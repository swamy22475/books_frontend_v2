import { createContext, useState, useEffect } from 'react';
import React from 'react';

import { api } from 'src/lib/api-client';

const initialContext = {
  notes: [],
  loading: true,
  error: null,
  selectedNoteId: null,
  selectNote: () => { },
  addNote: async () => { },
  updateNote: async () => { },
  deleteNote: async () => { }
};

export const NotesContext = createContext(initialContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(initialContext.notes);
  const [loading, setLoading] = useState(initialContext.loading);
  const [error, setError] = useState(initialContext.error);
  const [selectedNoteId, setSelectedNoteId] = useState(initialContext.selectedNoteId);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await api.get('/master/notes/');
      setNotes(data || []);
      if (data && data.length > 0) {
        setSelectedNoteId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const selectNote = (id) => {
    setSelectedNoteId(id);
  };

  const addNote = async (newNote) => {
    try {
      const addedNote = await api.post('/master/notes/', {
        title: newNote.title || '',
        color: newNote.color || 'primary'
      });
      setNotes((prev) => [addedNote, ...prev]);
      setSelectedNoteId(addedNote.id);
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  // Update a note
  const updateNote = async (id, title, color) => {
    try {
      const updatedNote = await api.put(`/master/notes/${id}`, { title, color });
      setNotes((prev) => prev.map((note) => note.id === id ? updatedNote : note));
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await api.delete(`/master/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));

      // Select the first available note if we deleted the currently selected one
      if (selectedNoteId === id) {
        setNotes((currentNotes) => {
          const remaining = currentNotes.filter((n) => n.id !== id);
          if (remaining.length > 0) {
            setSelectedNoteId(remaining[0].id);
          } else {
            setSelectedNoteId(null);
          }
          return remaining;
        });
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        selectedNoteId,
        selectNote,
        addNote,
        updateNote,
        deleteNote
      }}>

      {children}
    </NotesContext.Provider>);

};