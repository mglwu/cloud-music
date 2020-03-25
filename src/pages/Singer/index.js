import React, {useState, useEffect, useRef, useCallback} from 'react'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/Header'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import SongList from '../SongList'
import {connect} from 'react-redux'
import {getSingerInfo, changeEnterLoading} from './store/actionCreator'
import MusicNote from '../../baseUI/MusicNote'

import {HEADER_HEIGHT} from './../../api/config'

import './index.scss'

function Singer(props) {
  const {artist: immutableArtist, songs: immutableSongs, enterLoading} = props
  const {getSingerInfoDispatch} = props

  const [showStatus, setShowStatus] = useState(true)

  const collectButton = useRef()
  const imageWrapper = useRef()
  const songScrollWrapper = useRef()
  const songScroll = useRef()
  const header = useRef()
  const layer = useRef()
  // 图片初始高度
  const initalHeight = useRef(0)
  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5

  const musicNoteRef = useRef()

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight
    songScrollWrapper.current.style.top = `${h - OFFSET}px`
    initalHeight.current = h
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`
    songScroll.current.refresh()
  }, [])

  useEffect(() => {
    const id = props.match.params.id
    getSingerInfoDispatch(id)
    // eslint-disable-next-line
  }, [])

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback(pos => {
    let height = initalHeight.current
    const newY = pos.y
    const imageDOM = imageWrapper.current
    const buttonDOM = collectButton.current
    const headerDOM = header.current
    const layerDOM = layer.current

    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT

    // 指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height)

    if (newY > 0) {
      imageDOM.style['transform'] = `scale(${1 + percent})`
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
      layerDOM.style.top = `${height - OFFSET + newY}px`
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      layerDOM.style.zIndex = 1
      imageDOM.style.paddingTop = '75%'
      imageDOM.style.height = 0
      imageDOM.style.zIndex = -1
      // 按钮跟着移动且渐渐变透明
      buttonDOM.style['transform'] = `translate3d(0, ${newY}px, 0)`
      buttonDOM.style['opacity'] = `${1 - percent * 2}`
    } else if (newY < minScrollY) {
      // 往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`
      layerDOM.style.zIndex = 1
      // 防止溢出的歌单内容挡住 Header
      headerDOM.style.zIndex = 100
      // 此时图片高度与 Header 一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`
      imageDOM.style.paddingTop = 0
      imageDOM.style.zIndex = 99
    }
  }, [])

  const artist = immutableArtist ? immutableArtist.toJS() : []
  const songs = immutableSongs ? immutableSongs.toJS() : []

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <div className="singer-container">
        <Header
          ref={header}
          title={artist.name}
          handleClick={setShowStatusFalse}
        />
        <div
          ref={imageWrapper}
          className="img-wrapper"
          style={{background: `url(${artist.picUrl}) 0 0 / cover`}}
        >
          <div className="filter"></div>
        </div>
        <div ref={collectButton} className="collect-button">
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </div>
        <div ref={layer} className="bg-layer"></div>
        <div ref={songScrollWrapper} className="song-list-wrapper">
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongList
              songs={songs}
              showCollect={false}
              showBackground={true}
              musicAnimation={musicAnimation}
            />
            <MusicNote ref={musicNoteRef}></MusicNote>
          </Scroll>
        </div>
        {enterLoading && <Loading />}
      </div>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  artist: state.getIn(['singerInfo', 'artist']),
  songs: state.getIn(['singerInfo', 'songOfArtist']),
  enterLoading: state.getIn(['singerInfo', 'enterLoading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getSingerInfoDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getSingerInfo(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singer))
