import express from 'express'
import {
  countReports,
  createReport,
  getReport,
  getReports
} from '~/controllers/reports.controllers'
import { verifyToken } from '~/middlewares/auth.middlewares'

const route: express.Router = express.Router()

route.post('/create', verifyToken, createReport)
route.get('/all', getReports)
route.get('/count', countReports)
route.get('/:idReport', getReport)

export default route
