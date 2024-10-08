const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "students",
});

// Establish the database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process with an error
  }
  console.log("Connected to the MySQL database.");
});

// Route: Retrieve all students
app.get("/students", (req, res) => {
  const sqlSelect = "SELECT * FROM `student_details`";

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({
        message: "Error retrieving student data.",
        error: err,
      });
    }

    return res.status(200).json({
      message: "Students retrieved successfully",
      data: result, // Make sure `data` is returned as an array
    });
  });
});

// Route: Add a new student
app.post("/add_user", (req, res) => {
  const { name, email, gender, age } = req.body;

  // Validate the required fields
  if (!name || !email || !gender || !age) {
    return res.status(400).json({
      message: "All fields are required: name, email, gender, age.",
    });
  }

  const sqlInsert = "INSERT INTO `student_details` (`name`, `email`, `gender`, `age`) VALUES (?, ?, ?, ?)";
  const values = [name, email, gender, age];

  db.query(sqlInsert, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({
        message: "Failed to add student. Please try again.",
        error: err,
      });
    }

    return res.status(201).json({
      message: "Student added successfully",
      studentId: result.insertId,
    });
  });
});

// Route: Retrieve a student by ID
app.get("/get_students/:id", (req, res) => {
  const studentId = req.params.id;

  const sqlSelect = "SELECT * FROM `student_details` WHERE `id` = ?";

  db.query(sqlSelect, [studentId], (err, result) => {
    if (err) {
      console.error("Error fetching student:", err);
      return res.status(500).json({
        message: "Error retrieving student data.",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({
      message: "Student retrieved successfully",
      data: result[0], // Return the first item instead of an array
    });
  });
});

// Route: Update a student by ID
app.put("/edit_student/:id", (req, res) => {
  const studentId = req.params.id;
  const { name, email, gender, age } = req.body;

  // Check if all fields are present
  if (!name || !email || !gender || !age) {
    return res.status(400).json({
      message: "All fields are required: name, email, gender, age.",
    });
  }

  const sqlUpdate = "UPDATE `student_details` SET `name` = ?, `email` = ?, `gender` = ?, `age` = ? WHERE `id` = ?";
  const values = [name, email, gender, age, studentId];

  db.query(sqlUpdate, values, (err, result) => {
    if (err) {
      console.error("Error updating student:", err);
      return res.status(500).json({
        message: "Failed to update student.",
        error: err,
      });
    }

    // Check if any row was affected (i.e., student existed)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({
      message: "Student updated successfully.",
    });
  });
});

// Route: Delete a student by ID
app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;

  const sqlDelete = "DELETE FROM `student_details` WHERE `id` = ?";
  db.query(sqlDelete, [studentId], (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      return res.status(500).json({
        message: "Failed to delete student.",
        error: err,
      });
    }

    // Check if any row was affected (i.e., student existed)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    return res.status(200).json({
      message: "Student deleted successfully.",
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
