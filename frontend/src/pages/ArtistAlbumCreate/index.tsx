import React, { useState } from 'react'
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
import { useAppDispatch, useAxiosPrivate } from '~/hooks'
import { setNotify } from '~/reduxStore/globalSlice'
import SelectorCategory from './SelectorCategory'
import MultipleGenre from './MultipleGenre'

interface FormAlbum {
  title: string
  photo: File | string
  background: string
  description: string
  category: string
  genre: { value: string }[]
}

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề.'),
  photo: yup
    .mixed()
    .required('Vui lòng tải ảnh lên.')
    .nullable(),
  background: yup
    .string()
    .required('Vui lòng nhập màu nền.'),
  description: yup.string().required('Vui lòng nhập mô tả.')
})

const ArtistCreateAlbum: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<FormAlbum>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<FormAlbum>,
    defaultValues: {
      background: '#0F172A'
    }
  })

  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()

  const onSubmit = async (data: FormAlbum) => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (data.title) formData.append('title', data.title)
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

      const res = await axios.post(
        '/api/v1/listtracks/create',
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

  return (
    <div className={style.create__album}>
      <FormProvider {...methods}>
        <form
          className={style.form}
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ opacity: loading ? '0.8' : 'unset' }}
        >
          <h1 className={style.title}>
            Tạo dự án âm nhạc mới
          </h1>
          <InputFile
            label='Ảnh tiêu đề'
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
    </div>
  )
}

export default ArtistCreateAlbum
