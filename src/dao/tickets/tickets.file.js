import fs from "fs";

export class Ticket {
  constructor(email, amountProducts) {
    (this.id = undefined),
      (this.code = `ticket_${Date.now.toString()}`),
      (this.purchase_datetime = Date.now),
      (this.amount = amountProducts),
      (this.purchaser = email);
  }
}

export default class TicketFileManager {
  constructor(path) {
    this.__path = path;
  }

  getTickets = async () => {
    if (!fs.existsSync(this.__path))
      await fs.promises.writeFile(this.__path, "[]");
    if (fs.existsSync(this.__path)) {
      const tickets = JSON.parse(
        await fs.promises.readFile(this.__path, "utf-8")
      );
      return tickets;
    }
  };

  createTicket = async (email, amountProduct) => {
    try {
      const newTicket = new Ticket(email, amountProduct);
      const tickets = await this.getTickets();
      tickets.push(newTicket);
      await fs.promises.writeFile(
        this.__path,
        JSON.stringify(tickets, null, "\t")
      );
      return newTicket;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
