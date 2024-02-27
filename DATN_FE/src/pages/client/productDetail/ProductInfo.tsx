import { Swiper, SwiperSlide } from "swiper/react";
import {
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  CaretRightOutlined
} from '@ant-design/icons';
import { Navigation, Autoplay } from "swiper/modules";
import React, { Dispatch, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetOneProductDetailQuery, useListProductDetailQuery, useUpdateProductDetailMutation } from "../../../store/productDetail/productDetail.service";
import { useFetchListProductQuery, useFetchOneProductByAdminQuery, useFetchOneProductQuery } from "../../../store/product/product.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getOneIdProductDetailSlice, listProductDetailFilter, listProductDetailFilterSlice, listProductDetailRelatedSlice, listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import { useFetchOneCategoryQuery } from "../../../store/category/category.service";
import { listProductRelated, listProductRelatedSlice, listProductSlice } from "../../../store/product/productSlice";
import axios from "axios";
import { useForm } from "react-hook-form";
import { CartSchema, cartForm } from "../../../Schemas/Cart";
import { yupResolver } from "@hookform/resolvers/yup";
import { productDetailForm, productDetailSchema } from "../../../Schemas/ProductDetail";
import { addCartSlice } from "../../../store/cart/cartSlice";
import { useAddCartMutation } from "../../../store/cart/cart.service";
import {
  Avatar,
  Breadcrumb,
  Button,
  Collapse,
  Form,
  Image,
  Input,
  List,
  Modal,
  Rate,
  Skeleton,
  Space,
  message,
} from 'antd';
import type { FormInstance } from 'antd';
import ProductViewed from "./ProductViewed";
import { useFetchListReviewsQuery } from "../../../store/reviews/review.service";
import { listReviewByRate, listReviewByRateFilterSlice, listReviewByRateSlice, listReviewByUserFilterSlice, listReviewSlice } from "../../../store/reviews/reviewSlice";
import { IProductDetail } from "../../../store/productDetail/productDetail.interface";
import moment from "moment";
import { useFetchListOutfitQuery, useFetchOneOutfitQuery } from "../../../store/outfit/outfit.service";
import { listOutfitSlice, listSearchOutfitByProductIdSlice } from "../../../store/outfit/outfitSlice";
import OutfitProductDetail from "./OutfitProductDetail";

