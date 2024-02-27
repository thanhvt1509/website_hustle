import React from 'react'

const Footer = () => {
    return (
        <div className='bg-[#F5F5F5]'>
            <div className="container grid grid-cols-4">
                <div className="pt-[75px] pr-[15px] pb-[52px] pl-[35px] border-r-2">
                    <h3 className='font-bold py-[15px] text-[18px] opacity-[85%] tracking-wide'>Thời trang nam Hustle</h3>
                    <p className='text-[#666666] tracking-wide font-normal'>Hệ thống thời trang cho phái mạnh hàng đầu
                        Việt Nam, hướng tới phong cách nam tính, lịch lãm và trẻ trung.</p>
                    <div className="flex my-5">
                        <a href="" className='w-[32px] h-[32px] border-2 flex items-center justify-center'>
                            <svg className="w-6 h-6 text-[#666666] dark:text-[#666666] hover:opacity-50 transition-all ease-linear" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                                <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd" />
                            </svg>
                        </a>
                        <a href="" className='w-[32px] h-[32px] ml-3 border-2 flex items-center justify-center'>
                            <svg className="w-6 h-6 text-[#666666] dark:text-[#666666] hover:opacity-50 transition-all ease-linear" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                                <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </div>
                    {/* <h3 className='text-[#666666] font-bold my-[15px] tracking-wide'>Phương thức thanh toán</h3> */}
                </div>
                <div className="pt-[75px] pr-[15px] pb-[52px] pl-[35px] border-r-2">
                    <h3 className='font-bold py-[15px] text-[18px] opacity-[85%] tracking-wide'>Thông tin liên hệ</h3>
                    <p className='text-[#666666] text-[14px] tracking-wide font-bold mb-[8px]'>Địa chỉ: <span className='font-normal '>Thanh Xuân , Hà Nội</span></p>
                    <p className='text-[#666666] tracking-wide font-bold mb-[8px]'>Điện thoại: <span className='font-normal '>0967584597</span></p>
                    <p className='text-[#666666] tracking-wide font-bold mb-[8px]'>Email: <span className='font-normal '>hustle2003@gmail.com</span></p>
                    <div className="">
                        <h3 className="text-[16px] text-[#666666] font-semibold my-[10px]">Phương thức vận chuyển</h3>
                        <div className="flex">
                            <img src="/images/icon-ship/shipment_1_img.jpg" alt="" />
                            <img className='ml-3' src="/images/icon-ship/shipment_2_img.jpg" alt="" />
                        </div>
                    </div>
                </div>
                <div className="pt-[75px] pr-[15px] pb-[52px] pl-[35px] border-r-2">
                    <h3 className='font-bold py-[15px] text-[18px] opacity-[85%] tracking-wide'>Nhóm liên kết</h3>
                    <ul className='text-[14px] list-disc text-[#666666]'>
                        <li className='mb-[8px]'>Tìm kiếm</li>
                        <li className='mb-[8px]'>Giới thiệu</li>
                        <li className='mb-[8px]'>Chính sách đổi trả</li>
                        <li className='mb-[8px]'>Chính sách bảo mật</li>
                        <li className='mb-[8px]'>Tuyển dụng</li>
                        <li className='mb-[8px]'>Liên hệ</li>
                    </ul>
                </div>
                <div className="pt-[75px] pr-[15px] pb-[52px] pl-[35px]">
                    <h3 className='font-bold py-[15px] text-[18px] opacity-[85%] tracking-wide'>Đăng ký nhận tin</h3>
                    <p className='text-[#666666] tracking-wide font-normal'>Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và thông tin giảm giá khác..</p>
                    <form className="flex my-5 py-3">
                        <input className='py-3 px-3 border border-gray-300 focus:outline-none' type="text" placeholder='Nhập email của bạn...' />
                        <button className='bg-[#333333] py-3 px-3 text-white'>Đăng kí</button>
                    </form>
                    <img src="/images/logo-bct/footer_logobct_img.jpg" alt="" />
                    {/* <h3 className='text-[#666666] font-bold my-[15px] tracking-wide'>Phương thức thanh toán</h3> */}
                </div>
            </div>
            <div className="h-[51px] flex items-center justify-center text-[#666666] border-t-2">
                <p className='tracking-wide'>Hustle2003@gmail.com</p>
            </div>
        </div>
    )
}

export default Footer
