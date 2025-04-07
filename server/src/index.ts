import { Hono } from 'hono'


import {cors} from 'hono/cors'
import { connectDB } from './db/connection'
import noteRoutes from './routes/note.route'
import auth from './routes/auth.routes'
const app = new Hono()
app.use('*', cors())
app.route('/api/v1/notes', noteRoutes)
app.route('/api/v1/auth', auth)
app.get('/', async(c) => {
  await connectDB()
  return c.text(`Note taker api is running on port ${process.env.PORT}`)
})

export default app