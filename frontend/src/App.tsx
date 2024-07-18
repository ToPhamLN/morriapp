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
import OneSignal from 'react-onesignal'
import { useEffect } from 'react'

const App: React.FC = () => {
  const { role, isAdmin } = useAppSelector(
    (state) => state.profile
  )

  async function initializeOneSignal() {
    await OneSignal.init({
      appId: 'bcd99d6f-0d71-4fca-b3a3-400df3af1761',
      allowLocalhostAsSecureOrigin: true
    })
    OneSignal.Slidedown.promptPush()
    OneSignal.
  }

  useEffect(() => {
    initializeOneSignal()
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/OneSignalSDKWorker.js')
        .then(function (registration) {
          console.log(
            'Service Worker registered with scope:',
            registration.scope
          )
        })
        .catch(function (error) {
          console.log(
            'Service Worker registration failed:',
            error
          )
        })
    }
    if (Notification.permission === 'granted') {
      console.log('Notification permission granted.')
    } else if (Notification.permission === 'denied') {
      console.log('Notification permission denied.')
    } else {
      Notification.requestPermission().then(
        (permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.')
          } else {
            console.log('Notification permission denied.')
          }
        }
      )
    }
  })

  // useEffect(() => {
  //   // Hàm khởi tạo OneSignal

  //   // Kiểm tra và yêu cầu quyền thông báo
  //   const requestNotificationPermission = async () => {
  //     if (Notification.permission === 'granted') {
  //       console.log('Notification permission granted.')
  //       initializeOneSignal()
  //     } else if (Notification.permission === 'denied') {
  //       console.log('Notification permission denied.')
  //     } else {
  //       const permission =
  //         await Notification.requestPermission()
  //       if (permission === 'granted') {
  //         console.log('Notification permission granted.')
  //         initializeOneSignal()
  //       } else {
  //         console.log('Notification permission denied.')
  //       }
  //     }
  //   }

  //   // Đăng ký Service Worker
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker
  //       .register('/OneSignalSDKWorker.js')
  //       .then(function (registration) {
  //         console.log(
  //           'Service Worker registered with scope:',
  //           registration.scope
  //         )
  //         requestNotificationPermission() // Yêu cầu quyền thông báo sau khi đăng ký Service Worker
  //       })
  //       .catch(function (error) {
  //         console.log(
  //           'Service Worker registration failed:',
  //           error
  //         )
  //       })
  //   }
  // }, [])

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
          {privateRoutes.map((route) => {
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
