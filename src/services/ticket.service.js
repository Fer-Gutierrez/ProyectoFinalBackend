import { HttpError, StatusCodes } from "../utils.js";
import FactoryDAO from "../dao/daoFactory.js";
import { BadRequestError, NotFoundError } from "../exceptions/exceptions.js";

class TicketService {
  constructor() {
    this.ticketManagerDAO = FactoryDAO.getTicketManager();
    this.productMangerDAO = FactoryDAO.getProductManager();
    this.cartManagerDAO = FactoryDAO.getCartManager();
  }
  createTicket = async (user, cartId) => {
    try {
      if (!user?.email)
        throw new NotFoundError("email (user) are required. Please Login");
      if (!cartId) throw new NotFoundError("cartId are required");

      let cart = await this.cartManagerDAO.getCartById(cartId);
      if (!cart) throw new NotFoundError(`Cart (Id=${cartId}) not found`);

      if (cart.products.length === 0)
        throw new BadRequestError(`The Cart is empty.`);

      let amountProducts = 0;
      const productsWithoutStock = [];
      const productsCompleted = [];
      for (const p of cart.products) {
        let product = await this.productMangerDAO.getProductById(p.product);
        if (!product)
          throw new NotFoundError(
            `The Product (${p.product}) in Cart (${cartId}) doesnt exists.`
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
      throw error;
    }
  };

  getTicketByID = async (id) => {
    try {
      let ticket = await this.ticketManagerDAO.getTicketById(id);
      if (!ticket) throw new NotFoundError(`Ticket (${id}) not found`);
      return ticket;
    } catch (error) {
      throw error;
    }
  };
}

export default new TicketService();
