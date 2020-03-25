import React from 'react'
import {renderRoutes} from 'react-router-config'
import {NavLink} from 'react-router-dom'
import Player from '../Player'

import './index.scss'

function Home(props) {
  const {route} = props

  return (
    <div className="home">
      <div className="top">
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">Cloud-Music</span>
        <span className="iconfont search" onClick={() => props.history.push('/search')}>&#xe62b;</span>
      </div>
      <div className="tab">
        <NavLink to="/recommend" activeClassName="selected">
          <div className="tab-item">
            <span>推荐</span>
          </div>
        </NavLink>
        <NavLink to="/singers">
          <div className="tab-item">
            <span>歌手</span>
          </div>
        </NavLink>
        <NavLink to="/rank">
          <div className="tab-item">
            <span>排行榜</span>
          </div>
        </NavLink>
      </div>
      {renderRoutes(route.routes)}
      <Player></Player>
    </div>
  )
}

export default React.memo(Home)
