import * as OneSignal from '@onesignal/node-onesignal'
import { ConfigurationParameters } from 'node_modules/@onesignal/node-onesignal/dist/configuration'
const configParams = {
  userKey: process.env.USER_AUTH_KEY,
  appKey: process.env.APP_ID
} as ConfigurationParameters

const configuration = OneSignal.createConfiguration(configParams)
const client = new OneSignal.DefaultApi(configuration)
const getApp = async () => {
  const app = await client.getApp(process.env.APP_ID as string)
  return app
}

const app = getApp()

console.log(app)
