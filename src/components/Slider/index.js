import React, {useEffect} from 'react'
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
import './index.scss'

function Slider(props) {
  // const [sliderSwiper, setSliderSwiper] = useState(null)
  const {bannerList} = props

  useEffect(() => {
    new Swiper('.slider-container', {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: {el: '.swiper-pagination'}
    })
    // setSliderSwiper(sliderSwiper)
  }, [bannerList.length])

  return (
    <div className="container">
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {bannerList.map((slider, index) => {
            return (
              <div className="swiper-slide" key={index}>
                <div className="slider-nav">
                  <img
                    src={slider.imageUrl}
                    width="100%"
                    height="100%"
                    alt="推荐"
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </div>
  )
}

export default React.memo(Slider)
