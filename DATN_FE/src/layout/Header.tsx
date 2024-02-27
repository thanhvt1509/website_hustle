import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Link, useNavigate } from "react-router-dom";
import {
  useAddCartMutation,
  useDeleteCartMutation,
  useGetOneCartQuery,
  useListCartQuery,
  useUpdateCartMutation,
} from "../store/cart/cart.service";
import {
  addCartSlice,
  decreaseCartSlice,
  increaseCartSlice,
  listCartSlice,
  removeCartSlice,
} from "../store/cart/cartSlice";
import {
  useGetOneProductDetailQuery,
  useListProductDetailQuery,
} from "../store/productDetail/productDetail.service";
import { listProductDetailRelatedSlice, listProductDetailSlice } from "../store/productDetail/productDetailSlice";
import { useFetchListProductQuery, useSearchProductQuery } from "../store/product/product.service";
import { listProductSearchSlice, listProductSlice } from "../store/product/productSlice";
import { toast } from "react-toastify";
import { register } from "../store/user/userSlice";
import axios from "axios";
import { logout } from "../store/user/userSlice";
import { Breadcrumb, Button, Form, Input, Space, message } from "antd";
import { ICart } from "../store/cart/cart.interface";
import { useForm } from "react-hook-form";
import { ForgotAccountForm, ForgotAccountSchema } from "../Schemas/forgotAccount";
import { yupResolver } from "@hookform/resolvers/yup";
import { listOutfitSlice } from "../store/outfit/outfitSlice";
import { useFetchListOutfitQuery } from "../store/outfit/outfit.service";

type FormDataType = {
  email: string;
  password: string;
};

