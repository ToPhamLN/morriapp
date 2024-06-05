import express from 'express'
import { getListenThisMonth } from '~/controllers/monthlyListens.controller'

const route: express.Router = express.Router()

route.get('/thismonth', getListenThisMonth)

export default route
