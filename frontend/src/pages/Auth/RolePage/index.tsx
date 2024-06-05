import React, { useState } from 'react'
import style from '~/styles/Role.module.css'
import { GrNext, GrPrevious } from 'react-icons/gr'
import ChooseRole from './ChooseRole'
import AboutNewMe from './AboutNewMe'
import {
  FormProvider,
  Resolver,
  useForm
} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FaCheck } from 'react-icons/fa'
import { useAxiosPrivate } from '~/hooks'
import { LoadingIcon } from '~/components/pure'
import { useAppDispatch } from '~/hooks'
import { updateProfile } from '~/reduxStore/profileSlice'
import { setNotify } from '~/reduxStore/globalSlice'
import { useNavigate } from 'react-router-dom'

interface FormData {
  role: string
  username: string
  avatar?: File
}

const schema = yup.object().shape({
  role: yup
    .string()
    .required('Vui lòng chọn vai trò trước.'),
  username: yup
    .string()
    .required('Vui lòng nhập tên người dùng.'),
  avatar: yup
    .mixed()
    .required('Vui lòng tải ảnh đại diện lên.')
    .nullable()
})
const RolePage: React.FC = () => {
  const [step, setStep] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<FormData>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<FormData>
  })
  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handlePrev = () => {
    if (step > 1) {
      setStep((p) => p - 1)
    }
  }
  const handleNext = () => {
    const role = methods.getValues().role
    if (!role) {
      methods.setError('role', {
        type: 'required'
      })
      return
    }
    if (step < 2) {
      setStep((p) => p + 1)
    }
  }
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const res = await axios.post(
        'api/v1/auths/role',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      dispatch(updateProfile(res.data.auth))
      dispatch(
        setNotify({
          type: 'success',
          message: res.data.message
        })
      )
      navigate('/')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <FormProvider {...methods}>
      <form
        className={style.role}
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ opacity: loading ? '0.8' : 'unset' }}
      >
        <div className={style.container}>
          {step === 1 && <ChooseRole />}
          {step === 2 && <AboutNewMe />}
          <div className={style.step}>
            <div className={style.btn} onClick={handlePrev}>
              <GrPrevious />
            </div>
            {step === 2 ? (
              <button
                className={`${style.btn} ${style.success__btn}`}
                onClick={handleNext}
              >
                {loading ? <LoadingIcon /> : <FaCheck />}
              </button>
            ) : (
              <div
                className={style.btn}
                onClick={handleNext}
              >
                <GrNext />
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default RolePage
