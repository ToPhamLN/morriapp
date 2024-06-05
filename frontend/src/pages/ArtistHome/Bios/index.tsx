import React from 'react'
import Slick from './Slick'
import style from '~/styles/ArtistDetails.module.css'
import { DBios } from '~/types/data'
import { MdCake, MdSendTimeExtension } from 'react-icons/md'
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube
} from 'react-icons/fa'
import { IconType } from 'react-icons/lib'
import { calculateDate, formatDay } from '~/utils/format'

interface BiosData extends DBios {
  createdAt: string
}

interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
  bios: BiosData
}

const socialMediaIcons = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  twitter: FaTwitter,
  youtube: FaYoutube
} as {
  [key: string]: IconType
}

const Bios = ({ setExit, bios }: Props) => {
  return (
    <div className={style.fixed__container}>
      <article className={style.bios__details}>
        <button
          className={style.exit}
          type='button'
          onClick={() => setExit((p) => !p)}
        >
          X
        </button>
        <h1>Tiểu sử</h1>
        <div className={style.container}>
          <Slick lists={bios?.photos} />
          <div className={style.other}>
            <div className={style.top}>
              <label className={style.label}>
                <MdCake />
                {bios?.birthday &&
                  formatDay(bios?.birthday)}
              </label>
              <label className={style.label}>
                <MdSendTimeExtension />{' '}
                {bios?.createdAt &&
                  calculateDate(bios?.createdAt)}
              </label>
            </div>
            <div className={style.links}>
              {bios?.links?.map((link, index) => (
                <label
                  className={style.label}
                  key={index}
                  onClick={() =>
                    window.open(link?.path, '_blank')
                  }
                >
                  {link?.name
                    ? React.createElement(
                        socialMediaIcons[link?.name]
                      )
                    : ''}
                </label>
              ))}
            </div>
          </div>
          <div className={style.content}>
            {bios?.content}
          </div>
        </div>
      </article>
    </div>
  )
}

export default Bios
