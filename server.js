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
  
          case "View Employees by Department":
            viewDepartments();
            break;

          case "View all Roles":
            viewRole();
            break;
        
          case "View Employees":
            viewEmployees();
            break;    

          case 'Add a department':
            addDepartment();
            break;

          case 'Add a role':
            addRole();
            break;

          case "Add Employee":
            addEmployee();
            break;
  
          case 'Update an employee role':
            updateEmployee();
            break;
  
          case "End":
            connection.end();
            break;
        }
      });
  }

  function viewDepartments() {
    connection.query('SELECT * FROM department', (error, result) => {
        if (error) throw error;
  
        console.log('\n');
        console.table(result);
  
        runPrompts();
    })
  }

  function viewRole() {
    connection.query('SELECT * FROM role', (error, result) => {
        if (error) throw error;
  
        console.log('\n');
        console.table(result);
  
        runPrompts();
    })
  }
  
  function viewEmployees() {
    connection.query('SELECT * FROM employee', (error, result) => {
        if (error) throw error;

        console.log('\n');
        console.table(result);

        runPrompts();
    })
}

function addDepartment() {
  inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter the department name: '
      }])
      .then(response => {
          connection.query('INSERT INTO department(name) VALUES (?)', [response.name], (error, result) => {
              if (error) throw error;
          })

          viewDepartments();
      })
}
  
function addRole() {
  inquirer.prompt([{
              name: 'name',
              type: 'input',
              message: 'Enter the role name: '
          },
          {
              name: 'salary',
              type: 'number',
              message: 'Enter the salary: ',
              validate: salary => {
                  if (salary) {
                      return true;
                  } else {
                      console.log('Please enter a number!');
                      return false;
                  }
              }
          },
          {
              name: 'department',
              type: 'list',
              message: 'Select the department:',
              choices: getDepartments()
          }
      ])
      .then(response => {
          var responseID = 0;

          connection.query('SELECT id FROM department WHERE name = ?', [response.department], (error, result) => {

              if (error) throw error;
              result.forEach(id => {
                  responseID = id.id;
              })

              connection.query('INSERT INTO role SET ?', {
                  title: response.name,
                  salary: response.salary,
                  department_id: responseID
              }, (error, result) => {
                  if (error) throw error;
              })

              viewRoles();
          })
      })
}

