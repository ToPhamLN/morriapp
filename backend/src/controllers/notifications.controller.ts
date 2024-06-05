import { Request, Response, NextFunction } from 'express'
import { NotificationModel } from '~/models'

export const createNotification = async (
  notification: Partial<INotification>
) => {
  try {
    const newNotification = new NotificationModel(notification)
    await newNotification.save()
    return newNotification
  } catch (error) {
    return null
  }
}

export const getMyNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { receiver, receiverCategory } = req.query as {
      receiver?: string
      receiverCategory?: string
    }

    let query: {
      receiver?: string
      receiverCategory?: string
    } = {}

    if (receiver && receiverCategory) {
      query = { receiver, receiverCategory }
    }

    const notifications = await NotificationModel.find(query)
    res.status(200).json(notifications)
  } catch (error) {
    next(error)
  }
}

export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { idNotification } = req.params
    await NotificationModel.findByIdAndDelete(idNotification)
    res
      .status(200)
      .json({ message: 'Xóa thông báo thành công!' })
  } catch (error) {
    next(error)
  }
}
