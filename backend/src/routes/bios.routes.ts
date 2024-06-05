import express from 'express'
import {
  updateBios,
  getBios
} from '~/controllers/bios.controllers'
import uploadCloud from '~/middlewares/uploader'
import { verifyToken } from '~/middlewares/auth.middlewares'

const route: express.Router = express.Router()

route.get('/:idArtist', getBios)
route.put(
  '/update',
  verifyToken,
  uploadCloud.array('photos'),
  updateBios
)

export default route
