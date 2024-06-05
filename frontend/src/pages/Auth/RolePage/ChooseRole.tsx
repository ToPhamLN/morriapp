import React, { ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import style from '~/styles/Role.module.css'
import { ERole } from '~/constants/enum'

const Role: React.FC = () => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors }
  } = useFormContext()
  const handleChooseRole = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setValue('role', e.target.value)
    clearErrors('role')
  }
  return (
    <div className={style.role__container}>
      <h1 className={style.title}>Chọn vai trò của bạn</h1>
      <h3 className={style.desc}>
        Lưu ý: Bạn không thể thay đổi sau này
      </h3>
      <div className={style.grid}>
        <label className={style.role__item}>
          <input
            type='radio'
            {...register('role')}
            value={ERole.USER}
            onChange={handleChooseRole}
          />
          <span className={style.role__name}>
            Người nghe
          </span>
          <img src='/src/assets/user-role.jpg' alt='' />
        </label>
        <label className={style.role__item}>
          <input
            type='radio'
            {...register('role')}
            value={ERole.ARTIST}
            onChange={handleChooseRole}
          />
          <span className={style.role__name}>Nghệ sĩ</span>
          <img src='/src/assets/artist-role.jpg' alt='' />
        </label>
      </div>
      {errors.role && (
        <p className={style.error}>
          Vui lòng chọn vai trò trước.
        </p>
      )}
    </div>
  )
}

export default Role
