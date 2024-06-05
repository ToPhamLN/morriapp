import { Link } from 'react-router-dom'
import { useSearchHandler } from '~/hooks'
import style from '~/styles/Card.module.css'
import { DPerson } from '~/types/data'

interface Props {
  person: DPerson
}

const CardPeople = ({ person }: Props) => {
  const category =
    person.role === 'Artist' ? 'artist' : 'user'
  const path = `/${category}/${person?.slug}${person?._id}.html`
  const { handleAddSearch } = useSearchHandler()
  return (
    <div className={style.card__people}>
      <div className={style.title}>
        <div className={style.image}>
          <img
            src={
              person?.avatar?.path ||
              '/src/assets/account-default.png'
            }
            alt='Image Playlist'
          />
        </div>
      </div>
      <div className={style.artist__name}>
        <Link
          to={path}
          onClick={() =>
            handleAddSearch(
              person?.username,
              person?.avatar,
              path
            )
          }
        >
          {person?.username}
        </Link>
      </div>
    </div>
  )
}

export default CardPeople
