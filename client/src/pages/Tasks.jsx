import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FaPlus, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || null,
      tags: newTaskTags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'todo'
    });
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setNewTaskDueDate('');
    setNewTaskTags('');
  };

  const updateStatus = async (task, newStatus) => {
    await updateTask(task._id, { status: newStatus });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'done': return 'text-green-500';
      case 'in_progress': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
      </div>

      {/* Create Task Form */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex gap-4">
           <input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
            className="border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="text"
            value={newTaskTags}
            onChange={(e) => setNewTaskTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="flex-1 border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
           <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map(task => (
          <div
            key={task._id}
            className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 transition-all ${
              task.status === 'done' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-1 items-center pt-1">
                 <button
                  onClick={() => updateStatus(task, task.status === 'done' ? 'todo' : 'done')}
                  className={`text-2xl transition-colors ${getStatusColor(task.status)}`}
                >
                  {task.status === 'done' ? <FaCheckCircle /> : <FaRegCircle />}
                </button>
                <select 
                   value={task.status}
                   onChange={(e) => updateStatus(task, e.target.value)}
                   className="text-xs p-1 border-none bg-transparent text-gray-500 focus:ring-0 cursor-pointer capitalize"
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                   <h3 className={`font-medium text-lg text-gray-800 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                   <div className="flex gap-2 items-center">
                     <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <FaTrash />
                    </button>
                   </div>
                </div>
                
                {/* Meta details */}
                <div className="flex gap-4 text-xs text-gray-500 mt-1 flex-wrap items-center">
                   {task.dueDate && (
                    <span className="flex items-center gap-1">
                       📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                   )}
                   <span>🕒 Created: {new Date(task.createdAt).toLocaleDateString()} {new Date(task.createdAt).toLocaleTimeString()}</span>
                   {task.updatedAt !== task.createdAt && (
                     <span>📝 Edited: {new Date(task.updatedAt).toLocaleDateString()}</span>
                   )}
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {task.tags.map((tag, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 py-8">No tasks found. Add one above!</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
