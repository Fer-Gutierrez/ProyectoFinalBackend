import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserDbManager from "../../src/dao/users/users.mongo.js";

describe("UserDbManager", () => {
  let mongoServer;
  let userDbManager;
  let userCreated;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    userDbManager = new UserDbManager();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a user", async () => {
    const user = {
      first_name: "Fer ejemplo",
      last_name: "Guti ejemplo",
      email: "fer@ejemplo.com",
      age: 32,
      password: "Fer1234",
    };
    const result = await userDbManager.create(user);
    userCreated = result._id.toString();

    expect(result).to.exist;
    expect(result).to.not.have.property("error");
  });

  it("should get all users", async () => {
    const users = await userDbManager.getAll();

    expect(users).to.be.an("array");
  });

  it("should get user by email", async () => {
    const email = "fer@ejemplo.com";
    const user = await userDbManager.getByEmail(email);

    expect(user).to.exist;
  });

  it("should get user by ID", async () => {
    const userId = userCreated;
    const user = await userDbManager.getById(userId);

    expect(user).to.exist;
  });

  
  it("should update a user", async () => {
    const userId = userCreated;
    const userToUpdate = {
      first_name: "Fer editado",
      last_name: "Guti editado",
      email: "fer@ejemploeditado.com",
      age: 22,
      password: "Fer1234Edit",
    };
    const result = await userDbManager.update(userId, userToUpdate);

    expect(result).to.exist;
  });
});
