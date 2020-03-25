import React from 'react'
import './index.scss'

function LoadingV2() {
  return (
    <div className="loadingV2">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <span>拼命加载中...</span>
    </div>
  )
}

export default React.memo(LoadingV2)
