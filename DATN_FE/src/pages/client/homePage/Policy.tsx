import React from "react";

const Policy = () => {
  return (
    <div className="container">
      <div className="flex pb-[60px] justify-between gap-y-[20px] flex-wrap">
        <div className="flex gap-x-[15px] items-center">
          <img src="/images/icon/home_policy_icon_1.png" alt="" className="w-[48px] h-[48px]" />
          <div className="">
            <p className="mb-3 font-medium">Miễn phí vận chuyển</p>
            <p className="text-sm max-w-[255px]">Áp dụng cho mọi đơn hàng từ 500k</p>
          </div>
        </div >
        <div className="flex gap-x-[15px] items-center">
          <img src="/images/icon/home_policy_icon_2.png" alt="" className="w-[48px] h-[48px]" />
          <div className="">
            <p className="mb-3 font-medium">Đổi trả dễ dàng</p>
            <p className="text-sm max-w-[255px]">7 ngày đổi trả vì bất kì lí do gì</p>
          </div>
        </div>
        <div className="flex gap-x-[15px] items-center">
          <img src="/images/icon/home_policy_icon_3.png" alt="" className="w-[48px] h-[48px]" />
          <div className="">
            <p className="mb-3 font-medium">Hỗ trợ nhanh chóng</p>
            <p className="text-sm max-w-[255px]">HOTLINE 24/7 : 0964942121</p>
          </div>
        </div>
        <div className="flex gap-x-[15px] items-center">
          <img src="/images/icon/home_policy_icon_4.png" alt="" className="w-[48px] h-[48px]" />
          <div className="">
            <p className="mb-3 font-medium">Thanh toán đa dạng</p>
            <p className="text-sm max-w-[255px]">Thanh toán khi nhận hàng, Napas, Visa, Chuyển Khoản</p>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Policy;