import { Schema, model } from 'mongoose'
import { ERole } from '~/types'

const notificationSchema = new Schema<INotification>(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    receiverCategory: {
      type: String,
      enum: Object.values(ERole)
    },
    title: {
      type: String
    },
    photo: {
      path: {
        type: String
      },
      fileName: {
        type: String
      }
    },
    path: { type: String },
    message: { type: String },
    isReaded: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const NotificationModel = model<INotification>(
  'Notification',
  notificationSchema
)
export default NotificationModel
