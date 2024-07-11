import React, { useState } from 'react'
import {
  useForm,
  FormProvider,
  Resolver
} from 'react-hook-form'
import { MdOutlineLibraryAddCheck } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import { TextBox } from '~/components/common'
import { LoadingIcon } from '~/components/pure'
import style from '~/styles/ReportCreate.module.css'
import SelectorCategory from './SelectorCategory'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppDispatch, useAxiosPrivate } from '~/hooks'
import { setNotify } from '~/reduxStore/globalSlice'
interface FormReport {
  path: string
  photo: string
  title: string
  category: string
  description: string
}

const schema = yup.object().shape({
  category: yup.string().required('Vui lòng nhập loại.'),
  description: yup.string().required('Vui lòng nhập mô tả.')
})

const ReportCreate = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<FormReport>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<FormReport>
  })
  const { state } = useLocation() as {
    state: {
      path?: string
      title?: string
      photo?: string
    }
  }

  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()

  const onSubmit = async (data: FormReport) => {
    try {
      setLoading(true)
      const res = await axios.post(
        'api/v1/reports/create',
        { ...data, ...state }
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
    <div className={style.create__report}>
      <FormProvider {...methods}>
        <form
          className={style.form}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Link to={state?.path ? state?.path : '*'}>
            <div className={style.title}>
              <div className={style.photo}>
                <img
                  src={
                    state?.photo || '/src/assets/disc.png'
                  }
                  alt={state?.photo}
                />
              </div>
              <div className='more__links'>
                <h1>Báo cáo</h1>
                <h2>{state?.title}</h2>
              </div>
            </div>
          </Link>
          <SelectorCategory />
          <TextBox label='Mô tả' name='description' />

          <button className={style.submit}>
            {loading ? (
              <LoadingIcon />
            ) : (
              <>
                <MdOutlineLibraryAddCheck />
                Gửi
              </>
            )}
          </button>
        </form>
      </FormProvider>
    </div>
  )
}

export default ReportCreate
