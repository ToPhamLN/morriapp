import { Schema, model } from 'mongoose'

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String
    },
    avatar: {
      path: {
        type: String
      },
      fileName: {
        type: String
      }
    },
    background: {
      path: {
        type: String
      },
      fileName: {
        type: String
      }
    },
    auth: {
      type: Schema.Types.ObjectId,
      ref: 'Auth'
    },
    slug: {
      type: String
    },
    role: { type: String, default: 'User' }
  },
  { timestamps: true }
)

const UserModel = model('User', userSchema)

export default UserModel
