import { Schema, model } from 'mongoose'

const biosSchema = new Schema<IBios>(
  {
    photos: [
      {
        fileName: String,
        path: String
      }
    ],
    content: { type: String },
    birthday: {
      type: Date,
      default: new Date('2010-01-01')
    },
    links: [
      {
        name: String,
        path: String
      }
    ],
    artist: {
      type: Schema.Types.ObjectId,
      ref: 'Artist'
    }
  },
  { timestamps: true }
)

const BiosModel = model<IBios>('Bios', biosSchema)

export default BiosModel
