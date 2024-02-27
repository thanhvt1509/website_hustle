import { Link } from "react-router-dom";
import Breadcrumb from "../../layout/Breadcrumb";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";

const RetailChain = () => {
  return (
    <>
      <Header></Header>
      <Breadcrumb></Breadcrumb>
      <div className="max-w-[1500px] mx-auto mb-[65px]">
        <h1 className="text-[30px] font-bold text-center mb-7">
          Hệ thống cửa hàng
        </h1>
        <div className="px-10 flex justify-between">
          <div className="p-5 border border-[#e7e7e7] rounded">
            <h2 className="text-[22px] font-bold mb-2">Tìm cửa hàng</h2>
            <div className="w-[382px]">
              <div className="mb-4">
                <label htmlFor="" className="block mb-3 font-medium text-sm">
                  Chọn tỉnh thành
                </label>
                <select
                  name=""
                  id=""
                  className="border border-[#e7e7e7] rounded px-3 py-2 w-full outline-none"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Bắc Ninh">Bắc Ninh</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Vĩnh Phúc">Vĩnh Phúc</option>
                  <option value="Ninh Bình">Ninh Bình</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Nghệ An">Nghệ An</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="" className="block mb-3 font-medium text-sm">
                  Chọn cửa hàng
                </label>
                <select
                  name=""
                  id=""
                  className="border border-[#e7e7e7] rounded px-3 py-2 w-full outline-none"
                >
                  <option value="Hà Nội">Đống Đa</option>
                  <option value="Hoàng Mai">Hoàng Mai</option>
                  <option value="Nam Từ Liêm">Nam Từ Liêm</option>
                  <option value="Gia Lâm">Gia Lâm</option>
                  <option value="Cầu Giấy">Cầu Giấy</option>
                  <option value="Hai Bà Trưng">Hai Bà Trưng</option>
                  <option value="Thanh Trì">Thanh Trì</option>
                  <option value="Hà Đông">Hà Đông</option>
                  <option value="Long Biên">Long Biên</option>
                  <option value="Bắc Từ Liêm">Bắc Từ Liêm</option>
                  <option value="Hoài Đức">Hoài Đức</option>
                </select>
              </div>
              <div className="h-[300px] overflow-auto">
                <div className="flex gap-x-3 mb-5">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="leading-7">TORANO 02 CHÙA BỘC</p>
                    <div className="text-sm leading-6">
                      <p>Số 02, Chùa Bộc , Đống Đa, Hà Nội</p>
                      <p>
                        Thời gian hoạt động:{" "}
                        <b>8h30 - 22h00 (kể cả CN và ngày lễ)</b>
                      </p>
                      <p>
                        Số điện thoại: <b>097 640 8388</b>
                      </p>
                      <Link to="" className="underline text-[#1a73e8]">
                        Xem bản đồ
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-3 mb-5">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="leading-7">TORANO 02 CHÙA BỘC</p>
                    <div className="text-sm leading-6">
                      <p>Số 02, Chùa Bộc , Đống Đa, Hà Nội</p>
                      <p>
                        Thời gian hoạt động:{" "}
                        <b>8h30 - 22h00 (kể cả CN và ngày lễ)</b>
                      </p>
                      <p>
                        Số điện thoại: <b>097 640 8388</b>
                      </p>
                      <Link to="" className="underline text-[#1a73e8]">
                        Xem bản đồ
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-3 mb-5">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="leading-7">TORANO 02 CHÙA BỘC</p>
                    <div className="text-sm leading-6">
                      <p>Số 02, Chùa Bộc , Đống Đa, Hà Nội</p>
                      <p>
                        Thời gian hoạt động:{" "}
                        <b>8h30 - 22h00 (kể cả CN và ngày lễ)</b>
                      </p>
                      <p>
                        Số điện thoại: <b>097 640 8388</b>
                      </p>
                      <Link to="" className="underline text-[#1a73e8]">
                        Xem bản đồ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3724.6574268345366!2d105.83095!3d21.006365!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac808f2bfe7f%3A0xed43de34e3591978!2zMiBQLiBDaMO5YSBC4buZYywgS2ltIExpw6puLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1681979843141!5m2!1svi!2sus"
              width="600"
              height="450"
              className="border-0 w-[952px] h-[560px]"
              allowFullScreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default RetailChain;
