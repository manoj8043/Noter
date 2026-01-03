import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import io from 'socket.io-client';
import { initDB, saveToDB, getFromDB } from '../utils/db';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to load from API first
        const [notesRes, tasksRes] = await Promise.all([
          api.get('/notes'),
          api.get('/tasks')
        ]);
        
        setNotes(notesRes.data);
        setTasks(tasksRes.data);
        
        // Save to IndexedDB
        await saveToDB('notes', notesRes.data);
        await saveToDB('tasks', tasksRes.data);
      } catch (error) {
        console.error('Error fetching data from API, trying offline storage:', error);
        // Fallback to IndexedDB
        const offlineNotes = await getFromDB('notes');
        const offlineTasks = await getFromDB('tasks');
        
        if (offlineNotes) setNotes(offlineNotes);
        if (offlineTasks) setTasks(offlineTasks);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.IO connection
    const newSocket = io('/', {
      path: '/socket.io',
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const addNote = async (note) => {
    const res = await api.post('/notes', note);
    setNotes([res.data, ...notes]);
  };

  const updateNote = async (id, updates) => {
    const res = await api.put(`/notes/${id}`, updates);
    setNotes(notes.map(n => n._id === id ? res.data : n));
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter(n => n._id !== id));
  };

  const addTask = async (task) => {
    const res = await api.post('/tasks', task);
    setTasks([res.data, ...tasks]);
  };

  const updateTask = async (id, updates) => {
    const res = await api.put(`/tasks/${id}`, updates);
    setTasks(tasks.map(t => t._id === id ? res.data : t));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  const value = {
    notes,
    tasks,
    loading,
    addNote,
    updateNote,
    deleteNote,
    addTask,
    updateTask,
    deleteTask,
    socket
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
