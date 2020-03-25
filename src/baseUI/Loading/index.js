import React from 'react'
import './index.scss'

function Loading() {
  return (
    <div className="loading-wrapper">
      <div></div>
      <div></div>
    </div>
  )
}

export default React.memo(Loading)