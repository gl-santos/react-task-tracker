import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:3001/tasks/';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Backend down?', err);
    }
  };

  const addTask = async () => {
    const text = input.trim();
    if (text) {
      try {
        await fetch(BACKEND_URL, { method: 'POST', body: JSON.stringify({text}), headers: {'Content-Type': 'application/json'} });
        await fetchTasks();
      } catch(err) {
        console.error('Add failed.', err);
      }
      setInput('');
    }
  };

  const toggleTask = async (id) => {
    try {
      await fetch(BACKEND_URL + id, { method: 'PUT', headers: {'Content-Type': 'application/json'} });
      await fetchTasks();
    } catch(err) {
      console.error('Toggle failed.', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(BACKEND_URL + id, { method: 'DELETE', headers: {'Content-Type': 'application/json'} });
      await fetchTasks();
    } catch(err) {
      console.error('Delete failed.', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Task Tracker</h1>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs doing?"
            className="flex-1 border border-gray-300 p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button 
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r-lg font-semibold transition-colors"
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex-1">
                <span className={`block ${task.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.done && '☑️ '} {task.text}
                </span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    task.done 
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {task.done ? 'Undo' : 'Done'}
                </button>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 mt-4 italic">No tasks yet — add one above!</p>
        )}
      </div>
    </div>
  );
}

export default App;