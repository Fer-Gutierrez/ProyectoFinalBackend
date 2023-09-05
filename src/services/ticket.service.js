import { HttpError } from "../utils.js";

class TicketService {
  constructor() {}
  createTicket = async (email, amountProducts) => {
    try {
      if (!email || !amountProducts)
        throw new HttpError("email and amountProducts are required");
      if (isNaN(amountProducts))
        throw new HttpError("aomuntProducts must be a number");
    } catch (error) {
      throw new HttpError(error.message, error.status);
    }
  };
}

export default new TicketService();
