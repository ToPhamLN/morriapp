import { Routes, Route } from 'react-router-dom'
import {
  publicRoutes,
  privateRoutes,
  authRoutes,
  artistRoutes
} from '~/constants/pathUrl'
import DefaultLayout from '~/layouts/DefaultLayout'
import NotFound from './pages/Error/NotFound'
import ArtistLayout from './layouts/ArtistLayout'
import { useAppSelector } from './hooks'
import { ERole } from './constants/enum'

const App: React.FC = () => {
  const userInfo = useAppSelector(
    (state) => state.profile.role
  )

  return (
    <Routes>
      {userInfo === ERole.ARTIST && (
        <Route path='/' element={<ArtistLayout />}>
          {artistRoutes.map((route) => {
            const Page = route.component
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Page />}
              ></Route>
            )
          })}
          {publicRoutes.map((route) => {
            const Page = route.component
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<Page />}
              ></Route>
            )
          })}
          <Route path='*' element={<NotFound />} />
        </Route>
      )}
      <Route path='/' element={<DefaultLayout />}>
        {authRoutes.map((route) => {
          const Page = route.component
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Page />}
            ></Route>
          )
        })}
        {publicRoutes.map((route) => {
          const Page = route.component
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Page />}
            ></Route>
          )
        })}
        {privateRoutes.map((route) => {
          const Page = route.component
          return (
            <Route
              key={route.path}
              path={route.path}
              element={userInfo ? <Page /> : <Page />}
            ></Route>
          )
        })}
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
