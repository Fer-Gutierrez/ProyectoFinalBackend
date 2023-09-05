import ticketModel from "../models/ticket.model.js";

export default class TicketDbManager {
  constructor() {}

  createTicket = async (email, amountProduct) => {
    try {
      const newTicket = new ticketModel({
        code: `ticket_${Date.now.toString()}`,
        amount: amountProduct,
        purchaser: email,
      });
      const result = await newTicket.save();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
