import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import { connect } from '~/config/db'
import {
  authRoutes,
  artistRoutes,
  listTrackRoutes,
  trackRoutes,
  biosRoutes,
  interactionRoutes,
  userRoutes,
  followingRoutes,
  monthlyListensRoutes,
  notificationsRoutes,
  reportsRoutes
} from './routes'
import {
  notFound,
  errorHandler
} from '~/middlewares/error.middlewares'
//
import * as OneSignal from '@onesignal/node-onesignal'
import { ConfigurationParameters } from 'node_modules/@onesignal/node-onesignal/dist/configuration'
const configParams = {
  userKey: process.env.USER_AUTH_KEY,
  appKey: process.env.APP_ID
} as ConfigurationParameters

const configuration = OneSignal.createConfiguration(configParams)
const client = new OneSignal.DefaultApi(configuration)
const getApp = async () => {
  const app = new OneSignal.App()

  // configure your application
  app.name = 'app_name'
  app.gcm_key = '<your key here>'
  app.android_gcm_sender_id = '<your id here>'

  const response = await client.createApp(app)
  return app
}

const appd = getApp()

console.log(appd)

//
dotenv.config()
const app: express.Application = express()
const port = process.env.PORT ?? 5000

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

app.use('/api/v1/auths', authRoutes)
app.use('/api/v1/artists', artistRoutes)
app.use('/api/v1/listtracks', listTrackRoutes)
app.use('/api/v1/tracks', trackRoutes)
app.use('/api/v1/bios', biosRoutes)
app.use('/api/v1/interactions', interactionRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/followings', followingRoutes)
app.use('/api/v1/monthlylistens', monthlyListensRoutes)
app.use('/api/v1/notifications', notificationsRoutes)
app.use('/api/v1/reports', reportsRoutes)

app.use(notFound)
app.use(errorHandler)

connect()

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}`
  )
})
