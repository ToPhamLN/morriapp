import React, { useEffect, useState } from 'react'
import {
  useForm,
  FormProvider,
  Resolver
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDispatch, useAxiosPublic } from '~/hooks'
import {
  setProfile,
  updateProfile
} from '~/reduxStore/profileSlice'
import {
  useLocation,
  useNavigate,
  Link
} from 'react-router-dom'
import style from '~/styles/Login.module.css'
import { InputBox } from '~/components/common'
import { LoadingIcon } from '~/components/pure'
import { setNotify } from '~/reduxStore/globalSlice'
import Passport from './Passport'

interface FormLogin {
  email: string
  password: string
}
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ.')
    .required('Vui lòng nhập email.cwa'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.')
    .max(16, 'Mật khẩu không được quá 16 ký tự.')
    .required('Vui lòng nhập mật khẩu.')
})

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<FormLogin>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<FormLogin>
  })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const axiosPublic = useAxiosPublic()
  const { state } = useLocation()

  const onSubmit = async (data: FormLogin) => {
    try {
      setLoading(true)
      const res = await axiosPublic.post(
        'api/v1/auths/login',
        data
      )
      const { role, idRole } = res.data.auth
      console.log(state)

      if (role && idRole) {
        dispatch(updateProfile(res.data.auth))
        if (state?.history) {
          navigate(state?.history)
        } else {
          navigate('/')
        }
      } else {
        navigate('/role')
      }

      dispatch(
        setNotify({
          type: 'success',
          message: res.data.message
        })
      )
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(
      location.search
    )
    const userParam = searchParams.get('user')

    if (userParam) {
      const userData = JSON.parse(userParam)
      const { role, idRole } = userData
      console.log(userData)
      dispatch(updateProfile(userData))
      if (role && idRole) {
        if (state?.history) {
          navigate(state?.history)
        } else {
          navigate('/')
        }
      } else {
        navigate('/role')
      }
    }
  }, [location.search])

  return (
    <div className={style.login}>
      <div
        className={style.container}
        style={{ opacity: loading ? '0.8' : 'unset' }}
      >
        <h1>Đăng nhập vào Morri</h1>
        <Passport />
        <div className={style.stripe}></div>
        <FormProvider {...methods}>
          <form
            className={style.login__account}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <InputBox
              label='Email'
              name='email'
              type='text'
            />
            <InputBox
              label='Password'
              name='password'
              type='password'
            />
            <button
              className={style.submit__login}
              type='submit'
            >
              {loading ? <LoadingIcon /> : 'Đăng nhập'}
            </button>
          </form>
        </FormProvider>
        <div className={style.forget}>
          <Link to={'/'}>Quên mật khẩu?</Link>
        </div>
        <div className={style.stripe}></div>
        <div className={style.reminder}>
          Chưa có tài khoản?
          <Link to={'/signup'}>Đăng ký</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
