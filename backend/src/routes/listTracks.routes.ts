import express from 'express'
import {
  addTrack,
  createListTrack,
  getAlbum,
  getListTracks,
  pinlistTrack,
  updateListTrack
} from '~/controllers/listTracks.controller'
import { verifyToken } from '~/middlewares/auth.middlewares'
import uploadCloud from '~/middlewares/uploader'

const route: express.Router = express.Router()

route.post(
  '/create',
  verifyToken,
  uploadCloud.single('photo'),
  createListTrack
)
route.put(
  '/update/:idListTrack',
  verifyToken,
  uploadCloud.single('photo'),
  updateListTrack
)
route.put('/pin/:idListTrack', verifyToken, pinlistTrack)
route.put('/addtrack/:idListTrack', verifyToken, addTrack)

route.get('/all', getListTracks)
route.get('/:idListTrack', getAlbum)

export default route
