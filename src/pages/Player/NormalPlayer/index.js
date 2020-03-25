import React, {useState, useRef, useEffect, useCallback} from 'react'
import {CSSTransition} from 'react-transition-group'
import animations from 'create-keyframe-animation'
import ProgressBar from '../../../baseUI/ProgressBar'
import Scroll from '../../../baseUI/Scroll'
import {playMode} from '../../../api/config'
import {prefixStyle, getName, formatPlayTime} from '../../../api/utils'
import cn from 'classnames'

import './index.scss'

function NormalPlayer(props) {
  const {
    fullScreen,
    song,
    mode,
    playing,
    percent,
    currentTime,
    duration,
    currentLineNum,
    currentPlayingLyric,
    currentLyric
  } = props
  const {
    togglePlayList,
    toggleFullScreen,
    clickPlaying,
    onProgressChange,
    handlePrev,
    handleNext,
    changeMode
  } = props

  // 处理tranform的浏览器兼容问题
  const transform = prefixStyle('transform')

  const normalPlayerRef = useRef()
  const lyricScrollRef = useRef()

  const lyricLineRefs = useRef([])
  const cdWrapperRef = useRef()

  const [currentState, setCurrentState] = useState(true)

  useEffect(() => {
    if (!lyricScrollRef.current) return
    let bScroll = lyricScrollRef.current.getBScroll()
    if (currentLineNum > 5) {
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current
      bScroll.scrollToElement(lineEl, 1000)
    } else {
      bScroll.scrollTo(0, 0, 1000)
    }
  }, [currentLineNum])

  const getPlayMode = () => {
    let content
    if (mode === playMode.sequence) {
      content = '&#xe625'
    } else if (mode === playMode.loop) {
      content = '&#xe653'
    } else {
      content = '&#xe61b'
    }
    return content
  }

  const _getPosAndScale = () => {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    return {x, y, scale}
  }

  const enter = () => {
    normalPlayerRef.current.style.display = 'block'
    const {x, y, scale} = _getPosAndScale()
    let animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    })
    animations.runAnimation(cdWrapperRef.current, 'move')
  }

  const afterEnter = () => {
    const cdWrapperDom = cdWrapperRef.current
    animations.unregisterAnimation('move')
    cdWrapperDom.style.animation = ''
  }

  const leave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = 'all 0.4s'
    const {x, y, scale} = _getPosAndScale()
    cdWrapperDom.style[
      transform
    ] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
  }

  const afterLeave = () => {
    if (!cdWrapperRef.current) return
    const cdWrapperDom = cdWrapperRef.current
    cdWrapperDom.style.transition = ''
    cdWrapperDom.style[transform] = ''
    normalPlayerRef.current.style.display = 'none'
    setCurrentState(true)
  }

  const clickPlayingCB = useCallback(
    e => {
      clickPlaying(e, !playing)
    },
    [clickPlaying, playing]
  )

  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <div className="normal-player-container" ref={normalPlayerRef}>
        <div className="background">
          <img
            src={`${song.al.picUrl}?param=300x300`}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <div className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <div className="text">
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </div>
        </div>
        <div className="middle" ref={cdWrapperRef} onClick={() => setCurrentState(!currentState)}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState}
          >
            <div
              className="cd-wrapper"
              style={{
                visibility: currentState ? 'visible' : 'hidden'
              }}
            >
              {/* <div className={cn('needle', {pause: playing})}></div> */}
              <div className="cd">
                <img
                  className={cn('image play', {pause: !playing})}
                  src={`${song.al.picUrl}?param=400x400`}
                  alt="img"
                />
              </div>
              <p className="playing-lyric">{currentPlayingLyric}</p>
            </div>
          </CSSTransition>

          <CSSTransition
            timeout={400}
            classNames="fade"
            in={!currentState}
          >
            <div className="lyric-container">
              <Scroll ref={lyricScrollRef}>
                <div
                  className="lyric-wrapper"
                  style={{
                    visibility: !currentState ? 'visible' : 'hidden'
                  }}
                >
                  {currentLyric ? (
                    currentLyric.lines.map((item, index) => {
                      lyricLineRefs.current[index] = React.createRef()
                      return (
                        <p
                          className={cn('text', {
                            current: currentLineNum === index
                          })}
                          key={item + index}
                          ref={lyricLineRefs.current[index]}
                        >
                          {item.txt}
                        </p>
                      )
                    })
                  ) : (
                    <p className="text pure">纯音乐，请欣赏。</p>
                  )}
                </div>
              </Scroll>
            </div>
          </CSSTransition>
        </div>

        <div className="bottom">
          <div className="progress-wrapper">
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              ></ProgressBar>
            </div>
            <span className="time time-r">{formatPlayTime(duration)}</span>
          </div>
          <div className="operators">
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{__html: getPlayMode()}}
              ></i>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={clickPlayingCB}
                dangerouslySetInnerHTML={{
                  __html: playing ? '&#xe723' : '&#xe731'
                }}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right" onClick={() => togglePlayList(true)}>
              <i className="iconfont">&#xe640;</i>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default React.memo(NormalPlayer)
