import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { useEffect } from "react";
import { Form } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../store/user/userSlice";
import { RootState } from "../../../store";
import { useAddCartMutation, useListCartQuery } from "../../../store/cart/cart.service";
import { listCartSlice } from "../../../store/cart/cartSlice";
import { ICart } from "../../../store/cart/cart.interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotAccountForm, ForgotAccountSchema } from "../../../Schemas/forgotAccount";
import ForgotPassword from "./ForgotPassword";
import Swal from "sweetalert2";

type FormDataType = {
  email: string;
  password: string;
};

const signin = () => {
  const { data: listCart, isSuccess: isSuccessCart } = useListCartQuery()
  const cartState = useSelector((state: RootState) => state.cartSlice.carts)
  const [onAddCart] = useAddCartMutation()
  const cartStore: ICart[] = JSON.parse(localStorage.getItem("carts")!)
  const user = useSelector((state: any) => state?.user);
  useEffect(() => {
    const buttonSignin = document.querySelector(".buttonSignin");
    const formSignin = document.querySelector(".formSignin");
    const buttonSignin3 = document.querySelector(".buttonSignin-3");
    const buttonForgotPass = document.querySelector(".buttonForgotPass");
    const formForgotPass = document.querySelector(".formForgotPass");
    const navigateButtonSignin = () => {
      formSignin?.classList.remove("hidden");
      buttonSignin?.classList.add("text-black");
    };
    buttonForgotPass?.addEventListener("click", () => {
      formForgotPass?.classList.remove("hidden");
      formSignin?.classList.add("hidden");
      buttonSignin?.classList.add("text-black");
    });
    buttonSignin3?.addEventListener("click", () => {
      navigateButtonSignin();
      formForgotPass?.classList.add("hidden");
    });
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (listCart) {
      if (user?.current?._id) {
        dispatch(listCartSlice(listCart))
      } else {
        dispatch(listCartSlice(cartStore ? cartStore : [])!)
      }
    }
  }, [isSuccessCart, listCart])
  const handSubmitSignin = async (data: FormDataType) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        data
      );
      toast.success("Đăng nhập thành công");
      if (cartState?.length > 0) {
        cartStore?.map((cart) => {
          onAddCart({ userId: response?.data?.user?._id, ...cart });
        });
      }
      dispatch(
        register({
          isLoggedIn: true,
          token: response?.data?.accessToken,
          userData: response?.data?.user,
        })
      );

      if (response?.data?.user?.role == "user") {
        navigate("/");
      } else if (response?.data?.user?.role == "admin") {
        navigate("/admin");
      }
    } catch (error: any) {
      if (error.response) {
        const serverErrorMessage = error.response.data.messages;
        toast.error(`Đăng nhập thất bại: ${serverErrorMessage}`);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  useEffect(() => {
    let params = new URLSearchParams(document.location.search)
    let token = params.get("confirmationCode");
    if (token) {
      axios.post(
        `http://localhost:8080/api/auth/confirm-registration/${token}`
      ).then(({ data }) =>
        Swal.fire({
          title: data.message,
          icon: "success",
        })
      );
    }
  }, [])
  return (
    <>
      <Header></Header>
      <div className="w-[630px] py-[60px] mx-auto flex flex-col items-center mb-[55px]">
        <div className="flex text-[24px] font-semibold tracking-wide text-[#CACACA] mb-[45px]">
          <Link
            to="/signin"
            className="px-[30px] border-r-2 text-black cursor-pointer buttonSignin"
          >
            Đăng nhập
          </Link>
          <Link to="/signup" className="px-[30px] cursor-pointer buttonSignup">
            Đăng ký
          </Link>
        </div>
        <Form
          form={form}
          onFinish={handSubmitSignin}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          style={{ maxWidth: 600 }}
          className="w-full formSignin"
          scrollToFirstError
        >
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
          <Form.Item>
            <div className="flex mt-[25px]">
              <button className="bg-[#333333] hover:bg-black transition-all ease-linear px-[28px] py-[12px] text-[#ffffff] rounded-lg uppercase tracking-wide">
                Đăng Nhập
              </button>
              <div className="flex flex-col ml-[30px]">
                <div className="font-thin flex">
                  <p>Bạn chưa có tài khoản?</p>
                  <Link
                    to="/signup"
                    className="text-blue-400 italic ml-1 opacity-60 cursor-pointer hover:opacity-80 buttonSignup-2"
                  >
                    Đăng ký
                  </Link>
                </div>
                <p>
                  Bạn quên mật khẩu?
                  <span className="text-blue-400 italic ml-1 opacity-60 cursor-pointer hover:opacity-80 buttonForgotPass">
                    Quên mật khẩu
                  </span>
                </p>
              </div>
            </div>
          </Form.Item>
        </Form>
        {/* forgot password */}
        <ForgotPassword></ForgotPassword>
      </div>
      <Footer></Footer>
    </>
  );
};
export default signin;