const Header = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const { data: listCart, isSuccess: isSuccessCart } = useListCartQuery();
  const { data: listProductDetail, isSuccess: isSuccessProductDetail } =
    useListProductDetailQuery();
  const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductQuery();
  const { data: listOutfit, isSuccess: isSuccesslistOutfit } = useFetchListOutfitQuery();
  const outfitState = useSelector((state: RootState) => state.outfitSlice.outfits)
  useEffect(() => {
    if (listOutfit) {
      dispatch(listOutfitSlice(listOutfit))
    }
  }, [isSuccesslistOutfit])
  const cartState = useSelector((state: RootState) => state.cartSlice.carts);
  const productDetailState = useSelector(
    (state: RootState) => state.productDetailSlice.productDetails
  );
  const productDetailRelatedState = useSelector(
    (state: RootState) => state.productDetailRelatedReducer.productDetails
  );
  const productState = useSelector(
    (state: RootState) => state.productSlice.products
  );
  const [onRemoveCart] = useDeleteCartMutation();
  const [onUpdateCart] = useUpdateCartMutation();
  const [onAddCart] = useAddCartMutation();
  const cartStore: ICart[] = JSON.parse(localStorage.getItem("carts")!);
  const [totalCart, setTotalCart] = useState<number>(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
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
        const serverErrorMessage = error.response.data?.messages;
        toast.error(`Đăng nhập thất bại: ${serverErrorMessage}`);
      } else {
        console.log(error);
      }
    }
  };
  const user = useSelector((state: any) => state?.user);
  const isLoggedIn = user?.isLoggedIn;
  const fullName = user?.current?.fullname;
  const role = user?.current?.role;
  const logOut = () => {
    // Gọi action đăng xuất
    dispatch(logout());
    toast.success("Bạn đã đăng xuất!");
    localStorage.removeItem("carts");
    navigate("/signin");
  };
  useEffect(() => {
    if (listCart) {
      if (user?.current?._id) {
        dispatch(listCartSlice(listCart))
      } else {
        dispatch(listCartSlice(cartStore ? cartStore : [])!)
      }
    }
  }, [isSuccessCart, listCart]);
  useEffect(() => {
    if (listProductDetail) {
      dispatch(listProductDetailRelatedSlice(listProductDetail));
    }
  }, [isSuccessProductDetail]);
  useEffect(() => {
    if (listProduct) {
      dispatch(listProductSlice(listProduct));
    }
  }, [isSuccessListProduct]);
  // xu li cart
  const removeCart = async (id: string) => {
    try {
      if (id) {
        if (user?.current?._id) {
          const isConfirm = window.confirm("Ban co chac chan muon xoa khong?");
          if (isConfirm) {
            await onRemoveCart(id).then(() => dispatch(removeCartSlice(id)));
            message.success("Xóa thành công!");
          }
        } else {
          const isConfirm = window.confirm("Ban co chac chan muon xoa khong?");
          if (isConfirm) {
            dispatch(removeCartSlice(id));
            message.success("Xóa thành công!");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const decreaseCart = async (_id: string, discount: number) => {
    try {
      if (_id && discount) {
        if (user?.current?._id) {
          dispatch(decreaseCartSlice({ _id: _id, discount: discount }));
          const cartIndex = JSON.parse(localStorage.getItem("cartIndex")!);
          if (cartIndex) {
            await onUpdateCart({ _id, ...cartIndex });
          }
          console.log(2)

        } else {
          console.log(1)
          dispatch(decreaseCartSlice({ _id: _id, discount: discount }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const increaseCart = async (_id: string, discount: number) => {
    try {
      if (_id) {
        if (user?.current?._id) {
          dispatch(increaseCartSlice({ _id: _id, discount: discount }));
          const cartIndex = JSON.parse(localStorage.getItem("cartIndex")!);
          if (cartIndex) {
            await onUpdateCart({ _id, ...cartIndex });
          }
        } else {
          dispatch(increaseCartSlice({ _id: _id, discount: discount }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // hàm dropdownUser
  const handleDropdown = () => {
    const iconUser = document.querySelector(".icon-user");
    const dropdown = document.querySelector(".dropdown-user");
    const hiddenUser = document.querySelector(".dropdown-user.hidden");
    const overlay = document.querySelector(".overlay-dropdownUser");
    const isSelected = document.querySelector(".isSelected");
    const signinDropdown = document.querySelector(".signinDropdown");

    isSelected?.classList.remove("translate-x-0");
    isSelected?.classList.add("translate-x-[150%]");
    signinDropdown?.classList.remove("translate-x-[-150%]");
    if (dropdown?.classList.contains("opacity-0")) {
      dropdown?.classList.remove("opacity-0");
      dropdown?.classList.remove("pointer-events-none");
      overlay?.classList.remove("hidden");
    } else {
      dropdown?.classList.add("pointer-events-none");
      dropdown?.classList.add("opacity-0");
      overlay?.classList.add("hidden");
    }
    overlay?.addEventListener("click", () => {
      dropdown?.classList.add("pointer-events-none");
      dropdown?.classList.add("opacity-0");
      overlay.classList.add("hidden");
    });
  };
  const forgotPassword = () => {
    const isSelected = document.querySelector(".isSelected");
    const signinDropdown = document.querySelector(".signinDropdown");
    isSelected?.classList.add("translate-x-0");
    isSelected?.classList.remove("translate-x-[150%]");
    signinDropdown?.classList.add("translate-x-[-150%]");
  };
  const backSigninDropdown = () => {
    const isSelected = document.querySelector(".isSelected");
    const signinDropdown = document.querySelector(".signinDropdown");
    isSelected?.classList.remove("translate-x-0");
    isSelected?.classList.add("translate-x-[150%]");
    signinDropdown?.classList.remove("translate-x-[-150%]");
  };
  // overlay-cart
  useEffect(() => {
    const overlayCart = document.querySelector(".overlay-cart");
    const iconOutCart = document.querySelector(".icon-outCart");
    const overlay = document.querySelector(".overlay");
    const iconCart = document.querySelector(".icon-cart");
    const closeDropdownUser = () => {
      const overlayDropdownUser = document.querySelector(
        ".overlay-dropdownUser"
      );
      const dropdown = document.querySelector(".dropdown-user");
      if (!overlayDropdownUser?.classList.contains("hidden")) {
        overlayDropdownUser?.classList.add("hidden");
        dropdown?.classList.add("pointer-events-none");
      }
    };
    iconCart?.addEventListener("click", () => {
      overlay?.classList.remove("hidden");
      overlayCart?.classList.remove("translate-x-[100%]", "opacity-0");
      const dropdown = document.querySelector(".dropdown-user");
      if (!dropdown?.classList.contains("opacity-0")) {
        dropdown?.classList.add("opacity-0");
        dropdown?.classList.add("pointer-events-none");
      }
    });
    iconOutCart?.addEventListener("click", () => {
      overlay?.classList.add("hidden");
      overlayCart?.classList.add("translate-x-[100%]", "opacity-0");
      closeDropdownUser();
    });
    overlay?.addEventListener("click", () => {
      overlay?.classList.add("hidden");
      overlayCart?.classList.add("translate-x-[100%]", "opacity-0");
      closeDropdownUser();
    });
    overlayCart?.addEventListener("click", (e) => {
      // e.stopPropagation()
    });
  }, []);
  useEffect(() => {
    let total = 0;
    if (cartState) {
      cartState.map((cart) => {
        total += cart.totalMoney;
      });
    }
    setTotalCart(total);
  }, [cartState]);

  // search
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const {
    handleSubmit
  } = useForm()

  const productSearch = useSelector((state: RootState) => state.productSearchReducer.products)
  useEffect(() => {
    if (listProduct && searchTerms) {
      if (searchTerms.trim() !== "") {
        dispatch(listProductSearchSlice({ searchTerm: searchTerms, products: listProduct }))
      } else {
        dispatch(listProductSearchSlice({ searchTerm: searchTerms, products: [] }))
      }
    }
  }, [searchTerms])
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };
  const handleSearch = () => {
    if (listProduct && searchTerms) {
      localStorage.setItem("searchTerm", JSON.stringify(searchTerms))
      dispatch(listProductSearchSlice({ searchTerm: searchTerms, products: listProduct }))
      navigate(`/search`)
    }
  }
  // forgotPassword
  const {
    handleSubmit: handleSubmitAccount,
    register: registerAccount,
    formState: { errors }
  } = useForm<ForgotAccountForm>({
    resolver: yupResolver(ForgotAccountSchema)
  })
  const handleForgotAccount = async (data: ForgotAccountForm) => {
    await axios.post(
      "http://localhost:8080/api/auth/user/forgotPassword",
      data
    );
    message.success("Mã token đã gửi về email của bạn")
  }



  return (
    <>
      <div className="sticky top-0 bg-white z-[99]">
        <div className="bg-[#242021] h-[36px] left-0 right-0">
          <div className="container text-white h-full flex justify-between items-center">
            <p className="text-[13px]">
              Hotline mua hàng:{" "}
              <strong>
                <Link to="">0967584597</Link>
              </strong>{" "}
              (9:00-21:00, Tất cả hàng tuần){" "}
              <span className="mx-[10px]">|</span> <Link to="">Liên hệ</Link>
            </p>
            {/* <div className="flex">
              <div className="relative mr-[5px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <p className="px-[4px] w-[14px] h-[14px] flex items-center justify-center bg-red-600 rounded-full absolute bottom-0 right-[-2px] top-[-5px] text-[10px]">
                  1
                </p>
              </div>
              <p>Thông báo của tôi</p>
            </div> */}
          </div>
        </div>
        <div className="border-b-2">
          <div className="h-[73px] flex justify-between container">
            {/* logo */}
            <div className="h-[73px] flex items-center">
              <Link to="/">
                <img
                  src="../../public/images/logo/dec5f33d-20b9-45cc-ab8c-5ce587a75660.jpg"
                  className="w-[170px] h-[53px]"
                  alt=""
                />
              </Link>
            </div>
            {/* icon */}
            <div className="flex items-center">
              {/* icon search */}
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-[32px] h-[26px] mr-[15px] cursor-pointer"
                  onClick={toggleSearch}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              {/* icon user */}
              <div className="relative">
                <svg
                  onClick={handleDropdown}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-[32px] h-[26px] mr-[15px] cursor-pointer icon-user"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <div className="top-[190%] right-[-23px] py-[15px] rounded-b-lg px-[20px] absolute z-50 bg-white shadow-lg tracking-wide before:content-[''] before:absolute before:top-0 before:right-[3rem] before:border-l-[12px]  before:border-r-[10px] before:border-t-[10px] before:border-b-[10px] before:border-l-white before:border-r-white before:border-b-white before:translate-y-[-100%] before:rotate-[180deg] dropdown-user opacity-0 transition-all ease-in-out pointer-events-none overflow-x-hidden">
                  {isLoggedIn ? (
                    <div className="relative w-[260px] h-[200px]">
                      <div className="flex flex-col transition-all ease-in-out signinDropdown absolute left-0 right-0">
                        <h1 className="uppercase text-center pb-2 mb-5 border-b-[1px] text-lg tracking-widest text-[#333333]">
                          Thông tin tài khoản
                        </h1>
                        <div>
                          <h2 className="mb-2">Xin chào: {fullName}</h2>
                          <ul className="ml-5 text-sm">
                            <li className="list-disc font-light mb-1">
                              <Link to="/account">Tài khoản của tôi</Link>
                            </li>
                            {role == "admin" ? (
                              <li className="list-disc font-light mb-1">
                                <Link to="/admin">Quản trị</Link>
                              </li>
                            ) : null}
                            <li className="list-disc font-light mb-1">
                              <Link to="/account/orders">Đơn hàng của tôi</Link>
                            </li>
                            <li className="list-disc font-light mb-1">
                              <Link to="/account/addresses">
                                Danh sách địa chỉ
                              </Link>
                            </li>
                            <li className="list-disc font-light mb-1">
                              <button onClick={() => logOut()}>
                                Đăng xuất
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-[350px] h-[400px]">
                      {/* singin */}
                      <div className="flex flex-col transition-all ease-in-out signinDropdown absolute left-0 right-0  items-center">
                        <h1 className="uppercase text-[18px] text-[#333333]">
                          Đăng nhập tài khoản
                        </h1>
                        <p className="text-[#666666]">
                          Nhập email và mật khẩu của bạn
                        </p>
                        <hr className="my-4 w-full" />
                        <Form
                          form={form}
                          onFinish={handSubmitSignin}
                          initialValues={{
                            residence: ["zhejiang", "hangzhou", "xihu"],
                            prefix: "86",
                          }}
                          className="w-full"
                          scrollToFirstError
                        >
                          <Form.Item
                            name="email"
                            className="mb-1"
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
                              className="py-2 px-2 w-full border-2 focus:outline-none mt-3"
                              placeholder="Email"
                            />
                          </Form.Item>
                          <Form.Item
                            name="password"
                            className="mb-0"
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
                              className="py-2 px-2 w-full border-2 focus:outline-none mt-3"
                              placeholder="Mật khẩu"
                            />
                          </Form.Item>
                          <Form.Item>
                            <button className="w-full text-white bg-[#333333] hover:bg-[#000000] transition-all ease-linear uppercase text-[14px] py-3 px-3 mt-8 rounded-lg">
                              Đăng nhập
                            </button>
                            <div className="flex text-[#666666] w-full text-[12px] justify-between mt-8">
                              <p>Bạn đã có tài khoản chưa?</p>
                              <Link to="/signup" className="hover:text-black">
                                Tạo tài khoản
                              </Link>
                            </div>
                            <div className="flex text-[#666666] w-full text-[12px] justify-between mt-2">
                              <p>Quên mật khẩu?</p>
                              <p
                                onClick={forgotPassword}
                                className="hover:text-black cursor-pointer"
                              >
                                Khôi phục mật khẩu
                              </p>
                            </div>
                          </Form.Item>
                        </Form>
                      </div>
                      {/* khôi phục mật khẩu */}
                      <form onSubmit={handleSubmitAccount(handleForgotAccount)} className="flex flex-col transition-all ease-in-out isSelected absolute left-0 right-0 translate-x-[150%] items-center">
                        <h1 className="uppercase text-[18px] text-[#333333]">
                          Khôi phục mật khẩu
                        </h1>
                        <p className="text-[#666666]">Nhập email của bạn</p>
                        <hr className="my-4 w-full" />
                        <input
                          type="email"
                          {...registerAccount("email")}
                          className="py-2 px-2 w-full border-2 focus:outline-none mt-3"
                          placeholder="Email"
                        />
                        <p className="italic text-red-500 text-sm">{errors ? errors.email?.message : ""}</p>
                        <button className="w-full text-white bg-[#333333] hover:bg-[#000000] transition-all ease-linear uppercase text-[14px] py-3 px-3 mt-8 rounded-lg">
                          Khôi phục
                        </button>
                        <div className="flex text-[#666666] w-full text-[12px] justify-between mt-2">
                          <p>Bạn đã nhớ mật khẩu?</p>
                          <p
                            onClick={backSigninDropdown}
                            className="hover:text-black cursor-pointer"
                          >
                            Trở về đăng nhập
                          </p>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              <div className="left-0 right-0 bottom-0 absolute hidden overlay-dropdownUser bg-[#666666] opacity-30 w-full h-[100vh] top-[100%]"></div>
              {/* icon cart */}
              <div className="relative icon-cart cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-[32px] h-[26px] cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>

                <span className="w-[20px] h-[20px] flex items-center justify-center rounded-[50%] bg-red-600 text-white absolute top-[-5px] right-[-5px]">
                  {cartState?.length > 0 ? cartState.length : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* search */}
        <div
          className={`bg-white absolute z-50 transition-all w-full duration-500 ${showSearch ? "top-0" : "-top-[1000%]"
            }`}
        >
          <div className="container">
            <form className="flex justify-between py-8">
              <Link to="/">
                <img
                  src="https://theme.hstatic.net/200000690725/1001078549/14/logo.png?v=173"
                  alt=""
                  className="w-[220px]"
                />
              </Link>
              <div >
                <form onClick={handleSubmit(handleSearch)} className="flex items-center gap-x-5 justify-between border border-[#e2e2e2] focus:border-black rounded w-[714px] h-[45px] px-3">
                  <input
                    type="text"
                    className="outline-none w-full px-3 placeholder:text-black placeholder:text-[15px]"
                    placeholder="Tìm kiếm sản phẩm ..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit">
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
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </button>
                </form>
                <div className="">
                  <div>
                    {productSearch?.slice(0, 3).map((product, index) => {
                      return <Link to={`/products/${product._id}`} className="flex justify-between border-b mt-4 pb-4 cursor-pointer">
                        <div>
                          <h3 className="font-bold text-sm">
                            {product.title}
                          </h3>
                          <span className="text-[13px]">{product.price.toLocaleString("vi-VN")}₫</span>
                        </div>
                        <img
                          src={product.images?.[0]}
                          alt=""
                          className="w-[40px] h-[52px]"
                        />
                      </Link>
                    })}
                  </div>
                  {productSearch && productSearch?.length > 3 ? <Link to="" className="text-center block mt-4 text-sm">Xem thêm {productSearch?.length - 3} sản phẩm</Link> : ""}
                </div>
              </div>
              <div className="w-[120px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 ml-auto cursor-pointer"
                  onClick={toggleSearch}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </form>
          </div>
        </div>
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black opacity-50 transition-opacity duration-500 ${showSearch ? "block" : "hidden"
            }`}
          onClick={toggleSearch}
        ></div>
        {/* overlay-cart */}
        <div className="fixed overlay transition-all ease-linear hidden top-0 right-0 bottom-0 left-0  bg-[rgba(57,56,56,0.2)]"></div>
        {/* cart */}
        <div className="fixed top-0 opacity-0 translate-x-[100%] transition-all ease-linear overlay-cart bg-white right-0 max-w-[580px] min-w-[580px] h-full py-[20px] px-[15px] flex flex-col justify-between">
          {/* list product */}
          <div className="">
            <h1 className="font-bold tracking-wide text-[20px] mb-[10px]">
              Giỏ hàng
            </h1>
            <h1 className="tracking-wide py-[10px] text-[16px]">
              Bạn {totalCart < 500000 ? <span className="">
                cần mua thêm <strong className="text-red-400">{(500000 - totalCart).toLocaleString("vi-VN")}đ</strong>
                <strong className="uppercase ml-2">miễn phí vận chuyển</strong>
              </span> : <span>đã được <strong>Miễn phí vận chuyển</strong></span>}
            </h1>
            <hr className="my-[20px]" />
            <div className="overflow-y-scroll h-[450px]">
              {cartState?.map((cart, index) => {
                return <div key={index}>
                  {productState
                    ?.filter(
                      (product) => product._id === cart.productDetailId.product_id
                    )
                    .map((pro, index) => {
                      return (
                        <div
                          className="justify-between mb-6 rounded-lg border-2 bg-white p-6 max-h-[140px] shadow-md sm:flex sm:justify-start relative"
                          key={index}
                        >
                          <Link to={`/products/${pro._id}`}>
                            <img
                              src={cart.productDetailId?.imageColor}
                              alt="product-image"
                              className="w-[80px] rounded-lg sm:w-[80px] h-[90px]"
                            />
                          </Link>
                          <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                            <div className="mt-5 sm:mt-0">
                              <h2 className="text-lg font-bold text-gray-900">
                                {pro?.title}
                              </h2>
                              {/* color and size */}
                              <p className="mt-1 text-xs text-gray-700">
                                {cart.productDetailId?.nameColor} / {cart.productDetailId?.size}
                              </p>
                              {/* price product */}

                              <p className="mt-1 text-[14px] text-[#8f9bb3] font-semibold tracking-wide">
                                {(pro.price - pro.discount).toLocaleString("vi-VN")}
                                đ
                              </p>
                            </div>
                            {user?.current?._id ? (
                              <div
                                className="absolute right-[10px] top-[10px]"
                                onClick={() => removeCart(cart._id!)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div
                                className="absolute right-[10px] top-[10px]"
                                onClick={() =>
                                  removeCart(cart.productDetailId?._id!)
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block">
                              <div className="flex items-center">
                                <p className="font-bold tracking-wide text-[15px]">
                                  {cart.totalMoney.toLocaleString("vi-VN")}
                                </p>
                              </div>
                              <div className="flex items-center w-[100px] border border-gray-300 rounded">
                                {user?.current?._id ? <button
                                  onClick={() =>
                                    decreaseCart(
                                      cart._id!,
                                      (pro.price - pro.discount)
                                    )
                                  }
                                  disabled={
                                    cart?.quantity == 1
                                  }
                                  type="button"
                                  className={`${cart?.quantity == 1 ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 opacity-75 text-gray-700 transition hover:opacity-75" : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"}`}
                                >
                                  -
                                </button> : <button
                                  onClick={() =>
                                    decreaseCart(
                                      cart.productDetailId._id!,
                                      (pro.price - pro.discount)
                                    )
                                  }
                                  disabled={
                                    cart?.quantity == 1
                                  }
                                  type="button"
                                  className={`${cart?.quantity == 1 ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 opacity-75 text-gray-700 transition hover:opacity-75" : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"}`}
                                >
                                  -
                                </button>}
                                <input
                                  type="number"
                                  id="Quantity"
                                  value={cart.quantity}
                                  // value={Number(cartState.reduce((acc: number, curr: any) => {
                                  //   if (curr.productDetailId == item._id) {
                                  //     return acc += curr.quantity
                                  //   }
                                  // }, 0))}
                                  min="1"
                                  max={cart.productDetailId?.quantity}
                                  className="outline-none  font-semibold h-8 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                {user?.current?._id ? <button
                                  onClick={() =>
                                    increaseCart(
                                      cart._id!,
                                      (pro.price - pro.discount)
                                    )
                                  }
                                  disabled={
                                    cart.productDetailId?.quantity === cart?.quantity
                                  }
                                  type="button"
                                  className={`${cart.productDetailId?.quantity === cart?.quantity
                                    ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 text-gray-300 transition hover:opacity-75"
                                    : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"
                                    } `}
                                >
                                  +
                                </button> : <button
                                  onClick={() =>
                                    increaseCart(
                                      cart.productDetailId._id!,
                                      (pro.price - pro.discount)
                                    )
                                  }
                                  disabled={
                                    cart.productDetailId?.quantity === cart?.quantity
                                  }
                                  type="button"
                                  className={`${cart.productDetailId?.quantity === cart?.quantity
                                    ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 text-gray-300 transition hover:opacity-75"
                                    : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"
                                    } `}
                                >
                                  +
                                </button>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              })}
            </div>
          </div>
          {/* pay */}
          <div className=" w-full rounded-lg border bg-white px-6 pt-6 pb-6 shadow-md md:mt-0 md:w-full">
            <div className="flex justify-between">
              <p className="text-lg font-bold">Tổng tiền:</p>
              <div className="">
                <p className="text-[20px] font-bold text-red-500 tracking-wide">
                  {totalCart.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <Link to={"/checkout"}>
                <button className="mt-6 w-full uppercase rounded-md bg-red-500 py-1.5 font-medium text-red-50 hover:bg-red-600">
                  Thanh toán
                </button>
              </Link>
              <button className="mt-6 w-full uppercase rounded-md bg-red-500 py-1.5 font-medium text-red-50 hover:bg-red-600">
                <Link to="/cart">Xem giỏ hàng</Link>
              </button>
            </div>
          </div>
          <div className="absolute right-[10px] top-[10px] icon-outCart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-7 w-7 cursor-pointer duration-150 hover:text-red-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
