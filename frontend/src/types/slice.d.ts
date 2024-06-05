import { DImage, DListTrack, DTrack } from './data'
interface IProfile {
  _id?: string
  email?: string
  accessToken?: string
  role?: string
  idRole?: {
    _id: string
    username: string
    avatar: DImage
    background: DImage
    slug: string
    role: string
  }
}

interface SettingsSliceType {
  theme: boolean
}

interface IArtistType {
  name: string
}

interface VolumeType {
  isMute: boolean
  value: number
}

interface ModeTrackPlay {
  isLoop: boolean
  isReplay: boolean
  isSuffle: boolean
}

interface TrackPlaySliceType {
  listInfo?: DListTrack
  waitingList: DTrack[]
  list: DTrack[]
  track: DTrack
  volume: VolumeType
  currentTime: number
  mode: ModeTrackPlay
  isPlaying: boolean
}

interface SNotification {
  type: string
  message: string
}

interface GlobalSliceType {
  view: {
    isView: boolean
    isRecently: boolean
  }
  isSidebar: boolean
  notify: SNotification[]
  search: (SearchItem | SearchKey)[]
}

interface SearchItem {
  type: 'item'
  image?: DImage
  title?: string
  path?: string
}

interface SearchKey {
  type: 'key'
  title?: string
}
