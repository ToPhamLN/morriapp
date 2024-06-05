import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import { IProfile } from '~/types/slice'

const initialState: IProfile = localStorage.getItem(
  'profile'
)
  ? JSON.parse(localStorage.getItem('profile')!)
  : {}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (
      state,
      action: PayloadAction<IProfile>
    ) => {
      state = action.payload
      localStorage.setItem('profile', JSON.stringify(state))
      return action.payload
    },
    updateProfile: (
      state,
      action: PayloadAction<IProfile>
    ) => {
      state = { ...state, ...action.payload }
      localStorage.setItem('profile', JSON.stringify(state))
      return { ...state, ...action.payload }
    },
    deleteProfile: (state) => {
      state = {}
      console.log(state)
      localStorage.removeItem('profile')
      return state
    }
  }
})

export const { setProfile, updateProfile, deleteProfile } =
  profileSlice.actions
export default profileSlice.reducer
