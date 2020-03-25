import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import Loading from '../Loading'
import LoadingV2 from '../LoadingV2'
import {debounce} from '../../api/utils'

import './index.scss'

const Scroll = forwardRef((props, ref) => {
  // better-scroll 实例对象
  const [bScroll, setBScroll] = useState()
  // current 指向初始化 bs 实例需要的 DOM 元素
  const scrollContainerRef = useRef()

  const {
    direction,
    click,
    refresh,
    bounceTop,
    bounceBottom,
    pullUpLoading,
    pullDownLoading
  } = props

  const {pullUp, pullDown, onScroll} = props

  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', scroll => {
      onScroll(scroll)
    })
    return () => {
      bScroll.off('scroll')
    }
  }, [onScroll, bScroll])

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300)
  }, [pullUp])

  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300)
  }, [pullDown])

  useEffect(() => {
    if (!bScroll || !pullUp) return

    const handlePullUp = () => {
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce()
      }
    }

    bScroll.on('scrollEnd', handlePullUp)

    return () => {
      bScroll.off('scrollEnd', handlePullUp)
    }
  }, [pullUp, pullUpDebounce, bScroll])

  useEffect(() => {
    if (!bScroll || !pullDown) return

    const handlePullDown = pos => {
      if (pos.y > 50) {
        pullDownDebounce()
      }
    }

    bScroll.on('touchEnd', handlePullDown)
    return () => {
      bScroll.off('touchEnd', handlePullDown)
    }
  }, [pullDown, pullDownDebounce, bScroll])

  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh()
    }
  })

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
    }
  }))

  const PullUpDisplayStyle = pullUpLoading ? {diplay: ''} : {display: 'none'}
  const PullDownDisplayStyle = pullDownLoading
    ? {diplay: ''}
    : {display: 'none'}

  return (
    <div ref={scrollContainerRef} className="scroll-container">
      {props.children}
      <div className="pullUpLoading" style={PullUpDisplayStyle}>
        <Loading />
      </div>
      <div className="pullDownLoading" style={PullDownDisplayStyle}>
        <LoadingV2 />
      </div>
    </div>
  )
})

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']),
  click: PropTypes.bool,
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,
  bounceBottom: PropTypes.bool
}

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
}

export default Scroll
