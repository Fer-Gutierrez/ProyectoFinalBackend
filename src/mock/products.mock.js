import { faker } from "@faker-js/faker";

export const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    code: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    price: faker.number.float({ min: 10, max: 10000, precision: 0.01 }),
    status: faker.datatype.boolean,
    category: faker.commerce.product(),
    stock: faker.number.int({ min: 1, max: 100 }),
    thumbnails: faker.image.avatarGitHub(),
  };
};
