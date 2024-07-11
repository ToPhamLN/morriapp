import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import style from '~/styles/InputBox.module.css'
import { IoIosArrowDown } from 'react-icons/io'
import { useFormContext } from 'react-hook-form'
import { EReportCategory } from '~/constants/enum'

const SelectorCategory = () => {
  const [expend, setExpend] = useState<boolean>(false)

  const {
    formState: { errors },
    watch,
    setValue,
    clearErrors
  } = useFormContext()

  const handleChoose = (value: string) => {
    setValue('category', value)
    clearErrors('category')
    setExpend(false)
  }

  const handleClear = () => {
    setValue('category', '')
  }
  const listCategory = Object.keys(EReportCategory).map(
    (key) =>
      EReportCategory[key as keyof typeof EReportCategory]
  )
  return (
    <div className={style.container}>
      <div className={style.selector}>
        <div
          className={`${style.input__box} ${watch('category') ? style.has__value : ''}`}
        >
          <label htmlFor='selector'>Loại</label>
          <div className={style.result}>
            {watch('category')}
          </div>
          {watch('category') && (
            <button
              className={style.icon}
              onClick={handleClear}
            >
              <MdOutlineClose />
            </button>
          )}
          <button
            className={style.icon}
            onClick={() => setExpend((p) => !p)}
          >
            <IoIosArrowDown />
          </button>
        </div>
        {expend && (
          <div
            className={style.wrapper}
            style={{ height: 'auto' }}
          >
            {listCategory.map((item, index) => (
              <div
                className={style.item__selector}
                key={index}
                onClick={() => handleChoose(item)}
                role='button'
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className={style.error}>
        {errors?.category?.message?.toString()}
      </p>
    </div>
  )
}

export default SelectorCategory
