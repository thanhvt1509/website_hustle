import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, useEffect, useState } from "react";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetInfoUserQuery,
  useUpdateAddressMutation,
} from "../../../store/user/user.service";
import { useForm } from "react-hook-form";
import { AddressForm, AddressSchema } from "../../../Schemas/Auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Button, Modal } from "antd";
import axios from "axios";

const myAddress = () => {
  const [addAddress] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const dispatch: Dispatch<any> = useDispatch();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: yupResolver(AddressSchema),
  });
  const user = useSelector((state: any) => state.user);
  const isLoggedIn = user?.isLoggedIn;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [upadteForm, setUpdateForm] = useState(false);
  const { data: InfoUser } = useGetInfoUserQuery(user?.current?._id);

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/");
    }
  }, [navigate]);

  const onAddAddress = async (data: AddressForm) => {
    try {
      await addAddress(data), console.log(data);

      toast.success("Them dia chi thanh cong");
      setIsModalOpen(false);
      await useGetInfoUserQuery(user.current.id);
    } catch (error) {
      console.log(error);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      await deleteAddress(id);
      toast.success("Xóa địa chỉ thành công");
      await useGetInfoUserQuery(user.current.id);
    } catch (error) {
      console.log(error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModalUpdate = () => {
    {
      setIsModalUpdateOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  // const [city, setCity] = useState('')

  // const getApiProvinces = async () => {
  //   const { data } = await axios.get('https://provinces.open-api.vn/api')
  //   setCity(data)
  // }

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWards] = useState("");
  const [selectedNameProvince, setSelectedNameProvince] = useState("");
  const [selectedNameDistrict, setSelectednameDistrict] = useState("");
  const [selectedNameWard, setSelectednameWard] = useState("");
  // console.log(myProvince);

  useEffect(() => {
    // Gọi API để lấy dữ liệu tỉnh/thành phố
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const nameProvince = provinces.find((item) => item.code == provinceCode);
    // myProvince = {
    //   code: nameProvice.code,
    //   name: nameProvince.name
    // }
    setSelectedNameProvince(nameProvince.name);

    setSelectedProvince(provinceCode);

    // Gọi API để lấy dữ liệu quận/huyện dựa trên tỉnh/thành phố được chọn
    axios
      .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((response) => setDistricts(response.data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);

    const nameDistrict = districts.districts.find(
      (item) => item.code == districtCode
    );
    setSelectednameDistrict(nameDistrict.name);

    // Gọi API để lấy dữ liệu xã/phường dựa trên quận/huyện được chọn
    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((response) => setWards(response.data))
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWards(wardCode);

    const nameWard = wards.wards.find((item) => item.code == wardCode);
    setSelectednameWard(nameWard.name);
  };

  useEffect(() => {
    setValue("myProvince", selectedNameProvince);
  }, [selectedNameProvince]);
  useEffect(() => {
    setValue("myDistrict", selectedNameDistrict);
  }, [selectedNameDistrict]);
  useEffect(() => {
    setValue("myWard", selectedNameWard);
  }, [selectedNameWard]);

  const getAddress = async (id: string) => {
    showModalUpdate();
    const addressUpdate = await InfoUser?.addresses?.find(
      (address: any) => address._id == id
    );
    setValue("address", addressUpdate.address),
      setValue("_id", addressUpdate._id),
      setValue("fullname", addressUpdate.fullname),
      setValue("phone", addressUpdate.phone);
    setValue("myProvince", addressUpdate.myProvince);
    setValue("myDistrict", addressUpdate.myDistrict);
    setValue("myWard", addressUpdate.myWard);
    const provinceCode = provinces.find(
      (item) => item.name == addressUpdate.myProvince
    );
    setSelectedProvince(provinceCode.code);

    // Lấy districts dựa trên provinceCode
    const response1 = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode.code}?depth=2`
    );
    console.log(response1.data);

    // Lưu districts vào state
    setDistricts(response1.data);

    // Tìm districtCode dựa trên tên quận/huyện (addressUpdate.myDistrict)
    const districtCode = response1.data.districts.find(
      (item) => item.name == addressUpdate.myDistrict
    );
    console.log(districtCode.code);
    console.log(districtCode);

    // Lưu districtCode vào state hoặc biến khác để sử dụng sau này
    setSelectedDistrict(districtCode.code);

    // Kiểm tra xem selectedDistrictCode đã được xác định chưa
    // Sử dụng districtCode để lấy thông tin wards
    const response2 = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode.code}?depth=2`
    );

    console.log(response2.data);

    // Lưu thông tin wards vào state
    setWards(response2.data);

    // Tìm wardCode dựa trên tên phường/xã (addressUpdate.myWard)
    const wardCode = response2.data.wards.find(
      (item) => item.name == addressUpdate.myWard
    ).code;

    // Lưu wardCode vào state hoặc biến khác để sử dụng sau này
    setSelectedWards(wardCode);

    // await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode.code}?depth=2`)
    //   .then(response => {
    //     console.log(response.data);

    //     setDistricts(response.data)

    //     const districtCode = response.data.districts.find((item) => item.name == addressUpdate.myDistrict)
    //     console.log(districtCode.code);

    //     setSelectedDistrict(districtCode.code)

    //   })
    //   .catch(error => console.error('Error fetching districts:', error));
    // console.log(districts);

    // const districtCode = districts.find((item) => item.name == addressUpdate.myDistrict)
    // console.log(districtCode);

    // // setSelectedProvince(districtCode.code)
    // console.log(selectedDistrict);

    // if (selectedDistrict) {

    //   await axios.get(`https://provinces.open-api.vn/api/p/${selectedDistrict}?depth=2`)
    //     .then(response => {
    //       setWards(response.data)

    //       // const districtCode = response.data.districts.find((item) => item.name == addressUpdate.myDistrict)
    //       // console.log(districtCode);

    //       setSelectedWards(response.data.wards.find((item) => item.name == addressUpdate.myWard).code)
    //     })
    //     .catch(error => console.error('Error fetching districts:', error));
    // }
  };

  const [updateUserAddress] = useUpdateAddressMutation();

  const updateAddress = async (data: AddressForm) => {
    await updateUserAddress(data);
    // console.log(data);

    toast.success("Sửa đổi địa chỉ thành công");
    setIsModalUpdateOpen(false);
    await useGetInfoUserQuery(user.current.id);
  };

  useEffect(() => {
    setValue("address", ""), setValue("fullname", ""), setValue("phone", "");
  }, [isModalUpdateOpen, isModalOpen]);

  return (
    <>
      <Header></Header>
      <div className="container">
        <div className="mt-14">
          <h1 className="text-[25px] mb-7 font-bold text-center pb-5 relative">
            Thông tin địa chỉ
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
                <Link to="/account">Thông tin tài khoản</Link>
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
                <Link to="/account/addresses" className="font-bold">
                  Danh sách địa chỉ
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
                <Link to="/account/password">Thay đổi mật khẩu</Link>
              </div>
            </div>
            <div className="w-[1130px]">
              <div className=" mb-[20px] grid grid-cols-3 gap-[24px]">
                {InfoUser?.addresses?.map((item: any, index) => {
                  return (
                    <Link
                      to={""}
                      className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 mb-[16px]"
                    >
                      <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                      <div className="sm:flex sm:justify-between sm:gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                            Thông tin nhận hàng
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="max-w-[40ch] text-sm text-gray-500 font-bold">
                          Người nhận:
                        </p>
                        <p className="max-w-[40ch] text-sm text-gray-500">
                          {item.fullname}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="max-w-[40ch] text-sm text-gray-500 font-bold">
                          Địa chỉ nhận hàng:
                        </p>
                        <p className="max-w-[40ch] text-sm text-gray-500">
                          {item.address}, <br />
                          {item.myWard},<br />
                          {item.myDistrict},<br />
                          {item.myProvince}
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className="max-w-[40ch] text-sm text-gray-500 font-bold">
                          Số điện thoại:
                        </p>
                        <p className="max-w-[40ch] text-sm text-gray-500">
                          {item.phone}
                        </p>
                      </div>
                      <Button
                        type="primary"
                        onClick={(id) => getAddress(item._id)}
                        className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                        title="Edit Product"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </Button>
                      <button
                        className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                        title="Delete Product"
                        onClick={() => removeAddress(item._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </Link>
                  );
                })}
                <Modal title="Basic Modal" open={isModalUpdateOpen} onOk={handleSubmit(updateAddress)} onCancel={handleCancelUpdate} okButtonProps={{ className: "text-white bg-blue-500" }}>
                  <form className="" onSubmit={handleSubmit(updateAddress)}>
                    <input type="hidden" {...register('_id')} name="_id" />
                    <div className="mb-5">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                      >
                        Người nhận hàng
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
                        Số điện thoại
                      </label>
                      <input
                        {...register("phone")}
                        type="text"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <p className="text-red-500 italic text-sm">
                        {errors ? errors.phone?.message : ""}
                      </p>
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="countries"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                      >
                        Tỉnh/Thành phố:
                      </label>
                      <select
                        onChange={handleProvinceChange}
                        value={selectedProvince}
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {" "}
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="countries"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                      >
                        Quận/Huyện:
                      </label>
                      <select
                        onChange={handleDistrictChange}
                        value={selectedDistrict}
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Chọn quận/huyện</option>
                        {districts?.districts?.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="countries"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                      >
                        Chọn xã/phường:
                      </label>
                      <select
                        onChange={handleWardChange}
                        value={selectedWard}
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Chọn xã phường</option>
                        {wards?.wards?.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-5">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                      >
                        Địa chỉ nhận hàng
                      </label>
                      <input
                        {...register("address")}
                        type="text"
                        id="address"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      />
                      <p className="text-red-500 italic text-sm">
                        {errors ? errors.address?.message : ""}
                      </p>
                    </div>
                    {/* <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button> */}
                  </form>
                </Modal>
              </div>
              <Button
                type="primary"
                onClick={showModal}
                className="bg-blue-500 mb-[100px]"
              >
                Thêm địa chỉ
              </Button>
              <Modal title="Basic Modal" open={isModalOpen} onOk={handleSubmit(onAddAddress)} onCancel={handleCancel} okButtonProps={{ className: "text-white bg-blue-500" }}>
                <form className="" onSubmit={handleSubmit(onAddAddress)}>
                  <div className="mb-5">
                    <label
                      htmlFor="fullname"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                    >
                      Người nhận hàng
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
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                    >
                      Số điện thoại
                    </label>
                    <input
                      {...register("phone")}
                      type="text"
                      id="phone"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    <p className="text-red-500 italic text-sm">
                      {errors ? errors.phone?.message : ""}
                    </p>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="countries"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                    >
                      Tỉnh/Thành phố:
                    </label>
                    <select
                      onChange={handleProvinceChange}
                      value={selectedProvince}
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {" "}
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="countries"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                    >
                      Quận/Huyện:
                    </label>
                    <select
                      onChange={handleDistrictChange}
                      value={selectedDistrict}
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts?.districts?.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="countries"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                    >
                      Chọn xã/phường:
                    </label>
                    <select
                      onChange={handleWardChange}
                      value={selectedWard}
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Chọn xã phường</option>
                      {wards?.wards?.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900"
                    >
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      {...register("address")}
                      type="text"
                      id="address"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    <p className="text-red-500 italic text-sm">
                      {errors ? errors.address?.message : ""}
                    </p>
                  </div>
                </form>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default myAddress;
