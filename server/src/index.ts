import { Hono } from 'hono'
import { serve } from '@hono/node-server'

import {cors} from 'hono/cors'
import { connectDB } from './db/connection'
import noteRoutes from './routes/note.route'

const app = new Hono()
app.use('*', cors())
app.route('/api/v1/notes', noteRoutes)
app.get('/', async(c) => {
  await connectDB()
  return c.text(`Note taker api is running on port ${process.env.PORT}`)
})

serve(app)
