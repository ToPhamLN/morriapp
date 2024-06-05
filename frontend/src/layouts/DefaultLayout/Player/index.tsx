import React, { useEffect, useRef } from 'react'
import style from '~/styles/Player.module.css'

import {
  useAppDispatch,
  useAppSelector,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'

import {
  setWaitingList,
  setTrack,
  setVolume,
  setCurrentTime,
  setIsPlaying
} from '~/reduxStore/trackPlaySlice'
import { sortPlayList } from '~/utils/array'
import { DInteraction, DTrack } from '~/types/data'
import useSWR, { mutate } from 'swr'
import PlayerInfo from './PlayerInfo'
import Range from './Range'
import Controller from './Controller'
import Option from './Option'

const Player: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    waitingList,
    track,
    volume,
    currentTime,
    mode,
    isPlaying,
    listInfo
  } = useAppSelector((state) => state.trackPlay)
  const dispatch = useAppDispatch()
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const fetcher = useFetcher()
  const axios = useAxiosPrivate()

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = audioRef.current
    const { value } = event.target
    if (audio) {
      audio.currentTime = parseFloat(value)
      dispatch(setCurrentTime(parseFloat(value)))
    }
  }

  const handleVolume = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = audioRef.current
    const { value } = event.target
    let isMuteValue = false
    if (value === '0') isMuteValue = true
    if (audio) {
      audio.volume = parseFloat(value)
      dispatch(
        setVolume({
          isMute: isMuteValue,
          value: parseFloat(value)
        })
      )
    }
  }

  const handleMute = () => {
    const audio = audioRef.current
    if (audio) {
      if (!volume.isMute) {
        audio.volume = 0
      } else {
        audio.volume = volume.value
      }
    }
    dispatch(
      setVolume({
        isMute: !volume.isMute,
        value: volume.value
      })
    )
  }

  const handleReplay = () => {
    const audio = audioRef.current
    if (audio) {
      audio.load()
      dispatch(setIsPlaying(true))
      audio.play()
    }
  }

  const handlePlayForward = () => {
    const newList: DTrack[] = sortPlayList(1, waitingList)
    dispatch(setTrack(newList[0]))
    dispatch(setWaitingList(newList))
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      handleReplay()
    }
  }, [track])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleTimeUpdate = () => {
        dispatch(setCurrentTime(audio.currentTime))
      }
      audio.addEventListener('timeupdate', handleTimeUpdate)

      audio.currentTime = currentTime
      if (volume.isMute) {
        audio.volume = 0
      } else {
        audio.volume = volume.value
      }
      audio.pause()
      dispatch(setIsPlaying(false))

      return () => {
        audio.addEventListener(
          'timeupdate',
          handleTimeUpdate
        )
      }
    }
  }, [])
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      if (isPlaying) {
        audio.play()
      } else {
        audio.pause()
      }
    }
  }, [isPlaying])

  const { data: interaction } = useSWR(
    idRole?._id
      ? `api/v1/interactions/${idRole?._id}`
      : null,
    fetcher
  ) as { data: DInteraction }

  const likedTrack = track?._id
    ? interaction?.wishTrack?.includes(track?._id)
    : false

  const handleLikeTrack = async () => {
    if (idRole?._id && track?._id)
      try {
        await axios.put(
          `api/v1/interactions/wish/track/${track?._id}`
        )
        mutate(`api/v1/interactions/${idRole?._id}`)
      } catch (error) {
        console.log(error)
      }
  }

  const handleAddReacently = async () => {
    if (idRole?._id && track?._id)
      try {
        await axios.put(
          `api/v1/interactions/recently/track/${track?._id}`
        )
        mutate(`api/v1/interactions/${idRole?._id}`)
      } catch (error) {
        console.log(error)
      }
  }
  const handleListenTrack = async () => {
    if (track?._id) {
      try {
        await axios.post(
          `api/v1/tracks/${track?._id}/listen`,
          {
            listInfo: listInfo?._id
          }
        )
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    handleAddReacently()
    handleListenTrack()
  }, [track])

  return (
    <div
      className={`${style.player} ${!track && style.no__track}`}
    >
      <PlayerInfo
        likedTrack={likedTrack}
        handleLikeTrack={handleLikeTrack}
      />
      <div className={style.track__process}>
        <audio
          ref={audioRef}
          onEnded={
            mode.isReplay ? handleReplay : handlePlayForward
          }
          className={'player__track'}
        >
          <source
            src={track?.source?.path}
            type='audio/mpeg'
          />
          <track
            kind='captions'
            label='English'
            srcLang='en'
          />
        </audio>
        <Controller
          likedTrack={likedTrack}
          handleLikeTrack={handleLikeTrack}
        />
        <Range handleSeek={handleSeek} />
      </div>
      <Option
        handleMute={handleMute}
        handleVolume={handleVolume}
      />
    </div>
  )
}

export default Player
