import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../../layout/Header";
import Footer from "../../../layout/Footer";
import {
  useGetOneOrderQuery,
  useUpdateOrderMutation,
} from "../../../store/order/order.service";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, useEffect, useState } from "react";
import {
  useListOrderDetailQuery,
  useUpdateOrderDetailMutation,
} from "../../../store/orderDetail/orderDetail.service";
import { listOrderDetailSlice } from "../../../store/orderDetail/orderDetailSlice";
import {
  useGetOneProductDetailQuery,
  useListProductDetailQuery,
} from "../../../store/productDetail/productDetail.service";
import {
  useFetchListProductQuery,
  useFetchOneProductQuery,
} from "../../../store/product/product.service";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import { listProductSlice } from "../../../store/product/productSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  orderReturnForm,
  orderReturnSchema,
} from "../../../Schemas/OrderReturn";
import { useAddOrderReturnMutation } from "../../../store/orderReturn/order.service";
import { useForm } from "react-hook-form";
import { ReviewForm, ReviewSchema } from "../../../Schemas/Review";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Form,
  Modal,
  Rate,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
  notification,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  FormOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useAddReviewMutation } from "../../../store/reviews/review.service";
import { RootState } from "../../../store";

function formatDateStringToDisplayDate(dateString: any) {
  const originalDate = new Date(dateString);

  const day = originalDate.getDate();
  const month = originalDate.getMonth() + 1;
  const year = originalDate.getFullYear();
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();

  let amPm = "SA";
  if (hours >= 12) {
    amPm = "CH";
  }

  const formattedDate = `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""
    }${month}/${year}, ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? "0" : ""
    }${minutes}${amPm}`;
  return formattedDate;
}

function mapStatusToText(statusCode: any) {
  switch (statusCode) {
    case 0:
      return "Hủy đơn hàng";
    case 1:
      return "Chờ xử lý";
    case 2:
      return "Chờ lấy hàng";
    case 3:
      return "Đang giao";
    case 4:
      return "Đã nhận hàng";
    case 5:
      return "Hoàn thành";
    case 6:
      return "Yêu cầu đổi hàng";
    default:
      return "Trạng thái không xác định";
  }
}

function mapStatusPaymentToText(statusCode: any) {
  switch (statusCode) {
    case 0:
      return "Chưa thanh toán";
    case 1:
      return "Đã thanh toán";
    default:
      return "Trạng thái không xác định";
  }
}

