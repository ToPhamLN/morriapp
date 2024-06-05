import { Request, Response, NextFunction } from 'express'
import { FollowingModel, UserModel } from '~/models'
import { ERole } from '~/types'
import { createNotification } from './notifications.controller'

export const followingAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRole: userId } = req.auth as { idRole: string }
    const { artistId } = req.body
    const user = await UserModel.findById(userId)
    let following = await FollowingModel.findOne({
      user: userId
    })
    if (!following) {
      following = new FollowingModel({
        user: userId,
        followedArtists: [artistId]
      })

      return res
        .status(200)
        .json({ message: 'Đã theo dõi nghệ sĩ thành công.' })
    }
    const isFollowing =
      following.followedArtists.includes(artistId)
    if (isFollowing) {
      await FollowingModel.updateOne(
        { user: userId },
        { $pull: { followedArtists: artistId } }
      )
      return res.status(200).json({
        message: 'Đã hủy theo dõi nghệ sĩ thành công.'
      })
    } else {
      await FollowingModel.updateOne(
        { user: userId },
        { $push: { followedArtists: artistId } }
      )
      const notification: Partial<INotification> = {
        receiver: artistId,
        receiverCategory: ERole.ARTIST,
        photo: user?.avatar || {},
        message: `${user?.username} đã theo dõi bạn`,
        path: `/user/${user?.slug}${user?._id}.html`
      }
      await createNotification(notification)
      await following.save()
      return res
        .status(200)
        .json({ message: 'Đã theo dõi nghệ sĩ thành công.' })
    }
  } catch (error) {
    next(error)
  }
}

export const getUserFollowedArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId
    const following = await FollowingModel.findOne({
      user: userId
    }).populate('followedArtists')
    const followedArtists = following
      ? following.followedArtists
      : []
    res.status(200).json(followedArtists)
  } catch (error) {
    next(error)
  }
}

export const getArtistFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artistId = req.params.artistId
    const users = await getUserFollowByArtist(artistId)
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const getUserFollowByArtist = async (
  artistId: string
) => {
  try {
    const followers = await FollowingModel.find({
      followedArtists: { $in: [artistId] }
    }).populate('user')
    const users = followers
      .map((follower) => follower.user)
      .filter((user) => user)

    return users
  } catch (error) {
    return null
  }
}
