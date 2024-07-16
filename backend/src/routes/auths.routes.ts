import express from 'express'
import {
  createRole,
  facebookAuth,
  facebookAuthCallback,
  googleAuth,
  googleAuthCallback,
  logout,
  postLogin,
  postSignup,
  refresh,
  updateAuth
} from '~/controllers/auths.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'
import uploadCloud from '~/middlewares/uploader'
import passport from 'passport'
const CLIENT_URL = process.env.CLIENT_URL as string
const route: express.Router = express.Router()

route.get('/google', googleAuth)
route.get('/google/callback', googleAuthCallback)

route.get('/facebook', facebookAuth)
route.get('/facebook/callback', facebookAuthCallback)

route.post('/login', postLogin)
route.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect(CLIENT_URL)
  })
})
route.post('/signup', postSignup)
route.put('/update', verifyToken, updateAuth)
route.post(
  '/role',
  uploadCloud.single('avatar'),
  verifyToken,
  createRole
)
route.get('/refresh', refresh)
route.post('/logout', verifyToken, logout)

export default route
