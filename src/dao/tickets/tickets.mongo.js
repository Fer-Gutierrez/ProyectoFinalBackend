import ticketModel from "../models/ticket.model.js";

export default class TicketDbManager {
  constructor() {}

  getTickets = async () => {
    try {
      let tickets = await ticketModel.find().lean();
      return tickets;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  createTicket = async (email, amountProduct) => {
    try {
      const ahora = new Date();
      const stringAhora = `${ahora.getFullYear()}${(ahora.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${ahora.getDate().toString().padStart(2, "0")}${ahora
        .getHours()
        .toString()
        .padStart(2, "0")}${ahora
        .getMinutes()
        .toString()
        .padStart(2, "0")}${ahora.getSeconds().toString().padStart(2, "0")}`;
      const newTicket = new ticketModel({
        code: `ticket_${stringAhora}`,
        amount: amountProduct,
        purchaser: email,
      });
      const result = await newTicket.save();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getTicketById = async (id) => {
    try {
      let ticket = await ticketModel
        .findOne({ _id: id })
      return ticket;
    } catch (error) {
      throw new Error(
        `Error to try getTicketById (Mongo persistence): ${error.message}`
      );
    }
  };
}
