import { Schema, model } from 'mongoose'
import { ECategory, EGenre, ERole } from '~/types'

const listTrackSchema = new Schema<IListTrack>(
  {
    category: {
      type: String,
      enum: Object.values(ECategory)
    },
    title: {
      type: String,
      required: true,
      default: 'playlist'
    },
    photo: {
      path: String,
      fileName: String
    },
    background: {
      type: String,
      default: '000000'
    },
    description: {
      type: String,
      default: 'playlist'
    },
    genre: [{ type: String, enum: Object.values(EGenre) }],
    list: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
      default: []
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
    pin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const ListTrackModel = model<IListTrack>(
  'ListTrack',
  listTrackSchema
)

export default ListTrackModel
