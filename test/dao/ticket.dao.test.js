import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import TicketDbManager from "../../src/dao/tickets/tickets.mongo.js";
import { dropTickets } from "../routes/setup.test.js";

describe("dao/ticket.mongo.js", () => {
  let mongoServer;
  let ticketDbManager;
  let ticketCreated;

  before(async () => {
    await dropTickets();
    ticketDbManager = new TicketDbManager();
  });

  it("should create a ticket", async () => {
    const email = "email@prueba.com";
    const amount = 12;
    const result = await ticketDbManager.createTicket(email, amount);
    ticketCreated = result._id.toString();

    expect(result).to.exist;
    expect(result).to.not.have.property("error");
  });

  it("should get ticket by ID", async () => {
    const ticketId = ticketCreated;
    const result = await ticketDbManager.getTicketById(ticketId);

    expect(result).to.exist;
  });
});
