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

    res.status(200).json({
      auth: { ...others, accessToken },
      message: 'Đăng nhập thành công'
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
