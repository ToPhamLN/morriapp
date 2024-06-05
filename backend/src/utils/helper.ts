import jwt from 'jsonwebtoken'
import { IAuth, IJwtPayload } from '~/type'

export const generateAccessToken = (auth: IAuth): string => {
  return jwt.sign(
    {
      authId: auth._id,
      role: auth.role
    } as IJwtPayload,
    process.env.JWT_ACCESS_KEY as string,
    { expiresIn: '365d' }
  )
}

export const generateRefreshToken = (auth: IAuth): string => {
  return jwt.sign(
    {
      authId: auth._id,
      role: auth.role
    } as IJwtPayload,
    process.env.JWT_REFRESH_KEY as string,
    { expiresIn: '365d' }
  )
}

export const convertSlug = (a: string): string => {
  let slug: string = a

  slug = slug.toLowerCase()
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
  slug = slug.replace(/đ/gi, 'd')

  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ''
  )

  slug = slug.replace(/ /gi, '-')

  slug = slug.replace(/\-\-\-\-\-/gi, '-')
  slug = slug.replace(/\-\-\-\-/gi, '-')
  slug = slug.replace(/\-\-\-/gi, '-')
  slug = slug.replace(/\-\-/gi, '-')

  slug = '@' + slug + '@'
  slug = slug.replace(/\@\-|\-\@|\@/gi, '')

  return slug
}
