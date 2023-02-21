-- Drops the employees if it exists currently --
DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;

-- use employees database --
USE employeesDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
    );

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL, 
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) 
    REFERENCES department (id)
    ON DELETE SET NULL
);

-- CREATE TABLE employee (
-- id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
-- first_name VARCHAR(30),
-- last_name VARCHAR(30),
-- role_id INT (10),
-- manager_id INT,

-- FOREIGN KEY (role_id) 
-- REFERENCES role (id)
-- ON DELETE SET NULL,
-- INDEX role_ind (role_id),
-- FOREIGN KEY (manager_id) 
-- REFERENCES employee(id)
-- ON DELETE SET NULL);
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);