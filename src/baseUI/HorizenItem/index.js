import React, {useRef, useEffect} from 'react'
import Scroll from '../Scroll'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './index.scss'

function Horizen(props) {
  const {list, oldVal, title} = props
  const {handleClick} = props
  const categoryRef = useRef(null)

  useEffect(()=>{
    let categoryDOM = categoryRef.current
    let tagElems = categoryDOM.querySelectorAll("span")
    let totalWidth = 0
    Array.from(tagElems).forEach(ele => {
      totalWidth += ele.offsetWidth
    })
    totalWidth += 5
    categoryDOM.style.width = `${totalWidth}px`
  }, [])

  return (
    <Scroll direction={"horizental"}>
      <div ref={categoryRef}>
        <div className="horizen-list">
          <span>{title}</span>
          {list.map(item => {
            return (
              <span
                key={item.key}
                className={cn('list-item', {selected: oldVal === item.key})}
                onClick={() => handleClick(item.key)}
              >
                {item.name}
              </span>
            )
          })}
        </div>
      </div>
    </Scroll>
  )
}

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
}

Horizen.defaultProps = {
  list: [],
  oldVal: '',
  title: '',
  handleClick: null
}

export default React.memo(Horizen)
