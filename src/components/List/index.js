import React from 'react'
import {withRouter} from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import {getCount} from '../../api/utils'

import './index.scss'

function RecommendList(props) {
  const enterDetail = id => {
    props.history.push(`/recommend/${id}`)
  }

  return (
    <div className="list-wrapper">
      <h1 className="title">推荐歌单</h1>
      <div className="list">
        {props.recommendList.map((item, index) => {
          return (
            <div
              className="list-item"
              key={item.id + index}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img-wrapper">
                <div className="decorate"></div>
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('../../assets/images/lazyload.png')}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={item.picUrl + '?param=300x300'}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
                <div className="play-count">
                  <i className="iconfont play">&#xe885;</i>
                  <span className="count">{getCount(item.playCount)}</span>
                </div>
              </div>
              <div className="desc">{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(withRouter(RecommendList))
