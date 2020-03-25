import React, {useState, useImperativeHandle, forwardRef} from 'react'
import {CSSTransition} from 'react-transition-group'

import './index.scss'

const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false)
  const [timer, setTimer] = useState('')
  const {text} = props

  // 外面组件拿函数组件ref的方法，用useImperativeHandle这个hook
  useImperativeHandle(ref, () => ({
    show() {
      // 做了防抖处理
      if (timer) clearTimeout(timer)
      setShow(true)
      setTimer(
        setTimeout(() => {
          setShow(false)
        }, 2000)
      )
    }
  }))

  return (
    <CSSTransition in={show} timeout={300} classNames="drop" unmountOnExit>
      <div className="toast-wrapper">
        <div className="text">{text}</div>
      </div>
    </CSSTransition>
  )
})

export default React.memo(Toast)
