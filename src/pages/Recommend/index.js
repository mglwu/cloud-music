import React, {useEffect} from 'react'
import {renderRoutes} from 'react-router-config'
import {forceCheck} from 'react-lazyload'
import {connect} from 'react-redux'
import * as actionTypes from './store/actionCreators'

import Sroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import Slider from '../../components/Slider'

import RecommendList from '../../components/List'

import './index.scss'

function Recommend(props) {
  const {bannerList, recommendList, enterLoading, songsCount} = props

  const {getBannerDataDispatch, getRecommendListDataDispatch} = props

  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch()
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []
  const recommendListJS = recommendList ? recommendList.toJS() : []

  return (
    <div className="content" style={{ bottom: songsCount ? '60px' : '0px' }}>
      <Sroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Sroll>
      {enterLoading && <Loading />}
      {renderRoutes(props.route.routes)}
    </div>
  )
}

const mapStateToProps = state => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enderLoading: state.getIn(['recommend', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = dispatch => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend))
