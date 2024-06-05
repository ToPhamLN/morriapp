import { ChangeEvent } from 'react'
import {
  FieldValues,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext
} from 'react-hook-form'
import { MdOutlineClose } from 'react-icons/md'
import style from '~/styles/InputBox.module.css'
import { DImage } from '~/types/data'

const InputFileMultiple = () => {
  const {
    formState: { errors },
    control,
    watch
  } = useFormContext()

  const { append, remove } = useFieldArray({
    control,
    name: 'photos'
  }) as unknown as {
    fields: FileList
    append: UseFieldArrayAppend<FieldValues, 'photos'>
    remove: UseFieldArrayRemove
  }

  const { remove: removeOld } = useFieldArray({
    control,
    name: 'photosOld'
  }) as unknown as {
    fields: { path: string; fileName: string }[]
    append: UseFieldArrayAppend<FieldValues, 'photos'>
    remove: UseFieldArrayRemove
  }

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (files) {
      for (let i = 0; i < files.length; i++) {
        append(files[i])
      }
    }
  }

  return (
    <div className={style.container}>
      <div className={style.header__files}>
        <span className={style.label}>Ảnh</span>
        <div className={style.input__files}>
          <label htmlFor='photos'>Đăng ảnh</label>
          <input
            type='file'
            name='photos'
            id='photos'
            multiple={true}
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className={style.files__list}>
        {watch('photosOld') &&
          watch('photosOld').map(
            (file: DImage, index: number) => (
              <div key={index} className={style.file__item}>
                <img
                  src={file?.path}
                  alt={file?.fileName}
                />
                <button
                  type='button'
                  onClick={() => removeOld(index)}
                  className={style.delete__image}
                >
                  <MdOutlineClose />
                </button>
              </div>
            )
          )}
        {watch('photos') &&
          watch('photos').map(
            (file: File, index: number) => (
              <div key={index} className={style.file__item}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file?.name}
                />
                <button
                  type='button'
                  onClick={() => remove(index)}
                  className={style.delete__image}
                >
                  <MdOutlineClose />
                </button>
              </div>
            )
          )}
      </div>
      <p className={style.error}>
        {errors?.photos?.message?.toString()}
      </p>
    </div>
  )
}

export default InputFileMultiple
