import { Schema, model } from 'mongoose'

const followingSchema = new Schema<IFollowing>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  followedArtists: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
    default: []
  }
})

const FollowingModel = model<IFollowing>(
  'Following',
  followingSchema
)

export default FollowingModel
