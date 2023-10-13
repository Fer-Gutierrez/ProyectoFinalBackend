import { expect } from "chai";
import { dropCarts, dropProducts, dropTickets } from "./setup.test.js";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("carts.router.js", () => {
  let cookie;
  let productId;
  let cartId;
  let arrayProductsId = [];

  before(async () => {
    await dropProducts();
    await dropCarts();

    const authResponse = await requester.post("/api/sessions/login").send({
      email: "admincoder@coder.com",
      password: "adminCod3r123",
    });

    const cookieHeader = authResponse.headers["set-cookie"];
    cookie = cookieHeader[0].split(";")[0];

    for (let i = 1; i < 4; i++) {
      const mockProduct = {
        title: `producto prueba ${i}`,
        code: `PP12${i}`,
        description: `desc producto de prueba ${i}`,
        price: i * 1000,
        status: true,
        stock: i,
        category: "prueba",
        owner: "64cab2d191c62d6747aad068",
      };

      const response = await requester
        .post("/api/products")
        .set("Cookie", [cookie])
        .send(mockProduct);
      arrayProductsId.push(response.body.payload.data._id);
    }
  });

  it("[POST] /api/carts -should response Success create a cart-", async () => {
    try {
      const response = await requester.post("/api/carts");

      cartId = response.body.payload.data._id;
      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("_id", cartId);
    } catch (error) {
      console.error("Error in POST /api/carts:", error);
      throw error;
    }
  });

  it("[GET] /api/carts -should response Success get carts-", async () => {
    try {
      const response = await requester.get("/api/carts");
      expect(response.statusCode).to.be.eql(200);
    } catch (error) {
      console.error("Error in GET /api/carts:", error);
      throw error;
    }
  });

  it("[GET] /api/carts/{:pid} -should response Success get carts by ID-", async () => {
    try {
      const response = await requester.get(`/api/carts/${cartId}`);
      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload).to.have.property("_id", cartId);
    } catch (error) {
      console.error("Error in GET /api/carts/:{pid}:", error);
      throw error;
    }
  });

  it("[POST] /api/carts/{:cid}/products/{:pid} -should response Success to delete product in cart with ID-", async () => {
    try {
      const response = await requester.post(
        `/api/carts/${cartId}/products/${arrayProductsId[0]}`
      );

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("modifiedCount", 1);
    } catch (error) {
      console.error("Error in POST /api/carts:", error);
      throw error;
    }
  });

  it("[PUT] /api/carts/{:cid}/products/{:pid} -should response Success to update product in cart with ID-", async () => {
    try {
      const response = await requester
        .put(`/api/carts/${cartId}/products/${arrayProductsId[0]}`)
        .send({ quantity: 3 });

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("modifiedCount", 1);
    } catch (error) {
      console.error("Error in PUT /api/carts/{cid}/products{pid}:", error);
      throw error;
    }
  });

  it("[DELETE] /api/carts/{:cid}/products/{:pid} -should response Success to delete product in cart with ID-", async () => {
    try {
      const response = await requester.delete(
        `/api/carts/${cartId}/products/${arrayProductsId[0]}`
      );

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("modifiedCount", 1);
    } catch (error) {
      console.error("Error in DELETE /api/carts/{cid}/products{pid}:", error);
      throw error;
    }
  });

  it("[PUT] /api/carts/{:cid} -should response Success to update all products in cart with ID-", async () => {
    try {
      const arrayProducts = [];
      arrayProductsId.forEach((p) => {
        arrayProducts.push({ product: p, quantity: 1 });
      });

      const response = await requester
        .put(`/api/carts/${cartId}`)
        .send(arrayProducts);

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("modifiedCount", 1);
      expect(response.body.payload.data).to.have.property("matchedCount", 1);
    } catch (error) {
      console.error("Error in PUT /api/carts/{:cid}:", error);
      throw error;
    }
  });

  it("[POST] /api/carts/{:cid}/purchase -should response Success to purchase a cart by ID-", async () => {
    try {
      const response = await requester
        .post(`/api/carts/${cartId}/purchase`)
        .set("Cookie", [cookie]);

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data.ticket).to.have.property("_id");
      expect(response.body.payload.data.ticket).to.have.property(
        "purchase_datetime"
      );
    } catch (error) {
      console.error("Error in POST /api/carts/:{cid}/purchase:", error);
      throw error;
    }
  });

  it("[DELETE] /api/carts/{:cid} -should response Success to delete all product by ID-", async () => {
    try {
      const response = await requester.delete(`/api/carts/${cartId}`);

      expect(response.statusCode).to.be.eql(200);
      expect(response.body.payload.data).to.have.property("modifiedCount", 1);
    } catch (error) {
      console.error("Error in DELETE /api/carts/:{cid}:", error);
      throw error;
    }
  });

  //   //Envios con Role = "admin":
  it("[POST] /api/carts/{:cid}/products/{:pid} -should response Unauthorized error to add product in cart with admin user role-", async () => {
    try {
      const response = await requester
        .post(`/api/carts/${cartId}/products/${arrayProductsId[0]}`)
        .set("Cookie", [cookie]);

      expect(response.statusCode).to.be.eql(403);
      expect(response.body).to.have.property("error", "AUTHORIZATION_ERROR");
    } catch (error) {
      console.error("Error in POST /api/carts:", error);
      throw error;
    }
  });

  it("[PUT] /api/carts/{:cid} -shouldresponse Unauthorized error to update all products in cart with admin user-", async () => {
    try {
      const arrayProducts = [];
      arrayProductsId.forEach((p) => {
        arrayProducts.push({ product: p, quantity: 1 });
      });

      const response = await requester
        .put(`/api/carts/${cartId}`)
        .set("Cookie", [cookie])
        .send(arrayProducts);

      expect(response.statusCode).to.be.eql(403);
      expect(response.body).to.have.property("error", "AUTHORIZATION_ERROR");
    } catch (error) {
      console.error("Error in PUT /api/carts/{:cid}:", error);
      throw error;
    }
  });

  it("[PUT] /api/carts/{:cid}/products/{:pid} -should response Unauthorized error to update product in cart with admin user-", async () => {
    try {
      const response = await requester
        .put(`/api/carts/${cartId}/products/${arrayProductsId[0]}`)
        .set("Cookie", [cookie])
        .send({ quantity: 3 });

      expect(response.statusCode).to.be.eql(403);
      expect(response.body).to.have.property("error", "AUTHORIZATION_ERROR");
    } catch (error) {
      console.error("Error in PUT /api/carts/{cid}/products{pid}:", error);
      throw error;
    }
  });
});
