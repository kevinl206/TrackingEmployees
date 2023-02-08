const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'AhooYeah!',
    database: 'TrackingEmployees'
});

init();

// initial function 
function init() {
    runPrompts();
}

function runPrompts() {
    inquirer.prompt([{
        name: 'choice',
        type: 'list',
        message: "Please select an option: ",
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }])
    .then(function ({ task }) {
        switch (task) {
          case "View Employees":
            viewEmployee();
            break;
  
          case "View Employees by Department":
            viewEmployeeByDepartment();
            break;
        
          case "Add Employee":
            addEmployee();
            break;
  
          case "Remove Employees":
            removeEmployees();
            break;
  
          case "Update Employee Role":
            updateEmployeeRole();
            break;
  
          case "Add Role":
            addRole();
            break;
  
          case "End":
            connection.end();
            break;
        }
      });
  }
