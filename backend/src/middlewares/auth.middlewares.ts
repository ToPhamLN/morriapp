import jwt, { VerifyErrors } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { AuthModel } from '~/models'

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.headers.token as string

  if (token) {
    const accessToken = token.split(' ')[1]

    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY as string,
      async (err: VerifyErrors | null, auth: any) => {
        if (err) {
          return res.status(403).json({
            message: 'Token đã hết hạn'
          })
        }

        try {
          const existed = await AuthModel.findById(
            auth?.authId
          ).lean()
          if (auth && !existed) {
            return res.status(401).json({
              message: 'Bạn đang giả mạo người dùng?'
            })
          }
          req.auth = existed
          next()
        } catch (error) {
          next(error)
        }
      }
    )
  } else {
    res.status(401).json({
      message: 'Bạn không có thẩm quyền làm điều này'
    })
  }
}
