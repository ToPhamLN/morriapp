import { Document, Types } from 'mongoose'
import { EGenre, EListens, ERole } from '~/types'

declare global {
  interface IImage {
    path?: string
    fileName?: string
  }

  interface ILinks {
    name: string
    path: string
  }

  interface IAuth extends Document {
    email: string
    password: string
    role?: ERole
    idRole?: Types.ObjectId
  }

  interface IUser extends Document {
    username?: string
    background?: IImage
    avatar?: IImage
    auth?: Types.ObjectId
    slug?: string
    role: 'User'
  }

  interface IArtist extends Document {
    username: string
    avatar: IImage
    background: IImage
    auth: Types.ObjectId
    slug?: string
    role: 'Artist'
    listens: number
  }

  interface IFollowing extends Document {
    user: Types.ObjectId
    followedArtists: Types.ObjectId[]
  }

  interface ITrack extends Document {
    title?: string
    photo?: IImage
    source: IImage
    duration: number
    album: Types.ObjectId
    artist: Types.ObjectId[]
    author: Types.ObjectId
    authorRole: ERole
    lyrics: string
    slug?: string
    listens: number
    likes: number
  }

  interface IListTrack extends Document {
    category: string
    title: string
    photo: IImage
    background: string
    author: Types.ObjectId
    authorRole: ERole
    description: string
    list: Types.ObjectId[]
    slug: string
    listens: number
    genre: EGenre[]
    pin: boolean
  }
  interface IBios extends Document {
    artist?: Types.ObjectId
    photos?: IImage[]
    content?: string
    birthday?: Date
    links?: ILinks[]
  }
  interface IInteraction extends Document {
    user: Types.ObjectId
    wishTrack: Types.ObjectId[]
    wishList: Types.ObjectId[]
    recentlyTrack: Types.ObjectId[]
  }

  interface IJwtPayload {
    authId: string
    role?: ERole
  }

  interface IMonthlyListens {
    item: Types.ObjectId
    itemCategory: EListens
    month: number
    year: number
    count: number
  }

  interface INotification extends Document {
    receiver: Types.ObjectId
    receiverCategory: ERole
    title?: string
    path?: string
    message: string
    photo: IImage
    isReaded: boolean
  }
}

declare module 'express' {
  interface Request {
    auth?: AuthModel | null | undefined
  }
}
