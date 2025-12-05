require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const DB_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));

let tasks = [];
if (fs.existsSync(DB_FILE)) {
  tasks = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}
else {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks));
}

const saveTasks = () => fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));

app.get('/', (req, res) => {
  res.json({ status: 'Backend alive', tasksCount: tasks.length });
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.done = !task.done;
  saveTasks();
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server locked and loaded on port ${PORT}`);
});
