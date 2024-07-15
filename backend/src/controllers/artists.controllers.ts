import { Response, Request, NextFunction } from 'express'
import { ArtistModel } from '~/models'
import { v2 as cloudinary } from 'cloudinary'
import { convertSlug } from '~/utils/helper'
import { emitWarning } from 'process'

interface IReqFiles {
  avatar?: Express.Multer.File[] | []
  background?: Express.Multer.File[] | []
}

interface IReqBody {
  username?: string
  backgroundOld?: string
  avatarOld?: string
}

export const updateArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRole: artistId } = req.auth as { idRole: string }
    const existedArtist = await ArtistModel.findById(artistId)
    if (!existedArtist)
      throw new Error('Không tìm thấy nghệ sĩ này')

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

    const newArtist: Partial<IArtist> = {
      username: username,
      slug: username ? convertSlug(username) : ''
    }
    if (avatar && avatar[0]?.filename) {
      newArtist.avatar = {
        path: avatar[0]?.path,
        fileName: avatar[0]?.filename
      }
    } else {
      newArtist.avatar = convertAvatar
    }
    if (background && background[0]?.filename) {
      newArtist.background = {
        path: background[0]?.path,
        fileName: background[0]?.filename
      }
    } else {
      newArtist.background = convertBackground
    }

    const updateArtist = await ArtistModel.findByIdAndUpdate(
      artistId,
      { $set: newArtist },
      { new: true }
    )
    if (!updateArtist) {
      throw new Error('Không thể cập nhập.')
    }
    if (
      !convertAvatar?.fileName &&
      existedArtist?.avatar?.fileName
    )
      await cloudinary.uploader.destroy(
        existedArtist?.avatar?.fileName
      )
    if (
      !convertBackground?.fileName &&
      existedArtist?.background?.fileName
    )
      await cloudinary.uploader.destroy(
        existedArtist?.background?.fileName
      )

    res.status(201).json({
      message: 'Cập nhập thành công',
      artist: updateArtist
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

export const getArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, page, limit } = req.query as {
      q?: string
      page?: string
      limit?: string
    }

    const query: any = {}

    if (q) {
      query.slug = {
        $regex: new RegExp(convertSlug(q), 'i')
      }
    }

    let artistsQuery = ArtistModel.find(query)
      .sort({ createdAt: -1 })
      .lean()

    if (page && limit) {
      const pageNumber = parseInt(page, 10) || 1
      const limitNumber = parseInt(limit, 10) || 20
      const skip = (pageNumber - 1) * limitNumber

      artistsQuery = artistsQuery.skip(skip).limit(limitNumber)
    }

    const artists = await artistsQuery.exec()

    res.status(200).json(artists)
  } catch (error) {
    next(error)
  }
}

export const getArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idArtist } = req.params
    const artist = await ArtistModel.findById(idArtist).lean()
    res.status(200).json(artist)
  } catch (error) {
    next(error)
  }
}

export const countArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await ArtistModel.countDocuments().exec()
    res.status(200).json(count)
  } catch (error) {
    next(error)
  }
}

export const delelteArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idArtist } = req.params
    const existedArtist = await ArtistModel.findById(idArtist)
    if (!existedArtist) {
      return res.status(404).json({
        message: 'Bạn đã xóa nghệ sĩ này rồi!'
      })
    }
    await ArtistModel.findByIdAndDelete(idArtist)
    const { avatar, background } = existedArtist
    if (avatar?.fileName) {
      await cloudinary.uploader.destroy(avatar?.fileName)
    }
    if (background?.fileName) {
      await cloudinary.uploader.destroy(background?.fileName)
    }
    res.status(200).json({ message: 'Xóa nghệ sĩ thành công!' })
  } catch (error) {
    next(error)
  }
}
