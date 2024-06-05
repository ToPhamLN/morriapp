import { Schema, model } from 'mongoose'
import { EListens } from '~/types'

const monthlyListen = new Schema<IMonthlyListens>({
  item: {
    type: Schema.Types.ObjectId,
    refPath: 'itemCategory'
  },
  itemCategory: {
    type: String,
    enum: Object.values(EListens)
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

const MonthlyListenModel = model<IMonthlyListens>(
  'MonthlyListen',
  monthlyListen
)

export default MonthlyListenModel
