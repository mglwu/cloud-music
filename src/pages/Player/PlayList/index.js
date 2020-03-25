import React, {useRef, useState, useCallback} from 'react'
import {prefixStyle, getName, shuffle, findIndex} from '../../../api/utils'
import {CSSTransition} from 'react-transition-group'
import {playMode} from '../../../api/config'
import {
  changePlayingState,
  changeCurrentSong,
  changeShowPlayList,
  changeCurrentIndex,
  changePlayList,
  changePlayMode,
  deleteSong,
  changeSequecePlayList
} from '../store/actionCreator'
import {connect} from 'react-redux'
import Scroll from '../../../baseUI/Scroll'
import Confirm from '../../../baseUI/Confirm'

import './index.scss'

function PlayList(props) {
  const {
    showPlayList,
    currentIndex,
    currentSong: immutableCurrentSong,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList
  } = props
  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    deleteSongDispatch,
    clearDispatch
  } = props

  const currentSong = immutableCurrentSong.toJS()
  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequencePlayList.toJS()

  const playListRef = useRef()
  const listWrapperRef = useRef()
  const [isShow, setIsShow] = useState(false)
  const [canTouch, setCanTouch] = useState(true)
  const [startY, setStartY] = useState(0)
  const [initialed, setInitialed] = useState(0)
  const [distance, setDistance] = useState(0)

  const listContentRef = useRef()
  const handleScroll = pos => {
    let state = pos.y === 0
    setCanTouch(state)
  }

  const transform = prefixStyle('transform')

  const onEnterCB = useCallback(() => {
    setIsShow(true)
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`
  }, [transform])

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current.style['transition'] = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`
  }, [transform])

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style['transition'] = 'all 0.3s'
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0)`
  }, [transform])

  const onExitedCB = useCallback(() => {
    setIsShow(false)
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0)`
  }, [transform])

  const getCurrentIcon = item => {
    const current = currentSong.id === item.id
    const className = current ? 'icon-play' : ''
    const content = current ? '&#xe6e3;' : ''
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{__html: content}}
      ></i>
    )
  }

  const getPlayMode = () => {
    let content
    let text
    if (mode === playMode.sequence) {
      content = '&#xe625;'
      text = '顺序播放'
    } else if (mode === playMode.loop) {
      content = '&#xe653;'
      text = '单曲循环'
    } else {
      content = '&#xe61b;'
      text = '随机播放'
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={e => changeMode(e)}
          dangerouslySetInnerHTML={{__html: content}}
        ></i>
        <span className="text" onClick={e => changeMode(e)}>
          {text}
        </span>
      </div>
    )
  }

  const changeMode = () => {
    let newMode = (mode + 1) % 3
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList)
      let index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList)
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList)
      let index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
    }
    changeModeDispatch(newMode)
  }

  const handleChangeCurrentIndex = index => {
    if (currentIndex === index) return
    changeCurrentIndexDispatch(index)
  }

  const handleDeleteSong = (e, song) => {
    e.stopPropagation()
    deleteSongDispatch(song)
  }

  const confirmRef = useRef()

  const handleShowClear = () => {
    confirmRef.current.show()
  }

  const handleConfirmClear = () => {
    clearDispatch()
  }

  const handleTouchStart = e => {
    if (!canTouch || initialed) return
    listWrapperRef.current.style['transition'] = ''
    setStartY(e.nativeEvent.touches[0].pageY) // 记录Y值
    setInitialed(true)
  }
  const handleTouchMove = e => {
    if (!canTouch || !initialed) return
    let distance = e.nativeEvent.touches[0].pageY - startY
    if (distance < 0) return
    setDistance(distance) // 记录下滑距离
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`
  }
  const handleTouchEnd = e => {
    setInitialed(false)
    if (distance >= 150) {
      togglePlayListDispatch(false)
    } else {
      listWrapperRef.current.style['transition'] = 'all 0.3s'
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`
    }
  }

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <div
        className="play-list-container"
        ref={playListRef}
        style={isShow === true ? {display: 'block'} : {display: 'none'}}
        onClick={() => togglePlayListDispatch(false)}
      >
        <div
          className="list-wrapper"
          ref={listWrapperRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="list-header">
            <h1 className="title">
              {getPlayMode()}{' '}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </div>
          <div className="scroll-wrapper">
            <Scroll
              ref={listContentRef}
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
              <ul className="list-content">
                {playList.map((item, index) => {
                  return (
                    <li
                      className="item"
                      key={item.id}
                      onClick={() => handleChangeCurrentIndex(index)}
                    >
                      {getCurrentIcon(item)}
                      <span className="text">
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span
                        className="delete"
                        onClick={e => handleDeleteSong(e, item)}
                      >
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Scroll>
          </div>
        </div>
        <Confirm ref={confirmRef} handleConfirm={handleConfirmClear} />
      </div>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  showPlayList: state.getIn(['player', 'showPlayList']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
  mode: state.getIn(['player', 'mode'])
})

const mapDispatchToProps = dispatch => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data))
    },
    // 修改当前歌曲在列表中的 index，也就是切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    // 修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    // 修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    },
    // 删除歌曲
    deleteSongDispatch(data) {
      dispatch(deleteSong(data))
    },
    // 清空歌单
    clearDispatch() {
      // 1. 清空两个列表
      dispatch(changePlayList([]))
      dispatch(changeSequecePlayList([]))
      // 2. 初始 currentIndex
      dispatch(changeCurrentIndex(-1))
      // 3. 关闭PlayList显示
      dispatch(changeShowPlayList(false))
      // 4. 将当前歌曲置空
      dispatch(changeCurrentSong({}))
      // 5. 重置播放状态
      dispatch(changePlayingState(false))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PlayList))
