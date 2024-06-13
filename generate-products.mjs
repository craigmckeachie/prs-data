import { faker } from "@faker-js/faker";

const productUnits = [
  "Each",
  "Dozen",
  "Case",
  "Pack",
  "Box",
  "Pair",
  "Set",
  // "Kilogram",
  // "Gram",
  // "Pound",
  // "Ounce",
  // "Liter",
  // "Milliliter",
  // "Gallon",
  // "Meter",
  // "Centimeter",
  // "Inch",
  // "Foot",
  // "Square Meter",
  // "Cubic Meter",
];

function createRandomProduct() {
  return {
    partnbr: faker.commerce.isbn(),
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 5, max: 100 }),
    unit: faker.helpers.arrayElement(productUnits),
    photopath: faker.image.urlLoremFlickr({
      category: "product",
      width: 100,
      height: 200,
    }),
    vendorid: faker.helpers.rangeToNumber({ min: 1, max: 50 }),
  };
}

function buildInsert(product) {
  return `
    INSERT INTO [dbo].[Products]
           ([PartNbr]
           ,[Name]
           ,[Price]
           ,[Unit]
           ,[PhotoPath]
           ,[VendorId])
     VALUES
           (''
           ,''
           ,''
           ,''
           ,''
           ,'')
  `;
}

console.clear();
console.log(`
  USE [PrsDbC40]
  GO

  DELETE FROM [dbo].[Products]

  GO
  `);
let counter = 1;
while (counter <= 50) {
  const product = createRandomProduct();
  console.log(product);
  // const insertStatement = buildInsert(product);
  // console.log(insertStatement);
  counter++;
}
