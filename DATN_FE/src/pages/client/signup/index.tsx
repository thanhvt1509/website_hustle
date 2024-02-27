import { useEffect, useState } from "react";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { Button, Form, Input, Spin, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

type FormDataType = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const signup = () => {
  // useEffect(() => {
  //     const buttonSignin = document.querySelector(".buttonSignin")
  //     const buttonSignup = document.querySelector(".buttonSignup")
  //     const formSignup = document.querySelector(".formSignup")
  //     const formSignin = document.querySelector(".formSignin")
  //     const buttonSignup2 = document.querySelector(".buttonSignup-2")
  //     const buttonSignin2 = document.querySelector(".buttonSignin-2")
  //     const buttonSignin3 = document.querySelector(".buttonSignin-3")
  //     const buttonForgotPass = document.querySelector(".buttonForgotPass")
  //     const formForgotPass = document.querySelector(".formForgotPass")
  //     const navigateButtonSignup = () => {
  //         formSignin?.classList.add("hidden")
  //         formSignup?.classList.remove("hidden")
  //         buttonSignin?.classList.remove("text-black")
  //         buttonSignup?.classList.add("text-black")
  //     }
  //     const navigateButtonSignin = () => {
  //         formSignup?.classList.add("hidden")
  //         formSignin?.classList.remove("hidden")
  //         buttonSignup?.classList.remove("text-black")
  //         buttonSignin?.classList.add("text-black")
  //     }
  //     buttonSignin?.addEventListener("click", () => {
  //         navigateButtonSignin()
  //         formForgotPass?.classList.add("hidden")
  //     })
  //     buttonSignin2?.addEventListener("click", () => {
  //         navigateButtonSignin()
  //     })
  //     buttonSignup?.addEventListener("click", () => {
  //         navigateButtonSignup()
  //         formForgotPass?.classList.add("hidden")
  //     })
  //     buttonSignup2?.addEventListener("click", () => {
  //         navigateButtonSignup()
  //     })
  //     buttonSignin3?.addEventListener("click", () => {
  //         navigateButtonSignin()
  //         formForgotPass?.classList.add("hidden")
  //     })
  //     buttonForgotPass?.addEventListener("click", () => {
  //         formForgotPass?.classList.remove("hidden")
  //         formSignin?.classList.add("hidden")
  //         formSignup?.classList.add("hidden")
  //         buttonSignin?.classList.add("text-black")
  //         buttonSignup?.classList.remove("text-black")
  //     })
  // }, [])

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handSubmitSignup = async (data: FormDataType) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/auth/register", data);
      setLoading(false)
      //   message.success("Successfully registered");
      Swal.fire({
        title: "Vui lòng xác thực email của bạn!",
        icon: "info",
      })
      // .then((result) => {
      //   if (result.isConfirmed) {
      //     window.location.href = "https://mail.google.com/mail/"; // Replace with your actual link
      //   }
      // });
      navigate("/signin");

    } catch (error: any) {
      if (error.response) {
        const serverErrorMessage = error.response.data.messages;
        console.log(serverErrorMessage);
        form.setFields([
          {
            name: "email",
            errors: ["Email đã tồn tại"],
          },
        ]);
      } else {
        toast.error("Đăng kí thất bại, đã có lỗi xảy ra :((")
        console.log(error);
      }
    }
  };
  return (
    <div>
      {loading &&
        <div className="fixed inset-0 flex justify-center items-center bg-gray-50 ">
          <Spin className="z-50" size='large' />
        </div>}
      <Header></Header>
      <div className="w-[630px] py-[60px] mx-auto flex flex-col items-center mb-[55px]">
        <div className="flex text-[24px] font-semibold tracking-wide text-[#CACACA] mb-[45px]">
          <Link
            to="/signin"
            className="px-[30px] border-r-2 cursor-pointer buttonSignin"
          >
            Đăng nhập
          </Link>
          <Link
            to="/signup"
            className="px-[30px] cursor-pointer text-black buttonSignup"
          >
            Đăng ký
          </Link>
        </div>
        {/* signup */}
        <Form
          form={form}
          onFinish={handSubmitSignup}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          style={{ maxWidth: 600 }}
          className="w-full formSignup"
          scrollToFirstError
        >
          <Form.Item
            name="fullname"
            className="mb-7"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ và tên",
              },
            ]}
          >
            <input
              type="text"
              placeholder="Họ và tên của bạn ..."
              className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 focus:outline-none focus:bg-white "
            />
          </Form.Item>
          <Form.Item
            name="email"
            className="mb-7"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ",
              },
              {
                required: true,
                message: "Vui lòng nhập email",
              },
            ]}
          >
            <input
              type="text"
              placeholder="E-mail"
              className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 focus:outline-none focus:bg-white "
            />
          </Form.Item>
          <Form.Item
            name="password"
            className="mb-7"
            rules={[
              {
                required: true,
                message: "Vui lòng nhâp mật khẩu",
              },
              {
                min: 6,
                message: "Mật khẩu tối thiểu 6 kí tự",
              },
            ]}
          >
            <input
              type="password"
              placeholder="Password"
              className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 focus:outline-none focus:bg-white "
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            className="mb-7"
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận lại mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không hớp"));
                },
              }),
            ]}
          >
            <input
              type="password"
              placeholder="ConfirmPassword"
              className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 focus:outline-none focus:bg-white "
            />
          </Form.Item>
          <Form.Item>
            <div className="flex mt-5">
              <button className="bg-[#333333] px-[28px] py-[12px] text-[#ffffff] rounded-lg uppercase tracking-wide">
                Đăng Ký
              </button>
              <div className="flex flex-col  ml-[30px]">
                <p className="font-thin opacity-60">Bạn đã có tài khoản?</p>
                <Link
                  to="/signin"
                  className="text-blue-400 italic buttonSignin-2 cursor-pointer opacity-60 hover:opacity-80"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </Form.Item>
        </Form>
        {/* <form className="w-full formSignup" action="">
                <input type="text" placeholder="Họ và tên của bạn ..." className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white " />
                <input type="text" placeholder="Email" className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white " />
                <input type="password" placeholder="Password" className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white " />
                <input type="password" placeholder="ConfirmPassword" className="w-full border-[1px] bg-[#EDEDED] text-[#5c5c5c] italic tracking-wide px-4 py-4 mb-[25px] focus:outline-none focus:bg-white " />
                <div className="flex mt-[25px]">
                    <button className="bg-[#333333] px-[28px] py-[12px] text-[#ffffff] rounded-lg uppercase tracking-wide">Đăng Ký</button>
                    <div className="flex flex-col  ml-[30px]">
                        <p className="font-thin opacity-60">Bạn đã có tài khoản?</p>
                        <p className="text-blue-400 italic buttonSignin-2 cursor-pointer opacity-60 hover:opacity-80">Đăng nhập ngay</p>
                    </div>
                </div>
            </form> */}
      </div>
      <Footer></Footer>
    </div>
  );
};
export default signup;
