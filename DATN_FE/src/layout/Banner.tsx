import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Banner = () => {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        grabCursor={"true"}
        spaceBetween={30}
        slidesPerView={"auto"}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        autoplay={{ delay: 3000 }}
      >
        <SwiperSlide>
          <div className="relative">
            <Link to="">
              <img
                src="/images/banner/slide_1_img.png"
                className="h-[730px] w-full object-cover"
                alt=""
              />
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Link to="">
              <img
                src="/images/banner/slide_2_img.png"
                className="h-[730px] w-full object-cover"
                alt=""
              />
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Link to="">
              <img
                src="/images/banner/slide_3_img.png"
                className="h-[730px] w-full object-cover"
                alt=""
              />
            </Link>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <Link to="">
              <img
                src="/images/banner/slide_4_img.png"
                className="h-[730px] w-full object-cover"
                alt=""
              />
            </Link>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Banner;
