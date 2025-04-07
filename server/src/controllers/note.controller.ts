import { Context } from 'hono'
import { Note } from '../models/note.model'

export const getAllNotes = async (c: Context) => {
  try {
    const {id} = c.get('user');

    if (!id){
      return c.json({
        error: 'Not authenticated' 
      })
    }
    const notes = await Note.find({user: id}).lean().exec();

    if (!notes || notes.length === 0) {
      return c.json({
        message: 'No notes found for the user'
      }, 404)
    }
    
    return c.json({
      data: notes,
      message: "Notes successfully retrieved"
    }, 200)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
}

export const getNoteById = async (c: Context) => {
  try {
    const {id} = c.get('user');

    if (!id){
      return c.json({
        error: 'Not authenticated'
      })
    }
    const noteId = c.req.param('id')
    const note = await Note.findById(noteId).lean().exec()
    
    if (!note) {
      return c.json({ error: 'Note not found' }, 404)
    }
    
    return c.json({ data: note })
  } catch (error) {
    console.error('Error fetching note:', error)
    return c.json({ error: 'Invalid note ID format' }, 400)
  }
}

export const createNote = async (c: Context) => {
  try {
    const user = c.get('user');

    if (!user.id){
      return c.json({
        error: 'Not authenticated'
      })
    }
    const { title, content } = await c.req.json()
    
    if (!title?.trim() || !content?.trim()) {
      return c.json({ 
        error: 'Title and content are required and cannot be empty' 
      }, 400)
    }

    const newNote = await Note.create({
      user: user.id,
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
    const user = c.get('user');

    if (!user.id){
      return c.json({
        error: 'Not authenticated'
      })
    }
    const noteId = c.req.param('id')
    const { title, content } = await c.req.json()
    
    // First find the note to check ownership
    const existingNote = await Note.findById(noteId);
    
    if (!existingNote) {
      return c.json({ error: 'Note not found' }, 404)
    }

    // Check if the current user is the creator of the note
    if (existingNote.user.toString() !== user.id) {
      return c.json({ error: 'Unauthorized to update this note' }, 403)
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      {
        title: title?.trim(),
        content: content?.trim(),
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
    const user = c.get('user');

    if (!user.id){
      return c.json({
        error: 'Not authenticated'
      })
    }
    const noteId = c.req.param('id')
    const note = await Note.findById(noteId);
    if (!note) {
      return c.json({ error: 'Note not found' }, 404);
    }
    
    if (note.user.toString() !== user.id) {
      return c.json({ error: 'Unauthorized to delete this note' }, 403);
    }
    
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return c.json({ error: 'Note not found' }, 404)
    }

    return c.json({ 
      message: 'Note successfully deleted',
      data: { id: noteId } 
    })
  } catch (error) {
    console.error('Error deleting note:', error)
    return c.json({ error: 'Invalid note ID format' }, 400)
  }
}
