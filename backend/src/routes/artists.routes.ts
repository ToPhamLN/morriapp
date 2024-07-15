import express from 'express'
import {
  countArtist,
  delelteArtist,
  getArtist,
  getArtists,
  updateArtist
} from '~/controllers/artists.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'
import uploadCloud from '~/middlewares/uploader'

const route: express.Router = express.Router()

route.get('/all', getArtists)
route.get('/count', countArtist)
route.get('/:idArtist', getArtist)
route.put(
  '/update',
  verifyToken,
  uploadCloud.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 }
  ]),
  updateArtist
)
route.delete('/:idArtist', verifyToken, delelteArtist)

export default route
