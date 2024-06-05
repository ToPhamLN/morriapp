import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import style from '~/styles/InputBox.module.css'
import { IoIosArrowDown } from 'react-icons/io'
import {
  useFormContext,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldValues
} from 'react-hook-form'
import { EGenre } from '~/constants/enum'

const MultipleGenre = () => {
  const [expend, setExpend] = useState<boolean>(false)
  const {
    formState: { errors },
    watch,
    clearErrors,
    control
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'genre'
  }) as {
    fields: { value: string }[]
    append: UseFieldArrayAppend<FieldValues, 'genre'>
    remove: UseFieldArrayRemove
  }

  const listGenre = Object.keys(EGenre).map(
    (key) => EGenre[key as keyof typeof EGenre]
  )

  const isArtistSelected = (genre: string) => {
    return fields.some((item) => item.value === genre)
  }

  const handleChoose = (value: string) => {
    console.log(isArtistSelected(value))
    if (!isArtistSelected(value)) {
      append({ value: value })
    }
    clearErrors('genre')
    setExpend(false)
  }

  return (
    <div className={style.container}>
      <div
        className={`${style.selector} ${style.multiple}`}
      >
        <div
          className={`${style.input__box} ${watch('genre') ? style.has__value : ''}`}
        >
          <label htmlFor='selector'>Thể loại nhạc</label>
          <div className={style.result}>
            {fields.map((item, index) => (
              <div
                key={index}
                className={style.result__item}
                onClick={() => remove(index)}
              >
                {item.value}
                <MdOutlineClose />
              </div>
            ))}
          </div>

          <div
            className={style.icon}
            onClick={() => setExpend((p) => !p)}
          >
            <IoIosArrowDown />
          </div>
        </div>
        {expend && (
          <div className={style.wrapper}>
            {listGenre.map((item, index) => (
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
        {errors?.album?.message?.toString()}
      </p>
    </div>
  )
}

export default MultipleGenre
