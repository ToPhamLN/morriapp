import * as OneSignal from '@onesignal/node-onesignal'
import { ConfigurationParameters } from 'node_modules/@onesignal/node-onesignal/dist/configuration'
import { Request, Response, NextFunction } from 'express'
// new version buit it errors
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

const configParams: ConfigurationParameters = {
  appKey: process.env.REST_API_KEY,
  userKey: process.env.USER_AUTH_KEY
}

const authMethods = {
  app_key: process.env.REST_API_KEY,
  user_key: process.env.USER_AUTH_KEY
} as OneSignal.AuthMethods

const configuration = OneSignal.createConfiguration(configParams)
const client = new OneSignal.DefaultApi(configuration)

export const getAppInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const app = await client.getApp(process.env.APP_ID as string)
    req.appInfo = app
    next()
  } catch (error) {
    console.error(error)
    next(error)
  }
}

interface Notify {
  message: string
  title: string
}

export const sendNotification = async (data: Notify) => {
  try {
    const app = await client.getApp(
      process.env.APP_ID as string
      // { authMethods } as OneSignal.Configuration
    )
    return console.log(app)
    const notification = new OneSignal.Notification()

    notification.app_id = process.env.APP_ID as string
    notification.name = 'test_notification_name'
    notification.contents = { en: "Gig'em Ags" }
    notification.headings = { en: "Gig'em Ags" }
    notification.included_segments = ['All']

    const notificationResponse =
      await client.createNotification(notification)
    return notificationResponse
  } catch (error) {
    console.log(error)
  }
}
