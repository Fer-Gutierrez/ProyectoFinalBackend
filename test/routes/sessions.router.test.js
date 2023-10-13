import { expect } from "chai";
import { dropUsers } from "./setup.test.js";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("sessions.router.js", () => {
  let cookie;
  let userId;
  let userEmail;

  before(async () => {
    await dropUsers();
    // const authResponse = await requester.post("/api/sessions/login").send({
    //   email: "admincoder@coder.com",
    //   password: "adminCod3r123",
    // });
    // const cookieHeader = authResponse.headers["set-cookie"];
    // cookie = cookieHeader[0].split(";")[0];
  });

  it("[POST] /api/sessions/register -should response Success to register new user-", async () => {
    const mockUser = {
      first_name: "fernando",
      last_name: "gutierrez",
      email: "fer@prueba.com",
      age: 22,
      password: "prueba",
    };

    try {
      const response = await requester
        .post("/api/sessions/register")
        .send(mockUser);

      userId = response.body.payload.data._id;
      userEmail = response.body.payload.data.email;

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("_id", userId);
      expect(response.body.payload.data).to.have.property("email", userEmail);
    } catch (error) {
      console.error("Error in POST /api/sessions/register:", error);
      throw error;
    }
  });

  it("[POST] /api/sessions/register -should response BadRequest to register a existent user-", async () => {
    const mockUser = {
      first_name: "fernando",
      last_name: "gutierrez",
      email: userEmail,
      age: 22,
      password: "prueba",
    };

    try {
      const response = await requester
        .post("/api/sessions/register")
        .send(mockUser);

      expect(response.statusCode).to.be.eql(400);
      expect(response.body).to.have.property("error", "BAD_REQUEST");
    } catch (error) {
      console.error("Error in POST /api/sessions/register:", error);
      throw error;
    }
  });

  it("[POST] /api/sessions/login -should response Success to login with existent user-", async () => {
    const mockUser = {
      email: "fer@prueba.com",
      password: "prueba",
    };

    try {
      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);

      const cookieHeader = response.headers["set-cookie"];
      cookie = cookieHeader[0].split(";")[0];

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload).to.have.property("id", userId);
      expect(response.body.payload).to.have.property("email", userEmail);
      expect(response.body.payload).to.have.property("role", "usuario");
    } catch (error) {
      console.error("Error in POST /api/sessions/login:", error);
      throw error;
    }
  });

  it("[POST] /api/sessions/login -should response BadRequest to login with incorrect password-", async () => {
    const mockUser = {
      email: "fer@prueba.com",
      password: "incorrect",
    };

    try {
      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);

      expect(response.statusCode).to.be.eql(400);
      expect(response.body).to.have.property("error", "BAD_REQUEST");
    } catch (error) {
      console.error("Error in POST /api/sessions/login:", error);
      throw error;
    }
  });

  it("[POST] /api/sessions/login -should response BadRequest to login with incorrect email-", async () => {
    const mockUser = {
      email: "ferIncorrect@prueba.com",
      password: "prueba",
    };

    try {
      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);

      expect(response.statusCode).to.be.eql(404);
      expect(response.body).to.have.property("error", "NOT_FOUND");
    } catch (error) {
      console.error("Error in POST /api/sessions/login:", error);
      throw error;
    }
  });

  it("[GET] /api/sessions/logout -should response Success to logout with cookie-", async () => {
    try {
      const response = await requester
        .get("/api/sessions/logout")
        .set("Cookie", [cookie]);

      expect(response.statusCode).to.be.eql(200);
    } catch (error) {
      console.error("Error in GET /api/sessions/logout:", error);
      throw error;
    }
  });

  it("[GET] /api/sessions/current -should response Success to send a correct cookie-", async () => {
    try {
      const response = await requester
        .get("/api/sessions/current")
        .set("Cookie", [cookie]);

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload).have.property("id", userId);
      expect(response.body.payload).have.property("email", userEmail);
    } catch (error) {
      console.error("Error in GET /api/sessions/currrent:", error);
      throw error;
    }
  });

  //   it("[GET] /api/products -should response Success get products-", async () => {
  //     try {
  //       const response = await requester.get("/api/products");
  //       expect(response.statusCode).to.be.eql(200);
  //     } catch (error) {
  //       console.error("Error in GET /api/products:", error);
  //       throw error;
  //     }
  //   });

  //   it("[GET] /api/products/{:pid} -should response Success get product by ID-", async () => {
  //     try {
  //       const response = await requester.get(`/api/products/${productId}`);
  //       expect(response.statusCode).to.be.eql(200);
  //       expect(response.body.payload).to.have.property("_id", productId);
  //     } catch (error) {
  //       console.error("Error in GET /api/products/:{pid}:", error);
  //       throw error;
  //     }
  //   });

  //   it("[PUT] /api/products/{:pid} -should response Success update product by ID-", async () => {
  //     try {
  //       const productToUpdate = {
  //         title: "producto editado",
  //         code: "PE123",
  //         description: "desc producto editado",
  //         price: 5000,
  //         status: true,
  //         stock: 10,
  //         category: "editado",
  //       };

  //       const response = await requester
  //         .put(`/api/products/${productId}`)
  //         .set("Cookie", [cookie])
  //         .send(productToUpdate);

  //       expect(response.statusCode).to.be.eql(200);
  //       expect(response.body.payload.data).to.have.property("modifiedCount", 1);
  //       expect(response.body.payload.data).to.have.property("matchedCount", 1);
  //     } catch (error) {
  //       console.error("Error in PUT /api/products/:{pid}:", error);
  //       throw error;
  //     }
  //   });

  //   it("[DELETE] /api/products/{:pid} -should response Success delete product by ID-", async () => {
  //     try {
  //       const response = await requester
  //         .delete(`/api/products/${productId}`)
  //         .set("Cookie", [cookie]);

  //       expect(response.statusCode).to.be.eql(200);
  //       expect(response.body.payload.data).to.have.property("deletedCount", 1);
  //     } catch (error) {
  //       console.error("Error in DELETE /api/products/:{pid}:", error);
  //       throw error;
  //     }
  //   });

  //   //Envios sin Token:
  //   it("[POST] /api/products - should response Unauthorized error-", async () => {
  //     const mockProduct = {
  //       title: "producto prueba",
  //       code: "PP123",
  //       description: "desc producto de prueba",
  //       price: 2000,
  //       status: true,
  //       stock: 5,
  //       category: "prueba",
  //     };

  //     try {
  //       const response = await requester.post("/api/products").send(mockProduct);

  //       expect(response.statusCode).to.be.eql(401);
  //       expect(response.body).to.have.property("error", "AUTHENTICATION_ERROR");
  //     } catch (error) {
  //       console.error("Error in POST /api/products:", error);
  //       throw error;
  //     }
  //   });

  //   it("[PUT] /api/products/{:pid} - should response Unauthorized error-", async () => {
  //     try {
  //       const productToUpdate = {
  //         title: "producto editado",
  //         code: "PE123",
  //         description: "desc producto editado",
  //         price: 5000,
  //         status: true,
  //         stock: 10,
  //         category: "editado",
  //       };

  //       const response = await requester
  //         .put(`/api/products/${productId}`)
  //         .send(productToUpdate);

  //       expect(response.statusCode).to.be.eql(401);
  //       expect(response.body).to.have.property("error", "AUTHENTICATION_ERROR");
  //     } catch (error) {
  //       console.error("Error in PUT /api/products/:{pid}:", error);
  //       throw error;
  //     }
  //   });

  //   it("[DELETE] /api/products/{:pid} - should response Unauthorized error -", async () => {
  //     try {
  //       const response = await requester.delete(`/api/products/${productId}`);

  //       expect(response.statusCode).to.be.eql(401);
  //       expect(response.body).to.have.property("error", "AUTHENTICATION_ERROR");
  //     } catch (error) {
  //       console.error("Error in DELETE /api/products/:{pid}:", error);
  //       throw error;
  //     }
  //   });
});
