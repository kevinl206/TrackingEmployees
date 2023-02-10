use employees;

INSERT INTO department
    (name)
VALUES
    ('Commisioner'),
    ('Supervisor'),
    ('Data Analytics'),
    ('Accountants');

INSERT INTO role 
    (title, salary, department_id)
VALUES
    ('Influencer', 100000, 1),
    ('Salesperson', 50000, 1),
    ('Director', 140000, 2),
    ('Lead', 65000, 2),
    ('Supervisor', 195000, 3),
    ('Media Manager', 100000, 3),
    ('Account Manager', 110000, 4),
    ('Accountant', 90000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
('Kevin', 'Love', 1, NULL),
('Kobe', 'Bryant', 2, 1),
('Michael', 'Jordan', 3, NULL),
('Stephen', 'Curry', 6, 5),
('Lebron', 'James', 7, 8),
('Allen', 'Iverson', 7, NULL),

