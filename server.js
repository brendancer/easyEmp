var consoleTable = require("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");
var queries = require("./queries");
var setUp = require("./setup");

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
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "setUp",
        message:
          "Do you need to set up or update either your employee types or department names?",
      },
    ])
    .then(function (answer) {
      if (answer.setUp === true) {
        inquirer
          .prompt([
            {
              type: "list",
              name: "setUpmodify",
              message: "Which would you like to add?",
              choices: ["Employee Type", "Department Name", "Both"],
            },
          ])
          .then(function (answer) {
            switch (answer.setUpmodify) {
              case "Employee Type":
                console.log(
                  "Type in a type of employee\n (i.e. vice president, progammer, salesperson, etc.)\n one at a time"
                );
                empRole();
                break;

              case "Department Name":
                console.log(
                  "Enter Departments (i.e. accounting, production, sales etc.) \n one at a time"
                );
                deptName();
            }
          });
      } else {
        start();
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
          type: "input",
          name: "salary",
          message: "Salary (in K, i.e 40,500 = 40.5)",
        },
        {
          type: "input",
          name: "dept",
          message: "Department (if Applicable, type enter for none)",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO emp_role SET ?",
          {
            title: answer.empType,
            salary: answer.salary,
            department_id: answer.dept,
          },
          function (err) {
            if (err) throw err;
            console.log(`Employee type ${answer.empType} edded to database`);
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
                  console.log("Thank you for emtering your employee types.");
                  start();
                } else {
                  empRole();
                }
              });
          }
        );
      });
  }

  function deptName() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "deptName",
          message: "Department Name:",
        },
        {
          type: "list",
          name: "done",
          message: "Do you have more Department Names to enter?",
          choices: ["yes", "no"],
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
                  console.log(
                    "Thank you for emtering your department names. Now you may perform the following tasks:"
                  );
                  start();
                } else {
                  deptName();
                }
              });
          }
        );
      });
  }

  function displayRoleNo() {
    console.log("Employee-type Id#s");
    connection.query("SELECT title FROM emp_role"),
      function (err, res) {
        if (err) throw err;
        console.log(res);
      };
  }
  function displayDeptNo() {
    console.log("Department Id#s");
    connection.query("SELECT dept_name FROM department"),
      function (err, res) {
        if (err) throw err;
        console.log(res);
      };
  }

  function start() {
    displayRoleNo();
    displayDeptNo();
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
