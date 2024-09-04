import { faker } from "@faker-js/faker"

const products = new Array(300).fill(null).map(() => ({
    id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    material: faker.commerce.productMaterial(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    quantity: faker.number.int({min: 0, max: 100})
}))

export default products