import { Schema, model } from 'mongoose'

const artistSchema = new Schema<IArtist>(
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
      ref: 'Auth',
      required: true,
      unique: true
    },
    role: {
      type: String,
      default: 'Artist'
    },
    slug: {
      type: String
    },
    listens: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const ArtistModel = model<IArtist>('Artist', artistSchema)

export default ArtistModel