const OrderDetail = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {
    setValue,
    formState: { errors },
  } = useForm<ReviewForm>({
    resolver: yupResolver(ReviewSchema),
  });
  const [countUpload, setCountUpload] = useState([0]);

  const user = useSelector((state: any) => state.user);
  useEffect(() => {
    if (user) {
      setValue("user_id", user?.current?._id);
    }
  }, [user]);
  const isLoggedIn = user?.isLoggedIn;
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/");
    }
  }, [navigate]);

  const { id } = useParams();
  const { data: order } = useGetOneOrderQuery(id!);

  const [showCancelButton, setShowCancelButton] = useState(true);
  const [showReturnButton, setShowReturnButton] = useState(true);

  useEffect(() => {
    if (order && order.createdAt) {
      // Tính thời gian hiện tại
      const currentTime = new Date();

      // Tính thời gian trôi qua kể từ khi tạo đơn hàng
      const timeElapsed = currentTime - new Date(order.createdAt);

      // Kiểm tra xem đã qua 30 phút chưa
      const showCancelButton = timeElapsed <= 30 * 60 * 1000;
      const showReturnButton = timeElapsed <= 10 * 24 * 60 * 60 * 1000;
      console.log(showReturnButton);

      setShowCancelButton(showCancelButton);
      setShowReturnButton(showReturnButton);
    }
  }, [order]);



  const { data: listOrderDetail, isSuccess: isSuccessListOrder } =
    useListOrderDetailQuery();
  const { data: listProductDetail, isSuccess: isSuccessListProductDetail } =
    useListProductDetailQuery();
  const { data: listProduct, isSuccess: isSuccessProduct } =
    useFetchListProductQuery();
  const [onaddReviews] = useAddReviewMutation();
  useEffect(() => {
    if (listOrderDetail) {
      dispatch(listOrderDetailSlice(listOrderDetail));
    }
  }, [isSuccessListOrder, isModalOpen]);
  useEffect(() => {
    if (listProductDetail) {
      dispatch(listProductDetailSlice(listProductDetail));
    }
  }, [isSuccessListProductDetail]);
  useEffect(() => {
    if (listProduct) {
      dispatch(listProductSlice(listProduct));
    }
  }, [isSuccessProduct]);

  const [updateOrder] = useUpdateOrderMutation();

  const [imageList, setImageList] = useState<any[]>([]);

  const handleImageChange = (info: any) => {
    if (info.file.status === "done") {
      const imageUrl = info.file.response[0].url;
      setImageList([...imageList, imageUrl]);
    }
  };

  const handleImageProductRemove = (file: any) => {
    console.log(file);

    console.log(file.response[0].url);

    const updatedImageList = imageList.filter(
      (url) => url !== file.response[0].url
    );
    setImageList(updatedImageList);
  };

  const productDetailState = useSelector(
    (state: RootState) => state.productDetailSlice.productDetails
  );
  const productState = useSelector(
    (state: RootState) => state.productSlice.products
  );
  const listOrderDetailState = useSelector(
    (state: RootState) => state.orderDetailSlice.orderDetails
  );

  const orderDetailIds = order?.orderDetails.map(
    (orderDetail: any) => orderDetail?._id
  );
  const productsInOrder = listOrderDetailState?.filter((orderDetail: any) =>
    orderDetailIds?.includes(orderDetail._id)
  );

  let totalProductPrice = 0;
  productsInOrder?.forEach((product: any) => {
    totalProductPrice += product.totalMoney;
  });
  const handleCancelOrder = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này")) {
      try {
        const updatedOrder = { ...order, status: 0 };
        await updateOrder({ id: id, ...updatedOrder });
        toast.success("Hủy đơn hàng thành công");
      } catch (error) {
        console.error("Lỗi khi thực hiện hủy đơn hàng: ", error);
      }
    }
  };

  const handleConfirmReceived = async () => {
    Swal.fire({
      title: "Bạn đã nhận được hàng chưa?",
      showCancelButton: true,
      confirmButtonText: "Đã nhận hàng",
      cancelButtonText: "Chưa nhận hàng",
      icon: "question",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedOrder = { ...order, status: 4 };
          await updateOrder({ id: id, ...updatedOrder });
          toast.success("Xác thực đơn hàng thành công");
        } catch (error) {
          console.error("Lỗi khi xác thực đơn hàng: ", error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        try {
          const updatedOrder = { ...order, status: 3 };
          await updateOrder({ id: id, ...updatedOrder });
        } catch (error) {
          console.error("Lỗi khi chuyển trạng thái về chưa nhận hàng: ", error);
        }
      }
    });
  };
  const [idProduct, setIdProduct] = useState<string>("");
  const [idProductDetail, setIdProductDetail] = useState<string>("");
  const { data: getOneProduct } = useFetchOneProductQuery(idProduct!);
  const { data: getOneProductDetail } = useGetOneProductDetailQuery(
    idProductDetail!
  );
  const [orderDetailId, setOrderDetailId] = useState<string>("");
  const showModal = (
    id: string,
    idProDetail: string,
    orderDetailId: string
  ) => {
    if (id) {
      setIdProduct(id);
      if (orderDetailId) {
        setOrderDetailId(orderDetailId);
      }
      setIdProductDetail(idProDetail);
      setValue("product_id", id);
    }
    setIsModalOpen(true);
  };

  const [isModalOrderOpen, setIsModalOrderOpen] = useState(false);
  const showOrderModal = () => {
    setIsModalOrderOpen(true);
  };
  const handleOrderCancel = () => {
    setIsModalOrderOpen(false);
  };

  const {
    register: registerOrder,
    setValue: setOrderValue,
    handleSubmit: handleOrderSubmit,
    formState: { errors: OrderErrors },
  } = useForm<orderReturnForm>({
    resolver: yupResolver(orderReturnSchema),
  });

  const [addOrderReturn] = useAddOrderReturnMutation()
  const [updatedOrder] = useUpdateOrderMutation()

  // const [addReason, setAddReason] = useState(false)
  // const handleReasonChange = async (e) => {
  //   setAddReason(true);
  // };
  const [showInput, setShowInput] = useState(false);

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    if (selectedValue !== "khác") {
      setOrderValue('reason', selectedValue)
    }
    setShowInput(selectedValue === "khác");
  };
  const onAddOrderReturn = async (data: orderReturnForm) => {
    const image = imageList;
    const value = { ...data, images: image };
    console.log(value);
    let count = 0;
    value.orderDetailIds?.forEach((item) => {
      if (item.quantity == 0) {
        count += 1
      }
    })
    if (count === data.orderDetailIds.length) {
      toast.success('Vui lòng chọn số lượng sản phẩm để trả hàng')
    } else {
      await addOrderReturn(value)
      await updatedOrder({ id: id, status: 6 })
      toast.success('Trả hàng thành công vui lòng đợi xác nhận')
      setIsModalOrderOpen(false);
    }
  }

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [onupdateOrderDetail] = useUpdateOrderDetailMutation();

  const onFinish = async (values: any) => {
    const imageObjects = fileList.map((file) => ({
      url: file.response[0].url,
      publicId: file.response[0].publicId,
    }));
    values.images = imageObjects;
    if (idProduct && user?.current?._id && getOneProductDetail) {
      const valuesData = {
        ...values,
        color: getOneProductDetail.nameColor,
        size: getOneProductDetail.size,
        userId: user.current._id,
        productId: idProduct,
      };
      await onaddReviews(valuesData);
      if (orderDetailId) {
        await onupdateOrderDetail({
          _id: orderDetailId,
          order: { isReviewed: true },
        });
      }
      navigate(`/products/${idProduct}`);
      Swal.fire({
        title: "Cảm ơn bạn đã đánh giá !",
        icon: "success",
      });
      setIsModalOpen(false);
    }
  };

  const props: UploadProps = {
    listType: "picture-card",
    name: "images",
    multiple: true,
    action: " http://localhost:8080/api/images/upload",
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    setCountUpload(newFileList.length);
  };
  const handleRemoveImage = async (file: UploadFile) => {
    console.log(file);
    try {
      await axios.delete(
        `http://localhost:8080/api/images/remove/${file.response[0].publicId}`
      );
      notification.success({
        message: "Xóa ảnh thành công",
        duration: 5,
        closeIcon: true,
      });
    } catch (error) { }
  };
  const [provinces, setProvinces] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [wards, setWards] = useState<any>([]);
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

  const handleProvinceChange = (e: any) => {
    const provinceCode = e.target.value;
    const nameProvince: any = provinces.find((item: any) => item.code == provinceCode);

    setSelectedNameProvince(nameProvince.name);

    setSelectedProvince(provinceCode);

    // Gọi API để lấy dữ liệu quận/huyện dựa trên tỉnh/thành phố được chọn
    axios
      .get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then((response) => setDistricts(response.data))
      .catch((error) => console.error("Error fetching districts:", error));
  };

  const handleDistrictChange = (e: any) => {
    const districtCode: any = e.target.value;
    setSelectedDistrict(districtCode);

    const nameDistrict = districts.districts.find(
      (item: any) => item.code == districtCode
    );
    setSelectednameDistrict(nameDistrict.name);

    // Gọi API để lấy dữ liệu xã/phường dựa trên quận/huyện được chọn
    axios
      .get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then((response) => setWards(response.data))
      .catch((error) => console.error("Error fetching wards:", error));
  };

  const handleWardChange = (e: any) => {
    const wardCode = e.target.value;
    setSelectedWards(wardCode);

    const nameWard = wards.wards.find((item: any) => item.code == wardCode);
    setSelectednameWard(nameWard.name);
  };

  useEffect(() => {
    setOrderValue("address.myProvince", selectedNameProvince);
  }, [selectedNameProvince]);
  useEffect(() => {
    setOrderValue("address.myDistrict", selectedNameDistrict);
  }, [selectedNameDistrict]);
  useEffect(() => {
    setOrderValue("address.myWard", selectedNameWard);
  }, [selectedNameWard]);

  return (
    <>
      <Header></Header>
      <div className="container">
        {/* <Rate /> */}
        <div className="mt-14">
          <h1 className="text-[25px] mb-7 font-bold text-center pb-5 relative">
            Chi tiết đơn hàng
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
                <Link to="/account/ordersReturn">Yêu cầu đổi trả</Link>
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
                <div className="mb-7 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      ĐƠN HÀNG: #{id}
                    </h3>
                    <p className="text-sm cursor-pointer mb-3">
                      Đặt lúc —{" "}
                      {formatDateStringToDisplayDate(order?.createdAt)}
                    </p>
                    <h1 className="mb-3">
                      Trạng thái đơn hàng:{" "}
                      <span className="text-lg font-bold">
                        {mapStatusToText(order?.status)}
                      </span>
                    </h1>
                    {order?.status === 3 && (
                      <p>
                        Nếu bạn đã nhận được hàng, vui lòng ấn vào{" "}
                        <button
                          onClick={handleConfirmReceived}
                          className="text-blue-500 underline"
                        >
                          xác thực đơn hàng
                        </button>
                      </p>
                    )}
                    {(order?.status === 4 || order?.status === 5) && showReturnButton ? (
                      <div className="">

                        <Button
                          type="primary"
                          onClick={showOrderModal}
                          className="text-white mr-1 bg-blue-700"
                        >
                          Đổi hàng
                        </Button>
                        <Tooltip title="Bạn chỉ gửi yêu cầu đổi hàng trong 10 ngày tính từ lúc đặt hàng " color={'blue'} key={'blue'}>
                          <InfoCircleOutlined className='text-blue-500' />
                        </Tooltip>
                      </div>
                    ) : null}
                  </div>
                  <Modal
                    title={
                      <h1 className="text-lg border-b py-3 text-blue-500">
                        YÊU CẦU ĐỔI HÀNG
                      </h1>
                    }
                    centered
                    open={isModalOrderOpen}
                    onOk={handleOrderSubmit(onAddOrderReturn)}
                    okButtonProps={{ className: "text-white bg-blue-500" }}
                    onCancel={handleOrderCancel}
                    width={1000}
                    okText="Gửi yêu cầu"
                    cancelText="Hủy"
                  >
                    <form
                      className=" mx-auto"
                      onSubmit={handleOrderSubmit(onAddOrderReturn)}
                    >
                      <input
                        type="hidden"
                        value={user.current._id}
                        {...registerOrder("userId")}
                        id="userId"
                        className=""
                      />
                      <input
                        type="hidden"
                        value={order?._id}
                        {...registerOrder("orderId")}
                        id="orderId"
                      />
                      <div className="flex justify-between space-x-5 my-5">
                        <div className="w-3/5">
                          <div className="mb-3">
                            <label htmlFor="reason" className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray">
                              <span className="text-sm text-red-500 mr-1">*</span>Lý do đổi hàng
                            </label>
                            <select onClick={handleSelectChange} id="reason" className="bg-gray-50 p-[6px] border border-gray-300 outline-none text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              <option value="">Chọn lý do</option>
                              <option value="Không đúng kích, màu sắc">Không đúng kích thước, màu sắc</option>
                              <option value="Không đúng mẫu">Không đúng mẫu</option>
                              <option value="khác" >Khác..</option>
                            </select>
                            <p className="text-red-500 italic text-sm">{OrderErrors ? OrderErrors.reason?.message : ""}</p>
                          </div>
                          {showInput && (
                            <div className="mb-5" id="addreason">
                              <label htmlFor="small-input" className="block mb-2 text-sm font-medium  text-gray-900 dark:text-gray">Lý do cụ thể</label>
                              <input
                                type="text"
                                {...registerOrder("reason")}
                                id="reason"
                                className="block w-full p-2 text-gray-900 border outline-none border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              />
                              <p className="text-red-500 italic text-sm">{OrderErrors ? OrderErrors.reason?.message : ""}</p>
                            </div>
                          )}
                          <details className="pb-2 overflow-hidden [&_summary::-webkit-details-marker]:hidde">
                            <summary
                              className="flex w-[250px] cursor-pointer p-2 transition"
                            >
                              <span className="text-sm text-blue-500">Ghi chú <FormOutlined /></span>
                            </summary>
                            <div className="pt-3">
                              <div className="mb-5">
                                <textarea rows={3} {...registerOrder("note")} id="note" className="block w-full p-2 outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                {/* <p className="text-red-500 italic text-sm">{OrderErrors ? OrderErrors.reason?.message : ""}</p> */}
                              </div>
                            </div>
                          </details>

                          <div className="border rounded-sm">
                            <div className="flex items-center space-x-1 border-b py-3 px-3">
                              <h3 className="font-medium">Mô tả</h3>
                              <Tooltip
                                style={{ width: 500 }}
                                title={
                                  <span className="tooltip-content">
                                    <h1 className="mb-4 text-lg font-bold">Một số lưu ý:</h1>
                                    <div className="container">
                                      <ul className="list-disc pl-6">
                                        <li className="mb-2">Hình ảnh/video rõ nét, không mờ, nhòe</li>
                                        <li className="mb-2">Chụp cận cảnh lỗi của sản phẩm</li>
                                        <li className="mb-2">Cung cấp hình ảnh hóa đơn</li>
                                      </ul>
                                    </div>
                                  </span>
                                }
                                color="blue"
                                key={'blue'}
                              >
                                <InfoCircleOutlined className='text-blue-500' />
                              </Tooltip>
                            </div>
                            <Form
                              form={form}
                              name="validateOnly"
                              layout="vertical"
                              autoComplete="off"
                              // onFinish={uploadFile}
                              className="py-3 pb-1 "
                            >
                              <Form.Item
                                name="productImages"
                                // label="Ảnh Sản phẩm"
                                className="relative mb-0 pl-1"
                                rules={[
                                  { required: true, message: "Không được để trống" },

                                ]}
                              >
                                <Upload
                                  className=""
                                  name="productImages"
                                  {...props}
                                  onChange={handleImageChange}
                                  onRemove={handleImageProductRemove}
                                  maxCount={4}
                                >
                                  <div>
                                    <PlusOutlined />
                                    <div>Upload </div>
                                  </div>
                                </Upload>
                              </Form.Item>
                            </Form>
                          </div>
                          <div className="mb-5">
                            {/* <label
                              htmlFor="small-input"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray"
                            >
                              Sản phẩm trả hàng
                            </label> */}
                            <div className="relative overflow-x-auto my-3 border rounded-sm">
                              <h3 className="font-medium p-3 py-5">SẢN PHẨM YÊU CẦU ĐỔI TRẢ</h3>
                              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-sm uppercase border-b-2 border-black bg-gray-50">
                                  <tr>
                                    <th scope="col" className="font-medium py-3 px-2 text-[13px]">
                                      Sản phẩm
                                    </th>
                                    <th scope="col" className="font-medium py-3 px-2 text-[13px]">
                                      Đơn giá
                                    </th>
                                    <th scope="col" className="font-medium py-3 px-2 text-[13px] text-center">
                                      SL
                                    </th>
                                    <th scope="col" className="font-medium py-3 px-2 text-[13px]">
                                      Thành tiền
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {productsInOrder.map((product: any, index: any) => {
                                    return (
                                      <>
                                        {
                                          productDetailState
                                            ?.filter(
                                              (proDetail: any) =>
                                                proDetail._id === product.productDetailId
                                            )
                                            .map((item: any) => {
                                              return (
                                                <>
                                                  {productState
                                                    ?.filter(
                                                      (prod: any) => prod._id === item.product_id
                                                    )
                                                    .map((pro: any) => (

                                                      <tr className="bg-white ">
                                                        <input type="hidden" {...registerOrder(`orderDetailIds.${index}.productDetailId`)} value={item._id} className="" />
                                                        <input type="hidden" {...registerOrder(`orderDetailIds.${index}.orderDetailId`)} value={product._id} className="" />
                                                        <input type="hidden" {...registerOrder(`orderDetailIds.${index}.color`)} value={product.color} className="" />
                                                        <input type="hidden" {...registerOrder(`orderDetailIds.${index}.size`)} value={product.size} className="" />
                                                        <input type="hidden" {...registerOrder(`orderDetailIds.${index}.price`)} value={product.price} className="" />
                                                        <th
                                                          scope="row"
                                                          className="py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-x-5 px-2 pr-3"
                                                        >
                                                          <img
                                                            src={item.imageColor}
                                                            alt={pro.title}
                                                            className="w-[58px] h-[78px] object-cover"
                                                          />
                                                          <div className="overflow-hidden">
                                                            <p className="mb-2 text-[13px] overflow-hidden text-ellipsis">
                                                              {pro.title}
                                                            </p>
                                                            <p className="text-xs font-normal text-blue-500">
                                                              {product.color} / {product.size}
                                                            </p>
                                                          </div>
                                                        </th>
                                                        <td className="px-2 py-4 text-[13px]">
                                                          {product.price.toLocaleString(
                                                            "vi-VN"
                                                          )}
                                                          ₫
                                                        </td>
                                                        <td className="px-3 py-4 text-xs">
                                                          <div className="relative flex items-center max-w-[8rem] space-x-1">
                                                            <input type="number" {...registerOrder(`orderDetailIds.${index}.quantity`)}
                                                              className="border p-1 outline-none rounded-md border-gray-300" onChange={(e) => e.target.value} defaultValue={0} placeholder="0" min={0} max={product.quantity} onKeyDown={(e) => { e.preventDefault() }} />
                                                            <span> /{product.quantity}</span>
                                                          </div>
                                                        </td>
                                                        <td className="px-2 py-4 text-[13px] text-end">
                                                          {product.totalMoney.toLocaleString(
                                                            "vi-VN"
                                                          )}
                                                          ₫
                                                        </td>
                                                      </tr>
                                                    ))}
                                                </>
                                              );
                                            })}
                                      </>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="w-2/5 ">
                          <div className="border rounded-sm">
                            <div className="border-b">
                              <h3 className=" p-3 font-medium">
                                Thông tin giao hàng
                              </h3>
                            </div>
                            <div className="p-3">
                              <div className="mb-3">
                                <label
                                  htmlFor="large-input"
                                  className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray"
                                >
                                  <span className="text-sm text-red-500">*</span> Họ tên người
                                </label>
                                <input
                                  {...registerOrder("fullName")}
                                  placeholder="Nhập họ tên"
                                  type="text"
                                  id="fullName"
                                  className="block w-full p-2 text-gray-900 border outline-none border-gray-300 rounded-md bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <p className="text-red-500 italic text-[13px]">
                                  {OrderErrors ? OrderErrors.fullName?.message : ""}
                                </p>
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="base-input"
                                  className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray"
                                >
                                  <span className="text-sm text-red-500">*</span> Số điện thoại
                                </label>
                                <input
                                  type="text"
                                  {...registerOrder("phoneNumber")}
                                  placeholder="Nhập số điện thoại"
                                  id="phoneNumber"
                                  className="block w-full p-2 text-gray-900 outline-none border border-gray-300 rounded-md bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <p className="text-red-500 italic text-[13px]">
                                  {OrderErrors ? OrderErrors.phoneNumber?.message : ""}
                                </p>
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="countries"
                                  className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray"
                                >
                                  <span className="text-sm text-red-500">*</span>  Tỉnh/Thành phố:
                                </label>
                                <select
                                  onChange={handleProvinceChange}
                                  value={selectedProvince}
                                  id="countries"
                                  className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-[13px] rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-[6px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                  <option value="">Chọn tỉnh/thành phố</option>
                                  {provinces.map((province: any) => (
                                    <option key={province.code} value={province.code}>
                                      {" "}
                                      {province.name}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-red-500 italic text-[13px]">
                                  {OrderErrors
                                    ? OrderErrors.address?.myProvince?.message
                                    : ""}
                                </p>
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="countries"
                                  className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray"
                                >
                                  <span className="text-sm text-red-500">*</span> Quận/Huyện:
                                </label>
                                <select
                                  onChange={handleDistrictChange}
                                  value={selectedDistrict}
                                  id="countries"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 outline-none text-[13px] rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-[6px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                  <option value="">Chọn quận/huyện</option>
                                  {districts?.districts?.map((district: any) => (
                                    <option key={district.code} value={district.code}>
                                      {district.name}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-red-500 italic text-[13px]">
                                  {OrderErrors
                                    ? OrderErrors.address?.myDistrict?.message
                                    : ""}
                                </p>
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="countries"
                                  className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray"
                                >
                                  <span className="text-sm text-red-500">*</span>  Xã/phường:
                                </label>
                                <select
                                  onChange={handleWardChange}
                                  value={selectedWard}
                                  id="countries"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 outline-none text-[13px] rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-[6px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                  <option value="">Chọn xã phường</option>
                                  {wards?.wards?.map((ward: any) => (
                                    <option key={ward.code} value={ward.code}>
                                      {ward.name}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-red-500 italic text-[13px]">
                                  {OrderErrors
                                    ? OrderErrors.address?.myWard?.message
                                    : ""}
                                </p>
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="small-input"
                                  className="block mb-2 text-[13px] font-medium text-gray-900 dark:text-gray"
                                >
                                  <span className="text-sm text-red-500">*</span>  Địa chỉ gửi
                                </label>
                                <input
                                  type="text"
                                  {...registerOrder("address.detailAddress")}
                                  id="address"
                                  className="block w-full p-2 text-gray-900 outline-none border border-gray-300 rounded-md bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <p className="text-red-500 italic text-[13px]">
                                  {OrderErrors
                                    ? OrderErrors.address?.detailAddress?.message
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>



                    </form>
                  </Modal>
                  <div className="text-right">
                    {/* {order?.status !== 4 && order?.status !== 3 && order?.status !== 0 &&
                      order?.paymentStatus && Number(order?.paymentStatus) !== 1 && <button
                        onClick={() => handleCancelOrder(id!)}
                        className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm cursor-pointer px-5 py-2.5 mr-2 mb-2"
                      >
                        Hủy đơn hàng
                      </button>
                    } */}
                    {/* {order?.status === 1 &&
                      Number(order?.paymentStatus) !== 1 ? (
                      <button
                        onClick={() => handleCancelOrder(id!)}
                        className="text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm cursor-pointer px-5 py-2.5 mr-2 mb-2"
                      >
                        Hủy đơn hàng
                      </button>
                    ) : (
                      ""
                    )} */}

                    {showCancelButton && Number(order?.paymentStatus) !== 1 ? (
                      <div className="">
                        <Tooltip title="Bạn chỉ được hủy trong 30 phút tính từ khi đặt hàng" color={'blue'} key={'blue'}>
                          <InfoCircleOutlined className='text-blue-500' />
                        </Tooltip>
                        <button
                          onClick={() => handleCancelOrder(id!)}
                          className="text-white bg-red-500 ml-1 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm cursor-pointer px-5 py-2.5 mr-2 mb-2"
                        >
                          Hủy đơn hàng
                        </button>
                      </div>
                    ) : null}

                    <Link
                      to="/account"
                      className="text-white block bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm cursor-pointer px-5 py-2.5 mr-2 mb-2"
                    >
                      Quay lại trang tài khoản
                    </Link>
                  </div>
                </div>
                <div className="relative overflow-x-auto mb-9 shadow-md sm:rounded-lg">
                  <table className="w-full text-[15px] text-left border-8 border-[#d9edf7]">
                    <thead className="text-sm cursor-pointer uppercase border-b-2 border-black bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Sản phẩm
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Mã sản phẩm
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Đơn giá
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Số lượng
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Thành tiền
                        </th>
                        {(order && order.status === 4) ||
                          order?.status === 5 ? (
                          <th scope="col" className="px-6 py-3">
                            Đánh giá
                          </th>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody>

                      {productsInOrder?.map((product: any) => {
                        return (
                          <>
                            {productDetailState
                              ?.filter(
                                (proDetail: any) =>
                                  proDetail._id === product.productDetailId
                              )
                              .map((item: any) => {
                                return (
                                  <>
                                    {productState
                                      ?.filter(
                                        (prod: any) =>
                                          prod._id === item.product_id
                                      )
                                      .map((pro: any) => (

                                        <tr className="bg-white">
                                          <th
                                            scope="row"
                                            className="font-medium text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                                          >
                                            <Link
                                              to={`/products/${pro._id!}`}
                                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                                            >

                                              <img
                                                src={item.imageColor}
                                                alt={pro.title}
                                                className="w-[58px] h-[78px] object-cover"
                                              />
                                              <div>
                                                <p className="mb-4 max-w-[340px]">
                                                  {pro.title}
                                                </p>
                                                <p>
                                                  {product.color} /{" "}
                                                  {product.size}
                                                </p>
                                              </div>
                                            </Link>
                                          </th>
                                          <td className="px-6 py-4">
                                            {pro?.sku}
                                          </td>
                                          <td className="px-6 py-4">
                                            {product.price.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </td>
                                          <td className="px-6 py-4">
                                            {product.quantity}
                                          </td>
                                          <td className="px-6 py-4">
                                            {product.totalMoney.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </td>

                                          <td>

                                            {(order && order.status === 4 || (order && order.status === 5)) && product.isReviewed === false ? (
                                              <div
                                                onClick={() =>
                                                  showModal(
                                                    pro._id!,
                                                    product.productDetailId!,
                                                    product._id!
                                                  )
                                                }
                                                className="bg-black flex item-center justify-center text-white py-2 mx-3 rounded-[30px] cursor-pointer"
                                              >
                                                Đánh giá
                                              </div>
                                            )
                                              : null}

                                            {(order && order.status === 4) ||
                                              (order && order.status === 5)
                                              ? product.isReviewed === true && (
                                                <div className="bg-gray-300 flex item-center justify-center text-white py-2 mx-3 rounded-[30px] cursor-pointer">
                                                  Đã đánh giá
                                                </div>
                                              )
                                              : null}

                                          </td>
                                        </tr>
                                      ))}

                                  </>
                                );
                              })}
                          </>
                        );
                      })}
                    </tbody>
                    <tbody>
                      <tr className="bg-white border-t">
                        <th
                          scope="row"
                          className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                        >
                          Giá sản phẩm
                        </th>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold">
                          {totalProductPrice.toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th
                          scope="row"
                          className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                        >
                          Giao hàng tận nơi
                        </th>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold">
                          {totalProductPrice >= 500000 || order?.pay_method === "FREE" || order?.orderReturn?.status !== 1 ? (
                            <p>Miễn phí</p>
                          ) : (
                            <p>40.000đ</p>
                          )}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th
                          scope="row"
                          className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                        >
                          Tổng tiền
                        </th>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold">
                          {Number(order?.totalMoney).toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="font-bold text-lg uppercase mb-5">
                    Địa chỉ nhận hàng
                  </h2>
                  <div className="bg-[#d9edf7] text-[#31708f] border border-[#bce8f1] p-3 mb-5 rounded-lg">
                    <p className="mb-2">
                      Tình trạng thanh toán:{" "}
                      {mapStatusPaymentToText(order?.paymentStatus)}
                    </p>
                    <p>Trạng thái đơn hàng: {mapStatusToText(order?.status)}</p>
                  </div>
                  <div>
                    <p className="mb-2">
                      Họ tên:{" "}
                      <span className="font-bold">{order?.fullName}</span>
                    </p>
                    <p className="mb-2">
                      Địa chỉ:{" "}
                      <span className="font-bold">
                        {order?.address.detailAddress},
                      </span>
                      <span className="font-bold">
                        {order?.address.myWard},
                      </span>
                      <span className="font-bold">
                        {order?.address.myDistrict},
                      </span>
                      <span className="font-bold">
                        {order?.address.myProvince}
                      </span>
                    </p>
                    <p className="mb-2">
                      Số điện thoại:{" "}
                      <span className="font-bold">{order?.phoneNumber}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {((order && order.status === 4) || (order && order.status === 5)) && (
            <>
              <Modal
                cancelButtonProps={{ style: { display: "none" } }}
                title="Đánh giá của bạn"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Form
                  name="basic"
                  layout="vertical"
                  style={{ maxWidth: 600 }}
                  onFinish={onFinish}
                >
                  {getOneProduct && getOneProductDetail && (
                    <div className="">
                      <div className="flex pb-3">
                        <img
                          className="h-20"
                          src={getOneProduct.images?.[0]}
                          alt=""
                        />
                        <div className="flex flex-col p-2">
                          <p>{getOneProduct?.title}</p>
                          <div className="">
                            <span className="text-xs text-gray-400 ">
                              Phân loại:{" "}
                            </span>
                            <span className="text-xs text-blue-500">
                              {getOneProductDetail.size}
                            </span>{" "}
                            -{" "}
                            <span className="text-xs text-blue-500">
                              {" "}
                              {getOneProductDetail.nameColor}
                            </span>
                          </div>
                          <div className="flex ">
                            <del className="text-gray-400">
                              {getOneProduct?.price?.toLocaleString("vi-VN")}đ
                            </del>
                            <p className="ml-2">
                              {(
                                getOneProduct?.price - getOneProduct?.discount
                              ).toLocaleString("vi-VN")}
                              đ
                            </p>
                          </div>
                        </div>
                      </div>
                      <Form.Item
                        label="Đánh giá"
                        name="rating"
                        className="text-base"
                        rules={[
                          { required: true, message: "Hãy đánh giá sao" },
                        ]}
                      >
                        <Rate className="text-2xl" />
                      </Form.Item>
                    </div>
                  )}

                  <Form.Item
                    label="Bình luận"
                    name="comment"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập tối thiểu 10 kí tự bạn nhé!",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                  <Form.Item
                    name="images"
                    label="Ảnh đánh giá"
                    className="relative"
                  >
                    <span className="absolute right-0 top-[-22px] text-gray-500 text-sm">
                      {countUpload}/3
                    </span>
                    <Upload
                      name="images"
                      multiple
                      action={"http://localhost:8080/api/images/upload"}
                      fileList={fileList}
                      onChange={handleChange}
                      listType="picture-card"
                      iconRender={() => <LoadingOutlined />}
                      onRemove={(file) => handleRemoveImage(file)}
                      maxCount={3}
                    >
                      <div>
                        <PlusOutlined />
                        <div>Upload </div>
                      </div>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      className="bg-blue-500 w-full py-3 flex items-center justify-center "
                      htmlType="submit"
                    >
                      Viết đánh giá
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default OrderDetail;
