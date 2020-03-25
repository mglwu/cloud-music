import {
  SET_HOT_KEYWORDS,
  SET_SUGGEST_LIST,
  SET_RESULT_SONGS_LIST,
  SET_ENTER_LOADING
} from './constants'

import {fromJS} from 'immutable'
import {
  getHotKeyWordsRequest,
  getSuggestListRequest,
  getResultSongsListRequest
} from '../../../api/request'

const changeHotKeyWords = data => ({
  type: SET_HOT_KEYWORDS,
  data: fromJS(data)
})

const changeSuggestList = data => ({
  type: SET_SUGGEST_LIST,
  data: fromJS(data)
})

const changeResultSongs = data => ({
  type: SET_RESULT_SONGS_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = data => ({
  type: SET_ENTER_LOADING,
  data
})

export const getHotKeyWords = () => {
  return dispatch => {
    getHotKeyWordsRequest()
      .then(data => {
        let list = data.result.hots
        dispatch(changeHotKeyWords(list))
      })
      .catch(() => {
        console.log('获取热门搜索失败')
      })
  }
}

export const getSuggestList = query => {
  return dispatch => {
    getSuggestListRequest(query)
      .then(data => {
        if (!data) return
        let res = data.result || []
        dispatch(changeSuggestList(res))
      })
      .catch(() => {
        console.log('请求失败')
      })
    getResultSongsListRequest(query).then(data => {
      if (!data) return
      let res = data.result.songs || []
      dispatch(changeResultSongs(res))
      dispatch(changeEnterLoading(false))
    })
  }
}
