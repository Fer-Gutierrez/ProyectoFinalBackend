import { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";

class TicketService {
  constructor() {
    this.ticketManagerDAO = FactoryDAO.getTicketManager();
    this.productMangerDAO = FactoryDAO.getProductManager();
    this.cartManagerDAO = FactoryDAO.getCartManager();
  }
  createTicket = async (user, cartId) => {
    try {
      if (!user?.email)
        throw new HttpError(
          "email (user) are required. Please Login",
          StatusCodes.BadRequest
        );

      if (!cartId)
        throw new HttpError("cartId are required", StatusCodes.BadRequest);

      let cart = await this.cartManagerDAO.getCartById(cartId);
      if (!cart)
        throw new HttpError(
          `Cart (Id=${cartId}) not found`,
          StatusCodes.NotFound
        );

      if (cart.products.length === 0)
        throw new HttpError(`The Cart is empty.`, StatusCodes.BadRequest);

      let amountProducts = 0;
      const productsWithoutStock = [];
      const productsCompleted = [];
      for (const p of cart.products) {
        let product = await this.productMangerDAO.getProductById(p.product);
        if (!product)
          throw new HttpError(
            `The Product (${p.product}) in Cart (${cartId}) doesnt exists.`,
            StatusCodes.BadRequest
          );
        if (product.stock < p.quantity) {
          productsWithoutStock.push(p);
        } else {
          productsCompleted.push(p);
          product.stock = product.stock - p.quantity;
          amountProducts += p.quantity;
          await this.productMangerDAO.updateProduct(p.product, product);
        }
      }

      // if (productsWithoutStock.length > 0) {
      //   const productsIds = productsWithoutStock.map((i) => i.product._id);
      //   throw new HttpError(
      //     `The following products dont have many stock: ${productsIds.join(
      //       ", "
      //     )}`,
      //     StatusCodes.BadRequest
      //   );
      // }

      //Actualizamos el stock de cada producto
      // for (const p of cart.products) {
      //   let product = await this.productMangerDAO.getProductById(p.product);
      //   product.stock = product.stock - p.quantity;
      //   amountProducts += p.quantity;
      //   await this.productMangerDAO.updateProduct(p.product, product);
      // }

      //Creamos el ticket
      if (productsCompleted.length > 0) {
        let completedResult = await this.ticketManagerDAO.createTicket(
          user.email,
          amountProducts
        );
        return {
          productsWithoutStock,
          productsCompleted,
          ticket: completedResult,
        };
      }

      return { productsWithoutStock, productsCompleted };
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };

  getTicketByID = async (id) => {
    try {
      let ticket = await this.ticketManagerDAO.getTicketById(id);
      if (!ticket)
        throw new HttpError(`Ticket (${id}) not found`, StatusCodes.NotFound);
      return ticket;
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };
}

export default new TicketService();
