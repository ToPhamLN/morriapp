import { useState } from 'react'
import {
  MdOutlineClose,
  MdOutlineVisibility,
  MdOutlineVisibilityOff
} from 'react-icons/md'
import style from '~/styles/InputBox.module.css'
import { useFormContext } from 'react-hook-form'

interface Props {
  label: string
  name: string
  type: string
}

const InputBox = ({ label, name, type }: Props) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useFormContext()
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false)

  return (
    <div className={style.container}>
      <div
        className={`${style.input__box} ${watch(name) ? style.has__value : ''} ${type == 'password' && style.type__pwd}`}
      >
        <label htmlFor={name}>{label}</label>
        {type == 'password' && (
          <div
            className={style.show}
            onClick={() =>
              setIsPasswordVisible(!isPasswordVisible)
            }
          >
            {isPasswordVisible ? (
              <MdOutlineVisibility />
            ) : (
              <MdOutlineVisibilityOff />
            )}
          </div>
        )}
        <input
          type={
            type == 'password'
              ? isPasswordVisible
                ? 'text'
                : 'password'
              : type
          }
          id={name}
          content={type}
          autoComplete='off'
          {...register(name)}
        />
        {watch(name) && (
          <div
            className={style.icon}
            onClick={() => setValue(name, '')}
          >
            <MdOutlineClose />
          </div>
        )}
      </div>
      <p className={style.error}>
        {errors[name]?.message?.toString()}
      </p>
    </div>
  )
}

export default InputBox
