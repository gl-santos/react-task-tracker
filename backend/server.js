require('dotenv').config();  // Load .env
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware: Parse JSON, allow React cross-origin
app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));  // Dev; update to Vercel URL later

// In-memory "DB" (array of tasks—upgrades to Mongo later)
let tasks = [
  { id: 1, text: 'Sample task', done: false }
];

// Routes: CRUD for tasks
// GET /tasks — All tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST /tasks — Add new
app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id — Toggle done
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.done = !task.done;
  res.json(task);
});

// DELETE /tasks/:id — Remove
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();  // No content = success
});

// Start server
app.listen(PORT, () => {
  console.log(`Server locked and loaded on port ${PORT}`);
});
