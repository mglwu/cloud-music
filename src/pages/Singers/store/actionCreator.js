import {
  getHotSingerListRequest,
  getSingerListRequest
} from '../../../api/request'
import * as actionTyps from './constants'
import {fromJS} from 'immutable'

export const changeCategory = data => ({
  type: actionTyps.CHANGE_CATRGORY,
  data
})

export const changeAlpha = data => ({
  type: actionTyps.CHANGE_ALPHA,
  data
})

const changeSingerList = data => ({
  type: actionTyps.CHANGE_SINGER_LIST,
  data: fromJS(data)
})

export const changePageCount = data => ({
  type: actionTyps.CHANGE_PAGE_COUNT,
  data
})

export const changeEnterLoading = data => ({
  type: actionTyps.CHANGE_ENTER_LOADING,
  data
})

export const changePullUpLoading = data => ({
  type: actionTyps.CHANGE_PULLUP_LOADING,
  data
})

export const changePullDownLoading = data => ({
  type: actionTyps.CHANGE_PULLDOWN_LOADING,
  data
})

export const getHotSingerList = () => {
  return dispatch => {
    getHotSingerListRequest(0)
      .then(res => {
        const data = res.artists
        dispatch(changeSingerList(data))
        dispatch(changeEnterLoading(false))
        dispatch(changePullDownLoading(false))
      })
      .catch(() => {
        console.log('热门歌手数据获取失败')
      })
  }
}

export const refreshMoreHotSingerList = () => {
  return (dispath, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState()
      .getIn(['singers', 'singerList'])
      .toJS()
    getHotSingerListRequest(pageCount)
      .then(res => {
        const data = [...singerList, ...res.artists]
        dispath(changeSingerList(data))
        dispath(changePullUpLoading(false))
      })
      .catch(() => {
        console.log('热门歌手数据获取失败')
      })
  }
}

export const getSingerList = () => {
  return (dispatch, getState) => {
    const category = getState().getIn(['singers', 'category'])
    const alpha = getState().getIn(['singers', 'alpha'])

    getSingerListRequest(category, alpha, 0)
      .then(res => {
        const data = res.artists
        dispatch(changeSingerList(data))
        dispatch(changeEnterLoading(false))
        dispatch(changePullDownLoading(false))
      })
      .catch(() => {
        console.log('歌手数据获取失败')
      })
  }
}

export const refreshMoreSingerList = () => {
  return (dispatch, getState) => {
    const category = getState().getIn(['singers', 'category'])
    const alpha = getState().getIn(['singers', 'alpha'])
    const pageCount = getState().getIn(['singers', 'pageCount'])
    const singerList = getState()
      .getIn(['singers', 'singerList'])
      .toJS()
    getSingerListRequest(category, alpha, pageCount)
      .then(res => {
        const data = [...singerList, ...res.artists]
        dispatch(changeSingerList(data))
        dispatch(changePullUpLoading(false))
      })
      .catch(() => {
        console.log('歌手数据获取失败')
      })
  }
}
