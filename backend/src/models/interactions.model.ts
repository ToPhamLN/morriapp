import { Schema, model } from 'mongoose'

const interactionSchema = new Schema<IInteraction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wishTrack: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
    default: []
  },
  wishList: {
    type: [{ type: Schema.Types.ObjectId, ref: 'ListTrack' }],
    default: []
  },
  recentlyTrack: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
    default: []
  }
})

const InteractionModel = model('Interaction', interactionSchema)

export default InteractionModel
