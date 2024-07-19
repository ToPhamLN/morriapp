import { Request, Response, NextFunction } from 'express'
import { ArtistModel, AuthModel, UserModel } from '~/models'
import {
  convertSlug,
  generateAccessToken,
  generateRefreshToken
} from '~/utils/helper'
import bcrypt from 'bcrypt'
import { ERole } from '~/types'
import { v2 as cloudinary } from 'cloudinary'
import {
  getApps,
  sendNotification
} from '~/config/pushNotification'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import passport from 'passport'

const CLIENT_URL = process.env.CLIENT_URL as string
let refreshTokens: string[] = []

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
})

interface Provider {
  provider: string
  id: string
}

export const googleAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'google',
    async (err: any, user: Provider, info: any) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login`)
      }
      try {
        await handleAuthSuccess(req, res, user)
      } catch (err) {
        next(err)
      }
    }
  )(req, res, next)
}

export const facebookAuth = passport.authenticate('facebook')

export const facebookAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'facebook',
    async (err: any, user: Provider, info: any) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login`)
      }
      try {
        await handleAuthSuccess(req, res, user)
      } catch (err) {
        next(err)
      }
    }
  )(req, res, next)
}

async function handleAuthSuccess(
  req: Request,
  res: Response,
  user: Provider
) {
  req.login(user, async (err) => {
    if (err) {
      throw err
    }
    const { provider, id: idProvider } = user

    try {
      let auth = await AuthModel.findOne({
        provider,
        idProvider
      })

      if (!auth) {
        auth = new AuthModel({
          provider,
          idProvider
        })

        await auth.save()
      }

      const { password: omitPassword, ...other } =
        auth.toObject()
      const accessToken = generateAccessToken(auth)
      const refreshToken = generateRefreshToken(auth)

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })

      res.redirect(
        `${process.env.CLIENT_URL}/login?user=${JSON.stringify({ ...other, accessToken })}`
      )
    } catch (error) {
      console.error('Error handling authentication:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
}

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const existAuth = await AuthModel.findOne({ email })

    if (existAuth) {
      return res
        .status(400)
        .json({ message: 'Email này đã tồn tại' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const newAuth = new AuthModel({ email, password: hashed })

    const auth = await newAuth.save()
    const { password: omitPassword, ...other } = auth.toObject()
    const accessToken = generateAccessToken(auth)
    const refreshToken = generateRefreshToken(auth)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })

    res.status(200).json({
      auth: { ...other, accessToken },
      message: 'Đăng ký thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const auth = await AuthModel.findOne({ email })
      .populate({
        path: 'idRole',
        select: 'username avatar slug'
      })
      .lean()

    if (!auth) {
      return res.status(404).json({
        message:
          'Không tìm thấy tài khoản này! Vui lòng thử lại.'
      })
    }

    const validPassword = await bcrypt.compare(
      password,
      auth.password
    )

    if (!validPassword) {
      return res
        .status(404)
        .json({ message: 'Sai mật khẩu!. Vui lòng thử lại.' })
    }

    const { password: omitPassword, ...others } = auth
    const accessToken = generateAccessToken(auth)
    const refreshToken = generateRefreshToken(auth)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict'
    })
    sendNotification({
      message: 'Chào mừng bạn đến với Morri',
      title: 'Đăng nhập thành công'
    })
    const app = await getApps()
    res.status(200).json({
      auth: { ...others, accessToken },
      message: 'Đăng nhập thành công',
      app: app
    })
  } catch (error) {
    next(error)
  }
}

export const updateAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, oldPassword, newPassword, role, idRole } =
      req.body
    const auth = req.auth

    if (email) {
      const existedAuth = await AuthModel.findOne({
        email,
        _id: { $ne: auth._id }
      })

      if (existedAuth) {
        return res
          .status(400)
          .json({ message: 'Tài khoản này đã tồn tại.' })
      }
    }

    const newAuth: Partial<IAuth> = {
      email: email || auth.email,
      role: role || auth.role,
      idRole: idRole || auth.idRole
    }
    if (oldPassword && newPassword) {
      const validPassword = await bcrypt.compare(
        oldPassword,
        auth.password
      )

      if (!validPassword) {
        return res.status(401).json({
          message: 'Sai mật khẩu cũ! Vui lòng thử lại.'
        })
      }
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(newPassword, salt)
      newAuth.password = hashed
    }

    const result = await AuthModel.findByIdAndUpdate(
      auth._id,
      { $set: newAuth },
      { $new: true }
    )

    res.status(200).json({
      message: 'Tài khoản cập nhật thành công.',
      auth: result
    })
  } catch (error) {
    next(error)
  }
}

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id: authId, idRole: authIdRole } = req.auth
    const { username, role } = req.body
    const avatar = req.file as Express.Multer.File
    let idRole
    if (authIdRole) {
      await cloudinary.uploader.destroy(avatar?.filename)
      return res
        .status(400)
        .json({ message: 'Không thể xử lý yêu cầu' })
    }
    if (role == ERole.ARTIST) {
      const newArtist = new ArtistModel({
        username,
        avatar: {
          path: avatar?.path,
          fileName: avatar?.filename
        },
        slug: convertSlug(username),
        auth: authId
      })
      const artist = await newArtist.save()
      idRole = artist._id
    } else if (role == ERole.USER) {
      const newUser = new UserModel({
        username,
        avatar: {
          path: avatar?.path,
          fileName: avatar?.filename
        },
        slug: convertSlug(username),
        auth: authId
      })
      const user = await newUser.save()
      idRole = user._id
    }

    const auth = await AuthModel.findByIdAndUpdate(
      authId,
      { $set: { idRole, role } },
      { new: true }
    )
      .populate({
        path: 'idRole',
        select: 'avatar username _id'
      })
      .select('-password')

    return res
      .status(200)
      .json({ auth, message: 'Cập nhập thành công!' })
  } catch (error) {
    if (req.file)
      await cloudinary.uploader.destroy(req.file.filename)
    next(error)
  }
}

export const logout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
  })
  req.session = null
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.body.token
  )
  res.clearCookie('refreshToken')
  res.status(200).json('Đăng xuất thành công!')
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken)
    return res
      .status(401)
      .json('Bạn không có thẩm quyền làm điều này')
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json('Token đã hết hạn')
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_KEY as string,
    (err: VerifyErrors | null, user: any) => {
      if (err) {
        console.log(err)
      }
      refreshTokens = refreshTokens.filter(
        (token) => token !== refreshToken
      )
      const newAccessToken = generateAccessToken(user)
      const newRefreshToken = generateRefreshToken(user)
      refreshTokens.push(newRefreshToken)
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict'
      })
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      })
    }
  )
}
