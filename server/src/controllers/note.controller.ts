import { Context } from 'hono'
import { Note } from '../models/note.model'

/**
 * Controller methods for Note operations
 * Implements RESTful endpoints for CRUD operations
 */

export const getAllNotes = async (c: Context) => {
  try {
    const notes = await Note.find()
    
    return c.json({
        "data": notes,
        "message": "Notes successfully retrieved"
        ,
    },200)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const getNoteById = async (c: Context) => {
  try {
    const noteId = c.req.param('id')
    const note = await Note.findById(noteId).lean().exec()
    
    if (!note) {
      return c.json({ error: 'Note not found' }, 404)
    }
    
    return c.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    return c.json({ error: 'Invalid note ID format' }, 400)
  }
}

export const createNote = async (c: Context) => {
  try {
    const { title, content } = await c.req.json()
    
    if (!title?.trim() || !content?.trim()) {
      return c.json({ 
        error: 'Title and content are required and cannot be empty' 
      }, 400)
    }

    const newNote = await Note.create({
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date()
    })

    return c.json({
      message: 'Note successfully created',
      data: newNote
    }, 201)
  } catch (error) {
    console.error('Error creating note:', error)
    return c.json({ error: 'Failed to create note' }, 400)
  }
}

export const updateNote = async (c: Context) => {
  try {
    const noteId = c.req.param('id')
    const { title, content } = await c.req.json()
    
    // Get existing note data
    const existingNote = await Note.findById(noteId).lean().exec()
    
    if (!existingNote) {
      return c.json({ error: 'Note not found' }, 404)
    }

    // Use existing values if new ones aren't provided
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        title: title?.trim() || existingNote.title,
        content: content?.trim() || existingNote.content,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).exec()

    return c.json({
      message: 'Note successfully updated',
      data: updatedNote
    })
  } catch (error) {
    console.error('Error updating note:', error)
    return c.json({ error: 'Failed to update note' }, 400)
  }
}

export const deleteNote = async (c: Context) => {
  try {
    const noteId = c.req.param('id')
    const deletedNote = await Note.findByIdAndDelete(noteId).exec()

    if (!deletedNote) {
      return c.json({ error: 'Note not found' }, 404)
    }

    return c.json({ 
      message: 'Note successfully deleted',
      id: noteId 
    })
  } catch (error) {
    console.error('Error deleting note:', error)
    return c.json({ error: 'Invalid note ID format' }, 400)
  }
}


