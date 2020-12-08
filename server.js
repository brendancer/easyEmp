var consoleTable = require("console.table");
var mysql = require("mysql");
var inquirer = require("inquirer");
var qr = require("./queries");
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
  viewEmp();
});

function displayRoleNo() {
  connection.query("SELECT id, title FROM emp_role", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

function displayDeptNo() {
  connection.query("SELECT id, dept_name FROM department", function (err, res) {
    if (err) throw err;
    console.table("Department- name ID numbers", res);
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
        type: "list",
        name: "setUp",
        message:
          "Do you need to set up either your employee-types or department-names?",
        choices: ["yes", "skip set-up"],
      },
    ])
    .then(function (answer) {
      if (answer.setUp === "yes") {
        empRole();
      } else {
        start();
      }
    });
}

function setUp() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "setUpDept",
        message: "Do you need to add Department Names?",
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
              message: "Do you need to add Employee Roles?",
            },
          ])
          .then(
            function () {
              if (answer.setUpEmp === true) {
                console.log(
                  `${
                    ("SELECT id, dept_name FROM department",
                    function (err, res) {
                      if (err) throw err;
                      console.table("Department- name ID numbers", res);
                    })
                  }`
                );
              }
            }.then(function (answer) {
              if (answer.setUpEmp === true) {
                console.log(
                  "Enter Type of Employee (i.e doctor, salesperson, clerk, etc"
                );
              }
            })
          );
      }
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
        message: `Please input the dept Id number \n ${getDptIdtable}`,
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
          console.log(`Employee type ${answer.empType} added to database`);
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
                console.log("Thank you for entering your employee types.");
                start();
              } else {
                empRole();
              }
            });
        }
      );
    });
}

//setup (creating updating db)

function start() {
  inquirer
    .prompt({
      type: "list",
      name: "taskChoice",
      message: "Choose your task",
      choices: [
        "Add or update employee info to the database",
        "View database info",
        "Change current info in database",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.taskChoice) {
        case "Add or update new employee info to the database":
          addInfo();
          break;
        case "View database info":
          viewInfo();
          break;
        case "Change current info in database":
          updateInfo();
          break;

        case "exit":
          close();
      }
    });
}

//interactions with db
function addInfo() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "changeItem",
        message: "Type of employee data to edit",
        choices: [
          "new employee",
          "update employee role",
          "update employee manager",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.changeItem) {
        case "new employee":
          newEmp();
          break;

        case "update employee role":
          updateRole();
          break;

        case "update employee manager":
          updateManager();
          break;
      }
    });
}

function newEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Employee's First Name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Employee's Last Name",
      },
      {
        type: "number",
        name: "roleNo",
        message: "Employee-Type ID Number, if applicable",
      },
      {
        type: "number",
        name: "managerNo",
        message: "Manager ID number",
      },
    ])
    .then(function (answers) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answers.firstName,
          last_name: answers.lastName,
          role_id: answers.roleNo,
          manager_id: answers.managerNo,
        },
        function (err, res) {
          if (err) throw err;
          console.log(
            `${answers.firstName} ${answers.lastName} has been added as a new employee.`
          );
          start();
        }
      );
    });
}
var employeeList;
function viewEmp() {
  connection.query(
    "SELECT first_name, last_name FROM employee",
    function (err, res) {
      if (err) throw err;
      employeeList = [res.first_name, res.last_name];
      console.log(employeeList);
      var fnln = employeeList.prototype.entries();
      console.log(fnln);
    }
  );
}
