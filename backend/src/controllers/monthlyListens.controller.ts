import { EListens } from '~/types/index'
import { MonthlyListenModel } from '~/models'
import { Request, Response, NextFunction } from 'express'

export const createMonthlyListens = async (
  item: string,
  itemCategory: EListens,
  month: number,
  year: number,
  count?: number
) => {
  try {
    let listenThisMonth = await MonthlyListenModel.findOne({
      item,
      itemCategory,
      month,
      year
    })
    if (!listenThisMonth) {
      listenThisMonth = new MonthlyListenModel({
        item,
        itemCategory,
        month,
        year,
        count: count ? count : 0
      })
      await listenThisMonth.save()
    }
    if (count) {
      const monthlyListens =
        await MonthlyListenModel.findOneAndUpdate(
          {
            item,
            itemCategory,
            month,
            year
          },
          { $inc: { count: 1 } },
          { new: true }
        )
      return monthlyListens
    }

    return listenThisMonth
  } catch (error) {
    throw new Error('Đã xảy ra lỗi')
  }
}

export const getListenThisMonth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { item, itemCategory } = req.query as {
      item: string
      itemCategory: EListens
    }
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const listenThisMonth = await createMonthlyListens(
      item,
      itemCategory,
      month,
      year
    )
    res.json(listenThisMonth)
  } catch (error) {
    next(error)
  }
}
