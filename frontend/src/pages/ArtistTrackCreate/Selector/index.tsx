import { useState, useEffect } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import style from '~/styles/InputBox.module.css'
import { DListTrack } from '~/types/data'
import { useAppSelector, useAxiosPrivate } from '~/hooks'
import { IoIosArrowDown } from 'react-icons/io'
import { useFormContext } from 'react-hook-form'

const Selector = () => {
  const [albums, setAlbums] = useState<DListTrack[]>([])
  const [expend, setExpend] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const axios = useAxiosPrivate()
  const {
    formState: { errors },
    watch,
    setValue,
    clearErrors
  } = useFormContext()
  const { idRole } = useAppSelector(
    (state) => state.profile
  )

  const handleGetAlbums = async () => {
    try {
      const res = await axios.get('api/v1/listtracks/all', {
        params: {
          author: idRole?._id
        }
      })
      setAlbums(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    handleGetAlbums()
  }, [])

  const handleChoose = (value: string, label: string) => {
    setValue('album._id', value)
    setValue('album.title', label)
    clearErrors('album')
    setExpend(false)
  }

  const handleClear = () => {
    setValue('album', '')
  }
  return (
    <div className={style.container}>
      <div className={style.selector}>
        <div
          className={`${style.input__box} ${watch('album') ? style.has__value : ''}`}
        >
          <label htmlFor='selector'> Album</label>
          <div className={style.result}>
            {watch('album.title')}
          </div>
          {watch('album') && (
            <div
              className={style.icon}
              onClick={handleClear}
            >
              <MdOutlineClose />
            </div>
          )}
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
              albums.map((album) => (
                <div
                  className={style.item__selector}
                  key={album._id}
                  onClick={() =>
                    handleChoose(
                      album?._id ?? '',
                      album?.title ?? ''
                    )
                  }
                  role='button'
                >
                  {album.title}
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

export default Selector
