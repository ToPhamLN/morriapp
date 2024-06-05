import { useEffect, useState } from 'react'
import style from '~/styles/Account.module.css'
import {
  useForm,
  FormProvider,
  Resolver
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { InputBox } from '~/components/common'
import {
  useAppSelector,
  useAxiosPrivate,
  useAppDispatch
} from '~/hooks'
import { setNotify } from '~/reduxStore/globalSlice'
import { updateProfile } from '~/reduxStore/profileSlice'

interface FormAccount {
  email?: string
  oldPassword?: string
  newPassword?: string
  confirmPwd?: string
}
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ.')
    .required('Vui lòng nhập email.'),
  oldPassword: yup.string(),
  newPassword: yup.string(),
  confirmPwd: yup
    .string()
    .oneOf(
      [yup.ref('newPassword')],
      'Mật khẩu xác nhận phải khớp.'
    )
})
const MoreAccount = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const methods = useForm<FormAccount>({
    resolver: yupResolver(
      schema
    ) as unknown as Resolver<FormAccount>
  })
  const profile = useAppSelector((state) => state?.profile)
  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()

  const onSubmit = async (data: FormAccount) => {
    try {
      setLoading(true)
      const res = await axios.put(
        'api/v1/auths/update',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      dispatch(
        setNotify({
          type: 'success',
          message: res.data?.message
        })
      )

      if (res?.data?.auth && res?.data?.auth?.email) {
        dispatch(
          updateProfile({
            email: res?.data?.auth?.email
          })
        )
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const form = {
      email: profile?.email || ''
    } as FormAccount
    methods.reset(form)
  }, [profile])
  return (
    <div className={style.content}>
      <FormProvider {...methods}>
        <form
          className={style.form}
          onSubmit={methods.handleSubmit(onSubmit)}
          style={{ opacity: loading ? '0.8' : 'unset' }}
        >
          <InputBox
            label='Email'
            name='email'
            type='text'
          />
          <InputBox
            label='Mật khẩu cũ'
            name='oldPassword'
            type='password'
          />{' '}
          <InputBox
            label='Mật khẩu mới'
            name='newPassword'
            type='password'
          />
          <InputBox
            label='Xác nhận mật khẩu'
            name='confirmPwd'
            type='password'
          />
          <button> Cập nhập</button>
        </form>
      </FormProvider>
    </div>
  )
}

export default MoreAccount
