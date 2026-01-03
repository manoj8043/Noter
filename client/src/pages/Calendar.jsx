import React from 'react';
import { useData } from '../context/DataContext';
import { FaCalendarAlt } from 'react-icons/fa';

const Calendar = () => {
  const { tasks } = useData();

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc;
    const date = new Date(task.dueDate).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  const dates = Object.keys(tasksByDate).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <FaCalendarAlt className="text-indigo-600" /> Calendar
      </h2>

      <div className="space-y-6">
        {dates.length > 0 ? (
          dates.map(date => (
            <div key={date} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                {date}
              </h3>
              <div className="space-y-3">
                {tasksByDate[date].map(task => (
                  <div key={task._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <span className={task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400">No tasks with due dates found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
