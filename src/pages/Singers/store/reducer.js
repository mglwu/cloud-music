import {fromJS} from 'immutable'
import * as actionType from './constants'

const defaultState = fromJS({
  catgory: '',
  alpha: '',
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,
  pullDownLoading: false,
  pageCount: 0
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionType.CHANGE_CATRGORY:
      return state.set('category', action.data)
    case actionType.CHANGE_ALPHA:
      return state.set('alpha', action.data)
    case actionType.CHANGE_SINGER_LIST:
      return state.set('singerList', action.data)
    case actionType.CHANGE_PAGE_COUNT:
      return state.set('pageCount', action.data)
    case actionType.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    case actionType.CHANGE_PULLUP_LOADING:
      return state.set('pullUpLoading', action.data)
    case actionType.CHANGE_PULLDOWN_LOADING:
      return state.set('pullDownLoading', action.data)
    default:
      return state
  }
}
