import {fromJS} from 'immutable'
import {getRankListRequest} from '../../../api/request'

// constants
export const CHANGE_RANK_LIST = 'home/rank/CHANGE_RANK_LIST'
export const CHANGE_LOADING = 'home/rank/CHANGE_LOADING'

// actionCreator
const changeRankList = data => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

const changeLoading = data => ({
  type: CHANGE_LOADING,
  data
})

export const getRankList = () => {
  return dispatch => {
    getRankListRequest()
      .then(res => {
        let list = res && res.list
        dispatch(changeRankList(list))
        dispatch(changeLoading(false))
      })
      .catch(() => {
        console.log('获取排行榜数据失败')
      })
  }
}

// reducer
const defalutState = fromJS({
  rankList: [],
  loading: true
})

const reducer = (state = defalutState, action) => {
  switch (action.type) {
    case CHANGE_RANK_LIST:
      return state.set('rankList', action.data)
    case CHANGE_LOADING:
      return state.set('loading', action.data)
    default:
      return state
  }
}

export {reducer}
