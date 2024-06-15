import * as fs from "fs";
// import { fs } from "fs";
// let fs = require("fs");
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

lines.push(buildDelete("[dbo].[Users]"));

// lines.push(buildIdentityInsert("[dbo].[Users]", "ON"));

let counter = 1;
while (counter <= 50) {
  const user = createRandomUser();
  const insertStatement = buildUserInsert(user);
  lines.push(insertStatement);
  counter++;
}

// lines.push(buildIdentityInsert("[dbo].[Users]", "OFF"));

lines.push(`
GO
`);

writeScriptFile(lines);
