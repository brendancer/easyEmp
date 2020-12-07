var consoleTable = require("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");
var queries = require("./queries");

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
    "Welcome to easyEmp! \n A CMS to help you manage your employee database \n Type in a type of employee\n (i.e. vice president, progammer, salesperson, etc.)\n You will have a chance to enter all employee types"
  );
  empRole();

  function empRole() {
    inquirer
      .prompt(
        {
          type: "input",
          name: "empType",
          message: "Employee Type",
        },
        {
          type: "confirm",
          name: "done",
          message: "Do you have more employee types to enter?",
        }
      )
      .then(function (answer) {
        if (answer.done === false) {
          empRole();
        } else {
          console.log(
            "Thank you for emtering your employee types. Now you may perform the followin tasks:"
          );
          start();
        }
      });
  }
}

function start() {
  inquirer
    .prompt({
      type: "list",
      name: "taskChoice",
      message: "Choose your task",
      choices: [
        "Add new info to the database",
        "View database info",
        "Change current info in database",
        "Remove database information or entries",
      ],
    })
    .then(function (answer) {
      switch (answer) {
        case "Add new info to the database":
          addInfo();
          break;

        case "View database info":
          viewInfo();
          break;

        case "Change current info in database":
          changeInfo();
          break;

        case "Remove database information or entries":
          removeInfo();
          break;
      }
    });
}
