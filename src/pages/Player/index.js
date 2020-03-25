import React, {useRef, useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen
} from './store/actionCreator'

import {isEmptyObject, shuffle, findIndex, getSongUrl} from '../../api/utils'
import PlayList from './PlayList'
import Toast from '../../baseUI/Toast'
import Lyric from '../../api/lyric-parser'
import MiniPlayer from './MiniPlayer'
import NormalPlayer from './NormalPlayer'
import {playMode} from '../../api/config'
import {getLyricRequest} from '../../api/request'

function Player(props) {
  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0)
  // 歌曲总长时间
  const [duration, setDuration] = useState(0)
  const [currentPlayingLyric, setPlayingLyric] = useState('')
  const [modeText, setModeText] = useState('')

  // 歌曲播放进度
  let precent = isNaN(currentTime / duration) ? 0 : currentTime / duration

  const {
    playing,
    currentSong: immutableCurrentSong,
    currentIndex,
    playList: immutablePlayList,
    mode, // 播放模式
    sequencePlayList: immutableSequenePlayList, // 顺序列表
    fullScreen
  } = props

  const {
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch, //改变playList
    changeModeDispatch, //改变mode
    toggleFullScreenDispatch
  } = props

  const playList = immutablePlayList.toJS()
  const sequencePlayList = immutableSequenePlayList.toJS()
  const currentSong = immutableCurrentSong.toJS()

  // 记录当前的歌曲，以便于下次重渲染时对比是否是一首歌
  const [preSong, setPreSong] = useState({})

  const audioRef = useRef()
  const toastRef = useRef()

  const currentLyric = useRef()
  const currentLineNum = useRef(0)
  const songReady = useRef(true)

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
      return
    songReady.current = false
    let current = playList[currentIndex]
    changeCurrentDispatch(current) // 赋值currentSong
    setPreSong(current)
    setPlayingLyric('')
    audioRef.current.src = getSongUrl(current.id)
    audioRef.current.autoplay = true
    togglePlayingDispatch(true) // 播放状态
    getLyric(current.id)
    setCurrentTime(0) // 从头开始播放
    setDuration((current.dt / 1000) | 0) // 时长
    // eslint-disable-next-line
  }, [currentIndex, playList])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause()
  }, [playing])

  const handleLyric = ({lineNum, txt}) => {
    if (!currentLyric.current) return
    currentLineNum.current = lineNum
    setPlayingLyric(txt)
  }

  const getLyric = id => {
    let lyric = ''
    if (currentLyric.current) {
      currentLyric.current.stop()
    }
    // 避免songReady值为false的情况
    setTimeout(() => {
      songReady.current = true
    }, 3000)
    getLyricRequest(id)
      .then(data => {
        lyric = data.lrc && data.lrc.lyric
        if (!lyric) {
          currentLyric.current = null
          return
        }
        currentLyric.current = new Lyric(lyric, handleLyric)
        currentLyric.current.play()
        currentLineNum.current = 0
        currentLyric.current.seek(0)
      })
      .catch(() => {
        currentLyric.current = ''
        songReady.current = true
        audioRef.current.play()
      })
  }

  // 播放暂停
  const clickPlaying = (e, state) => {
    e.stopPropagation()
    togglePlayingDispatch(state)
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000)
    }
  }

  // 进度条进度
  const onProgressChange = curPrecent => {
    const newTime = curPrecent * duration
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
    if (!playing) {
      togglePlayingDispatch(true)
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000)
    }
  }

  // 播放进度
  const updateTime = e => {
    setCurrentTime(e.target.currentTime)
  }

  // 单曲循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0
    togglePlayingDispatch(true)
    audioRef.current.play()
    if (currentLyric.current) {
      currentLyric.current.seek(0)
    }
  }

  // 上一首
  const handlePrev = () => {
    // 播放列表只有一首歌曲时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex - 1
    if (index < 0) index = playList.length - 1
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  // 下一首
  const handleNext = () => {
    // 播放列表只有一首歌曲时单曲循环
    if (playList.length === 1) {
      handleLoop()
      return
    }
    let index = currentIndex + 1
    if (index === playList.length) index = 0
    if (!playing) togglePlayingDispatch(true)
    changeCurrentIndexDispatch(index)
  }

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop()
    } else {
      handleNext()
    }
  }

  // 播放模式 顺序播放、随机播放、单曲循环
  const changeMode = () => {
    let newMode = (mode + 1) % 3
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList)
      let index = findIndex(currentSong, sequencePlayList)
      changeCurrentIndexDispatch(index)
      setModeText('顺序循环')
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList)
      setModeText('单曲循环')
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList)
      let index = findIndex(currentSong, newList)
      changePlayListDispatch(newList)
      changeCurrentIndexDispatch(index)
      setModeText('随机播放')
    }
    changeModeDispatch(newMode)
    toastRef.current.show()
  }

  const handleError = e => {
    songReady.current = true
    handleNext()
  }

  return (
    <div>
      {!isEmptyObject(currentSong) && (
        <MiniPlayer
          playing={playing}
          fullScreen={fullScreen}
          song={currentSong}
          precent={precent}
          clickPlaying={clickPlaying}
          toggleFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
        ></MiniPlayer>
      )}
      {!isEmptyObject(currentSong) && (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          mode={mode}
          precent={precent} // 进度
          modeText={modeText}
          duration={duration} // 总时长
          currentTime={currentTime} // 播放时间
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          changeMode={changeMode}
          handlePrev={handlePrev}
          handleNext={handleNext}
          onProgressChange={onProgressChange}
          currentLineNum={currentLineNum.current}
          clickPlaying={clickPlaying}
          toggleFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
        ></NormalPlayer>
      )}
      <PlayList clearPreSong={setPreSong.bind(null, {})}></PlayList>
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast ref={toastRef} text={modeText}></Toast>
    </div>
  )
}
const mapStateToProps = state => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList'])
})

const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data))
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data))
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data))
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))
