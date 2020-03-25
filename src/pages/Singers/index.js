import React, {useEffect} from 'react'
import Lazyload, {forceCheck} from 'react-lazyload'
import Horizen from '../../baseUI/HorizenItem'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import {categoryTypes, alphaTypes} from '../../api/config'
import {renderRoutes} from 'react-router-config'

import {
  getSingerList,
  getHotSingerList,
  changeCategory,
  changeAlpha,
  changePageCount,
  refreshMoreHotSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreSingerList
} from './store/actionCreator'
import {connect} from 'react-redux'

import './index.scss'

function Singers(props) {
  const {
    category,
    alpha,
    singerList,
    pageCount,
    enterLoading,
    pullUpLoading,
    pullDownLoading
  } = props
  const {
    changeCategoryDispatch,
    changeAlphaDispatch,
    getHotSingerDispatch,
    pullUpRefreshDispatch,
    pullDownRefreshDispatch
  } = props

  useEffect(() => {
    if (!singerList.length && !category && !alpha) {
      getHotSingerDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const handleUpdateCategory = val => {
    changeCategoryDispatch(val)
  }

  const handleUpdateAlpha = val => {
    changeAlphaDispatch(val)
  }

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount)
  }

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha)
  }

  const enterDetail = id => {
    props.history.push(`/singers/${id}`)
  }

  const singerListJS = singerList ? singerList.toJS() : []

  const renderSingerList = () => {
    return (
      <div className="list">
        {singerListJS.map(item => {
          return (
            <div
              className="list-item"
              key={item.id}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img-wrapper">
                <Lazyload
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('../../assets/images/singer.png')}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </Lazyload>
              </div>
              <span className="name">{item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="nav-container">
      <Horizen
        list={categoryTypes}
        title="分类(默认热门):"
        handleClick={handleUpdateCategory}
        oldVal={category}
      />
      <Horizen
        list={alphaTypes}
        title="首字母:"
        handleClick={handleUpdateAlpha}
        oldVal={alpha}
      />
      <div className="singer-list">
        <Scroll
          onScroll={forceCheck}
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
        {enterLoading && <Loading />}
      </div>
      {renderRoutes(props.route.routes)}
    </div>
  )
}

const matStateToProps = state => ({
  category: state.getIn(['singers', 'category']),
  alpha: state.getIn(['singers', 'alpha']),
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
})

const mapDispatchToProps = dispatch => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList())
    },
    changeCategoryDispatch(category) {
      dispatch(changeCategory(category))
      dispatch(getSingerList())
    },
    changeAlphaDispatch(alpha) {
      dispatch(changeAlpha(alpha))
      dispatch(getSingerList())
    },
    // 上拉加载
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true))
      dispatch(changePageCount(count + 50))
      if (hot) {
        dispatch(refreshMoreHotSingerList())
      } else {
        dispatch(refreshMoreSingerList(category, alpha))
      }
    },
    // 下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true))
      dispatch(changePageCount(0))
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList())
      } else {
        dispatch(getSingerList(category, alpha))
      }
    }
  }
}

export default connect(matStateToProps, mapDispatchToProps)(React.memo(Singers))
