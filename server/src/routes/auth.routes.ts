import { Hono } from 'hono'

import {  getMe, signinHandler, signupHandler } from '../controllers/auth.controller'
import { protect } from '../middlewares/auth.middleware';
const auth = new Hono()


auth.post('/signup', signupHandler);
auth.post('/signin', signinHandler);

auth.get("/me", protect,getMe);


export default auth