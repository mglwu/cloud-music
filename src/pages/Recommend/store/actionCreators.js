import * as actionTypes from './constants'
import {fromJS} from 'immutable'
import {getBannerRequest, getRecommendListRequest} from '../../../api/request'

export const changeBannerList = data => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data)
})

export const changeRecommendList = data => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data)
})

export const changeEnterLoading = data => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data
})

export const getBannerList = () => {
  return dispath => {
    getBannerRequest()
      .then(data => {
        dispath(changeBannerList(data.banners))
      })
      .catch(() => {
        console.log('轮播图数据传输错误')
      })
  }
}

export const getRecommendList = () => {
  return dispath => {
    dispath(changeEnterLoading(true))
    getRecommendListRequest()
      .then(data => {
        dispath(changeRecommendList(data.result))
        dispath(changeEnterLoading(false))
      })
      .catch(() => {
        console.log('推荐歌单数据传输错误')
      })
  }
}
