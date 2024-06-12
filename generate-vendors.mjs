import { faker } from "@faker-js/faker";

function createRandomVendor() {
  const companyName = faker.company.name();

  return {
    code: companyName.substring(0, 4).toUpperCase(),
    name: companyName,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.city(),
    zip: faker.location.zipCode(),
    phone: faker.string.numeric(10),
    email: "support@" + faker.internet.domainName(),
  };
}

function buildInsert(vendor) {
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

let counter = 1;
while (counter <= 3) {
  const vendor = createRandomVendor();
  console.log(vendor);
  // const insertStatement = buildInsert(user);
  // console.log(insertStatement);
  counter++;
}
