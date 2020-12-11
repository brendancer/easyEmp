var consoleTable = require("console.table");

var inquirer = require("inquirer");

var mysql = require("mysql");

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

function hello() {
  console.log(
    "Welcome to easyEmp! \n A CMS to help you manage your employee database"
  );
  start();
}

function start() {
  inquirer
    .prompt({
      type: "list",
      name: "taskChoice",
      message: "What would you like to do now?",
      choices: [
        "View Employees",
        "View Departments",
        "View Employee Roles",
        "Add New employees",
        "Add new departments",
        "Add new roles",
        "Update Current Employee Roles",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.taskChoice) {
        case "View Employees":
          viewEmp();
          break;
        case "View Departments":
          viewDept();
          break;
        case "View Employee Roles":
          viewRoles();
          break;
        case "Add New employees":
          roleTable();
          break;
        case "Add new departments":
          addDept();
          break;
        case "Add new roles":
          deptTable();
          break;
        case "Update Current Employee Roles":
          displayTables();
        case "Exit":
          close();
          break;
      }
    });
}

function viewEmp() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewRoles() {
  connection.query("SELECT * FROM emp_role", function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function roleTable() {
  connection.query("SELECT id, title FROM emp_role", function (err, res) {
    if (err) throw err;
    console.table("ROLE ID#", res);
    newEmp();
  });
}

function newEmp() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "roleNo",
        message: "Employee Role id number (see above)",
      },
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
        name: "manager",
        message: "manager id (if no manager, input 0)",
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

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "Department Name?",
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
          start();
        }
      );
    });
}

function deptTable() {
  connection.query("SELECT id, dept_name FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    addRole();
  });
}
function addRole() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "dept",
        message: "Please input a department number",
      },
      {
        type: "input",
        name: "empType",
        message: "Title of employee role",
      },
      {
        type: "number",
        name: "salary",
        message: "Salary (in K, i.e 40,500 = 40.5)",
      },
    ])
    .then(function (answer) {
      if (!answer.salary || !answer.dept) {
        console.log(
          "Your answer must be a number, please input this employee role again"
        );
        empRole();
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
          start();
        }
      );
    });
}

function displayTables() {
  connection.query(
    "SELECT id, first_name, last_name FROM employee",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      connection.query("SELECT * FROM emp_role", function (err, res) {
        if (err) throw err;
        console.table(res);

        roleInq();
      });
    }
  );
}
function roleInq() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "employee",
        message: "Please choose an Employee by their ID number",
      },
      {
        type: "number",
        name: "role",
        message: "update employee role by id number(see above)",
      },
    ])
    .then(function (answer) {
      let query = connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
          {
            role_id: answer.role,
          },
          {
            id: answer.employee,
          },
        ],
        function (err, res) {
          if (err) throw err;
          connection.query(
            "SELECT first_name, last_name, title FROM emp_role JOIN employee ON emp_role.id = employee.role_id",
            function (err, res) {
              if (err) throw err;
              console.log(
                `${res[0].first_name} ${res[0].last_name}'s role is now ${res[0].title}`
              );
              start();
            }
          );
        }
      );
    });
}

function close() {
  console.log("Thank you for using easyEmp!");
  //connection.end;
}
