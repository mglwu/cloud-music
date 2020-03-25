import React, {useState, useRef, useEffect, useCallback} from 'react'
import {CSSTransition} from 'react-transition-group'
import SearchBox from '../../baseUI/SearchBox'
import Scroll from '../../baseUI/Scroll'
import Loading from '../../baseUI/Loading'
import MusicNote from '../../baseUI/MusicNote'
import {connect} from 'react-redux'
import Lazyload, {forceCheck} from 'react-lazyload'
import {getName} from '../../api/utils'
import {
  getHotKeyWords,
  changeEnterLoading,
  getSuggestList
} from './store/actionCreator'
import {getSongDetail} from '../Player/store/actionCreator'

import './index.scss'

function Search(props) {
  const [show, setShow] = useState(false)
  const [query, setQuery] = useState('')

  const {
    hotList,
    enterLoading,
    suggestList: immutableSuggestList,
    songsCount,
    songsList: immutableSongsList
  } = props

  const suggestList = immutableSuggestList.toJS()
  const songsList = immutableSongsList.toJS()

  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch
  } = props

  const musicNoteRef = useRef()

  useEffect(() => {
    setShow(true)

    if (!hotList.size) {
      getHotKeyWordsDispatch()
    }
    // eslint-disable-next-line
  }, [])

  const searchBack = useCallback(() => {
    setShow(false)
  }, [])

  const handleQuery = q => {
    setQuery(q)
    if (!q) return
    changeEnterLoadingDispatch(true)
    getSuggestListDispatch(q)
  }

  const seleteItem = (e, id) => {
    getSongDetailDispatch(id)
    musicNoteRef.current.startAnimation({
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    })
  }

  const renderHotKey = () => {
    let list = hotList ? hotList.toJS() : []
    return (
      <ul>
        {list.map(item => {
          return (
            <li
              className="item"
              key={item.first}
              onClick={() => setQuery(item.first)}
            >
              <span>{item.first}</span>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderSingers = () => {
    let singers = suggestList.artists
    if (!singers || !singers.length) return
    return (
      <div className="list">
        <h1 className="title">相关歌手</h1>
        {singers.map((item, index) => {
          return (
            <div
              className="list-item"
              key={item.accountId + '' + index}
              onClick={() => props.history.push(`/singers/${item.id}`)}
            >
              <div className="img-wrapper">
                <Lazyload
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('../../assets/images/singer.png')}
                      alt="singers"
                    />
                  }
                >
                  <img
                    src={item.picUrl}
                    width="100%"
                    height="100%"
                    alt="singer"
                  />
                </Lazyload>
              </div>
              <span className="name">歌手：{item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAlbum = () => {
    let albums = suggestList.playlists
    if (!albums || !albums.length) return
    return (
      <div className="list">
        <h1 className="title">相关歌单</h1>
        {albums.map((item, index) => {
          return (
            <div
              className="list-item"
              key={item.accountId + '' + index}
              onClick={() => props.history.push(`/album/${item.id}`)}
            >
              <div className="img-wrapper">
                <Lazyload
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('../../assets/images/lazyload.png')}
                      alt="album"
                    />
                  }
                >
                  <img
                    src={item.coverImgUrl}
                    width="100%"
                    height="100%"
                    alt="album"
                  />
                </Lazyload>
              </div>
              <span className="name">歌单：{item.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderSongs = () => {
    return (
      <ul className="song-item" style={{paddingLeft: '20px'}}>
        {songsList.map(item => {
          return (
            <li key={item.id} onClick={e => seleteItem(e, item.id)}>
              <div className="info">
                <span>{item.name}</span>
                <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <div
        className="search-container"
        style={{bottom: songsCount ? '60px' : '0'}}
      >
        <div className="search-box-wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>

        <div
          className="shortcur-wrapper"
          style={{display: !query ? '' : 'none'}}
        >
          <Scroll>
            <div>
              <div className="hot-key">
                <h1 className="title">热门搜索</h1>
                {renderHotKey()}
              </div>
            </div>
          </Scroll>
        </div>

        <div
          className="shortcur-wrapper"
          style={{display: query ? '' : 'none'}}
        >
          <Scroll onScorll={forceCheck}>
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </div>
        <MusicNote ref={musicNoteRef}></MusicNote>
        {enterLoading && <Loading />}
      </div>
    </CSSTransition>
  )
}

const mapStateToProps = state => ({
  hotList: state.getIn(['search', 'hotList']),
  enterLoading: state.getIn(['search', 'enterLoading']),
  suggestList: state.getIn(['search', 'suggestList']),
  songsCount: state.getIn(['player', 'playList']).size,
  songsList: state.getIn(['search', 'songsList'])
})

const mapDispatchToProps = dispatch => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords())
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data))
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data))
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search))
