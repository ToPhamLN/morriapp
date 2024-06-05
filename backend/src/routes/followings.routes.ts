import express from 'express'
import {
  followingAction,
  getArtistFollowers,
  getUserFollowedArtists
} from '~/controllers/followings.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'
const route: express.Router = express.Router()
route.post('/follow', verifyToken, followingAction)
route.get('/artists/:artistId', getArtistFollowers)
route.get('/users/:userId', getUserFollowedArtists)

export default route
