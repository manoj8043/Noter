import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaPlus, FaTrash, FaSave, FaShare, FaStickyNote } from 'react-icons/fa';

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleCreate = async () => {
    const newNote = {
      title: 'Untitled Note',
      content: ''
    };
    await addNote(newNote);
  };

  const handleSelect = (note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedNote) return;
    await updateNote(selectedNote._id, {
      title: editTitle,
      content: editContent
    });
    // Update local state to reflect changes immediately if needed, 
    // but DataContext should handle it via re-fetch or state update
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      if (selectedNote && selectedNote._id === id) {
        setSelectedNote(null);
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Notes List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">My Notes</h2>
          <button
            onClick={handleCreate}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {notes.map(note => (
            <div
              key={note._id}
              onClick={() => handleSelect(note)}
              className={`p-3 rounded-lg cursor-pointer transition-colors group relative flex flex-col ${
                selectedNote?._id === note._id
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'hover:bg-gray-50 border-transparent'
              } border`}
            >
              <p className="text-xs text-gray-500 truncate">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
              <button
                onClick={(e) => handleDelete(note._id, e)}
                className="absolute right-2 top-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {selectedNote ? (
          <>
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none focus:ring-0 text-gray-800 w-full"
                placeholder="Note Title"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <FaSave /> Save
                </button>
                {/* Sharing to be implemented */}
                <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                  <FaShare />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ReactQuill
                theme="snow"
                value={editContent}
                onChange={setEditContent}
                className="h-full"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
            <FaStickyNote size={48} className="opacity-20" />
            <p>Select a note to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
