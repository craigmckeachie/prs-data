import { faker } from "@faker-js/faker";

function createRandomVendor() {
  const companyName = faker.company.name().replace("'", "''").substring(0, 29);
  const companyCode = companyName
    .substring(0, 4)
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase();

  return {
    code: companyCode,
    name: companyName,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode("#####"),
    phone: faker.string.numeric(10),
    email: "support@" + companyCode + ".com",
  };
}

function buildInsert(vendor) {
  return `
    INSERT INTO [dbo].[Vendors]
              ([Code]
              ,[Name]
              ,[Address]
              ,[City]
              ,[State]
              ,[Zip]
              ,[Phone]
              ,[Email])
        VALUES
              (
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

let counter = 1;
while (counter <= 50) {
  const vendor = createRandomVendor();
  // console.log(vendor);
  const insertStatement = buildInsert(vendor);
  console.log(insertStatement);
  counter++;
}
