import { useState, useEffect } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import style from '~/styles/InputBox.module.css'
import { useAxiosPrivate } from '~/hooks'
import { IoIosArrowDown } from 'react-icons/io'
import {
  useFormContext,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldValues
} from 'react-hook-form'

interface IResArtist {
  username?: string
  _id?: string
}

const MultipleArtist = () => {
  const [artists, setArtists] = useState<IResArtist[]>([])
  const [expend, setExpend] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const axios = useAxiosPrivate()
  const {
    formState: { errors },
    watch,
    clearErrors,
    control
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'artist'
  }) as {
    fields: { _id: string; username: string }[]
    append: UseFieldArrayAppend<FieldValues, 'artist'>
    remove: UseFieldArrayRemove
  }

  const handleGetArtists = async () => {
    try {
      const res = await axios.get('api/v1/artists/all')
      setArtists(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    handleGetArtists()
  }, [])

  const isArtistSelected = (artistId: string) => {
    return fields.some((artist) => artist?._id === artistId)
  }

  const handleChoose = (value: string, lable: string) => {
    if (!isArtistSelected(value)) {
      append({ _id: value, username: lable })
    }
    clearErrors('artist')
    setExpend(false)
  }

  return (
    <div className={style.container}>
      <div
        className={`${style.selector} ${style.multiple}`}
      >
        <div
          className={`${style.input__box} ${watch('artist') ? style.has__value : ''}`}
        >
          <label htmlFor='selector'>Nghệ sĩ tham gia</label>
          <div className={style.result}>
            {fields.map((artist, index) => (
              <div
                key={index}
                className={style.result__item}
                onClick={() => remove(index)}
              >
                {artist?.username}
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
            {!loading &&
              artists.map((artist) => (
                <div
                  className={style.item__selector}
                  key={artist._id}
                  onClick={() =>
                    handleChoose(
                      artist?._id ?? '',
                      artist?.username ?? ''
                    )
                  }
                  role='button'
                >
                  {artist?.username}
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

export default MultipleArtist
