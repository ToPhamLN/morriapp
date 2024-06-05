import { Schema, model } from 'mongoose'
import { ERole } from '~/types'

const trackSchema = new Schema<ITrack>(
  {
    title: {
      type: String,
      required: true
    },
    photo: {
      path: {
        type: String
      },
      fileName: {
        type: String
      }
    },
    source: {
      path: {
        type: String
      },
      fileName: {
        type: String
      }
    },
    duration: {
      type: Number
    },
    lyrics: {
      type: String
    },
    album: { type: Schema.Types.ObjectId, ref: 'ListTrack' },
    artist: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Artist' }]
    },
    author: {
      type: Schema.Types.ObjectId,
      refPath: 'authorRole'
    },
    authorRole: {
      type: String,
      enum: Object.values(ERole)
    },
    slug: {
      type: String
    },
    listens: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const TrackModel = model<ITrack>('Track', trackSchema)
export default TrackModel
