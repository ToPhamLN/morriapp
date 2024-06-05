import React, { useEffect, useState, useRef } from 'react'
import style from '~/styles/ArtistCreateTrack.module.css'
import {
  FormProvider,
  Resolver,
  useForm
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Selector from './Selector'
import {
  InputBox,
  InputFile,
  TextBox
} from '~/components/common'
import { LoadingIcon } from '~/components/pure'
import { MdOutlineLibraryAddCheck } from 'react-icons/md'
import MultipleArtist from './MultipleArtist'
import { useAppDispatch, useAxiosPrivate } from '~/hooks'
import { setNotify } from '~/reduxStore/globalSlice'
import { schemaTrack } from '~/utils/validate'

interface FormTrack {
  album?: { title: string; _id: string }
  title?: string
  photo?: string | File
  source?: File | string
  duration?: number
  lyrics?: string
  artist: { username: string; _id: string }[]
}
const defaultValues: FormTrack = {
  artist: []
}

const ArtistCreateTrack: React.FC = () => {
  const methods = useForm<FormTrack>({
    resolver: yupResolver(
      schemaTrack
    ) as unknown as Resolver<FormTrack>,
    defaultValues
  })
  const [loading, setLoading] = useState<boolean>(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const src = methods.watch('source') as unknown as
    | Blob
    | MediaSource
  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()
  const onSubmit = async (data: FormTrack) => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (data?.album)
        formData.append(
          'album',
          JSON.stringify(data?.album)
        )
      if (data?.title) formData.append('title', data?.title)
      if (data?.photo) formData.append('photo', data?.photo)

      if (data?.source)
        formData.append('source', data?.source)

      if (data?.duration)
        formData.append(
          'duration',
          data?.duration.toString()
        )
      if (data?.lyrics)
        formData.append('lyrics', data?.lyrics)
      if (data?.artist)
        formData.append(
          'artist',
          JSON.stringify(
            data?.artist?.map((item) => item?._id)
          )
        )

      const res = await axios.post(
        '/api/v1/tracks/create',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      if (res.data) {
        dispatch(
          setNotify({
            type: 'success',
            message: res.data.message
          })
        )
        methods.reset({})
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio && src) {
      const onLoadedMetadata = () => {
        methods.setValue('duration', audio.duration)
      }
      audio.addEventListener(
        'loadedmetadata',
        onLoadedMetadata
      )
      return () => {
        audio.removeEventListener(
          'loadedmetadata',
          onLoadedMetadata
        )
      }
    }
  }, [src])

  return (
    <div className={style.create__track}>
      <FormProvider {...methods}>
        <form
          className={style.form}
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ opacity: loading ? '0.8' : 'unset' }}
        >
          <h1 className={style.title}>Tạo Bài Hát Mới</h1>
          <Selector />
          <InputBox
            label='Tên bài hát'
            name='title'
            type='text'
          />
          <MultipleArtist />
          <InputFile
            label='Ảnh'
            name='photo'
            accept='image/*'
          />
          <InputFile
            label='Nhạc'
            name='source'
            accept='audio/*'
          />
          {src && (
            <>
              <audio controls ref={audioRef}>
                <source
                  src={URL.createObjectURL(src)}
                  type='audio/mpeg'
                />
                <track
                  kind='captions'
                  label='English'
                  srcLang='en'
                />
              </audio>
              <TextBox label='Lời bài hát' name='lyrics' />
            </>
          )}
          <button className={style.submit}>
            {loading ? (
              <LoadingIcon />
            ) : (
              <>
                <MdOutlineLibraryAddCheck />
                Tạo
              </>
            )}
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export default ArtistCreateTrack
