import { ReportModel } from '~/models'
import { Request, Response, NextFunction } from 'express'
import { convertSlug } from '~/utils/helper'

interface IReqbody {
  title?: string
  path?: string
  photo?: string
  category: string
  description: string
}

export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idRole: sender, role: senderCategory } =
      req.auth as {
        idRole: string
        role: string
      }
    const { title, path, photo, category, description } =
      req.body as IReqbody
    const newReport = new ReportModel({
      sender,
      senderCategory,
      title,
      path,
      photo,
      category,
      description,
      slug: title ? convertSlug(title) : undefined
    })
    const report = await newReport.save()
    res
      .status(200)
      .json({ report, message: 'Gửi báo cáo thành công' })
  } catch (error) {
    next(error)
  }
}

export const getReports = async (
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

    if (!page && !limit) {
      const reports = await ReportModel.find(query)
        .populate({
          path: 'sender',
          select: 'username _id avatar slug role'
        })
        .exec()
      return res.status(200).json(reports)
    }

    const pageNumber = page ? parseInt(page, 10) : 1
    const limitNumber = limit ? parseInt(limit, 10) : 20
    const skip = (pageNumber - 1) * limitNumber

    const reports = await ReportModel.find(query)
      .populate({
        path: 'sender',
        select: 'username _id avatar slug role'
      })
      .skip(skip)
      .limit(limitNumber)
      .exec()

    res.status(200).json(reports)
  } catch (error) {
    next(error)
  }
}

export const getReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idReport } = req.params as { idReport: never }
    const reports = await ReportModel.findById(idReport)
      .populate({
        path: 'sender',
        select: 'username _id avatar slug role'
      })
      .exec()
    res.status(200).json(reports)
  } catch (error) {
    next(error)
  }
}

export const countReports = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reportCount = await ReportModel.countDocuments().exec()
    res.status(200).json(reportCount)
  } catch (error) {
    next(error)
  }
}

export const delelteReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idReport } = req.params
    const existedArtist = await ReportModel.findById(idReport)
    if (!existedArtist) {
      return res.status(404).json({
        message: 'Bạn đã xóa báo cáo này rồi!'
      })
    }
    await ReportModel.findByIdAndDelete(idReport)

    res.status(200).json({ message: 'Xóa báo cáo thành công!' })
  } catch (error) {
    next(error)
  }
}
