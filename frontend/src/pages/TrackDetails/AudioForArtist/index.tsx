import { useAppSelector } from '~/hooks'
import style from '~/styles/TrackDetails.module.css'
import { useEffect, useRef } from 'react'

const AudioForArtist = () => {
  const { track } = useAppSelector(
    (state) => state.trackPlay
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement && track?.source?.path) {
      audioElement?.play()
    }

    // Cleanup function to pause audio when component unmounts
    return () => {
      if (audioElement) {
        audioElement?.pause()
      }
    }
  }, [track])

  return (
    <div className={style.controller}>
      <audio
        ref={audioRef}
        controls
        style={{ width: '100%' }}
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
    </div>
  )
}

export default AudioForArtist
