const mysql = require('mysql');
const inquirer = require('inquirer');
const


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
  
// function addRole() {
//   inquirer.prompt([{
//               name: 'name',
//               type: 'input',
//               message: 'Enter the role name: '
//           },
//           {
//               name: 'salary',
//               type: 'number',
//               message: 'Enter the salary: ',
//               validate: salary => {
//                   if (salary) {
//                       return true;
//                   } else {
//                       console.log('Please enter a number!');
//                       return false;
//                   }
//               }
//           },
//           {
//               name: 'department',
//               type: 'list',
//               message: 'Select the department:',
//               choices: getDepartments()
//           }
//       ])
//       .then(response => {
//           var responseID = 0;

//           connection.query('SELECT id FROM department WHERE name = ?', [response.department], (error, result) => {

//               if (error) throw error;
//               result.forEach(id => {
//                   responseID = id.id;
//               })

//               connection.query('INSERT INTO role SET ?', {
//                   title: response.name,
//                   salary: response.salary,
//                   department_id: responseID
//               }, (error, result) => {
//                   if (error) throw error;
//               })

//               viewRoles();
//           })
//       })
// }

// Add a role
function createRole() {
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
function createDepartment() {
  prompt([
      {
          name: "name",
          message: "What is the name of the department?"
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
function createEmployee() {
  prompt([
      {
          name: "first_name",
          message: "What's the employee's first name?"
      },
      {
          name: "last_name",
          message: "What's the employee's last name?"
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
                      message: "What's the employee's role?",
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
function updateEmployeeRole() {
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
// Quit the application
function quit() {
  process.exit();
}
