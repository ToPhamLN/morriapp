import React, { useState } from 'react'
import {
  useForm,
  FormProvider,
  Resolver
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAppDispatch, useAxiosPublic } from '~/hooks'
import { updateProfile } from '~/reduxStore/profileSlice'
import { useLocation, useNavigate } from 'react-router-dom'
import style from '~/styles/Login.module.css'
import { InputBox } from '~/components/common'
import { LoadingIcon } from '~/components/pure'
import { Link } from 'react-router-dom'
import { setNotify } from '~/reduxStore/globalSlice'

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
  return (
    <div className={style.login}>
      <div
        className={style.container}
        style={{ opacity: loading ? '0.8' : 'unset' }}
      >
        <h1>Đăng nhập vào Morri</h1>
        <div className={style.passport}>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='100'
              height='100'
              viewBox='0 0 48 48'
            >
              <path
                fill='#3F51B5'
                d='M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z'
              ></path>
              <path
                fill='#FFF'
                d='M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z'
              ></path>
            </svg>
            Đăng nhập bằng Google
          </button>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              x='0px'
              y='0px'
              width='100'
              height='100'
              viewBox='0 0 48 48'
            >
              <path
                fill='#FFC107'
                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
              ></path>
              <path
                fill='#FF3D00'
                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
              ></path>
              <path
                fill='#4CAF50'
                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
              ></path>
              <path
                fill='#1976D2'
                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
              ></path>
            </svg>
            Đăng nhập bằng Facebook
          </button>
        </div>
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
