import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserDbManager from "../../src/dao/users/users.mongo.js";
import { dropUsers } from "../routes/setup.test.js";
import { createHash } from "../../src/utils.js";

describe("dao/user.mongo.js", () => {
  let mongoServer;
  let userDbManager;
  let userCreated;

  before(async () => {
    await dropUsers();
    userDbManager = new UserDbManager();
  });

  it("should create a user", async () => {
    const user = {
      first_name: "Fer ejemplo",
      last_name: "Guti ejemplo",
      email: "fer@ejemplo.com",
      age: 32,
      password: createHash("Fer1234"),
      role: "admin",
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
      password: createHash("Fer1234"),
      role: "admin",
    };
    const result = await userDbManager.update(userId, userToUpdate);

    expect(result).to.exist;
  });
});
