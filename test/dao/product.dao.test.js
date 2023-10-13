import { expect } from "chai";
import ProductDbManager from "../../src/dao/products/products.mongo.js";
import { dropProducts } from "../routes/setup.test.js";

describe("dao/product.mongo.js", () => {
  let productDbManager;
  let productCreated;

  before(async () => {  
    await dropProducts();
    productDbManager = new ProductDbManager();
  });

  it("should create a product", async () => {
    const product = {
      title: "producto prueba",
      code: "PP123",
      description: "desc producto de prueba",
      price: 2000,
      status: true,
      stock: 5,
      category: "prueba",
    };
    const result = await productDbManager.addProduct(product);
    productCreated = result._id.toString();

    expect(result).to.exist;
    expect(result).to.not.have.property("error");
  });

  it("should get all products", async () => {
    const result = await productDbManager.getProducts();

    expect(result.docs).to.be.an("array");
    expect(result.totalDocs).to.be.an("number");
    expect(result.hasPrevPage).to.be.an("boolean");
  });

  it("should get product by ID", async () => {
    const productId = productCreated;
    const result = await productDbManager.getProductById(productId);

    expect(result).to.exist;
  });

  it("should update a product", async () => {
    const productId = productCreated;
    const productToUpdate = {
      title: "producto editado",
      code: "PE777",
      description: "desc producto editado",
      price: 5000,
      status: true,
      stock: 10,
      category: "editadp",
    };
    const result = await productDbManager.updateProduct(
      productId,
      productToUpdate
    );

    expect(result).to.exist;
  });

  it("should validate an array of products", async () => {
    const arrayOfProducts = [
      {
        product: productCreated,
        quantity: 4,
      },
    ];
    const result = await productDbManager.validateProductsArray(
      arrayOfProducts
    );

    expect(result).to.be.true;
  });

  it("should confirm the product existence by ID", async () => {
    const productId = productCreated;
    const result = await productDbManager.existProduct(productId);

    expect(result).to.be.exist;
  });

  it("should delete product by ID", async () => {
    const productId = productCreated;
    const result = await productDbManager.deleteProduct(productId);

    expect(result).to.exist;
  });
});
