-- Drops the employees if it exists currently --
DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

-- use eomployees database --
USE employees;

-- Creates the table "company within eomployee --
CREATE TABLE company (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
)