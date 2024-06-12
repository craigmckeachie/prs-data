import { faker } from "@faker-js/faker";

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
    lastname: lastName,
    phone: faker.string.numeric(10),
    // email: faker.internet.exampleEmail({ firstName, lastName }),
    // email: userName + "@" + faker.internet.domainName(),
    email: userName + "@example.com",
    isreviewer: faker.helpers.arrayElement([0, 1]),
    isadmin: faker.helpers.arrayElement([0, 1]),
  };
}

function buildInsert(user) {
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
while (counter <= 50) {
  const user = createRandomUser();
  // console.log(user);
  const insertStatement = buildInsert(user);
  console.log(insertStatement);
  counter++;
}
