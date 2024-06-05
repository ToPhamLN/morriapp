import React, { useEffect } from 'react'
import style from '~/styles/Search.module.css'
import { useSearchParams } from 'react-router-dom'
import OldKey from './OldKey'
import All from './All'
import ListTrackSection from './ListTrackSection'
import PeopleSection from './PeopleSection'
import { useFetcher } from '~/hooks'
import useSWR from 'swr'
import { mutate } from 'swr'
import {
  DArtist,
  DListTrack,
  DPerson,
  DTrack,
  DUser
} from '~/types/data'
import { ECategory } from '~/constants/enum'
import TrackSection from './TrackSection'
const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const filter = searchParams.get('filter') ?? ''

  const filterHandler = (value: string) => {
    const query = Object.fromEntries(searchParams.entries())
    query.filter = value
    setSearchParams(query)
  }
  const fetcher = useFetcher()
  const apiListTracks = 'api/v1/listtracks/all'
  const apiTracks = 'api/v1/tracks/all'
  const apiUsers = 'api/v1/users/all'
  const apiArtists = 'api/v1/artists/all'

  const { data: listTracks } = useSWR(
    q ? apiListTracks + 'search' : null,
    () => {
      if (q) {
        return fetcher(apiListTracks, {
          params: {
            q: q
          }
        })
      }
      return null
    }
  ) as { data: DListTrack[] }

  const { data: tracks } = useSWR(
    q ? apiTracks + 'search' : null,
    () => {
      if (q) {
        return fetcher(apiTracks, {
          params: {
            q: q
          }
        })
      }
      return null
    }
  ) as { data: DTrack[] }

  const { data: users } = useSWR(
    q ? apiUsers + 'search' : null,
    () => {
      if (q) {
        return fetcher(apiUsers, {
          params: {
            q: q
          }
        })
      }
      return null
    }
  ) as { data: DUser[] }

  const { data: artists } = useSWR(
    q ? apiArtists + 'search' : null,
    () => {
      if (q) {
        return fetcher(apiArtists, {
          params: {
            q: q
          }
        })
      }
      return null
    }
  ) as { data: DArtist[] }

  useEffect(() => {
    mutate(apiListTracks + 'search')
    mutate(apiTracks + 'search')
    mutate(apiUsers + 'search')
    mutate(apiArtists + 'search')
  }, [q])
  // console.log(listTracks?.map((item) => item.title))
  // console.log(tracks?.map((item) => item.title))
  // console.log(users?.map((item) => item.username))
  // console.log(artists?.map((item) => item.username))

  return (
    <div className={style.search}>
      <div className={style.filter}>
        <button
          onClick={() => filterHandler('')}
          className={filter == '' ? style.active : ''}
        >
          Tất cả
        </button>
        <button
          onClick={() => filterHandler('songs')}
          className={filter == 'songs' ? style.active : ''}
        >
          Bài hát
        </button>
        <button
          onClick={() => filterHandler('albums')}
          className={filter == 'albums' ? style.active : ''}
        >
          Bộ sưu tập
        </button>
        <button
          onClick={() => filterHandler('playlists')}
          className={
            filter == 'playlists' ? style.active : ''
          }
        >
          Danh sách phát
        </button>
        <button
          onClick={() => filterHandler('artists')}
          className={
            filter == 'artists' ? style.active : ''
          }
        >
          Nghệ sĩ
        </button>
        <button
          onClick={() => filterHandler('users')}
          className={filter == 'users' ? style.active : ''}
        >
          Người dùng
        </button>
      </div>
      {q == '' ? (
        <OldKey />
      ) : (
        <React.Fragment>
          {filter == '' && (
            <All
              listTracks={listTracks}
              tracks={tracks}
              users={users}
              artists={artists}
            />
          )}
          {filter == 'songs' && (
            <TrackSection tracks={tracks} />
          )}
          {filter == 'albums' && (
            <ListTrackSection
              listTracks={listTracks?.filter(
                (track) =>
                  track.category != ECategory.PLAYLIST
              )}
              nameSection='Bộ sưu tập'
            />
          )}
          {filter == 'playlists' && (
            <ListTrackSection
              listTracks={listTracks?.filter(
                (track) =>
                  track.category == ECategory.PLAYLIST
              )}
              nameSection='Danh sách phát'
            />
          )}
          {filter == 'artists' && (
            <PeopleSection
              people={artists as unknown as DPerson[]}
              nameSection='Nghệ sĩ'
            />
          )}
          {filter == 'users' && (
            <PeopleSection
              people={users as unknown as DPerson[]}
              nameSection='Nghệ sĩ'
            />
          )}
        </React.Fragment>
      )}
    </div>
  )
}

export default Search
