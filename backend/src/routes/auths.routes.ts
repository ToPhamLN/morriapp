import express from 'express'
import {
  createRole,
  postLogin,
  postSignup,
  updateAuth
} from '~/controllers/auths.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'
import uploadCloud from '~/middlewares/uploader'

const route: express.Router = express.Router()

route.post('/login', postLogin)
route.post('/signup', postSignup)
route.put('/update', verifyToken, updateAuth)
route.post(
  '/role',
  uploadCloud.single('avatar'),
  verifyToken,
  createRole
)

export default route
