import React, {useState, forwardRef, useImperativeHandle} from 'react'
import PropTypes from 'prop-types'
import {CSSTransition} from 'react-transition-group'

import './index.scss'

const Confirm = forwardRef((props, ref) => {
  const [show, setShow] = useState(false)
  const {text, cancelBtnText, confirmBtnText} = props
  const {handleConfirm} = props

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
    }
  }))

  return (
    <CSSTransition
      classNames="confirm-fade"
      timeout={300}
      appear={true}
      in={show}
    >
      <div
        className="confirm-wrapper"
        style={{display: show ? 'block' : 'none'}}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <div className="confirm_content">
            <p className="text">{text}</p>
            <div className="operate">
              <div className="operate_btn left" onClick={() => setShow(false)}>
                {cancelBtnText}
              </div>
              <div
                className="operate_btn"
                onClick={() => {
                  setShow(false)
                  handleConfirm()
                }}
              >
                {confirmBtnText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
})

Confirm.propTypes = {
  text: PropTypes.string,
  cancelBtnText: PropTypes.string,
  confirmBtnText: PropTypes.string,
  handleConfirm: PropTypes.func
}

Confirm.defaultProps = {
  text: '是否删除全部?',
  cancelBtnText: '取消',
  confirmBtnText: '确定',
  handleConfirm: null
}
export default React.memo(Confirm)
