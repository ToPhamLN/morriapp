import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import { SettingsSliceType } from '~/types/slice'

const initialState: SettingsSliceType = {
  theme: localStorage.getItem('themeMode')
    ? JSON.parse(window.localStorage.getItem('themeMode')!)
    : null!
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state) => {
      state.theme = !state.theme
      localStorage.setItem(
        'themeMode',
        JSON.stringify(state.theme)
      )
    }
  }
})

export const { setThemeMode } = themeSlice.actions
export default themeSlice.reducer
