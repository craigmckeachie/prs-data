import * as fs from "fs";
// import { fs } from "fs";
// let fs = require("fs");
import { faker } from "@faker-js/faker";

const productUnits = ["Each", "Dozen", "Case", "Pack", "Box", "Pair", "Set"];

function createRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const userName = faker.internet
    .userName({ firstName, lastName })
    .toLowerCase();

  return {
    username: userName,
    password: faker.internet.password(),
    firstname: firstName,
    lastname: lastName.replace("'", "''"),
    phone: faker.string.numeric(10),
    email: userName + "@example.com",
    isreviewer: faker.helpers.arrayElement([0, 1]),
    isadmin: faker.helpers.arrayElement([0, 1]),
  };
}

function buildUserInsert(user) {
  return `
INSERT INTO [dbo].[Users]
    ([Username]
    ,[Password]
    ,[Firstname]
    ,[Lastname]
    ,[Phone]
    ,[Email]
    ,[IsReviewer]
    ,[IsAdmin])
VALUES
    ('${user.username}'
    ,'${user.password}'
    ,'${user.firstname}'
    ,'${user.lastname}'
    ,'${user.phone}'
    ,'${user.email}'
    ,${user.isreviewer}
    ,${user.isadmin}) 
  `;
}

function createRandomVendor(id) {
  const companyName = faker.company.name().replace("'", "''").substring(0, 29);
  const companyNameNoSpecialCharacters = companyName.replace(/[^A-Z0-9]/gi, "");
  const companyCode =
    companyNameNoSpecialCharacters.substring(0, 4).toUpperCase() +
    "-" +
    companyNameNoSpecialCharacters.substring(4, 6).toUpperCase();

  return {
    id: id,
    code: companyCode,
    name: companyName,
    address: faker.location.streetAddress().replace("'", "''"),
    city: faker.location.city().replace("'", "''"),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode("#####"),
    phone: faker.string.numeric(10),
    email: "support@" + companyCode + ".com",
  };
}

function buildVendorInsert(vendor) {
  return `
    INSERT INTO [dbo].[Vendors]
              ([id]
              ,[Code]
              ,[Name]
              ,[Address]
              ,[City]
              ,[State]
              ,[Zip]
              ,[Phone]
              ,[Email])
        VALUES
              (
          '${vendor.id}', 
          '${vendor.code}',
          '${vendor.name}',
          '${vendor.address}',
          '${vendor.city}',
          '${vendor.state}',
          '${vendor.zip}',
          '${vendor.phone}',
          '${vendor.email}'
          )
  
  `;
}

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

function buildProductInsert(product) {
  return `
    INSERT INTO [dbo].[Products]
           ([PartNbr]
           ,[Name]
           ,[Price]
           ,[Unit]
           ,[PhotoPath]
           ,[VendorId])
     VALUES
           ('${product.partnbr}'
           ,'${product.name}'
           ,'${product.price}'
           ,'${product.unit}'
           , null
           ,'${product.vendorid}')
  `;
}

function buildDelete(table) {
  lines.push(`
DELETE FROM ${table}
GO
`);
}

function buildIdentityInsert(table, toggle) {
  lines.push(`
SET IDENTITY_INSERT ${table} ${toggle}
GO
`);
}

function writeScriptFile(lines) {
  let script = lines.join("");

  //Write script file
  let fileName = "populate-prs.sql";
  fs.writeFile(fileName, script, function (err, data) {
    if (err) console.log(err);
    console.log(`Successfully wrote script file to: ${fileName}`);
  });
}

let lines = [];

lines.push(`
USE [PrsDbC40]
GO
`);

//Users
lines.push(buildDelete("[dbo].[Users]"));

// lines.push(buildIdentityInsert("[dbo].[Users]", "ON"));

let counter = 1;
while (counter <= 50) {
  const user = createRandomUser();
  const insertStatement = buildUserInsert(user);
  lines.push(insertStatement);
  counter++;
}

lines.push(`
GO
`);

// lines.push(buildIdentityInsert("[dbo].[Users]", "OFF"));

//Vendors
lines.push(buildDelete("[dbo].[Vendors]"));

lines.push(buildIdentityInsert("[dbo].[Vendors]", "ON"));

counter = 1;
while (counter <= 50) {
  const vendor = createRandomVendor(counter);
  const insertStatement = buildVendorInsert(vendor);
  lines.push(insertStatement);
  counter++;
}

lines.push(`
GO
`);

lines.push(buildIdentityInsert("[dbo].[Vendors]", "OFF"));

//Products
lines.push(buildDelete("[dbo].[Products]"));

// lines.push(buildIdentityInsert("[dbo].[Products]", "ON"));

counter = 1;
while (counter <= 50) {
  const product = createRandomProduct(counter);
  const insertStatement = buildProductInsert(product);
  lines.push(insertStatement);
  counter++;
}

lines.push(`
GO
`);

// lines.push(buildIdentityInsert("[dbo].[Products]", "OFF"));

//End
lines.push(`
GO
`);
writeScriptFile(lines);
