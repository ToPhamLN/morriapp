import { ERole, ECategory, EGenre } from '~/constants/enum'

interface DImage {
  path: string
  fileName: string
}

interface DLink {
  name?: string
  path?: string
}

interface DAuthor {
  _id: string
  username: string
  avatar: DImage
  role: string
  slug: string
}

interface DPerson extends DAuthor {
  role: ERole
  slug: string
}

interface DAuth {
  _id: string
  email: string
  password?: string
  role?: string
  idRole?: ERole | DArtist | DUser
}

interface DArtist extends DAuthor {
  auth: string | DAuth
  slug: string
  background: DImage
  listens: number
}
interface DUser extends DAuthor {
  auth: string | DAuth
  slug: string
  background: DImage
}

interface DInteraction {
  user: string
  wishTrack: string[]
  wishList: string[]
  recentlyTrack: string[]
}

interface DListTrack {
  _id?: string
  category?: ECategory
  title?: string
  description?: string
  photo?: DImage
  background?: string
  author?: DAuthor
  authorRole?: ERole
  slug?: string
  likes?: number
  list: DTrack[]
  listens?: number
  pin?: boolean
  genre: EGenre[]
}

interface DTrack {
  _id?: string
  title?: string
  photo?: DImage
  source?: DImage
  duration?: number
  album?: DListTrack
  artist?: DArtist[]
  author?: DArtist
  authorRole?: ERole
  lyrics?: string
  slug?: string
  listens?: number
  likes?: number
  updatedAt?: string
}

interface DMonthlyListens {
  count: number
}

interface DBios {
  photos: DImage[]
  birthday?: string
  content?: string
  links?: DLink[]
}

interface DNotifiction {
  _id?: string
  receiver: string
  receiverCategory: string
  photo: DImage
  title?: string
  message?: string
  path?: string
}
