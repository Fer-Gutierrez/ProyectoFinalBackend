// import { expect } from 'chai';
// import sinon from 'sinon';
// import supertest from 'supertest';
// import { app } from '../../src/app.js';
// import productService from '../../src/services/product.service.js';

// const request = supertest(app);

// describe('ProductController', () => {
//   // Mock de datos para las pruebas
//   const mockProduct = {
//     code: 'PP123',
//     title: 'Product Title',
//     description: 'Product Description',
//     price: 4000,
//     status: true,
//     stock: 100,
//     category: 'Electronics'
//   };

//   describe('createProduct', () => {
//     it('should create a product', async () => {

//       sinon.stub(productService, 'addProduct').resolves(mockProduct);

//       const response = await request.post('/api/products').send(mockProduct);

//       expect(response.status).to.equal(200);
//       expect(response.body.message).to.equal('Product was added.');
//       expect(response.body.data).to.deep.equal(mockProduct);

//       productService.addProduct.restore();
//     });

//   });

//   describe('getProducts', () => {
//     it('should get a list of products', async () => {
//       // Mock del servicio para el método getProducts
//       sinon.stub(productService, 'getProducts').resolves({ docs: [mockProduct], totalDocs: 1 });

//       const response = await request.get('/api/products');

//       expect(response.status).to.equal(200);
//       expect(response.body.totalRecords).to.equal(1);
//       expect(response.body.data).to.deep.equal([mockProduct]);

//       productService.getProducts.restore();
//     });

//   });

//   // Agregar más bloques describe para otras funciones del controlador
// });
