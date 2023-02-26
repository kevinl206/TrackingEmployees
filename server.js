const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require("./db");
const { prompt } = require("inquirer");

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Ahooyeah1!',
//     database: 'employeesDB'
// },
// console.log(`Connected to the employeesDB database.`)
// );

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
    .then(function ( task ) {
        console.log(task);
        switch (task.choice) {
            
          case "View all departments":
            viewAllDepartments();
            break;

          case "View all roles":
            viewAllRoles();
            break;
        
          case "View all employees":
            viewAllEmployees();
            break;    

          case 'Add a department':
            addDepartment();
            break;

          case 'Add a role':
            addRole();
            break;

          case "Add an employee":
            addEmployee();
            break;
  
          case 'Update an employee role':
            updateEmployee();
            break;
  
          case "Exit":
            connection.end();
            break;
        }
      });
  }
  function viewAllDepartments() {
    db.allDepartments()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => runPrompts());
}

// View all employees
function viewAllEmployees() {
    db.allEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => runPrompts());
}

// View all roles
function viewAllRoles() {
    db.allRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => runPrompts());
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

// Add a role
function addRole() {
  db.allDepartments()
      .then(([rows]) => {
          let departments = rows;
          const departmentChoices = departments.map(({ id, name }) => ({
              name: name,
              value: id
          }));


          prompt([
            {
                name: "title",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                message: "What is the salary rate?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role fall in under?",
                choices: departmentChoices
            }
        ])
            .then(role => {
                db.addRole(role)
                    .then(() => console.log(`Added ${role.title} to the database`))
                    .then(() => runPrompts())
            })
    })
}



// Add a department
function addDepartment() {
  prompt([
      {
          name: "name",
          type: "input",
          message: "Enter the employee first name: ",
      }
  ])
      .then(res => {
          let name = res;
          db.addDepartment(name)
              .then(() => console.log(`Added ${name.name} to the database`))
              .then(() => runPrompts())
      })
}

// Add an employee
function addEmployee() {
  prompt([
      {
          name: "first_name",
          type: "input",
            message: "Enter the employee first name: "
      },
      {
          name: "last_name",
          type: "input",
          message: "Enter the employee last name: "
      }
  ])
      .then(res => {
          let firstName = res.first_name;
          let lastName = res.last_name;

          db.allRoles()
              .then(([rows]) => {
                  let roles = rows;
                  const roleChoices = roles.map(({ id, title }) => ({
                      name: title,
                      value: id
                  }));

                  prompt({
                      type: "list",
                      name: "roleId",
                      message: "Select the role: ",
                      choices: roleChoices
                  })
                      .then(res => {
                          let roleId = res.roleId;

                          db.allEmployees()
                              .then(([rows]) => {
                                  let employees = rows;
                                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                      name: `${first_name} ${last_name}`,
                                      value: id
                                  }));

                                  managerChoices.unshift({ name: "None", value: null });

                                  prompt({
                                      type: "list",
                                      name: "managerId",
                                      message: "Who's the employee's manager?",
                                      choices: managerChoices
                                  })
                                      .then(res => {
                                          let employee = {
                                              manager_id: res.managerId,
                                              role_id: roleId,
                                              first_name: firstName,
                                              last_name: lastName
                                          }

                                          db.addEmployee(employee);
                                      })
                                      .then(() => console.log(
                                          `Added ${firstName} ${lastName} to the database`
                                      ))
                                      .then(() => runPrompts())
                              })
                      })
              })
      })
}



// Update employee's role
function updateEmployee() {
  db.allEmployees()
      .then(([rows]) => {
          let employees = rows;
          const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id
          }));

          prompt([
              {
                  type: "list",
                  name: "employeeId",
                  message: "Which employee's role do you want to update?",
                  choices: employeeChoices
              }
          ])
              .then(res => {
                  let employeeId = res.employeeId;
                  db.allRoles()
                      .then(([rows]) => {
                          let roles = rows;
                          const roleChoices = roles.map(({ id, title }) => ({
                              name: title,
                              value: id
                          }));

                          prompt([
                              {
                                  type: "list",
                                  name: "roleId",
                                  message: "What's the new role of this employee?",
                                  choices: roleChoices
                              }
                          ])
                              .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                              .then(() => console.log("Employee's role is updated"))
                              .then(() => runPrompts())
                      });
              });
      })
}

