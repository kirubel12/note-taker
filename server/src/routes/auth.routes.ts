import { Hono } from 'hono'

import {  signinHandler, signupHandler } from '../controllers/auth.controller'
const auth = new Hono()


auth.post('/signup', signupHandler)
auth.post('/signin', signinHandler)



export default auth