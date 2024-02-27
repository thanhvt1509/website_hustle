import Header from "../../layout/Header";
import { Link } from "react-router-dom";
import Footer from "../../layout/Footer";

const Contact = () => {
  return (
    <>
      <Header></Header>
      <div className="bg-[#f5f5f5]">
        <div className="max-w-[1500px] mx-auto py-[10px] text-[#333333] px-2 text-sm">
          <Link to="/">Trang chủ</Link>
          <span className="mx-[6px]">/</span>
          <Link to="">Liên hệ</Link>
        </div>
      </div>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1226.05605351128!2d105.82304916707747!3d21.001996484838397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac86851cdbf9%3A0x2e8221230c1ca9a9!2zMzEzIMSQLiBUcsaw4budbmcgQ2hpbmgsIEtoxrDGoW5nIE1haSwgVGhhbmggWHXDom4sIEjDoCBO4buZaSAxMDAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1682395641602!5m2!1svi!2s"
          width="600"
          height="450"
          className="border-0 w-full mb-[50px]"
          loading="lazy"
        ></iframe>
        <div className="container">
          <div className="flex gap-x-[40px] mb-12">
            <div className="w-2/4">
              <h2 className="text-[22px] font-bold mb-4">
                Gửi thắc mắc cho chúng tôi
              </h2>
              <p className="text-sm mb-4">
                Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và
                chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể .
              </p>
              <form action="">
                <div>
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    className="border border-[#e7e7e7] text-sm font-medium text-[#5c5c5c] outline-none rounded py-3 px-5 w-full mb-5 placeholder:text-[#5c5c5c]"
                  />
                </div>
                <div className="flex gap-x-5">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="border border-[#e7e7e7] text-sm font-medium text-[#5c5c5c] outline-none rounded py-3 px-5 w-full mb-5 placeholder:text-[#5c5c5c]"
                  />
                  <input
                    type="number"
                    placeholder="Số điện thoại của bạn"
                    className="border border-[#e7e7e7] text-sm font-medium text-[#5c5c5c] outline-none rounded py-3 px-5 w-full mb-5 placeholder:text-[#5c5c5c]"
                  />
                </div>
                <div>
                  <textarea
                    name=""
                    placeholder="Nội dung"
                    cols={30}
                    rows={6}
                    className="w-full resize-none py-3 px-5 border border-[#e7e7e7] text-sm font-medium text-[#5c5c5c] outline-none rounded placeholder:text-[#5c5c5c]"
                  ></textarea>
                </div>
                <div className="sitebox-recaptcha mt-2 mb-5 text-sm text-[#9e9e9e]">
                  <p>
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2962ff]"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://policies.google.com/terms"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2962ff]"
                    >
                      Terms of Service
                    </a>{" "}
                    apply.
                  </p>
                </div>
                <button className="ouline-none bg-[#333] text-white uppercase transition-all px-6 py-3 rounded hover:bg-black">
                  Gửi cho chúng tôi
                </button>
              </form>
            </div>
            <div className="w-2/4">
              <h2 className="text-[22px] font-bold mb-4">Thông tin liên hệ</h2>
              <div>
                <div className="flex gap-x-5 mb-6">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#f6f6f6] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 368.16 368.16"
                    >
                      <g>
                        <g>
                          <g>
                            <g>
                              <path
                                d="M184.08,0c-74.992,0-136,61.008-136,136c0,24.688,11.072,51.24,11.536,52.36c3.576,8.488,10.632,21.672,15.72,29.4
																			 l93.248,141.288c3.816,5.792,9.464,9.112,15.496,9.112s11.68-3.32,15.496-9.104l93.256-141.296
																			 c5.096-7.728,12.144-20.912,15.72-29.4c0.464-1.112,11.528-27.664,11.528-52.36C320.08,61.008,259.072,0,184.08,0z
																			 M293.8,182.152c-3.192,7.608-9.76,19.872-14.328,26.8l-93.256,141.296c-1.84,2.792-2.424,2.792-4.264,0L88.696,208.952
																			 c-4.568-6.928-11.136-19.2-14.328-26.808C74.232,181.816,64.08,157.376,64.08,136c0-66.168,53.832-120,120-120
																			 c66.168,0,120,53.832,120,120C304.08,157.408,293.904,181.912,293.8,182.152z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M184.08,64.008c-39.704,0-72,32.304-72,72c0,39.696,32.296,72,72,72c39.704,0,72-32.304,72-72
																			 C256.08,96.312,223.784,64.008,184.08,64.008z M184.08,192.008c-30.872,0-56-25.12-56-56s25.128-56,56-56s56,25.12,56,56
																			 S214.952,192.008,184.08,192.008z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="text-sm leading-[1.6]">
                    <h3 className="font-bold">Địa chỉ</h3>
                    <p>
                      Tầng 8, tòa nhà Ford, số 313 Trường Chinh, quận Thanh
                      Xuân, Hà Nội
                    </p>
                  </div>
                </div>
                <div className="flex gap-x-5 mb-6">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#f6f6f6] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 482.6 482.6"
                    >
                      <g>
                        <g>
                          <path
                            d="M98.339,320.8c47.6,56.9,104.9,101.7,170.3,133.4c24.9,11.8,58.2,25.8,95.3,28.2c2.3,0.1,4.5,0.2,6.8,0.2
																	 c24.9,0,44.9-8.6,61.2-26.3c0.1-0.1,0.3-0.3,0.4-0.5c5.8-7,12.4-13.3,19.3-20c4.7-4.5,9.5-9.2,14.1-14
																	 c21.3-22.2,21.3-50.4-0.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2c-12.8,0-25.1,5.6-35.6,16.1l-35.8,35.8
																	 c-3.3-1.9-6.7-3.6-9.9-5.2c-4-2-7.7-3.9-11-6c-32.6-20.7-62.2-47.7-90.5-82.4c-14.3-18.1-23.9-33.3-30.6-48.8
																	 c9.4-8.5,18.2-17.4,26.7-26.1c3-3.1,6.1-6.2,9.2-9.3c10.8-10.8,16.6-23.3,16.6-36s-5.7-25.2-16.6-36l-29.8-29.8
																	 c-3.5-3.5-6.8-6.9-10.2-10.4c-6.6-6.8-13.5-13.8-20.3-20.1c-10.3-10.1-22.4-15.4-35.2-15.4c-12.7,0-24.9,5.3-35.6,15.5l-37.4,37.4
																	 c-13.6,13.6-21.3,30.1-22.9,49.2c-1.9,23.9,2.5,49.3,13.9,80C32.739,229.6,59.139,273.7,98.339,320.8z M25.739,104.2
																	 c1.2-13.3,6.3-24.4,15.9-34l37.2-37.2c5.8-5.6,12.2-8.5,18.4-8.5c6.1,0,12.3,2.9,18,8.7c6.7,6.2,13,12.7,19.8,19.6
																	 c3.4,3.5,6.9,7,10.4,10.6l29.8,29.8c6.2,6.2,9.4,12.5,9.4,18.7s-3.2,12.5-9.4,18.7c-3.1,3.1-6.2,6.3-9.3,9.4
																	 c-9.3,9.4-18,18.3-27.6,26.8c-0.2,0.2-0.3,0.3-0.5,0.5c-8.3,8.3-7,16.2-5,22.2c0.1,0.3,0.2,0.5,0.3,0.8
																	 c7.7,18.5,18.4,36.1,35.1,57.1c30,37,61.6,65.7,96.4,87.8c4.3,2.8,8.9,5,13.2,7.2c4,2,7.7,3.9,11,6c0.4,0.2,0.7,0.4,1.1,0.6
																	 c3.3,1.7,6.5,2.5,9.7,2.5c8,0,13.2-5.1,14.9-6.8l37.4-37.4c5.8-5.8,12.1-8.9,18.3-8.9c7.6,0,13.8,4.7,17.7,8.9l60.3,60.2
																	 c12,12,11.9,25-0.3,37.7c-4.2,4.5-8.6,8.8-13.3,13.3c-7,6.8-14.3,13.8-20.9,21.7c-11.5,12.4-25.2,18.2-42.9,18.2
																	 c-1.7,0-3.5-0.1-5.2-0.2c-32.8-2.1-63.3-14.9-86.2-25.8c-62.2-30.1-116.8-72.8-162.1-127c-37.3-44.9-62.4-86.7-79-131.5
																	 C28.039,146.4,24.139,124.3,25.739,104.2z"
                            fill="#000000"
                            data-original="#000000"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="text-sm leading-[1.6]">
                    <h3 className="font-bold">Điện thoại</h3>
                    <a href="tel:0964.942.121">0964.942.121</a>
                  </div>
                </div>
                <div className="flex gap-x-5 mb-6">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#f6f6f6] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 368 368"
                    >
                      <g>
                        <g>
                          <g>
                            <g>
                              <path
                                d="M184,60c4.4,0,8-3.6,8-8v-4c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8v4C176,56.4,179.6,60,184,60z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M184,308c-4.4,0-8,3.6-8,8v4c0,4.4,3.6,8,8,8c4.4,0,8-3.6,8-8v-4C192,311.6,188.4,308,184,308z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M52,176h-4c-4.4,0-8,3.6-8,8c0,4.4,3.6,8,8,8h4c4.4,0,8-3.6,8-8C60,179.6,56.4,176,52,176z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M320,176h-4c-4.4,0-8,3.6-8,8c0,4.4,3.6,8,8,8h4c4.4,0,8-3.6,8-8C328,179.6,324.4,176,320,176z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M93.6,82.4c-3.2-3.2-8-3.2-11.2,0c-3.2,3.2-3.2,8,0,11.2l2.8,2.8c1.6,1.6,3.6,2.4,5.6,2.4s4-0.8,5.6-2.4
																			 c3.2-3.2,3.2-8,0-11.2L93.6,82.4z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M85.2,271.6l-2.8,2.8c-3.2,3.2-3.2,8,0,11.2C84,287.2,86,288,88,288s4-0.8,5.6-2.4l2.8-2.8c3.2-3.2,3.2-8,0-11.2
																			 S88.4,268.4,85.2,271.6z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M274.4,82.4l-2.8,2.8c-3.2,3.2-3.2,8,0,11.2c1.6,1.6,3.6,2.4,5.6,2.4s4-0.8,5.6-2.4l2.8-2.8c3.2-3.2,3.2-8,0-11.2
																			 C282.4,79.2,277.6,79.2,274.4,82.4z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M192,180.8V108c0-4.4-3.6-8-8-8c-4.4,0-8,3.6-8,8v76c0,2,0.8,4,2.4,5.6l87.6,87.6c1.6,1.6,3.6,2.4,5.6,2.4s4-0.8,5.6-2.4
																			 c3.2-3.2,3.2-8,0-11.2L192,180.8z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                              <path
                                d="M184,0C82.4,0,0,82.4,0,184s82.4,184,184,184s184-82.4,184-184S285.6,0,184,0z M184,352c-92.8,0-168-75.2-168-168
																			 S91.2,16,184,16s168,75.2,168,168S276.8,352,184,352z"
                                fill="#000000"
                                data-original="#000000"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="text-sm leading-[1.6]">
                    <h3 className="font-bold">Thời gian làm việc</h3>
                    <p>Thứ 2 đến thứ 6 : từ 8h30 đến 18h</p>
                    <p>Thứ 7 : từ 8h30 đến 12h00</p>
                  </div>
                </div>
                <div className="flex gap-x-5">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#f6f6f6] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 512 512"
                    >
                      <g>
                        <g>
                          <g>
                            <path
                              d="M469.333,64H42.667C19.135,64,0,83.135,0,106.667v298.667C0,428.865,19.135,448,42.667,448h426.667
																		 C492.865,448,512,428.865,512,405.333V106.667C512,83.135,492.865,64,469.333,64z M42.667,85.333h426.667
																		 c1.572,0,2.957,0.573,4.432,0.897c-36.939,33.807-159.423,145.859-202.286,184.478c-3.354,3.021-8.76,6.625-15.479,6.625
																		 s-12.125-3.604-15.49-6.635C197.652,232.085,75.161,120.027,38.228,86.232C39.706,85.908,41.094,85.333,42.667,85.333z
																		 M21.333,405.333V106.667c0-2.09,0.63-3.986,1.194-5.896c28.272,25.876,113.736,104.06,169.152,154.453
																		 C136.443,302.671,50.957,383.719,22.46,410.893C21.957,409.079,21.333,407.305,21.333,405.333z M469.333,426.667H42.667
																		 c-1.704,0-3.219-0.594-4.81-0.974c29.447-28.072,115.477-109.586,169.742-156.009c7.074,6.417,13.536,12.268,18.63,16.858
																		 c8.792,7.938,19.083,12.125,29.771,12.125s20.979-4.188,29.76-12.115c5.096-4.592,11.563-10.448,18.641-16.868
																		 c54.268,46.418,140.286,127.926,169.742,156.009C472.552,426.073,471.039,426.667,469.333,426.667z M490.667,405.333
																		 c0,1.971-0.624,3.746-1.126,5.56c-28.508-27.188-113.984-108.227-169.219-155.668c55.418-50.393,140.869-128.57,169.151-154.456
																		 c0.564,1.91,1.194,3.807,1.194,5.897V405.333z"
                              fill="#000000"
                              data-original="#000000"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="text-sm leading-[1.6]">
                    <h3 className="font-bold">Email</h3>
                    <a href="mail:cskh@hustle.vn">cskh@hustle.vn</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Contact;
