import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { FaStickyNote, FaTasks } from 'react-icons/fa';

const Dashboard = () => {
  const { notes, tasks, loading } = useData();

  if (loading) return <div>Loading...</div>;

  const recentNotes = notes.slice(0, 3);
  const pendingTasks = tasks.filter(t => !t.isCompleted).slice(0, 3);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <FaStickyNote className="text-indigo-500" /> Recent Notes
            </h3>
            <Link to="/notes" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotes.length > 0 ? (
              recentNotes.map(note => (
                <div key={note._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h4 className="font-medium text-gray-800 truncate">{note.title}</h4>
                  <p className="text-sm text-gray-500 truncate">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No notes yet</p>
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <FaTasks className="text-green-500" /> Pending Tasks
            </h3>
            <Link to="/tasks" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <div key={task._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800 truncate">{task.title}</h4>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No pending tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
