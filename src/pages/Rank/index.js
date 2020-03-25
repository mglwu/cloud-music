import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {getRankList} from './store'
import {filterIndex} from '../../api/utils'
import {renderRoutes} from 'react-router-config'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'

import './index.scss'

function Rank(props) {
  const {rankList: list, loading} = props
  const {getRankListDispatch} = props

  let rankList = list ? list.toJS() : []
  let globalStartIndex = filterIndex(rankList)
  let officialList = rankList.slice(0, globalStartIndex)
  let globalList = rankList.slice(globalStartIndex)

  useEffect(() => {
    getRankListDispatch()
    // eslint-disable-next-line
  }, [])

  const enterDetail = detail => {
    props.history.push(`/rank/${detail.id}`)
  }

  const renderSongList = list => {
    return list.length ? (
      <ul className="song-list">
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          )
        })}
      </ul>
    ) : null
  }

  const renderRankList = (list, global) => {
    return (
      <ul className="rank-list" style={{display: global ? 'flex' : ''}}>
        {list.map(item => (
          <li
            className="list-item"
            style={{display: item.tracks.length ? 'flex' : ''}}
            key={item.id}
            onClick={() => enterDetail(item)}
          >
            <div
              className="img-wrapper"
              style={
                item.tracks.length
                  ? {width: '27vw', height: '27w'}
                  : {width: '32vw', height: '32w'}
              }
            >
              <img src={item.coverImgUrl} alt="" />
              <div className="decorate"></div>
              <span className="update-frequecy">{item.updateFrequency}</span>
            </div>
            {renderSongList(item.tracks)}
          </li>
        ))}
      </ul>
    )
  }

  let displayStyle = loading ? {display: 'none'} : {display: ''}

  return (
    <div className="rank-container">
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
          {loading && (
            <div className="enter-loading">
              <Loading />
            </div>
          )}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </div>
  )
}

const mapStateToProps = state => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getRankListDispatch() {
      dispatch(getRankList())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank))
