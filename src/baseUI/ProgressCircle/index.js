import React from 'react'

import './index.scss'

function ProgressCircle(props) {
  const {radius, precent} = props

  // 整个背景的周长
  const dashArray = Math.PI * 100
  // 没有高亮部分，剩下高亮的就是进度
  const dashOffset = (1 - precent) * dashArray

  return (
    <div className="circle-wrapper">
      <svg
        width={radius}
        height={radius}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="progress-background"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        />
        <circle
          className="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {props.children}
    </div>
  )
}

export default React.memo(ProgressCircle)
