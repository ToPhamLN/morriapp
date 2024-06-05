import { Request, Response, NextFunction } from 'express'
import { UserModel } from '~/models'
import { v2 as cloudinary } from 'cloudinary'
import { convertSlug } from '~/utils/helper'

interface IReqBody {
  username: string
  backgroundOld?: string
  avatarOld?: string
}

interface IReqFiles {
  avatar?: Express.Multer.File[] | []
  background?: Express.Multer.File[] | []
}

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idUser } = req.params
    const user = await UserModel.findOne({
      _id: idUser
    })
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query as {
      q: string
    }
    const query = {} as {
      slug: {
        $regex: RegExp
      }
    }
    if (q)
      query.slug = {
        $regex: new RegExp(convertSlug(q), 'i')
      }
    const user = await UserModel.find(query)
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRole: userId } = req.auth as { idRole: string }
    const existedUser = await UserModel.findById(userId)
    if (!existedUser)
      throw new Error('Không tìm thấy người dùng này')

    const { username, backgroundOld, avatarOld } =
      req.body as IReqBody
    const { avatar, background } =
      req.files as unknown as IReqFiles
    let convertBackground: IImage = {}
    let convertAvatar: IImage = {}
    if (backgroundOld) {
      convertBackground = JSON.parse(backgroundOld)
    }
    if (avatarOld) {
      convertAvatar = JSON.parse(avatarOld)
    }

    const newUser: Partial<IUser> = {
      username: username,
      slug: username ? convertSlug(username) : ''
    }

    if (avatar && avatar[0]?.filename) {
      newUser.avatar = {
        path: avatar[0]?.path,
        fileName: avatar[0]?.filename
      }
    } else {
      newUser.avatar = convertAvatar
    }
    if (background && background[0]?.filename) {
      newUser.background = {
        path: background[0]?.path,
        fileName: background[0]?.filename
      }
    } else {
      newUser.background = convertBackground
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: newUser },
      { new: true }
    )

    if (!updatedUser) {
      throw new Error('Không thể cập nhập.')
    }

    if (
      !convertAvatar.fileName &&
      existedUser?.avatar?.fileName
    ) {
      await cloudinary.uploader.destroy(
        existedUser?.avatar.fileName
      )
    }
    if (
      !convertBackground.fileName &&
      existedUser?.background?.fileName
    ) {
      await cloudinary.uploader.destroy(
        existedUser?.background.fileName
      )
    }
    res.status(201).json({
      message: 'Cập nhập thành công',
      user: updatedUser
    })
  } catch (error) {
    if (req.file) {
      const { avatar, background } =
        req.files as unknown as IReqFiles
      if (avatar) {
        await cloudinary.uploader.destroy(avatar[0]?.filename)
      }
      if (background) {
        await cloudinary.uploader.destroy(
          background[0]?.filename
        )
      }
    }
    next(error)
  }
}
