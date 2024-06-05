import style from '~/styles/Role.module.css'
import { InputBox, InputFile } from '~/components/common'
import { useFormContext } from 'react-hook-form'
import { ERole } from '~/constants/enum'

const AboutNewMe = () => {
  const { getValues } = useFormContext()

  return (
    <div className={style.form__section}>
      <h1 className={style.title}>Thông tin tài khoản</h1>
      <InputFile
        label='Ảnh đại diện'
        name='avatar'
        accept='image/*'
      />
      <InputBox
        name='username'
        label={
          getValues('role') == ERole.USER
            ? 'Tên người dùng'
            : 'Tên nghệ sĩ'
        }
        type='text'
      />
    </div>
  )
}

export default AboutNewMe
