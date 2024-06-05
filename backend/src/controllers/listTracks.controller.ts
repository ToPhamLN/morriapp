import { v2 as cloudinary } from 'cloudinary'
import { Request, Response, NextFunction } from 'express'
import { ListTrackModel } from '~/models'
import { EGenre } from '~/types'
import { convertSlug } from '~/utils/helper'
import { getListTrackLike } from './interactions.controllers'

interface IReqBody {
  photoOld: string
  description?: string
  title?: string
  category?: string
  background?: string
  genre?: EGenre[]
}

interface IError extends Error {
  statusCode: number
}

export const createListTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, category, background, genre } =
      req.body as IReqBody
    const { idRole, role } = req.auth
    const photo = req.file

    const newListTrack = new ListTrackModel({
      description,
      category,
      background,
      title,
      genre,
      author: idRole,
      authorRole: role,
      slug: title ? convertSlug(title) : ''
    })
    if (photo) {
      newListTrack.photo = {
        path: photo.path,
        fileName: photo.filename
      }
    }
    const listTrack = await newListTrack.save()
    res
      .status(200)
      .json({ listTrack, message: 'Tạo thành công' })
  } catch (error) {
    if (req.file && req.file.filename)
      await cloudinary.uploader.destroy(req.file.filename)
    next(error)
  }
}

export const updateListTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idListTrack } = req.params

    const existListTrack =
      await ListTrackModel.findById(idListTrack)
    if (!existListTrack)
      throw new Error('Danh sách nhạc này không tồn tại')
    const {
      title,
      description,
      category,
      background,
      genre,
      photoOld
    } = req.body as IReqBody
    const photo = req.file
    let convertPhotoOld: IImage = {}
    if (photoOld) {
      convertPhotoOld = JSON.parse(photoOld)
    }
    const newListTrack: Partial<IListTrack> = {
      description,
      category,
      background,
      title,
      genre,
      slug: title ? convertSlug(title) : ''
    }
    if (photo?.path) {
      newListTrack.photo = {
        path: photo.path,
        fileName: photo.filename
      }
    } else {
      newListTrack.photo = convertPhotoOld
    }

    const updateListTrack =
      await ListTrackModel.findByIdAndUpdate(
        idListTrack,
        { $set: newListTrack },
        { $new: true }
      )
    if (!updateListTrack) throw new Error('Không thể cập nhập')
    if (
      !convertPhotoOld?.fileName &&
      existListTrack?.photo?.fileName
    )
      await cloudinary.uploader.destroy(
        existListTrack?.photo?.fileName
      )
    res.status(201).json({
      message: 'Cập nhập thành công.'
    })
  } catch (error) {
    if (req.file && req.file.filename)
      await cloudinary.uploader.destroy(req.file.filename)
    next(error)
  }
}

export const pinlistTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idListTrack } = req.params
    const existListTrack =
      await ListTrackModel.findById(idListTrack)
    if (!existListTrack)
      throw new Error('Danh sách nhạc này không tồn tại')
    const newListTrack: Partial<IListTrack> = {
      pin: !existListTrack?.pin
    }
    const updateListTrack =
      await ListTrackModel.findByIdAndUpdate(
        idListTrack,
        { $set: newListTrack },
        { $new: true }
      )
    if (!updateListTrack) throw new Error('Không thể cập nhập')
    res.status(201).json({
      message: 'Cập nhập thành công.'
    })
  } catch (error) {
    next(error)
  }
}

export const listensListTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idListTrack } = req.params
    const existedListTrack =
      await ListTrackModel.findById(idListTrack)
    if (!existedListTrack)
      return res
        .status(404)
        .json({ message: 'Không tìm thấy danh sách này' })
    await ListTrackModel.updateOne(
      { _id: idListTrack },
      { $inc: { listens: 1 } }
    )
    res
      .status(200)
      .json({ message: 'Tăng lượt nghe thành công' })
  } catch (error) {
    next(error)
  }
}

export const addTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idListTrack } = req.params
    const { track } = req.body as { track: never }
    const existedListTrack =
      await ListTrackModel.findById(idListTrack)
    if (!existedListTrack) {
      const error = new Error(
        'Không tìm thấy danh sách này'
      ) as IError
      error.statusCode = 404
      throw error
    }
    const existedTrack = existedListTrack?.list?.includes(track)
    if (existedTrack) {
      await ListTrackModel.findByIdAndUpdate(
        idListTrack,
        {
          $pull: { list: track }
        },
        { new: true }
      )
      return res.status(200).json({
        message: 'Loại bỏ bài hát thành công'
      })
    } else {
      await ListTrackModel.findByIdAndUpdate(
        idListTrack,
        {
          $push: { list: track }
        },
        { new: true }
      )
      return res.status(200).json({
        message: 'Thêm bài hát thành công'
      })
    }
  } catch (error) {
    next(error)
  }
}

export const getListTracks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { author, pin, q, genre, ramdom } = req.query as {
      author?: string
      pin?: string
      q?: string
      genre?: string
      ramdom?: number
    }
    const query = {} as {
      author?: string
      pin?: boolean
      slug: {
        $regex: RegExp
      }
      genre?: {
        $in: string[]
      }
    }

    if (author) {
      query.author = author
    }
    if (pin === 'true') {
      query.pin = true
    } else if (pin === 'false') {
      query.pin = false
    }
    if (q)
      query.slug = {
        $regex: new RegExp(convertSlug(q), 'i')
      }
    if (genre)
      query.genre = {
        $in: [genre]
      }

    let listTracks = await ListTrackModel.find(query)
      .populate({
        path: 'author',
        select: 'username _id avatar slug role'
      })
      .lean()

    if (ramdom) {
      listTracks = listTracks
        ?.sort(() => Math.random() - 0.5)
        ?.slice(0, ramdom)
    }
    res.status(200).json(listTracks)
  } catch (error) {
    next(error)
  }
}

export const getAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idListTrack } = req.params
    const listTrack = await ListTrackModel.findById(idListTrack)
      .populate({
        path: 'author',
        select: 'username _id avatar slug role'
      })
      .populate({
        path: 'list',
        populate: {
          path: 'artist album author',
          select: '_id username title slug avatar role'
        }
      })

      .lean()

    const likes = await getListTrackLike(idListTrack)

    res.status(200).json({ ...listTrack, likes })
  } catch (error) {
    next(error)
  }
}
