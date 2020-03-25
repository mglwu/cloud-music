import React, {useEffect, useRef, useState} from 'react'
// import {prefixStyle} from './../../api/utils'

import './index.scss'

function ProgressBar(props) {
  const progressBarRef = useRef()
  const progressRef = useRef()
  const progressBtnRef = useRef()
  const [touch, setTouch] = useState({})

  const {percent, percentChange} = props

  const progressBtnWidth = 16

  useEffect(() => {
    if(percent >= 0 && percent <= -1 && !touch.initated) {
      const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
      const offsetWidth = percent * barWidth
      progressRef.current.style.width = `${offsetWidth}px`
      progressBtnRef.current.style['transform'] = `translate3d(${offsetWidth}px, 0, 0)`
    }
    // eslint-disable-next-line
  }, [percent])

  const _changePrecent = () => {
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
    const currentWidth = progressRef.current.clientWidth / barWidth
    percentChange(currentWidth)
  }

  // 处理进度条的偏移
  const _offset = offsetWidth => {
    progressRef.current.style.width = `${offsetWidth}px`
    progressBtnRef.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }

  const progressTouchStart = e => {
    const startTouch = {}
    startTouch.initated = true // 表示滑动动作开始
    startTouch.startX = e.touches[0].pageX // 滑动开始时横向坐标
    startTouch.left = progressRef.current.clientWidth // 当前 progress 长度
    setTouch(startTouch)
  }

  const progressTouchMove = e => {
    if (!touch.initated) return
    // 滑动距离
    const deltaX = e.touches[0].pageX - touch.startX
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth)
    _offset(offsetWidth)
  }

  const progressTouchEnd = e => {
    const endTouch = JSON.parse(JSON.stringify(touch))
    endTouch.initated = false
    setTouch(endTouch)
    _changePrecent()
  }

  const progressClick = e => {
    const rect = progressBarRef.current.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    _offset(offsetWidth)
    _changePrecent()
  }

  return (
    <div className="progress-bar-wrapper">
      <div className="bar-inner" ref={progressBarRef} onClick={progressClick}>
        <div className="progress" ref={progressRef}></div>
        <div
          className="progress-btn-wrapper"
          ref={progressBtnRef}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ProgressBar)
