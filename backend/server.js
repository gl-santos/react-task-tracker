require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskdb');
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', taskSchema);

app.get('/', async (req, res) => {
  res.json({ status: 'Backend alive', tasksCount: Task.length });
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  const newTask = new Task({ text });
  await newTask.save();
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { done: true }, { new: true });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server locked and loaded on port ${PORT}`);
});
