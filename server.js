var consoleTable = require("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");
var queries = require("./queries");
var setUp = require("./setup");
const { Console } = require("console");
const { start } = require("repl");
const { truncate } = require("fs");

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
  hello();
});

function displayRoleNo() {
  connection.query("SELECT id, title FROM emp_role", function (err, res) {
    if (err) throw err;
    console.table("Epmployee-Type ID numbers", [res]);
  });
}

function displayDeptNo() {
  connection.query("SELECT id, dept_name FROM department", function (err, res) {
    if (err) throw err;
    console.table("Department- name ID numbers", [res]);
  });
}
function hello() {
  console.log(
    "Welcome to easyEmp! \n A CMS to help you manage your employee database"
  );
  firstStart();
}

function firstStart() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "setUp",
        message:
          "Do you need to set up either your employee-types or department-names?",
      },
    ])
    .then(function (answer) {
      if (answer.setUp === true) {
        inquirer
          .prompt([
            {
              type: "confirm",
              name: "setUpDept",
              message: "Do you need to add department-names?",
            },
          ])
          .then(function (answer) {
            if (answer.setUpDept === true) {
              deptName();
            } else {
              inquirer
                .prompt([
                  {
                    type: "confirm",
                    name: "setUpEmp",
                    message: "Do you need to add Employee-Types?",
                  },
                ])
                .then(function (answer) {
                  if (answer.setUpEmp === true) {
                    console.log(
                      "Enter Type of Employee (i.e doctor, salesperson, clerk, etc"
                    );

                    empRole();
                  } else {
                    start();
                  }
                });
            }
          });

        function empRole() {
          inquirer
            .prompt([
              {
                type: "input",
                name: "empType",
                message: "Employee Type",
              },
              {
                type: "number",
                name: "salary",
                message: "Salary (in K, i.e 40,500 = 40.5)",
              },
              {
                type: "number",
                name: "dept",
                message: "Department number",
              },
            ])
            .then(function (answer) {
              if (!answer.salary || !answer.dept) {
                console.log("Your answer must be a number");
              }
              connection.query(
                "INSERT INTO emp_role SET ?",
                {
                  title: answer.empType,
                  salary: answer.salary,
                  department_id: answer.dept,
                },
                function (err) {
                  if (err) throw err;
                  console.log(
                    `Employee type ${answer.empType} added to database`
                  );
                  inquirer
                    .prompt([
                      {
                        type: "confirm",
                        name: "done",
                        message: "Would you like to add another employee type?",
                      },
                    ])
                    .then(function (answer) {
                      if (answer.done === false) {
                        console.log(
                          "Thank you for entering your employee types."
                        );
                        start();
                      } else {
                        empRole();
                      }
                    });
                }
              );
            });
        }
      }
      function deptName() {
        inquirer
          .prompt([
            {
              type: "input",
              name: "deptName",
              message: "Department Name:",
            },
          ])
          .then(function (answer) {
            connection.query(
              "INSERT INTO department SET ?",
              {
                dept_name: answer.deptName,
              },
              function (err) {
                if (err) throw err;
                console.log(`${answer.deptName} Department added to database`);
              }
            );
            inquirer
              .prompt([
                {
                  type: "confirm",
                  name: "done",
                  message: "Would you like to add another department name?",
                },
              ])
              .then(function (answer) {
                if (answer.done === false) {
                  inquirer
                    .prompt([
                      {
                        type: "confirm",
                        name: "empAlso",
                        message: "Do you need to add Employee-Types?",
                      },
                    ])
                    .then(function (answer) {
                      if (answer.empAlso === true) {
                        empRole();
                      } else {
                        start();
                      }
                    });
                } else {
                  deptName();
                }
              });
          });
      }
    });

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
}
