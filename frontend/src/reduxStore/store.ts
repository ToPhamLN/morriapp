import { configureStore } from '@reduxjs/toolkit'
import profileSlice from './profileSlice'
import settingsSlice from './settingsSlice'
import trackPlaySlice from './trackPlaySlice'
import globalSlice from './globalSlice'

export const store = configureStore({
  reducer: {
    trackPlay: trackPlaySlice,
    profile: profileSlice,
    settings: settingsSlice,
    global: globalSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
