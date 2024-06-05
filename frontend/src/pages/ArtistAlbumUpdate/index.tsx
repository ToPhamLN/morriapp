import React, { useState, useEffect } from 'react'
import {
  ColorPicker,
  InputBox,
  InputFile,
  TextBox
} from '~/components/common'
import { LoadingIcon } from '~/components/pure'
import style from '~/styles/ArtistCreateAlbum.module.css'
import {
  useForm,
  FormProvider,
  Resolver
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { MdOutlineLibraryAddCheck } from 'react-icons/md'
import {
  useAppDispatch,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'
import { setNotify } from '~/reduxStore/globalSlice'
import { useParams } from 'react-router-dom'
import { DImage, DListTrack } from '~/types/data'
import useSWR from 'swr'
import SelectorCategory from '~/pages/ArtistAlbumCreate/SelectorCategory'
import MultipleGenre from '~/pages/ArtistAlbumCreate/MultipleGenre'

interface FormAlbum {
  title: string
  photoOld: DImage
  photo: File | string
  background: string
  description: string
  genre: { value: string }[]
  category: string
}

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề.'),
  photo: yup.mixed().nullable(),
  background: yup.string(),
  description: yup.string().required('Vui lòng nhập mô tả.')
})

const ArtistAlbumUpdate: React.FC = () => {
  const idAlbum = useParams().albumParam?.slice(-29, -5)
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<FormAlbum>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<FormAlbum>
  })
  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()
  const fetcher = useFetcher()
  const apiEndpoint = `/api/v1/listtracks/${idAlbum}`
  const { data: album, isLoading } = useSWR(
    apiEndpoint,
    fetcher
  ) as {
    data: DListTrack
    isLoading: boolean
  }

  const onSubmit = async (data: FormAlbum) => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (data.title) formData.append('title', data.title)
      if (data.photoOld)
        formData.append(
          'photoOld',
          JSON.stringify(data.photoOld)
        )
      if (data.photo) formData.append('photo', data.photo)
      if (data.background)
        formData.append('background', data.background)
      if (data.description)
        formData.append('description', data.description)
      if (data.category)
        formData.append('category', data.category)
      if (data.genre) {
        data.genre.forEach((genre) =>
          formData.append('genre', genre?.value)
        )
      }

      const res = await axios.put(
        `api/v1/listtracks/update/${album?._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      dispatch(
        setNotify({
          type: 'success',
          message: res?.data?.message
        })
      )
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const formAlbum = {
      title: album?.title,
      photoOld: album?.photo,
      background: album?.background,
      description: album?.description,
      category: album?.category,
      genre: album?.genre?.map((genre) => ({
        value: genre
      }))
    } as unknown as FormAlbum
    methods.reset(formAlbum)
  }, [album])

  return (
    <div className={style.create__album}>
      {!isLoading && (
        <FormProvider {...methods}>
          <form
            className={style.form}
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ opacity: loading ? '0.8' : 'unset' }}
          >
            <div className={style.title}>Sửa đổi Album</div>
            <InputFile
              label='Thay đổi Ảnh tiêu đề'
              name='photo'
              accept='image/*'
            />
            <InputBox
              label='Tiêu đề'
              name='title'
              type='text'
            />
            <SelectorCategory />
            <MultipleGenre />

            <ColorPicker
              name='background'
              label={'Màu nền'}
            />
            <TextBox label='Mô tả' name='description' />
            <button>
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
      )}
    </div>
  )
}

export default ArtistAlbumUpdate
