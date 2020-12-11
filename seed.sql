DROP DATABASE IF EXISTS easyEmp_db;

CREATE DATABASE easyEmp_db;

USE easyEmp_db;

CREATE TABLE employee
(
  id INT NOT NULL
  AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR
  (30) NOT NULL,
  last_name VARCHAR
  (30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT 
);

  CREATE TABLE emp_role
  (
    id INT NOT NULL
    AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR
    (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL
  );

    CREATE TABLE department
    (
      id INT NOT NULL
      AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR
      (30)
  );




      INSERT INTO employee
        (first_name, last_name, role_id, manager_id)
      VALUES
        ("Brenda", "Goodwin", 2, 1),
        ("suzy", "Que", 1, 1 ),
        ("Rebecca", "Down", 1, 2),
        ("Henry", "gates", 2, 1),
        ("Steve", "Cahill", 1, 2);

      INSERT INTO emp_role
        ( title, salary, department_id)
      VALUES
        ("Developer", 60.3, 2),
        ("Manager", 110.4, 1);

      INSERT INTO department
        (dept_name)
      VALUES
        ("manager"),
        ("production"),
        ("sales");	
        

