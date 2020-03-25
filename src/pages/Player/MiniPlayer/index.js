import React, {useRef} from 'react'
import {getName} from '../../../api/utils'
import ProgressCircle from '../../../baseUI/ProgressCircle'
import {CSSTransition} from 'react-transition-group'
import cn from 'classnames'

import './index.scss'

function MiniPlayer(props) {
  const {song, fullScreen, playing, precent} = props
  const {clickPlaying, toggleFullScreen, togglePlayList} = props
  const miniPlayerRef = useRef()

  const handleTogglePlayList = e => {
    togglePlayList(true)
    e.stopPropagation()
  }

  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex'
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none'
      }}
    >
      <div
        className="mini-player-container"
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="img-wrapper">
            <img
              className={cn('play', {pause: !playing})}
              src={song.al.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name ellipsis">{song.name}</h2>
          <p className="desc ellipsis">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} precent={precent}>
            {playing ? (
              <i
                className="icon-mini iconfont icon-pause"
                onClick={e => clickPlaying(e, false)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="icon-mini iconfont icon-play"
                onClick={e => clickPlaying(e, true)}
              >
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </div>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer)
