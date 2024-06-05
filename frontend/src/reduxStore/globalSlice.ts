import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import {
  GlobalSliceType,
  SearchItem,
  SearchKey,
  SNotification
} from '~/types/slice'

const MAX_SEARCH_ITEMS = 22

const initialState: GlobalSliceType = {
  view: {
    isView: false,
    isRecently: false
  },
  isSidebar: false,
  notify: [],
  search: []
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsView: (state, action: PayloadAction<boolean>) => {
      state.view.isView = action.payload
    },
    setIsRecently: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.view.isRecently = action.payload
    },
    setIsSidebar: (state) => {
      state.isSidebar = !state.isSidebar
    },
    setNotify: (
      state,
      action: PayloadAction<SNotification>
    ) => {
      state.notify = [...state.notify, action.payload]
    },
    removeNotify: (
      state,
      action: PayloadAction<SNotification>
    ) => {
      state.notify = state.notify.filter(
        (item) => item.message !== action.payload.message
      )
    },
    addSearchItem: (
      state,
      action: PayloadAction<SearchItem>
    ) => {
      const { path } = action.payload
      const updatedSearch = state.search.filter(
        (item) => item.type === 'key' || item.path !== path
      )
      updatedSearch.unshift(action.payload)
      if (updatedSearch.length > MAX_SEARCH_ITEMS) {
        updatedSearch.pop()
      }
      state.search = updatedSearch
    },

    addSearchKey: (
      state,
      action: PayloadAction<SearchKey>
    ) => {
      const { title } = action.payload
      const updatedSearch = state.search.filter(
        (item) =>
          item.type === 'item' || item.title !== title
      )
      updatedSearch.unshift(action.payload)
      if (updatedSearch.length > MAX_SEARCH_ITEMS) {
        updatedSearch.pop()
      }
      state.search = updatedSearch
    },

    removeSearchItem: (
      state,
      action: PayloadAction<SearchItem>
    ) => {
      const { path } = action.payload
      const updatedSearch = state.search.filter(
        (item) => item.type === 'key' || item.path !== path
      )
      state.search = updatedSearch
    },

    removeSearchKey: (
      state,
      action: PayloadAction<SearchKey>
    ) => {
      const { title } = action.payload
      const updatedSearch = state.search.filter(
        (item) =>
          item.type === 'item' || item.title !== title
      )
      state.search = updatedSearch
    }
  }
})

export const {
  setIsView,
  setIsRecently,
  setIsSidebar,
  setNotify,
  removeNotify,
  addSearchItem,
  addSearchKey,
  removeSearchItem,
  removeSearchKey
} = globalSlice.actions

export default globalSlice.reducer
