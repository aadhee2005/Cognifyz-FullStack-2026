const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Temporary task data
let tasks = [
  { id: 1, title: "Learn REST API", completed: false },
  { id: 2, title: "Build Front-End UI", completed: true }
];

let nextId = 3;

// READ: Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// READ: Get a single task
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

// CREATE: Add a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// UPDATE: Edit a task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { title, completed } = req.body;

  if (typeof title === "string" && title.trim()) {
    task.title = title.trim();
  }

  if (typeof completed === "boolean") {
    task.completed = completed;
  }

  res.json(task);
});

// DELETE: Remove a task
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  res.json({ message: "Task deleted", task: deletedTask });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});