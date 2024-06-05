import { Schema, model } from 'mongoose'
import { ERole } from '~/types'

const authSchema = new Schema<IAuth>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: Object.values(ERole)
    },
    idRole: {
      type: Schema.Types.ObjectId,
      refPath: 'role'
    }
  },
  { timestamps: true }
)

const AuthModel = model<IAuth>('Auth', authSchema)
export default AuthModel
