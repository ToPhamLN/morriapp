import React from 'react'
import style from '~/styles/InputBox.module.css'
import {
  useFormContext,
  useFieldArray,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  FieldValues
} from 'react-hook-form'
import { MdOutlineClose } from 'react-icons/md'
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

const socialMediaIcons = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube
} as {
  [key: string]: IconType
}

const AddLink = () => {
  const {
    formState: { errors },
    control,
    register
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links'
  }) as {
    fields: { name: string; path: string }[]
    append: UseFieldArrayAppend<FieldValues, 'links'>
    remove: UseFieldArrayRemove
  }

  const linkSelected = (name: string) => {
    return fields.some((link) => link?.name === name)
  }
  const handleAddLink = (name: string) => {
    if (!linkSelected(name))
      append({ name: name, path: '' })
  }
  return (
    <div className={style.container}>
      <div className={style.header__link}>
        <span>Các đường dẫn:</span>
        {Object.keys(socialMediaIcons).map((link) => (
          <button
            key={link}
            type='button'
            onClick={() => handleAddLink(link)}
            style={{
              opacity: linkSelected(link) ? '0.3' : 'unset'
            }}
            disabled={linkSelected(link)}
          >
            {React.createElement(socialMediaIcons[link])}
          </button>
        ))}
      </div>
      <div className={style.content__link}>
        {fields.map((link, index) => (
          <div className={style.link__item} key={index}>
            <div className={style.label}>
              {React.createElement(
                socialMediaIcons[link?.name]
              )}
            </div>
            <div className={style.input__box}>
              <input
                type='text'
                {...register(`links.${index}.path`)}
              />
              <button
                type='button'
                className={style.icon}
                onClick={() => remove(index)}
              >
                <MdOutlineClose />
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className={style.error}>
        {errors?.links?.message?.toString()}
      </p>
    </div>
  )
}

export default AddLink
