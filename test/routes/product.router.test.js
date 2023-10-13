import { expect } from "chai";
import { dropProducts } from "./setup.test.js";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("product.router.js", () => {
  let cookie;
  let productId;
  before(async () => {
    await dropProducts();

    const authResponse = await requester.post("/api/sessions/login").send({
      email: "admincoder@coder.com",
      password: "adminCod3r123",
    });

    const cookieHeader = authResponse.headers["set-cookie"];
    cookie = cookieHeader[0].split(";")[0];
  });


  it("[POST] /api/products -should response Success create a product-", async () => {
    const mockProduct = {
      title: "producto prueba",
      code: "PP123",
      description: "desc producto de prueba",
      price: 2000,
      status: true,
      stock: 5,
      category: "prueba",
    };

    try {
      const response = await requester
        .post("/api/products")
        .set("Cookie", [cookie])
        .send(mockProduct);
      productId = response.body.payload.data._id;
      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("_id");
    } catch (error) {
      console.error("Error in POST /api/products:", error);
      throw error;
    }
  });

  it("[GET] /api/products -should response Success get products-", async () => {
    try {
      const response = await requester.get("/api/products");
      expect(response.statusCode).to.be.eql(200);
    } catch (error) {
      console.error("Error in GET /api/products:", error);
      throw error;
    }
  });

  it("[GET] /api/products/{:pid} -should response Success get product by ID-", async () => {
    try {
      const response = await requester.get(`/api/products/${productId}`);
      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload).to.have.property("_id", productId);
    } catch (error) {
      console.error("Error in GET /api/products/:{pid}:", error);
      throw error;
    }
  });

  it("[PUT] /api/products/{:pid} -should response Success update product by ID-", async () => {
    try {
      const productToUpdate = {
        title: "producto editado",
        code: "PE123",
        description: "desc producto editado",
        price: 5000,
        status: true,
        stock: 10,
        category: "editado",
      };

      const response = await requester
        .put(`/api/products/${productId}`)
        .set("Cookie", [cookie])
        .send(productToUpdate);

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("modifiedCount", 1);
      expect(response.body.payload.data).to.have.property("matchedCount", 1);
    } catch (error) {
      console.error("Error in PUT /api/products/:{pid}:", error);
      throw error;
    }
  });

  it("[DELETE] /api/products/{:pid} -should response Success delete product by ID-", async () => {
    try {
      const response = await requester
        .delete(`/api/products/${productId}`)
        .set("Cookie", [cookie]);

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("deletedCount", 1);
    } catch (error) {
      console.error("Error in DELETE /api/products/:{pid}:", error);
      throw error;
    }
  });

  //Envios sin Token:
  it("[POST] /api/products - should response Unauthorized error-", async () => {
    const mockProduct = {
      title: "producto prueba",
      code: "PP123",
      description: "desc producto de prueba",
      price: 2000,
      status: true,
      stock: 5,
      category: "prueba",
    };

    try {
      const response = await requester.post("/api/products").send(mockProduct);

      expect(response.statusCode).to.be.eql(401);
      expect(response.body).to.have.property("error", "AUTHENTICATION_ERROR");
    } catch (error) {
      console.error("Error in POST /api/products:", error);
      throw error;
    }
  });

  it("[PUT] /api/products/{:pid} - should response Unauthorized error-", async () => {
    try {
      const productToUpdate = {
        title: "producto editado",
        code: "PE123",
        description: "desc producto editado",
        price: 5000,
        status: true,
        stock: 10,
        category: "editado",
      };

      const response = await requester
        .put(`/api/products/${productId}`)
        .send(productToUpdate);

      expect(response.statusCode).to.be.eql(401);
      expect(response.body).to.have.property("error", "AUTHENTICATION_ERROR");
    } catch (error) {
      console.error("Error in PUT /api/products/:{pid}:", error);
      throw error;
    }
  });

  it("[DELETE] /api/products/{:pid} - should response Unauthorized error -", async () => {
    try {
      const response = await requester.delete(`/api/products/${productId}`);

      expect(response.statusCode).to.be.eql(401);
      expect(response.body).to.have.property("error", "AUTHENTICATION_ERROR");
    } catch (error) {
      console.error("Error in DELETE /api/products/:{pid}:", error);
      throw error;
    }
  });
});
