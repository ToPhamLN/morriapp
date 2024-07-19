// import * as OneSignal from '@onesignal/node-onesignal'
// import { ConfigurationParameters } from 'node_modules/@onesignal/node-onesignal/dist/configuration'
// import { Request, Response, NextFunction } from 'express'

// const configParams: ConfigurationParameters = {
//   restApiKey: process.env.REST_API_KEY,
//   userAuthKey: process.env.USER_AUTH_KEY
// }

// const authMethods = {
//   rest_api_key: process.env.REST_API_KEY,
//   user_auth_key: process.env.USER_AUTH_KEY
// } as OneSignal.AuthMethods

// const configuration = OneSignal.createConfiguration(configParams)
// const client = new OneSignal.DefaultApi(configuration)

// export const getAppInfo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const app = await client.getApp(
//       process.env.APP_ID as string,
//       { authMethods } as OneSignal.Configuration
//     )
//     req.appInfo = app
//     next()
//   } catch (error) {
//     console.error(error)
//     next(error)
//   }
// }

// interface Notify {
//   message: string
//   title: string
// }

// export const sendNotification = async (data: Notify) => {
//   try {
//     const app = await client.getApp(
//       process.env.APP_ID as string,
//       { authMethods } as OneSignal.Configuration
//     )
//     return console.log(app)
//     const notification = new OneSignal.Notification()

//     notification.app_id = process.env.APP_ID as string
//     notification.name = 'test_notification_name'
//     notification.contents = { en: "Gig'em Ags" }
//     notification.headings = { en: "Gig'em Ags" }
//     notification.included_segments = ['All']

//     const notificationResponse =
//       await client.createNotification(notification)
//     return notificationResponse
//   } catch (error) {
//     console.log(error)
//   }
// }

import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const BASE_URL = 'https://api.onesignal.com'
const restApiKey = process.env.REST_API_KEY
const userAuthKey = process.env.USER_AUTH_KEY
const appId = process.env.APP_ID

export const getApps = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/apps`, {
      headers: {
        accept: 'text/plain',
        Authorization: `Basic ${userAuthKey}`
      }
    })
    return res.data
  } catch (error) {
    errorFetch(error)
  }
}

interface Notify {
  message: string
  title: string
}

export const sendNotification = async (notify: Notify) => {
  try {
    console.log('send')
  } catch (error) {
    console.log(error)
  }
}

const errorFetch = (error: any) => {
  if (error.isAxiosError) {
    console.error('Axios error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request data:', error.request)
    } else {
      console.error('Error message:', error.message)
    }
  } else {
    console.error('Non-Axios error:', error)
  }
}
