import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import CartDbManager from "../../src/dao/carts/carts.mongo.js";
import ProductDbManager from "../../src/dao/products/products.mongo.js";
describe("dao/cart.mongo.js", () => {
  let mongoServer;
  let cartDbManager;
  let productDbManager;
  let cartCreated;
  let arrayProducts = [];

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cartDbManager = new CartDbManager();
    productDbManager = new ProductDbManager();

    for (let i = 1; i < 4; i++) {
      const product = {
        title: `producto prueba ${i}`,
        code: `PP${i}`,
        description: `desc producto prueba ${i}`,
        price: 2000 + i,
        status: true,
        stock: 5 + i,
        category: "prueba",
      };
      await productDbManager.addProduct(product);
    }
    let result = await productDbManager.getProducts();
    arrayProducts = result.docs;
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a cart", async () => {
    const result = await cartDbManager.addCart();
    cartCreated = result._id.toString();

    expect(result).to.exist;
    expect(result).to.not.have.property("error");
  });

  it("should get all carts", async () => {
    const result = await cartDbManager.getCarts();
    expect(result).to.be.an("array");
  });

  it("should get cart by ID", async () => {
    const cartId = cartCreated;
    const result = await cartDbManager.getCartById(cartId);

    expect(result).to.exist;
  });

  it("should addProduct to cart", async () => {
    const cartId = cartCreated;
    const productId = arrayProducts[0].id;
    const result = await cartDbManager.addProductToCart(cartId, productId);

    expect(result.acknowledged).to.be.true;
    expect(result.modifiedCount).to.be.eql(1);
    expect(result.matchedCount).to.be.eql(1);
  });

  it("should validate if product exist in the cart", async () => {
    const cartId = cartCreated;
    const productId = arrayProducts[0].id;
    const result = await cartDbManager.existProductInCart(cartId, productId);

    expect(result).to.be.true;
  });

  it("should update the list of products in cart by id", async () => {
    const cartId = cartCreated;
    const products = arrayProducts.map((p) => {
      return { product: p.id, quantity: 1 };
    });
    const result = await cartDbManager.updateProductsInCart(cartId, products);

    expect(result.acknowledged).to.be.true;
    expect(result.modifiedCount).to.be.eql(1);
    expect(result.matchedCount).to.be.eql(1);
  });

  it("should update quantity product in cart by ID", async () => {
    const cartId = cartCreated;
    const productId = arrayProducts[0].id;
    const quantity = 4;
    const result = await cartDbManager.updateQuantityProductInCart(
      cartId,
      productId,
      quantity
    );

    expect(result.acknowledged).to.be.true;
    expect(result.modifiedCount).to.be.eql(1);
    expect(result.matchedCount).to.be.eql(1);
  });

  it("should remove a product in cart by ID", async () => {
    const cartId = cartCreated;
    const productId = arrayProducts[0].id;
    const result = await cartDbManager.removeProductInCart(cartId, productId);

    expect(result.acknowledged).to.be.true;
    expect(result.modifiedCount).to.be.eql(1);
    expect(result.matchedCount).to.be.eql(1);
  });

  it("should remove all products in cart by ID", async () => {
    const cartId = cartCreated;
    const result = await cartDbManager.removeAllProductsInCart(cartId);

    expect(result.acknowledged).to.be.true;
    expect(result.modifiedCount).to.be.eql(1);
    expect(result.matchedCount).to.be.eql(1);
  });
});
