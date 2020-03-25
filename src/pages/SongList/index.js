import React from 'react'
import {getName} from '../../api/utils'
import {
  changePlayList,
  changeCurrentIndex,
  changeSequecePlayList
} from './../Player/store/actionCreator'
import {connect} from 'react-redux'

import './index.scss'

const SongList = React.forwardRef((props, refs) => {
  const {collectCount, showCollect, songs, showBackground} = props
  const {
    musicAnimation,
    changePlayListDispatch,
    changeSequecePlayListDispacth,
    changeCurrentIndexDispatch
  } = props
  const totalCount = songs.length

  const selectItem = (e, index) => {
    changePlayListDispatch(songs)
    changeSequecePlayListDispacth(songs)
    changeCurrentIndexDispatch(index)
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY)
  }

  const songList = list => {
    let res = []
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      res.push(
        <li key={i} onClick={e => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info ellipsis">
            <span>{item.name}</span>
            <span className="ellipsis">
              {item.ar ? getName(item.ar) : getName(item.artist)} -{' '}
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res
  }

  const collect = count => {
    return (
      <div className="add-list">
        <i className="iconfont">&#xe62d;</i>
        <span> 收藏 ({Math.floor(count / 1000) / 10} 万)</span>
      </div>
    )
  }

  const backgroundStyle = showBackground ? {background: '#fff'} : {}

  return (
    <div ref={refs} className="song-list" style={backgroundStyle}>
      <div className="first-line">
        <div className="play-all" onClick={e => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            {' '}
            播放全部 <span className="sum">(共 {totalCount} 首)</span>
          </span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <ul className="song-item">{songList(songs)}</ul>
    </div>
  )
})

const mapDispatchToProps = dispatch => {
  return {
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeSequecePlayListDispacth(data) {
      dispatch(changeSequecePlayList(data))
    }
  }
}

export default connect(null, mapDispatchToProps)(React.memo(SongList))
