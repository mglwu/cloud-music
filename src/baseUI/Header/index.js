import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const Header = React.forwardRef((props, ref) => {
  const {title, handleClick, isMarquee} = props
  return (
    <div className="header-container" ref={ref}>
      <i className="iconfont back" onClick={handleClick}>
        &#xe655;
      </i>
      {/* eslint-disable-next-line */}
      {isMarquee ? <marquee><h1>{title}</h1></marquee> : <h1>{title}</h1>}
    </div>
  )
})

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool
}

Header.defaultProps = {
  handleClick: () => {},
  title: '标题',
  isMarquee: false
}

export default React.memo(Header)
