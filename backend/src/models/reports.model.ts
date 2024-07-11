import { Schema, model } from 'mongoose'

const reportSchema = new Schema<IReport>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      refPath: 'senderCategory'
    },
    senderCategory: {
      type: String
    },
    path: {
      type: String
    },
    picture: {
      type: String
    },
    title: {
      type: String
    },
    category: {
      type: String
    },
    description: {
      type: String
    },
    slug: {
      type: String
    }
  },
  { timestamps: true }
)

const ReportModel = model<IReport>('Report', reportSchema)
export default ReportModel
