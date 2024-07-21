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
  externalUserIds?: string[]
  title: string
  message: string
  url?: string
  alias?: string
  aliases?: string[]
  email?: string
  sms?: string
  tag?: { key: string; value: string }
  tags?: { [key: string]: string }
  image?: string
}

export const sendNotification = async (notify: Notify) => {
  try {
    const form: any = {
      app_id: appId,
      headings: { en: notify.title },
      contents: { en: notify.message }
    }

    if (
      notify.externalUserIds &&
      notify.externalUserIds.length > 0
    ) {
      form.include_external_user_ids = notify.externalUserIds
    } else {
      form.included_segments = ['All']
    }

    if (notify.url) form.url = notify.url
    if (notify.alias) form.alias = notify.alias
    if (notify.aliases) form.aliases = notify.aliases
    if (notify.email) form.email = notify.email
    if (notify.sms) form.sms = notify.sms
    if (notify.image) form.large_icon = notify.image

    if (notify.tag) {
      form.filters = form.filters || []
      form.filters.push({
        field: 'tag',
        key: notify.tag.key,
        relation: '=',
        value: notify.tag.value
      })
    }

    if (notify.tags) {
      form.filters = form.filters || []
      Object.keys(notify.tags).forEach((key) => {
        form.filters.push({
          field: 'tag',
          key: key,
          relation: '=',
          value: notify.tags![key]
        })
      })
    }

    const res = await axios.post(
      `${BASE_URL}/notifications`,
      form,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Basic ${restApiKey}`
        }
      }
    )

    return res.data
  } catch (error) {
    errorFetch(error)
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
