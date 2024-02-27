import { Dispatch, useEffect, useState } from "react";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetInfoUserQuery,
  useUpdateAccountMutation,
} from "../../../store/user/user.service";
import { useForm } from "react-hook-form";
import { AccountForm, AccountSchema } from "../../../Schemas/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";

const myAccount = () => {
  const [updateAccount] = useUpdateAccountMutation();

  const dispatch: Dispatch<any> = useDispatch();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountForm>({
    resolver: yupResolver(AccountSchema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const user = useSelector((state: any) => state.user);
  const isLoggedIn = user?.isLoggedIn;
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      setValue("fullname", user.current.fullname),
        setValue("email", user.current.email),
        setValue("_id", user.current._id);
    }
  }, [isModalOpen]);

  const { data: InfoUser, refetch } = useGetInfoUserQuery(user?.current?._id);

  const onUpdateAccount = async (data: AccountForm) => {
    await updateAccount(data).then(() => refetch());
    toast.success("Thay đổi thông tin thành công");
    setIsModalOpen(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);
  return (
    <>
      <Header></Header>
      <div className="container">
        <div className="mt-14">
          <h1 className="text-[25px] mb-7 font-bold text-center pb-5 relative">
            Tài khoản của bạn
            <div className="absolute w-[60px] h-1 bg-black bottom-0 left-1/2 transform -translate-x-1/2"></div>
          </h1>
          <div className="flex">
            <div className="w-[380px]">
              <h2 className="font-bold uppercase mb-3 text-lg">Tài khoản</h2>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account" className="font-bold">
                  Thông tin tài khoản
                </Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/orders">Đơn hàng đã đặt</Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/ordersReturn">
                  Yêu cầu đổi trả
                </Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/addresses">Danh sách địa chỉ</Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/password">Thay đổi mật khẩu</Link>
              </div>
            </div>
            <div className="w-[1130px]">
              <div className="mb-[140px]">
                <h2 className="uppercase text-lg font-bold mb-2">
                  Thông tin tài khoản
                </h2>
                <div className="border-t border-gray-200 py-3">
                  <h2 className="font-semibold mb-2">
                    Họ tên: {InfoUser?.fullname}
                  </h2>
                  <p className="text-[15px] mb-2">Email: {InfoUser?.email}</p>
                  <p className="text-[15px] mb-2">
                    Địa chỉ: 64 Phú Diễn, Bắc Từ Liêm, Hà Nội
                  </p>
                  <p className="text-[15px] mb-2">
                    Số diện thoại: {user?.current?.phone}
                  </p>

                  <Button
                    type="primary"
                    onClick={showModal}
                    className="bg-blue-500"
                  >
                    Thay đổi thông tin
                  </Button>
                  <Modal
                    title="Basic Modal"
                    open={isModalOpen}
                    onOk={handleSubmit(onUpdateAccount)}
                    onCancel={handleCancel}
                    okButtonProps={{ className: "text-white bg-blue-500" }}
                  >
                    <form
                      className="max-w-sm"
                      onSubmit={handleSubmit(onUpdateAccount)}
                    >
                      <input type="hidden" {...register("_id")} />
                      <div className="mb-5">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                        >
                          Tên của bạn
                        </label>
                        <input
                          {...register("fullname")}
                          type="text"
                          id="fullname"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                        <p className="text-red-500 italic text-sm">
                          {errors ? errors.fullname?.message : ""}
                        </p>
                      </div>
                      <div className="mb-5">
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                        >
                          Email của bạn
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                        <p className="text-red-500 italic text-sm">
                          {errors ? errors.email?.message : ""}
                        </p>
                      </div>
                    </form>
                  </Modal>
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

export default myAccount;
