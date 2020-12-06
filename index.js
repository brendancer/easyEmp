var console = require("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  PORT: 3306,
  user: "root",
  password: "siska",
  database: "easyEmp_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  firstStart();
});

function firstStart() {
  console.log(
    "Welcome to easyEmp! \n A CMS to help you manage your employee database"
  );
  start();
}

function start() {
  inquirer.prompt({
    type: "list",
    name: "taskChoice",
    message: "Choose your task",
    choices: [
      "Post new info to the database",
      "View database info",
      "Change current info in database",
      "Delete database information or entries",
    ],
  });
}
