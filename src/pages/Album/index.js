import React, {useState, useEffect, useRef, useCallback} from 'react'
import {CSSTransition} from 'react-transition-group'
import Header from '../../baseUI/Header'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import SongList from '../SongList'
import {isEmptyObject} from '../../api/utils'
import {connect} from 'react-redux'
import {getAlbumList, changeEnterLoading} from './store/actionCreator'
import MusicNote from '../../baseUI/MusicNote'

import './index.scss'

export const HEADER_HEIGHT = 45

function Album(props) {
  const id = props.match.params.id
  const {currentAlbum: currentAlbumImmutable, enterLoading} = props
  const {getAlbumDataDispatch} = props

  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState('歌单')
  const [isMarquee, setIsMarquee] = useState(false)

  const headerEl = useRef(null)

  const musicNoteRef = useRef()

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y})
  }


  useEffect(() => {
    getAlbumDataDispatch(id)
  }, [getAlbumDataDispatch, id])

  const currentAlbum = currentAlbumImmutable ? currentAlbumImmutable.toJS() : []

  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])

  const handleScroll = useCallback(
    pos => {
      let minScrollY = -HEADER_HEIGHT
      let precent = Math.abs(pos.y / minScrollY)
      let headerDom = headerEl.current

      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = '#d44439'
        headerDom.style.opacity = Math.min(1, (precent - 1) / 2)
        setTitle(currentAlbum.name)
        setIsMarquee(true)
      } else {
        headerDom.style.backgroundColor = ''
        headerDom.style.opacity = 1
        setTitle('歌单')
        setIsMarquee(false)
      }
    },
    [currentAlbum]
  )

  const renderTopDesc = () => {
    return (
      <div className="top-desc">
        <div
          className="background"
          style={{
            background: `url(${currentAlbum.coverImgUrl}) no-repeat`
          }}
        >
          <div className="filter"></div>
        </div>
        <div className="img-wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play-count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {Math.floor(currentAlbum.subscribedCount / 1000) / 10}万
            </span>
          </div>
        </div>
        <div className="desc-wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="avatar" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderMenu = () => {
    return (
      <div className="menu">
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </div>
    )
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <div className="album-container">
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        />
        {!isEmptyObject(currentAlbum) && (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              <SongList
                songs={currentAlbum.tracks}
                showCollect={false}
                showBackground={true}
                musicAnimation={musicAnimation}
              />
              <MusicNote ref={musicNoteRef}></MusicNote>
            </div>
          </Scroll>
        )}
        {enterLoading && <Loading />}
      </div>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading'])
})

const mapDispatchToProps = dispatch => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true))
      dispatch(getAlbumList(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))
