import { useEffect, useState } from 'react'
import style from '~/styles/ArtistBio.module.css'
import { FormProvider, useForm } from 'react-hook-form'
import {
  InputBox,
  InputFileMultiple,
  TextBox
} from '~/components/common'
import AddLink from './AddLink'
import { LoadingIcon } from '~/components/pure'
import { MdOutlineLibraryAddCheck } from 'react-icons/md'
import {
  useAppSelector,
  useAxiosPrivate,
  useAppDispatch,
  useFetcher
} from '~/hooks'
import useSWR from 'swr'
import { DBios, DImage } from '~/types/data'
import { setNotify } from '~/reduxStore/globalSlice'

interface IFormBio {
  photosOld: DImage[]
  photos?: File[]
  birthday?: string
  content?: string
  links?: {
    name?: string
    path?: string
  }[]
}

export const ArtistBioCreate = () => {
  const { _id: idArtist } = useAppSelector(
    (state) => state.profile?.idRole
  ) as { _id: string }

  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<IFormBio>()
  const axios = useAxiosPrivate()
  const fetcher = useFetcher()
  const dispatch = useAppDispatch()
  const apiEndpoint = `api/v1/bios/${idArtist}`
  const { data: bios, isLoading } = useSWR(
    apiEndpoint,
    fetcher
  ) as { data: DBios; isLoading: boolean }
  const onSubmit = async (data: IFormBio) => {
    const formData = new FormData()
    if (data?.photos)
      for (let i = 0; i < data?.photos?.length; i++) {
        formData.append('photos', data?.photos[i])
      }
    if (data?.birthday)
      formData.append('birthday', data?.birthday)
    if (data?.content)
      formData.append('content', data?.content)
    if (data?.links) {
      const linksJson = JSON.stringify(data.links)
      formData.append('links', linksJson)
    }
    if (data.photosOld) {
      const photosOldJson = JSON.stringify(data.photosOld)
      formData.append('photosOld', photosOldJson)
    }

    try {
      setLoading(true)
      const res = await axios.put(
        'api/v1/bios/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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
    const formBio: IFormBio = {
      birthday: bios?.birthday?.split('T')[0],
      links: bios?.links,
      content: bios?.content,
      photosOld: bios?.photos
    }
    methods.reset(formBio)
  }, [bios])
  return (
    <div className={style.bio}>
      {!isLoading && (
        <FormProvider {...methods}>
          <form
            className={style.form}
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{ opacity: loading ? '0.8' : 'unset' }}
          >
            <h1 className={style.title}>Tiểu sử của tôi</h1>
            <InputFileMultiple />
            <InputBox
              label='Sinh nhật'
              name='birthday'
              type='date'
            />
            <TextBox label='Nội dung' name='content' />
            <AddLink />
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
      )}
    </div>
  )
}

export default ArtistBioCreate
