import { Routes, Route } from 'react-router-dom'
import {
  publicRoutes,
  privateRoutes,
  authRoutes,
  artistRoutes,
  adminRoutes
} from '~/constants/pathUrl'
import DefaultLayout from '~/layouts/DefaultLayout'
import NotFound from './pages/Error/NotFound'
import ArtistLayout from './layouts/ArtistLayout'
import { useAppSelector } from './hooks'
import { ERole } from './constants/enum'
import AdminLayout from './layouts/AdminLayout'

const App: React.FC = () => {
  const { role, isAdmin } = useAppSelector(
    (state) => state.profile
  )

  return (
    <Routes>
      {role === ERole.ARTIST && (
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
      {isAdmin && (
        <Route path='/' element={<AdminLayout />}>
          {adminRoutes.map((route) => {
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
              element={role ? <Page /> : <Page />}
            ></Route>
          )
        })}
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
