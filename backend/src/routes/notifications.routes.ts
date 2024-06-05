import express from 'express'
import {
  deleteNotification,
  getMyNotification
} from '~/controllers/notifications.controller'
import { verifyToken } from '~/middlewares/auth.middlewares'

const route: express.Router = express.Router()

route.get('/mine', getMyNotification)
route.delete(
  '/:idNotification/delete',
  verifyToken,
  deleteNotification
)

export default route
