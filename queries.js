const inquirer = require("inquirer");
const { listenerCount } = require("process");

function addInfo() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "changeItem",
        message: "Type of data to be added",
        choices: ["new employee", "new department", "change employee role"],
      },
    ])
    .then(function (answer) {
      switch (answer) {
        case "new employee":
          newEmp();
          break;

        case "new department":
          newDept();
          break;

        case "change employee role":
          changeRole();
          break;
      }
    });
}

// function viewInfo() {}

// function changeInfo() {}

// function removeInfo() {}

// // function newEmp() {
// //   inquirer
// //             .prompt([
// //               {
// //                 name: "firstName",
// //                 type: "input",
// //                 message: "Employee's First Name:",
// //               },
// //               {
// //                 name: "lastName",
// //                 type: "input",
// //                 message: "Employee's Last Name",
// //               },
// //               {
// //                 name: "role",
// //                 type: "rawlist",
// //                 message: "Please Choose the Employee Role",
// //                 choices: ["a", "b"],
// //               },

// //function newDept() {};

// //function changeRole() {};
