import React, {useEffect, useRef, forwardRef, useImperativeHandle} from 'react'
import {prefixStyle} from './../../api/utils'

import './index.scss'

const MusicNode = forwardRef((props, ref) => {
  const iconsRef = useRef()
  // 容器中有3个音符，也就是同时只能有3个音符下落
  const ICON_NUMBER = 3

  const transform = prefixStyle('transform')

  const createNode = txt => {
    const template = `<div class="icon-wrapper">${txt}</div>`
    let tempNode = document.createElement('div')
    tempNode.innerHTML = template
    return tempNode.firstChild
  }

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`)
      iconsRef.current.appendChild(node)
    }

    // 类数组转换成数组，当然也可以用[...xxx] 解构语法或者 Array.from()
    let domArray = [].slice.call(iconsRef.current.children)
    domArray.forEach(item => {
      item.running = false
      item.addEventListener(
        'transitionend',
        function() {
          this.style['display'] = 'none'
          this.style[transform] = `translate3d(0, 0, 0)`
          this.running = false

          let icon = this.querySelector('div')
          icon.style[transform] = `translate3d(0, 0, 0)`
        },
        false
      )
    })
    // eslint-disable-next-line
  }, [])

  const startAnimation = ({x, y}) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let domArray = [].slice.call(iconsRef.current.children)
      let item = domArray[i]
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + 'px'
        item.style.top = y + 'px'
        item.style.display = 'inline-block'

        setTimeout(() => {
          item.running = true
          item.style[transform] = `translate3d(0, 750px, 0)`
          let icon = item.querySelector('div')
          icon.style[transform] = `translate3d(-40px, 0, 0)`
        }, 20)

        break
      }
    }
  }

  useImperativeHandle(ref, () => ({
    startAnimation
  }))

  return <div className="music-note-container" ref={iconsRef}></div>
})

export default React.memo(MusicNode)
