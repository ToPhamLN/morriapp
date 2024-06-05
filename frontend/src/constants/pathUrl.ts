import React from 'react'
import Home from '~/pages/Home'
import Login from '~/pages/Auth/LoginPage'
import Signup from '~/pages/Auth/SignupPage'
import Search from '~/pages/Search'
import UserMylist from '~/pages/UserMyList'
import UserDetails from '~/pages/UserDetails'
import Account from '~/pages/Account'
import Role from '~/pages/Auth/RolePage'
import ArtistAlbum from '~/pages/ArtistAlbum'
import ArtistAlbumCreate from '~/pages/ArtistAlbumCreate'
import ArtistAlbumUpdate from '~/pages/ArtistAlbumUpdate'
import ArtistBioCreate from '~/pages/ArtistBioCreate'
import ArtistTrackCreate from '~/pages/ArtistTrackCreate'
import ArtistTrackUpdate from '~/pages/ArtistTrackUpdate'
import AlbumDetails from '~/pages/AlbumDetails'
import ArtistHome from '~/pages/ArtistHome'
import ArtistTrack from '~/pages/ArtistTrack'
import UserMyListCreate from '~/pages/UserMyListCreate'
import WishTrack from '~/pages/WishTrack'
import GenrePage from '~/pages/Genre'
import Lyrics from '~/pages/Lyrics'
import TrackDetails from '~/pages/TrackDetails'
import GenreDetails from '~/pages/GenreDetails'
import RankDetails from '~/pages/RankDetails'

export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  search: '/search',
  albumDetails: '/album/:albumParam',
  albumCreate: '/project/create',
  albumUpdate: '/album/:albumParam/edit',
  trackCreate: '/track/create',
  trackUpdate: '/track/:trackParam/edit',
  playlistDetails: '/playlist/:albumParam',
  playlistUpdate: '/playlist/:albumParam/edit',
  epDetails: '/ep/:albumParam',
  epUpdate: '/ep/:albumParam/edit',
  singleDetails: '/single/:albumParam',
  singleUpdate: '/single/:albumParam/edit',
  createlist: '/mylist/create',
  genre: '/genre',
  genreDetails: '/genre/:genreParam',
  userDetails: '/user/:userParam',
  mylist: '/mylist',
  wishTrack: '/wishTrack',
  account: '/account',
  role: '/role',
  artistDetails: '/artist/:artistParam',
  artistBioCreate: '/mybio',
  artistPin: '/mypin',
  artistAlbum: '/myproject',
  artistTrack: '/mytrack',
  lyrics: '/lyrics',
  trackDetails: '/track/:trackParam',
  rankDetails: '/rank/:rankParam'
} as const

export const authRoutes: {
  path: string
  component: React.ComponentType
}[] = [
  { path: routes.login, component: Login },
  { path: routes.signup, component: Signup },
  { path: routes.role, component: Role }
]

export const publicRoutes: {
  path: string
  component: React.ComponentType
}[] = [
  { path: routes.home, component: Home },
  { path: routes.search, component: Search },

  { path: routes.genre, component: GenrePage },
  { path: routes.artistDetails, component: ArtistHome },
  { path: routes.userDetails, component: UserDetails },
  {
    path: routes.albumDetails,
    component: AlbumDetails
  },
  {
    path: routes.playlistDetails,
    component: AlbumDetails
  },
  {
    path: routes.epDetails,
    component: AlbumDetails
  },
  {
    path: routes.singleDetails,
    component: AlbumDetails
  },
  {
    path: routes.lyrics,
    component: Lyrics
  },
  {
    path: routes.trackDetails,
    component: TrackDetails
  },
  {
    path: routes.genreDetails,
    component: GenreDetails
  },
  {
    path: routes.rankDetails,
    component: RankDetails
  }
]

export const privateRoutes: {
  path: string
  component: React.ComponentType
}[] = [
  { path: routes.mylist, component: UserMylist },
  { path: routes.account, component: Account },
  { path: routes.createlist, component: UserMyListCreate },
  { path: routes.wishTrack, component: WishTrack },
  {
    path: routes.playlistUpdate,
    component: ArtistAlbumUpdate
  }
]

export const artistRoutes: {
  path: string
  component: React.ComponentType
}[] = [
  { path: routes.home, component: ArtistHome },
  { path: routes.account, component: Account },
  {
    path: routes.albumCreate,
    component: ArtistAlbumCreate
  },
  { path: routes.artistAlbum, component: ArtistAlbum },
  {
    path: routes.artistBioCreate,
    component: ArtistBioCreate
  },
  {
    path: routes.albumUpdate,
    component: ArtistAlbumUpdate
  },
  {
    path: routes.epUpdate,
    component: ArtistAlbumUpdate
  },
  {
    path: routes.singleUpdate,
    component: ArtistAlbumUpdate
  },
  {
    path: routes.trackCreate,
    component: ArtistTrackCreate
  },
  {
    path: routes.trackUpdate,
    component: ArtistTrackUpdate
  },
  { path: routes.artistTrack, component: ArtistTrack }
]