const ProductInfo = () => {
  const dispatch: Dispatch<any> = useDispatch()
  const { id } = useParams()

  const productRelated = useSelector((state: RootState) => state.productRelatedSliceReducer.products)
  const productDetailState = useSelector((state: RootState) => state.productDetailSlice.productDetails)
  const productDetailFilterState = useSelector((state: RootState) => state.productDetailFilterSliceReducer.productDetails)
  const productDetailGetOneId = useSelector((state: RootState) => state.productDetailIdReducer.productDetails)

  const listCartState = useSelector((state: RootState) => state.cartSlice.carts)
  const [onAddCart] = useAddCartMutation()
  const [formProductDetailClicked, setFormProductDetailClicked] = useState(false);
  const { data: listReview, isSuccess: isSuccessReview } = useFetchListReviewsQuery()
  const reviewState = useSelector((state: RootState) => state.reviewSlice.reviews)
  const reviewByRateState = useSelector((state: RootState) => state.reviewByRatingReducer.reviews)
  const reviewByRateStateVer = reviewByRateState?.slice().reverse()
  useEffect(() => {
    if (listReview && id) {
      const listReviewByProductId = listReview?.filter((review) => review?.productId && review?.productId?.includes(id))
      dispatch(listReviewSlice(listReviewByProductId))
      dispatch(listReviewByRateSlice(listReviewByProductId))
    }
  }, [isSuccessReview, id])
  const navigate = useNavigate()
  if (id) {
    const {
      handleSubmit,
      register,
      setValue,
      formState: { errors }
    } = useForm<productDetailForm>({
      resolver: yupResolver(productDetailSchema)
    })
    const [quantity, setQuantity] = useState(1);
    const [currentTab, setCurrentTab] = useState(1);
    const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductQuery()
    const { data: getOneProduct, isSuccess: isSuccessProduct } = useFetchOneProductByAdminQuery(id)
    const { data: listProductDetailApi, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
    const categoryId = getOneProduct?.categoryId?._id;
    const { data: getCategoryById, isLoading: categoryLoading } = useFetchOneCategoryQuery(categoryId)
    const userStore = useSelector((state: any) => state.user)
    const productDetailRelatedState = useSelector((state: RootState) => state.productDetailRelatedReducer.productDetails)
    const { data: listOutfit, isSuccess: isSuccessOutfit } = useFetchListOutfitQuery()
    const listOutfitByProductIdState = useSelector((state: RootState) => state.searchOutfitReducer.outfits)
    const listOutfitState = useSelector((state: RootState) => state.outfitSlice.outfits)
    const productState = useSelector((state: RootState) => state.productSlice.products)

    const [rateAver, setRateAver] = useState<number>(0)
    useEffect(() => {
      if (getOneProduct) {
        dispatch(listProductDetailSlice(getOneProduct?.variants))
      }
    }, [getOneProduct])
    useEffect(() => {
      if (listProduct) {
        dispatch(listProductSlice(listProduct))
      }
    }, [isSuccessListProduct])
    useEffect(() => {
      if (listProductDetailApi) {
        dispatch(listProductDetailRelatedSlice(listProductDetailApi))
      }
    }, [isSuccessProductDetail])
    useEffect(() => {
      if (reviewState) {
        const rates = reviewState?.map((review) => review.rating)
        let totalRating = 0
        rates.forEach(rating => {
          totalRating += rating
        });
        let rateAverage = totalRating / rates.length
        setRateAver(rateAverage)
      }
    }, [reviewState, rateAver])
    useEffect(() => {
      if (listOutfit && id) {
        dispatch(listSearchOutfitByProductIdSlice({ searchTerm: id, outfits: listOutfit }))
      }
    }, [isSuccessOutfit, id])
    useEffect(() => {
      if (listOutfit) {
        dispatch(listOutfitSlice(listOutfit))
      }
    }, [isSuccessOutfit])
    const data = reviewByRateStateVer.map((item, index) => ({
      color: item.color,
      size: item.size,
      date: moment(item.createdAt as string, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("HH:mm DD/MM/YYYY"),
      images: item.images,
      rate: item.rating,
      reply: item.reply,
      fullname: item.userId ? item.userId?.fullname : null,
      comment: item.comment,
      useId: item.userId ? item.userId._id : null
    }));
    const renderContent = () => {
      switch (currentTab && currentTab) {
        case 1:
          return <>
            <div className="bg-[#fffbf8] py-4">
              <div className="flex w-[80%] mx-auto">
                <div className="">
                  <div className="flex items-center text-yellow-500">
                    <p className="text-[24px]"> {rateAver ? rateAver.toFixed(1) : 0}</p><span className="ml-2">trên 5 sao</span>
                  </div>
                  <Rate value={rateAver} allowHalf disabled className="text-2xl " />
                </div>
                <div className="flex ml-10">
                  <div onClick={() => dispatch(listReviewByRateFilterSlice({ rating: 0, reviews: reviewState && reviewState }))} className="border border-1 w-[80px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">Tất cả</div>
                  <div onClick={() => dispatch(listReviewByRateFilterSlice({ rating: 5, reviews: reviewState && reviewState }))} className="border border-1 w-[80px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">5 sao</div>
                  <div onClick={() => dispatch(listReviewByRateFilterSlice({ rating: 4, reviews: reviewState && reviewState }))} className="border border-1 w-[80px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">4 sao</div>
                  <div onClick={() => dispatch(listReviewByRateFilterSlice({ rating: 3, reviews: reviewState && reviewState }))} className="border border-1 w-[80px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">3 sao</div>
                  <div onClick={() => dispatch(listReviewByRateFilterSlice({ rating: 2, reviews: reviewState && reviewState }))} className="border border-1 w-[80px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">2 sao</div>
                  <div onClick={() => dispatch(listReviewByRateFilterSlice({ rating: 1, reviews: reviewState && reviewState }))} className="border border-1 w-[80px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">1 sao</div>
                  {userStore?.current?._id && <div onClick={() => dispatch(listReviewByUserFilterSlice({ userId: userStore.current._id, reviews: reviewState && reviewState }))} className="border border-1 w-[150px] flex items-center justify-center h-[42px] bg-white ml-3 cursor-pointer">Đánh giá của tôi</div>}
                </div>
              </div>
            </div>
            <div className="w-[80%] mx-auto">

              {reviewByRateStateVer.length > 0 && (
                <div className="">
                  <div className="my-5">
                    <span className="text-xl font-medium mr-1">{reviewByRateStateVer.length}</span>
                    <span className="text-sm text-gray-500">(Đánh giá)</span>
                  </div>
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      onChange: (page) => {
                        console.log(page);
                      },
                      pageSize: 10,
                    }}
                    dataSource={data}
                    renderItem={(item, index) => (
                      <List.Item>
                        <div className="flex justify-between items-start">
                          <div className="w-3/5">
                            <div >
                              <div className="flex items-center space-x-2">
                                <span className="font-medium"><Link to={``}>{item.fullname}</Link></span>
                                <span className="block"><Rate value={item.rate} disabled className="text-xs mb-0"></Rate></span>
                              </div>
                              <div className="flex mt-0 items-center ">
                                <span className="block text-end text-xs text-gray-400  border-r border-gray-300 pr-1">{item.date}</span>
                                <div className="px-1">
                                  <span className="text-xs text-gray-400 ">Phân loại: </span><span className="text-xs text-blue-500">{item.size}</span> - <span className="text-xs text-blue-500"> {item.color}</span>
                                </div>
                              </div>
                              <span className="block mt-2">{item.comment}</span>
                              <div className="flex space-x-3 mx-2">
                              </div>
                              <div className="flex items-start ">
                              </div>
                            </div>
                            {item?.reply?.comment && (
                              <Collapse
                                size="small"
                                // defaultActiveKey={['1']}
                                ghost
                                className="p-0"
                                style={{ padding: 0 }}
                                expandIcon={({ isActive }) => <CaretRightOutlined className={`text-blue-500`} rotate={isActive ? 90 : 0} />}
                              >
                                <Collapse.Panel key={index} header={<span className="text-gray-400">Replie</span>} className="m-0">
                                  <div className="ml-5 ">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium">{item.reply.nameUser}</span>
                                      <span className="block text-end text-xs text-gray-400 pr-1">{moment(item.reply.createdAt as string, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("HH:mm DD/MM/YYYY")}</span>
                                    </div>
                                    <span>{item.reply.comment}</span>
                                  </div>
                                </Collapse.Panel>
                              </Collapse>
                            )}
                          </div>
                          <div className="flex">
                            <Image.PreviewGroup
                              preview={{
                                onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                              }}
                            >
                              {item.images.map((image) => (
                                <Image height={70} src={image.url} alt="" className="pr-1" />

                              ))}
                            </Image.PreviewGroup>
                          </div>

                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
          </>
        case 2:
          return (
            <div className="mb-[40px]">
              <p>
                {getOneProduct?.description}
              </p>
            </div>
          );

        case 3:
          return (
            <div className="text-sm mb-[40px]">
              <p className="font-bold mb-3">1. CHÍNH SÁCH ÁP DỤNG</p>
              <p className="mb-3 ">Áp dụng từ ngày 01/09/2018.</p>
              <p className="mb-3 ">
                Trong vòng 07 ngày kể từ ngày mua sản phẩm với các sản phẩm
                HUSTLE.
              </p>
              <p className="mb-3 ">
                Áp dụng đối với sản phẩm nguyên giá và sản phẩm giảm giá ít hơn
                50%.
              </p>
              <p className="mb-3 ">
                Sản phẩm nguyên giá chỉ được đổi 01 lần duy nhất sang sản phẩm
                nguyên giá khác và không thấp hơn giá trị sản phẩm đã mua.
              </p>
              <p className="mb-3 ">
                Sản phẩm giảm giá/khuyến mại ít hơn 50% được đổi 01 lần sang màu
                khác hoặc size khác trên cùng 1 mã trong điều kiện còn sản phẩm
                hoặc theo quy chế chương trình (nếu có). Nếu sản phẩm đổi đã hết
                hàng khi đó KH sẽ được đổi sang sản phẩm khác có giá trị ngang
                bằng hoặc cao hơn. Khách hàng sẽ thanh toán phần tiền chênh lệch
                nếu sản phẩm đổi có giá trị cao hơn sản phẩm đã mua.
              </p>
              <p className="mb-3 ">
                Chính sách chỉ áp dụng khi sản phẩm còn hóa đơn mua hàng, còn
                nguyên nhãn mác, thẻ bài đính kèm sản phẩm và sản phẩm không bị dơ
                bẩn, hư hỏng bởi những tác nhân bên ngoài cửa hàng sau khi mua sản
                phẩm.
              </p>
              <p className="mb-3 ">
                Sản phẩm đồ lót và phụ kiện không được đổi trả.
              </p>
              <p className="font-bold mb-3 ">2. ĐIỀU KIỆN ĐỔI SẢN PHẨM</p>
              <p className="mb-3 ">
                Đổi hàng trong vòng 07 ngày kể từ ngày khách hàng nhận được sản
                phẩm.
              </p>
              <p className="mb-3 ">
                Sản phẩm còn nguyên tem, mác và chưa qua sử dụng.
              </p>
              <p className="font-bold mb-3 ">3. THỰC HIỆN ĐỔI SẢN PHẨM</p>
              <p className="mb-3 ">
                Quý khách có thể đổi hàng Online tại hệ thống cửa hàng và đại lý
                HUSTLE trên toàn quốc . Lưu ý: vui lòng mang theo sản phẩm và
                phiếu giao hàng.
              </p>
              <p className="mb-3 ">
                Nếu tại khu vực bạn không có cửa hàng HUSTLE hoặc sản phẩm bạn
                muốn đổi thì vui lòng làm theo các bước sau:
              </p>
              <p className="mb-3 ">
                Bước 1: Gọi đến Tổng đài: 0931733469 các ngày trong tuần (trừ ngày
                lễ), cung cấp mã đơn hàng và mã sản phẩm cần đổi.
              </p>
              <p className="mb-3 ">
                Bước 2: Vui lòng gửi hàng đổi về địa chỉ : Kho Online HUSTLE -
                1165 Giải Phóng, Thịnh Liệt, Q. Hoàng Mai, Hà Nội.
              </p>
              <p className="mb-3 ">
                Bước 3: HUSTLE gửi đổi sản phẩm mới khi nhận được hàng. Trong
                trường hợp hết hàng, HUSTLE sẽ liên hệ xác nhận.
              </p>
            </div>
          );
        case 4:
          return (
            <div className="mb-[40px]">
              <h2 className="font-bold text-3xl mb-3">
                BẢO MẬT THÔNG TIN KHÁCH HÀNG HUSTLE
              </h2>
              <div className="text-sm">
                <p className="font-bold mb-3 ">
                  1. Thu thập và sử dụng thông tin của TORANO
                </p>
                <p className="mb-3 ">
                  TORANO chỉ thu thập các loại thông tin cơ bản liên quan đến đơn
                  đặt hàng gồm:……
                </p>
                <p className="mb-3 ">
                  Các thông tin này được sử dụng nhằm mục đích xử lý đơn hàng,
                  nâng cao chất lượng dịch vụ, nghiên cứu thị trường, các hoạt
                  động marketing, chăm sóc khách hàng, quản lý nội bộ hoặc theo
                  yêu cầu của pháp luật. Khách hàng tùy từng thời điểm có thể
                  chỉnh sửa lại các thông tin đã cung cấp để đảm bảo được hưởng
                  đầy đủ các quyền mà TORANO dành cho Khách hàng của mình.
                </p>
                <p className="mb-3 ">TORANO cam kết:</p>
                <p className="mb-3 ">
                  Thông tin cá nhân của khách hàng được sử dụng đúng vào mục đích
                  của việc thu thập và cung cấp;
                </p>
                <p className="mb-3 ">
                  Mọi việc thu thập và sử dụng thông tin đã thu thập được của
                  Khách hàng đều được thông qua ý kiến của Khách hàng
                </p>
                <p className="mb-3 ">
                  Chỉ sử dụng các thông tin được Khách hàng đã cung cấp cho
                  TORANO, không sử dụng các thông tin của Khách hàng được biết đến
                  theo các phương thức khác;
                </p>
                <p className="mb-3 ">Thời gian lưu trữ và bảo mật thông tin:</p>
                <p className="mb-3 ">
                  Chỉ cho phép các đối tượng sau được tiếp cận với thông tin của
                  Khách hàng:
                </p>
                <p className="mb-3 ">
                  Người thực hiện việc cung cấp hàng hóa, dịch vụ từ TORANO theo
                  yêu cầu của Khách hàng;
                </p>
                <p className="mb-3 ">
                  Người thực hiện việc chăm sóc Khách hàng đã sử dụng hàng hóa,
                  dịch vụ của TORANO;
                </p>
                <p className="mb-3 ">
                  Người tiếp nhận và xử lý các thắc mắc của Khách hàng trong quá
                  trình sử dụng hàng hóa, dịch vụ của TORANO;
                </p>
                <p className="mb-3 ">Cơ quan Nhà nước có thẩm quyền</p>
                <p className="mb-3 ">
                  Trong quá trình chào hàng, quảng cáo và chăm sóc Khách hàng,
                  Khách hàng hoàn toàn có thể gửi yêu cầu dừng việc sử dụng thông
                  tin theo cách thức tương ứng mà hoạt động chào hàng, quảng cáo
                  và chăm sóc khách hàng gửi tới Khách hàng.
                </p>
                <p className="font-bold mb-3 ">
                  2. Cách thức bảo mật thông tin khách hàng:
                </p>
                <p className="mb-3 ">
                  Việc bảo mật các thông tin do Khách hàng cung cấp được dựa trên
                  sự đảm bảo việc tuân thủ của từng cán bộ, nhân viên TORANO, đối
                  tác và hệ thống lưu trữ dữ liệu. Trong trường hợp máy chủ lưu
                  trữ thông tin bị hacker tấn công dẫn đến mất mát dữ liệu cá nhân
                  Khách hàng, TORANO sẽ có trách nhiệm thông báo vụ việc cho cơ
                  quan chức năng điều tra xử lý kịp thời và thông báo cho Khách
                  hàng được biết. Tuy nhiên, do đặc điểm của môi trường internet,
                  không một dữ liệu nào trên môi trường mạng cũng có thể được bảo
                  mật 100%. Vì vậy, TORANO không cam kết chắc chắn rằng các thông
                  tin tiếp nhận từ Khách hàng được bảo mật tuyệt đối.
                </p>
                <p className="font-bold mb-3 ">
                  3. Trách nhiệm bảo mật thông tin Khách hàng
                </p>
                <p className="mb-3 ">
                  Khách hàng vui lòng chỉ cung cấp đúng và đủ các thông tin theo
                  yêu cầu của TORANO đặc biệt tránh cung cấp các thông tin liên
                  quan đến tài khoản ngân hàng khi chưa được mã hóa thông tin
                  trong các giao dịch thanh toán trực tuyến hoặc các thông tin
                  nhạy cảm khác. Khách hàng hoàn toàn chịu trách nhiệm về tính
                  trung thực và chính xác đối với các thông tin đã cung cấp cũng
                  như tự chịu trách nhiệm nếu cung cấp các thông tin ngoài yêu
                  cầu.
                </p>
                <p className="mb-3 ">
                  Trong trường hợp Khách hàng cung cấp thông tin cá nhân của mình
                  cho nhiều tổ chức, cá nhân khác nhau, Khách hàng phải yêu cầu
                  các bên liên quan cùng bảo mật. Mọi thông tin cá nhân của Khách
                  hàng khi bị tiết lộ gây thiệt hại đến Khách hàng, Khách hàng
                  phải tự xác định được nguồn tiết lộ thông tin. TORANO không chịu
                  trách nhiệm khi thông tin Khách hàng bị tiết lộ mà không có căn
                  cứ xác đáng thể hiện TORANO là bên tiết lộ thông tin.
                </p>
                <p className="mb-3 ">
                  TORANO không chịu trách nhiệm về việc tiết lộ thông tin của
                  Khách hàng nếu Khách hàng không tuân thủ các yêu cầu trên.
                </p>
                <p className="font-bold mb-3 ">
                  4. Luật áp dụng khi xảy ra tranh chấp
                </p>
                <p className="mb-3 ">
                  Mọi tranh chấp xảy ra giữa Khách hàng và TORANO sẽ được hòa
                  giải. Nếu hòa giải không thành sẽ được giải quyết tại Tòa án có
                  thẩm quyền và tuân theo pháp luật Việt Nam.
                </p>
              </div>
            </div>
          );
        default:
          return null;
      }
    };
    const increaseQuantity = () => {
      setQuantity(quantity + 1);
    };
    const decreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };

    useEffect(() => {
      setValue("quantity", quantity)
    }, [setValue, quantity])
    const handleFormProductDetail = async (data: productDetailForm) => {
      try {
        if (data && data.nameColor && getOneProduct) {
          await dispatch(getOneIdProductDetailSlice({ product_id: id, nameColor: data.nameColor, sizeTerm: data.size, productDetails: productDetailFilterState }))
          setFormProductDetailClicked(true)
        }
      } catch (error) {
        console.log(error);
      }
    }
    const onAddCartAsync = async () => {
      try {
        if (productDetailGetOneId && productDetailGetOneId[0]?._id && getOneProduct) {
          const cartId = listCartState?.filter((cart) =>
            cart.productDetailId === productDetailGetOneId[0]
          )
          if (productDetailGetOneId[0].quantity < quantity || cartId[0]?.quantity + quantity > productDetailGetOneId[0].quantity) {
            message.error("Sản phẩm đã vượt quá số lượng tồn kho!")
          } else {
            if (userStore?.current?._id) {
              await onAddCart({
                userId: userStore?.current?._id,
                productDetailId: productDetailGetOneId[0],
                quantity: quantity,
                totalMoney: (getOneProduct?.price - getOneProduct?.discount) * quantity
              }).then(() => dispatch(addCartSlice({
                userId: userStore?.current?._id,
                productDetailId: productDetailGetOneId[0],
                quantity: quantity,
                totalMoney: (getOneProduct?.price - getOneProduct?.discount) * quantity
              }))).then(() => {
                const overlayCart = document.querySelector(".overlay-cart")
                const overlay = document.querySelector(".overlay")
                overlay?.classList.remove("hidden")
                overlayCart?.classList.remove("translate-x-[100%]", "opacity-0")
                const dropdown = document.querySelector(".dropdown-user")
                if (!dropdown?.classList.contains("opacity-0")) {
                  dropdown?.classList.add("opacity-0")
                  dropdown?.classList.add("pointer-events-none")
                }
              })
            } else {
              await dispatch(addCartSlice({
                productDetailId: productDetailGetOneId[0],
                quantity: quantity,
                totalMoney: (getOneProduct?.price - getOneProduct?.discount) * quantity
              }))
              const overlayCart = document.querySelector(".overlay-cart")
              const overlay = document.querySelector(".overlay")
              overlay?.classList.remove("hidden")
              overlayCart?.classList.remove("translate-x-[100%]", "opacity-0")
              const dropdown = document.querySelector(".dropdown-user")
              if (!dropdown?.classList.contains("opacity-0")) {
                dropdown?.classList.add("opacity-0")
                dropdown?.classList.add("pointer-events-none")
              }
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      if (formProductDetailClicked) {
        onAddCartAsync()
        setFormProductDetailClicked(false)
      }
    }, [productDetailGetOneId, getOneProduct, formProductDetailClicked])

    // lay ra mau [0]
    useEffect(() => {
      if (productDetailState && getOneProduct) {
        const firstColor = productDetailState?.filter((pro) => pro?.product_id && pro?.product_id?.includes(getOneProduct._id!)).map((colors) => colors?.nameColor);
        if (firstColor && firstColor.length > 0) {
          const firstColorString = JSON.stringify(firstColor[0]);
          localStorage.setItem("firstColor", firstColorString);
          const getFirstColor = localStorage.getItem("firstColor");
          if (listProductDetailApi && getFirstColor) {
            const parsedFirstColor = JSON.parse(getFirstColor);
            dispatch(listProductDetailFilterSlice({ _id: id, nameTerm: parsedFirstColor, productDetails: getOneProduct.variants }));
          }
        }
      }
    }, [productDetailState, getOneProduct]);


    // lay ra size tuong ung voi color
    const handleColorProductDetail = async (name: string) => {
      setValue("product_id", id)
      setValue("nameColor", name)
      console.log(name)
      try {
        if (listProductDetailApi) {
          await dispatch(listProductDetailFilterSlice({ _id: id, nameTerm: name, productDetails: getOneProduct?.variants }))
        }
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      if (getCategoryById) {
        dispatch(listProductRelated(getCategoryById?.products))
      }
    }, [getCategoryById])


    function filterAndTransformVariants(inputVariants: any) {
      const resultVariants = [];

      const colorMap: any = {};

      (inputVariants ?? []).forEach((variant: any) => {
        const { product_id, nameColor, size, quantity, imageColor, sold, deleted, _id } = variant;

        if (!colorMap[nameColor]) {
          colorMap[nameColor] = {
            product_id,
            imageColor,
            nameColor,
            items: [],
            sold,
            deleted,
          };
        }

        const existingSize = colorMap[nameColor].items.find((item: any) => item.size === size);
        if (existingSize) {
          existingSize.quantity += quantity;
        } else {
          colorMap[nameColor].items.push({
            _id,
            size,
            quantity,
          });
        }
      });

      for (const colorKey in colorMap) {
        resultVariants.push(colorMap[colorKey]);
      }
      return resultVariants;
    }

    const productDetails = filterAndTransformVariants(getOneProduct?.variants)
    const colorProduct = productDetails?.map((product: any) => product.nameColor)


    let sizeProduct: any = [];
    productDetails.forEach((item) => {
      item.items.forEach((sizeObj: any) => {
        if (!sizeProduct.includes(sizeObj.size)) {
          sizeProduct.push(sizeObj.size);
        }
      });
    });

    const imagesProduct = productDetails.map((product: any) => product.imageColor)
    const listImages = [...getOneProduct?.images ?? [], ...imagesProduct];

    const [selectedImage, setSelectedImage] = useState(0);
    const handleImageClick = (index: any) => {
      setSelectedImage(index);
    };
    const handlePrevClick = () => {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : listImages.length - 1));
    };
    const handleNextClick = () => {
      setSelectedImage((prev) => (prev < listImages.length - 1 ? prev + 1 : 0));
    };
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0 });
    }, [id]);

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [size, setSize] = useState('')
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
      setSize('')
      form.resetFields();
    };

    const handleReset = () => {
      form.resetFields(); // Reset form fields
      setSize(''); // Reset the size state
    };

    const SubmitButton = ({ form }: { form: FormInstance }) => {
      const [submittable, setSubmittable] = useState(false);

      // Watch all values
      const values = Form.useWatch([], form);
      console.log(values);

      const determineSize = (height: any, weight: any) => {
        if ((height < 160) || (weight < 56)) {
          return 'Size không xác định';
        } else if ((height >= 160 && height <= 166) && (weight >= 56 && weight <= 62)) {
          return 'S';
        } else if ((height >= 167 && height <= 172) && (weight >= 63 && weight <= 68)) {
          return 'M';
        } else if ((height >= 173 && height <= 178) && (weight >= 69 && weight <= 74)) {
          return 'L';
        } else if ((height >= 179 && height <= 184) && (weight >= 75 && weight <= 80)) {
          return 'XL';
        } else if ((height > 184) || (weight > 80)) {
          return 'Size không xác định';
        }
        else {
          // Trường hợp không cùng khoảng, xét riêng chiều cao và cân nặng
          let sizeHeight, sizeWeight;

          if (height >= 160 && height <= 166) {
            sizeHeight = 0; // Gán giá trị số thay vì chuỗi
          } else if (height >= 167 && height <= 172) {
            sizeHeight = 1;
          } else if (height >= 173 && height <= 178) {
            sizeHeight = 2;
          } else if (height >= 179 && height <= 184) {
            sizeHeight = 3;
          }

          if (weight >= 56 && weight <= 62) {
            sizeWeight = 0;
          } else if (weight >= 63 && weight <= 68) {
            sizeWeight = 1;
          } else if (weight >= 69 && weight <= 74) {
            sizeWeight = 2;
          } else if (weight >= 75 && weight <= 80) {
            sizeWeight = 3;
          }

          // So sánh size của chiều cao và cân nặng (với giá trị số), chọn size lớn hơn
          if (sizeHeight > sizeWeight) {
            return getSizeString(sizeHeight);
          } else {
            return getSizeString(sizeWeight);
          }
        }
      }
      const getSizeString = (sizeValue) => {
        // Chuyển đổi giá trị số thành chuỗi
        switch (sizeValue) {
          case 0:
            return 'S';
          case 1:
            return 'M';
          case 2:
            return 'L';
          case 3:
            return 'XL';
          default:
            return '';
        }
      }

      // if (values) {
      //   const size = determineSize(values.height, values.weight);
      //   console.log(`Kích cỡ quần áo: ${size}`);
      // }

      // const height = 170; // Đổi giá trị này để kiểm tra với chiều cao khác
      // const weight = 60;  // Đổi giá trị này để kiểm tra với cân nặng khác

      // const size = determineSize(height, weight);
      // console.log(`Kích cỡ quần áo: ${size}`);
      if (values) {
        if (values.hight != undefined && values.weight != undefined) {

          console.log("value", values);

          // Handle cases where values are not valid numbers
          const parsedHeight = parseInt(values.hight, 10);
          const parsedWeight = parseInt(values.weight, 10);

          // Check if parsedHeight and parsedWeight are valid numbers
          if (!isNaN(parsedHeight) && !isNaN(parsedWeight)) {
            const size = determineSize(parsedHeight, parsedWeight);
            setSize(size)
          }
        }
      }

      useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
          () => {
            setSubmittable(true);
          },
          () => {
            setSubmittable(false);
          },
        );
      }, [values]);

      return (
        <Button type="primary" className="bg-blue-500" htmlType="submit" disabled={!submittable}>
          Gợi ý
        </Button>
      );
    }

    const [form] = Form.useForm();
    const [isFixed, setIsFixed] = useState(true);

    // Hàm xử lý sự kiện khi cuộn chuột
    const handleScroll = () => {
      // Kiểm tra vị trí của phần tử và cập nhật trạng thái
      const element = document.getElementById('tabsMenu');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsFixed(rect.top > 0); // Cập nhật trạng thái dựa trên vị trí của phần tử
      }
    };

    // Thêm lắng nghe sự kiện cuộn chuột
    useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
      <div className="container">
        <div className="mb-[70px] mt-5" id="scroller ">
          {/* <ScrollToTop /> */}
          <div className="flex justify-between gap-x-7 mb-10">
            {!isSuccessProduct ? (
              <div className="space-y-3 ">
                <div className="block">
                  <Skeleton.Image active={true} style={{ width: '380px', height: '400px' }} />
                </div>
                <div className="block">
                  <Skeleton.Image active={true} style={{ width: '80px', height: '80px' }} />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className={listOutfitByProductIdState.length > 0 ? isFixed ? 'fixed' : 'absolute bottom-0' : ''}>
                  <div className="w-[400px] h-[500px] relative">
                    <img
                      src={listImages[selectedImage]}
                      alt=""
                      className="w-[400px] h-[500px] object-cover border"
                    />
                    <button
                      onClick={handlePrevClick}
                      className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-gray-300 hover:bg-gray-400 text-gray-700"
                    >
                      &lt;
                    </button>
                    <button
                      onClick={handleNextClick}
                      className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-gray-300 hover:bg-gray-400 text-gray-700"
                    >
                      &gt;
                    </button>
                  </div>
                  <div className=" mt-5">
                    <Swiper
                      modules={[Navigation]}
                      spaceBetween={4}
                      slidesPerView={"auto"}
                      navigation={true}
                      className="w-[400px] mx-auto"
                    >
                      {listImages.map((imageUrl, index) => {
                        return <SwiperSlide key={index} className="w-20 h-24 cursor-pointer">
                          <div
                            onClick={() => handleImageClick(index)}
                            className={`h-20 w-16 overflow-hidden mb-3 relative group transform transition-transform hover:scale-110 
                        }`}
                          >
                            <div className="h-20 flex items-center justify-center">
                              <img
                                src={imageUrl}
                                alt=""
                                className="h-full w-full object-cover "
                              />
                            </div>

                          </div>
                        </SwiperSlide>
                      })}
                    </Swiper>

                  </div>
                </div>
              </div>
            )}

            <div className="product-info w-2/3">
              {!isSuccessProduct ? (
                <div className="">
                  <div className="">
                    <Skeleton.Input active={true} style={{ width: '380px', height: '39px' }} />
                  </div>
                  <div className="mt-3">
                    <Skeleton.Input active={true} style={{ width: '450px', height: '20px' }} />
                  </div>
                </div>
              ) : (
                <div className="mb-10">
                  <h1 className="text-[26px] font-bold mb-2">
                    {getOneProduct?.title}
                  </h1>
                  <div className="flex gap-x-5 text-sm">
                    <span>
                      Mã sản phẩm: <b>{getOneProduct?.sku}</b>
                    </span>
                    <span>
                      Tình trạng: <b>Còn hàng</b>
                    </span>
                    <span>
                      Thương hiệu: <b className="uppercase">HUSTLE</b>
                    </span>
                  </div>
                </div>
              )}

              {/* form */}
              <form onSubmit={handleSubmit(handleFormProductDetail)}>
                <div className="">
                  {!isSuccessProduct ? (
                    <div className="mb-8 mt-10 ">
                      <Skeleton.Input active={true} style={{ width: '220px', height: '40px' }} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-[109px] py-3 mb-5">
                      <span className="text-sm font-bold">Giá:</span>

                      <div className="font-bold text-xl text-[#FF2C26]">
                        {(getOneProduct?.price - getOneProduct.discount).toLocaleString("vi-VN")}đ
                        <del className="font-bold text-sm text-[#ccc] ml-2">
                          {getOneProduct.discount !== 0 && <span className="text-[13px] text-[#878C8F]">
                            <del>{getOneProduct.price?.toLocaleString("vi-VN")}đ</del>
                          </span>}
                        </del>
                      </div>
                      {getOneProduct && getOneProduct.discount !== 0 && <span className="width-[52px]  top-3 left-3 height-[22px] rounded-full px-3 py-[5px] text-xs font-semibold text-white bg-[#FF0000]">
                        -{`${((getOneProduct?.price - (getOneProduct.price - getOneProduct.discount)) / getOneProduct?.price * 100).toFixed(0)}`}%
                      </span>}
                    </div>
                  )}

                  {/* bien the */}
                  <div>
                    {!isSuccessProduct ? (
                      <div className="mt-3">
                        <div className="">
                          <Skeleton.Input active={true} style={{ width: '300px', height: '36px' }} />
                        </div>
                        <div className="mt-1">
                          <Skeleton.Input active={true} style={{ width: '300px', height: '36px' }} />
                        </div>
                        <div className="mt-8">
                          <Skeleton.Button active={true} style={{ width: '200px', height: '40px' }} />
                        </div>
                        <div className="mt-5 flex space-x-5 mb-3">
                          <Skeleton.Button active={true} style={{ width: '300px', height: '50px' }} />
                          <Skeleton.Button active={true} style={{ width: '300px', height: '50px' }} />
                        </div>
                      </div>
                    ) : (
                      <div className="">
                        {[...new Set(productDetailState?.filter((item) => item.product_id === getOneProduct?._id).filter((pro) => pro.quantity !== 0))].length != 0 ? <>
                          <p className="text-red-400 italic font-semibold">{errors ? errors.nameColor?.message : ""}</p>
                          <div className="flex my-6">
                            <div className="w-[13%] text-sm font-bold">Màu sắc</div>
                            <div className="flex">
                              {colorProduct.map((color, index) => (
                                <div className="mx-1">
                                  <input
                                    type="radio"
                                    value={color}
                                    onClick={() => {
                                      handleColorProductDetail(color);
                                      handleImageClick(index + getOneProduct.images.length);
                                    }}
                                    id={color}
                                    name="color"
                                    className="hidden peer"
                                  />
                                  <label htmlFor={color}
                                    className="py-2 px-6 items-center text-gray-500 bg-white border border-gray-200 rounded-md cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                                  >
                                    {color}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex my-6">
                            {/* size */}
                            <div className="w-[13%] text-sm font-bold">Kích thước</div>
                            <div className="flex">
                              {productDetailFilterState
                                ?.slice()
                                .sort((a: any, b: any) => new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime())
                                .map((item) => {
                                  return <>
                                    {item.quantity > 0 ? <div className="mx-1" key={item._id}>
                                      <input {...register("size")} type="radio" id={item.size} name="size" value={item.size} className="hidden peer" />
                                      <label htmlFor={item.size}
                                        className="py-2 px-6 items-center text-gray-600 bg-white border border-gray-400 rounded-md cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                                      >
                                        {item.size}
                                      </label>
                                    </div> :
                                      <div className="mx-1">
                                        <label
                                          className="py-2 px-6 items-center text-gray-300 bg-white border border-gray-200 rounded-md cursor-default dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 pointer-events-none peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800  dark:hover:bg-gray-700"
                                        >
                                          {item.size}
                                        </label>
                                      </div>
                                    }
                                  </>
                                })}
                            </div>
                          </div >
                          <div className="flex items-center gap-x-[71.75px] py-4 mb-2">
                            <span className="text-sm font-bold">Số lượng:</span>
                            <div className="flex items-center">
                              <label htmlFor="Quantity" className="sr-only">
                                {" "}
                                Quantity{" "}
                              </label>

                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={decreaseQuantity}
                                  type="button"
                                  className="w-10 h-10 leading-10 text-gray-700 transition hover:opacity-75"
                                >
                                  &minus;
                                </button>

                                <input
                                  type="number"
                                  id="Quantity"
                                  value={quantity}
                                  className="outline-none font-semibold h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                />

                                <button
                                  onClick={increaseQuantity}
                                  type="button"
                                  className="w-10 h-10 leading-10 text-gray-700 transition hover:opacity-75"
                                >
                                  +
                                </button>
                              </div>
                              <div className="ml-10">
                                <Button type="link" onClick={showModal} className="italic ">
                                  <span className="underline">Gợi ý size</span>
                                </Button>
                                <Modal
                                  cancelButtonProps={{ hidden: true }}
                                  okButtonProps={{ hidden: true }}
                                  title="Gợi ý size" open={isModalOpen} onCancel={handleCancel} onOk={SubmitButton}>
                                  <Form
                                    form={form}
                                    name="validateOnly"
                                    onFinish={SubmitButton}
                                    layout="vertical"
                                    autoComplete="off">
                                    <div className="">
                                      <div className="">
                                        <Form.Item
                                          name="hight"
                                          label="Chiều cao (cm)"
                                          rules={[{ required: true, message: "Chiều cao bắt buộc phải nhập" }]}
                                        >
                                          <Input type="number" min={0} />
                                        </Form.Item>
                                        <Form.Item
                                          name="weight"
                                          label="Cân nặng"
                                          rules={[{ required: true, message: "Cân nặng bắt buộc phải nhập" }]}
                                        >
                                          <Input type="number" min={0} />
                                        </Form.Item>
                                        <Form.Item>
                                          <Space>
                                            <SubmitButton form={form} />
                                            <Button htmlType="reset" onClick={handleReset}>Reset</Button>
                                          </Space>
                                        </Form.Item>
                                      </div>
                                      <div className="">
                                        <img src="" alt="" />
                                      </div>
                                    </div>
                                  </Form>
                                  {size && <p>Kích cỡ quần áo của bạn là: {size}</p>}
                                </Modal>
                              </div>
                            </div>
                          </div>
                          <div className="mb-7">
                            <div className="flex gap-x-[15px] mb-5">
                              <button className="addtoCart w-[336px] text-[#E70505] border uppercase h-[50px] rounded font-semibold hover:text-white hover:bg-[#E70505] transition-all border-[#E70505]">
                                Thêm vào giỏ
                              </button>
                              <button className="w-[336px] border h-[50px] flex items-center justify-center rounded font-semibold uppercase text-white bg-[#E70505] border-[#E70505] transition-all buy-now">
                                Mua ngay
                              </button>
                            </div>
                          </div>
                        </> : <div className="bg-[#E70505] text-white w-[250px] flex items-center justify-center my-[40px] font-semibold rounded-md pointer-events-none py-3 px-4">Sản phẩm đã hết hàng</div>}
                      </div>
                    )}

                  </div>
                </div>

              </form>
              {/* outfit */}
              <div className="" id="tabsMenu">
                {listOutfitByProductIdState.length > 0 &&
                  <OutfitProductDetail listOutfitByProductIdState={listOutfitByProductIdState} productState={productState} id={id} productDetailRelatedState={productDetailRelatedState} listOutfitState={listOutfitState} listCartState={listCartState}></OutfitProductDetail>
                }
              </div>

              {isSuccessProduct ? (
                <div className="policy flex justify-between gap-x-[13px]">
                  <div>
                    <div className="flex items-center gap-x-[10px] mb-4">
                      <img
                        src="/images/icon/product_info2_desc3_img.png"
                        className="w-[30px] h-[30px]"
                        alt=""
                      />
                      <span className="text-sm">
                        Kiểm tra, thanh toán khi nhận hàng COD
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-x-[10px] mb-4">
                      <img
                        src="/images/icon/product_info1_desc2_img.png"
                        className="w-[30px] h-[30px]"
                        alt=""
                      />
                      <span className="text-sm">Hàng phân phối chính hãng 100%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-x-[10px] mb-4">
                      <img
                        src="/images/icon/product_info1_desc3_img.png"
                        className="w-[30px] h-[30px]"
                        alt=""
                      />
                      <span className="text-sm">TỔNG ĐÀI 24/7 : 0964942121</span>
                    </div>

                  </div>
                </div>
              ) : ""}
            </div >
          </div >
          {/* tới đây  */}
          <div className="" >
            <div className="product-tabs flex gap-x-[60px]">
              <div>
                <button
                  className={`${currentTab === 1
                    ? "border-b-2 border-black text-black"
                    : "text-[#b3b3b3]"
                    } text-lg font-semibold pb-2`}
                  onClick={() => setCurrentTab(1)}
                >
                  Đánh giá - Nhận xét từ khách hàng
                </button>
              </div>
              <div>
                <button
                  className={`${currentTab === 2
                    ? "border-b-2 border-black text-black"
                    : "text-[#b3b3b3]"
                    } text-lg font-semibold pb-2`}
                  onClick={() => setCurrentTab(2)}
                >
                  Mô tả sản phẩm
                </button>
              </div>
              <div>
                <button
                  className={`${currentTab === 3
                    ? "border-b-2 border-black text-black"
                    : "text-[#b3b3b3]"
                    } text-lg font-semibold pb-2`}
                  onClick={() => setCurrentTab(3)}
                >
                  Chính sách đổi trả
                </button>
              </div>
              <div>
                <button
                  className={`${currentTab === 4
                    ? "border-b-2 border-black text-black"
                    : "text-[#b3b3b3]"
                    } text-lg font-semibold pb-2`}
                  onClick={() => setCurrentTab(4)}
                >
                  Chính sách bảo mật
                </button>
              </div>
            </div>
            <div className="mt-[40px]">{renderContent()}</div>
          </div>
          {/* san pham lien quan */}
          <div>
            <h1 className="text-[37px] font-semibold mb-[30px] text-center uppercase mt-10">
              Sản phẩm liên quan
            </h1>
            <div className="product-related mb-12">
              <Swiper
                modules={[Navigation]}
                // grabCursor={"true"}
                spaceBetween={25}
                slidesPerView={"auto"}
                navigation={true}
              >
                {productRelated?.map((product, index) => {
                  return <SwiperSlide key={index}>
                    <div className={`relative group ${[...new Set(productDetailRelatedState?.filter((item) => item.product_id === product?._id).filter((pro) => pro.quantity !== 0))].length === 0 && "opacity-60"}`}>
                      {[...new Set(productDetailRelatedState?.filter((item) => item.product_id === product?._id).filter((pro) => pro.quantity !== 0))].length === 0 && <div className="absolute z-10 overflow-hidden bg-red-500 font-semibold top-[50%] left-0 right-0 text-center text-white py-2">Hết hàng</div>}
                      <Link to={`/products/${product._id}`}>
                        <div className="min-h-[375px] max-h-[395px] overflow-hidden">
                          <img
                            src={product.images?.[0]}
                            className="mx-auto max-h-[395px] min-h-[375px] w-full group-hover:opacity-0 group-hover:scale-100 absolute transition-all ease-linear duration-200"
                            alt=""
                          />

                          <img
                            src={product.images?.[1] ? product.images?.[1] : productDetailRelatedState.find((proDetail) => proDetail.product_id && proDetail.product_id.includes(product._id!))?.imageColor
                            }
                            className="mx-auto max-h-[375px] min-h-[375px] w-full duration-999 absolute opacity-0 group-hover:opacity-100 transition-all ease-linear"
                            alt=""
                          />
                        </div>
                      </Link>
                      <div className="product-info p-[8px] bg-white">
                        <div className="text-sm flex justify-between mb-3">
                          <span>+{productDetailRelatedState ? [...new Set(productDetailRelatedState?.filter((item) => item.product_id === product._id).map((pro) => pro.nameColor))].length : 0} màu sắc</span>
                          <div className="flex">+{productDetailRelatedState ? [...new Set(productDetailRelatedState?.filter((item) => item.product_id === product._id).map((pro) => pro.size))].length : 0}
                            <p className="ml-1">Kích thước</p>
                          </div>
                        </div>
                        <Link to="" className="block font-medium h-12">
                          {product.title}
                        </Link>
                        <div className="price flex gap-x-[8px] items-baseline">
                          <span className="text-sm text-[#FF2C26] font-semibold">
                            {(product?.price - product.discount).toLocaleString("vi-VN")}đ
                          </span>
                          {product.discount !== 0 && <span className="text-[13px] text-[#878C8F]">
                            <del>{product.price?.toLocaleString("vi-VN")}đ</del>
                          </span>}
                        </div>
                      </div>
                      <div>
                        {product.discount > 0 && <span className="width-[52px] absolute top-3 left-3 height-[22px] rounded-full px-3 py-[3px] text-xs font-semibold text-white bg-[#FF0000]">
                          -{`${((product?.price - (product?.price - product?.discount)) / product?.price * 100).toFixed(0)}`}%
                        </span>}
                      </div>
                    </div>
                  </SwiperSlide>
                })}

              </Swiper>
            </div>
          </div>
          {/* Sản phẩm đã xem */}
          <ProductViewed idProduct={id} listProductDetail={productDetailState}></ProductViewed>
        </div >
      </div>
    );

  }
};

export default ProductInfo;