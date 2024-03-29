import * as actionTypes from './constants'
import {fromJS} from 'immutable'

const defaultState = fromJS({
  artist: {},
  songsOfArtist: [],
  enterLoading: true
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_ARIST:
      return state.set('artist', action.data)
    case actionTypes.CHANGE_SONGS_OF_ARTIST:
      return state.set('songOfArtist', action.data)
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    default:
      return state
  }
}
