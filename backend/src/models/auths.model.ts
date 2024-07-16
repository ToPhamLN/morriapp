import { Schema, model } from 'mongoose'
import { EProvider, ERole } from '~/types'

const authSchema = new Schema<IAuth>(
  {
    email: {
      type: String,
      required: false,
      unique: false
    },
    password: {
      type: String,
      required: false,
      unique: false
    },
    role: {
      type: String,
      enum: Object.values(ERole)
    },
    idRole: {
      type: Schema.Types.ObjectId,
      refPath: 'role'
    },
    idProvider: {
      type: String
    },
    provider: {
      type: String,
      enum: Object.values(EProvider)
    }
  },
  { timestamps: true }
)

const AuthModel = model<IAuth>('Auth', authSchema)
export default AuthModel
