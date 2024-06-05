import express from 'express'
import {
  createTrack,
  getTrack,
  updateTrack,
  getTracks,
  listensTrack,
  getRank
} from '~/controllers/tracks.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'
import uploadCloud from '~/middlewares/uploader'

const route: express.Router = express.Router()

route.post(
  '/create',
  verifyToken,
  uploadCloud.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'source', maxCount: 1 }
  ]),
  createTrack
)

route.put(
  '/:idTrack/update',
  verifyToken,
  uploadCloud.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'source', maxCount: 1 }
  ]),
  updateTrack
)
route.get('/all', getTracks)
route.get('/rank', getRank)
route.get('/:idTrack', getTrack)
route.post('/:idTrack/listen', listensTrack)

export default route
