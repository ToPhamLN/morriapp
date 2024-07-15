import express from 'express'
import {
  createRole,
  postLogin,
  postSignup,
  updateAuth
} from '~/controllers/auths.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'
import uploadCloud from '~/middlewares/uploader'
import passport from 'passport'
const CLIENT_URL = process.env.CLIENT_URL as string
const route: express.Router = express.Router()

route.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

route.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL,
    failureRedirect: `${CLIENT_URL}/login`
  })
)

route.get('/auth/facebook', passport.authenticate('facebook'))

route.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
)

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

export default route
