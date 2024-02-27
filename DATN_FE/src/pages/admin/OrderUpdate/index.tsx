import React, { useEffect, useState, useRef } from 'react';
import type { FormInstance } from 'antd';
import {
    Button,
    Form,
    Input,
    Select,
    message,
    Upload,
    Spin,
    Breadcrumb,
    Table,
    Modal,
    Popconfirm,
    Image,
    Badge,
    Tooltip
} from 'antd';
import {
    UploadOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    FrownOutlined,
    PrinterFilled
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDeleteOrderMutation, useGetOneOrderQuery, useUpdateOrderMutation } from '../../../store/order/order.service';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useGetOneOrderReturnQuery, useUpdateOrderReturnMutation } from '../../../store/orderReturn/order.service';
import { useDeleteOrderDetailMutation, useUpdateOrderDetailMutation } from '../../../store/orderDetail/orderDetail.service';
import { useListVoucherQuery } from '../../../store/vouchers/voucher.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

interface DataType {
    key: string;
    image: string;
    name: string;
    colorName: string;
    size: string;
    quantity: number;
    price: number;
}

const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    React.useEffect(() => {
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
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500'>
            Cập nhật
        </Button>
    );
};
interface ProductDetail {
    _id: string;
    product_id: string;
    nameColor: string;
    imageColor: string;
    quantity: number;
    size: string;
    sold: number;
    deleted: boolean;
}

const orderUpdate = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const componentRef = useRef();
    const { id } = useParams();
    const [onUpdate] = useUpdateOrderMutation()
    const [onUpdateOrderReturn] = useUpdateOrderReturnMutation()
    const [onUpdateOrderDetail] = useUpdateOrderDetailMutation()
    const [onRemoveOrderDetail] = useDeleteOrderDetailMutation()
    const [onRemoveOrder] = useDeleteOrderMutation()
    let orderDetails = []
    const { data: order } = useGetOneOrderQuery(id || '');
    const { data: voucher } = useListVoucherQuery();
    const voucherByOrder = voucher?.filter(voucher => voucher.code === order?.voucher_code)
    const idOrderReturn = order?.orderReturn?._id
    const { data: orderReturn } = useGetOneOrderReturnQuery(idOrderReturn);

    const ListOrderDeatils = order?.orderDetails;
    const ListOrderReturnDetail = orderReturn?.orderReturnDetails;

    const [openFormUpdateNote, setOpenFormUpdateNote] = useState(false);
    const [openFormUpdateInfo, setOpenFormUpdateInfo] = useState(false);
    const [openFormUpdateStatus, setOpenFormUpdateStatus] = useState(false);
    const [openFormConfirmOrderReturn, setOpenFormConfirmOrderReturn] = useState(false);
    const [orderDetail, setOrderDetail] = useState<any[]>([]);
    const [orderReturnDetail, setOrderReturnDetail] = useState<any[]>([]);
    const [sumTotalMoney, setSumTotalMoney] = useState<number>()

    const [provinces, setProvinces] = useState<any>([]);
    const [districts, setDistricts] = useState<any>([]);
    const [wards, setWards] = useState<any>([]);
    const [codeProvince, setCodeProvince] = useState<any>();
    const [codeDistrict, setCodeDistrict] = useState<any>();
    const [codeWard, setCodeWard] = useState<any>();
    const [nameProvince, setNameProvince] = useState<any>();
    const [nameDistrict, setNameDistrict] = useState<any>();
    const [nameWard, setNameWard] = useState<any>();

    const provinceUpdate: any = provinces.find((item: any) => item.name == order?.address.myProvince)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        // Gọi API để lấy dữ liệu tỉnh/thành phố
        axios.get('https://provinces.open-api.vn/api/p/')
            .then(response => setProvinces(response.data))
            .catch(error => console.error('Error fetching provinces:', error));

        if (order) {
            setNameProvince(order?.address.myProvince)
            setNameDistrict(order?.address.myDistrict)
            setNameWard(order?.address.myWard)
        }
        form.setFieldsValue({
            _id: order?._id,
            fullName: order?.fullName,
            address: order?.address,
            phoneNumber: order?.phoneNumber,
            myProvince: order?.address.myProvince,
            myDistrict: order?.address.myDistrict,
            myWard: order?.address.myWard,
            detailAddress: order?.address.detailAddress,
            // date: date(),
            paymentStatus: order?.paymentStatus && order?.paymentStatus,
            status: order?.status && order?.status,
            note: order?.note
        });
    }, [order]);

    useEffect(() => {
        if (provinceUpdate) {
            // Gọi API để lấy dữ liệu quận/huyện
            axios.get(`https://provinces.open-api.vn/api/p/${provinceUpdate.code}?depth=2`)
                .then(response => {
                    setDistricts(response.data);
                    const districtCode = response.data.districts.find((item: any) => item.name === order?.address?.myDistrict)?.code;
                    setCodeDistrict(districtCode);
                })
                .catch(error => console.error('Error fetching districts:', error));
        }
    }, [provinceUpdate, order?.address?.myDistrict]);

    useEffect(() => {
        // Gọi API để lấy dữ liệu phường/xã
        if (codeDistrict) {
            axios.get(`https://provinces.open-api.vn/api/d/${codeDistrict}?depth=2`)
                .then(response => {
                    setWards(response.data);
                    const wardCode = response.data.wards.find((item: any) => item.name === order?.address?.myWard)?.code;
                    setCodeWard(wardCode);
                })
                .catch(error => console.error('Error fetching wards:', error));
        }
    }, [codeDistrict, order?.address?.myWard]);

    const handleProvinceChange = (code: any) => {
        const province: any = provinces.find((item: any) => item.code == code)

        setNameProvince(province.name);
        setCodeProvince(code);
        form.setFieldsValue({
            myDistrict: '',
            myWard: '',
        });
        // Gọi API để lấy dữ liệu quận/huyện dựa trên tỉnh/thành phố được chọn
        axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
            .then(response => setDistricts(response.data))
            .catch(error => console.error('Error fetching districts:', error));
    };

    const handleDistrictChange = (code: any) => {
        setCodeDistrict(code);

        const district = districts?.districts.find((item: any) => item.code == code)
        setNameDistrict(district.name);
        form.setFieldsValue({
            myWard: '',
        });
        // Gọi API để lấy dữ liệu xã/phường dựa trên quận/huyện được chọn
        axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
            .then(response => setWards(response.data))
            .catch(error => console.error('Error fetching wards:', error));
    };

    const handleWardChange = (code: any) => {
        setCodeWard(code);

        const ward = wards.wards.find((item: any) => item.code == code)
        setNameWard(ward.name);
    };

    useEffect(() => {
        if (order) {
            setSumTotalMoney(order?.totalMoney)
        }
        if (ListOrderDeatils) {
            const fetchData = async () => {
                const productDetails = [];
                for (const detail of ListOrderDeatils) {
                    try {
                        const response = await axios.get(`http://localhost:8080/api/productDetails/${detail.productDetailId}`);
                        const productInfo = response.data;

                        const productResponse = await axios.get(`http://localhost:8080/api/products/${productInfo.product_id}`);
                        const productData = productResponse.data;

                        productDetails.push({
                            ...detail,
                            productInfo,
                            productName: productData.title,

                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                setOrderDetail(productDetails);
            };
            fetchData();
        }
        if (ListOrderReturnDetail) {
            const fetchData = async () => {
                const productDetails = [];
                for (const detail of ListOrderReturnDetail) {
                    try {
                        const response = await axios.get(`http://localhost:8080/api/productDetails/${detail.productDetailId}`);
                        const productInfo = response.data;

                        const productResponse = await axios.get(`http://localhost:8080/api/products/${productInfo.product_id}`);
                        const productData = productResponse.data;

                        productDetails.push({
                            ...detail,
                            productInfo,
                            productName: productData.title,
                            sku: productData.sku

                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
                setOrderReturnDetail(productDetails);
            };
            fetchData();
        }
    }, [order, ListOrderDeatils, ListOrderReturnDetail]);
    orderDetails = orderDetail

    const columns: ColumnsType<DataType> = [
        {
            title: 'Sản phẩm',
            render: (record: any) => (
                <div className='flex'>
                    <div className='mr-2'>
                        <img src={record?.image} alt="" className='w-14 h-20 object-cover' />
                    </div>
                    <div className="space-y-3 py-2 font-light ">
                        <span className='block'>{record?.name}</span>
                        <span className='block text'>{record?.colorName} / {record.size}</span>
                    </div>
                </div>
            ),
            className: 'w-2/5'
        },
        {
            title: 'Giá bán',
            dataIndex: 'price',
            render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: <div className="text-end">Thành tiền</div>,
            key: 'total',
            render: (record: any) => <div className='text-end'>{(record.price * record.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>,
            className: 'w-1/5'
        },
    ];
    let data: DataType[] = [];

    if (orderDetails) {
        data = orderDetails.map((order: any) => ({
            key: order._id,
            image: order.productInfo.imageColor,
            name: order.productName,
            colorName: order.color,
            size: order.size,
            quantity: order.quantity,
            price: order.price,
        }));
    }


    // const [onUpdate] = useUpdateProductMutation()

    const updateNote = async (values: any) => {
        try {
            console.log("value:", values);
            const newNote = { ...order, note: values.note }
            await onUpdate({ id, ...newNote });
            setOpenFormUpdateNote(false)
            message.success(`Cập nhật thành công`);
        } catch (error) {
            console.log(error);
        }
    };

    const updateInfo = async (values: any) => {
        try {
            const newValue = {
                ...order,
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                address: {
                    myProvince: nameProvince,
                    myDistrict: nameDistrict,
                    myWard: nameWard,
                    detailAddress: values.detailAddress
                }
            }
            await onUpdate({ id, ...newValue });
            setOpenFormUpdateInfo(false)
            message.success(`Cập nhật thành công`);
        } catch (error) {
            console.log(error);
        }
    };

    const updatePaymentStatus = async (values: any) => {
        try {
            const newValue = { ...order, paymentStatus: 1 }
            await onUpdate({ id, ...newValue });
            setOpenFormUpdateInfo(false)
            message.success(`Cập nhật thành công`);
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatusComplte = async (values: any) => {
        try {
            const newValue = { ...order, status: 5 }
            await onUpdate({ id, ...newValue });
            setOpenFormUpdateInfo(false)
            message.success(`Cập nhật thành công`);
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatus = async (values: any) => {
        try {
            const newValue = { ...order, status: values.status };
            await onUpdate({ id, ...newValue });
            setOpenFormUpdateStatus(false)
            message.success(`Cập nhật thành công`);
        } catch (error) {
            console.log(error);
        }
    };




    const confirmOrderReturn = async () => {
        try {
            const orderDetailsArray = order?.orderDetails;
            const orderReturnDetailsArray = orderReturn?.orderReturnDetails;

            const updatePromises = orderDetailsArray?.map(async (orderDetail) => {
                const matchingOrderReturnDetail = orderReturnDetailsArray.find(
                    (orderReturnDetail: any) => orderReturnDetail.orderDetailId === orderDetail._id
                );

                if (matchingOrderReturnDetail) {
                    if (orderDetail.quantity > matchingOrderReturnDetail?.quantity) {
                        const valueUpdate = {
                            ...orderDetail,
                            totalMoney: orderDetail.price * (orderDetail.quantity - matchingOrderReturnDetail.quantity),
                            quantity: orderDetail.quantity - matchingOrderReturnDetail.quantity,
                        };

                        await onUpdateOrderDetail({ _id: orderDetail._id, order: valueUpdate });

                        let totalMoneyUpdate = sumTotalMoney - (matchingOrderReturnDetail.quantity * matchingOrderReturnDetail.price);
                        setSumTotalMoney(totalMoneyUpdate);
                    }
                    if (orderDetail.quantity === matchingOrderReturnDetail?.quantity) {
                        await onRemoveOrderDetail(orderDetail._id)
                        // let totalMoneyUpdate = sumTotalMoney - (matchingOrderReturnDetail?.quantity * matchingOrderReturnDetail?.price);
                        // setSumTotalMoney(totalMoneyUpdate);
                    }
                }
            });

            await Promise.all(updatePromises);

            const updatedTotalMoney = orderDetailsArray?.reduce((total, orderDetail) => {
                const matchingOrderReturnDetail = orderReturnDetailsArray.find(
                    (orderReturnDetail: any) => orderReturnDetail.orderDetailId === orderDetail._id
                );

                if (matchingOrderReturnDetail) {
                    total -= matchingOrderReturnDetail.quantity * matchingOrderReturnDetail.price;
                }

                return total;
            }, sumTotalMoney);

            const valueStatus = order?.paymentStatus === 1 ? 5 : 4;
            const updatedOrder = { ...order, status: valueStatus, totalMoney: updatedTotalMoney };
            await onUpdate({ id, ...updatedOrder });

            const updateStatusOrderReturn = { ...orderReturn, status: 2 };
            const idOrderReturn = order?.orderReturn?._id;
            onUpdateOrderReturn({ id: idOrderReturn, ...updateStatusOrderReturn });

            setOpenFormConfirmOrderReturn(false);
            message.success(`Xác nhận yêu cầu đổi hàng`);
        } catch (error) {
            console.log(error);
        }
    };

    const unConfirmOrderReturn = async () => {
        try {
            const valueStatus = order?.paymentStatus === 1 ? 5 : 4;
            const updatedOrder = { ...order, status: valueStatus };
            await onUpdate({ id, ...updatedOrder });

            const updateStatusOrderReturn = { ...orderReturn, status: 0 };
            const idOrderReturn = order?.orderReturn?._id;
            onUpdateOrderReturn({ id: idOrderReturn, ...updateStatusOrderReturn });

            setOpenFormConfirmOrderReturn(false);
            message.error(`Xác nhận từ chối yêu cầu đổi hàng`);
        } catch (error) {
            console.log(error);
        }
    };

    function mapStatusToText(statusCode: number) {
        switch (statusCode) {
            case 0:
                return "Đã hủy";
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
                return "Y/c đổi hàng";
            default:
                return "Trạng thái không xác định";
        }
    }



    const totalCart = ListOrderDeatils?.reduce((total, order) => {
        return total + order.totalMoney;
    }, 0);

    return <>
        <Breadcrumb className='pb-3'
            items={[
                {
                    title: <Link to={`/admin/order`}>Đơn hàng</Link>,
                },
                {
                    title: 'Cập nhật',
                    className: 'uppercase',
                },
            ]}
        />

        <div className="hidden">
            <div className="p-16" ref={componentRef} >
                <div className="flex justify-between pb-5 p-4">
                    <div className="">
                        <span className='text-base font-bold'>MÃ ĐƠN HÀNG</span>
                        <span className='block text-base font-bold'>#{order?._id}</span>
                        <span className='block text-sm'>{moment(order?.createdAt as string, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("HH:mm DD/MM/YYYY")}</span>

                    </div>
                    <div className="">
                        <img className="w-[130px]" src="../../public/images/logo/dec5f33d-20b9-45cc-ab8c-5ce587a75660.jpg" alt="" />
                    </div>
                </div>
                <div className="">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        summary={(pageData) => {
                            let total = 0;
                            pageData.forEach((record) => {
                                total += record.price * record.quantity;
                            });

                            return (
                                <>
                                    {order?.orderReturn?.status !== 0 && order?.orderReturn?.status !== 1 ? (
                                        <>
                                            {orderReturnDetail?.map((item: any, index) => (

                                                <Table.Summary.Row className='opacity-80 bg-slate-100'>
                                                    <Table.Summary.Cell
                                                        className=''
                                                        key={item.key}
                                                        colSpan={1}
                                                        index={0}
                                                    >
                                                        <div className='flex'>
                                                            {/* <div className='mr-2'>
                                                                <img src={item?.productInfo.imageColor} alt="" className='w-14 h-20 object-cover' />
                                                            </div> */}
                                                            <div className="space-y-3 py-2 font-light">
                                                                <span className='block'>{item?.productName}</span>
                                                                <span className='block text'>{item?.productInfo.nameColor} / {item.size}</span>
                                                            </div>
                                                        </div>

                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell key={item.key} colSpan={1} index={index}>
                                                        {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell key={item.key} colSpan={1} index={index}>
                                                        {item.quantity}
                                                    </Table.Summary.Cell>

                                                    <Table.Summary.Cell key={item.key} colSpan={1} index={index}>

                                                        <div className='text-end'>{(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                    </Table.Summary.Cell>
                                                    <Badge.Ribbon text="Đổi hàng" className='opacity-100'>
                                                    </Badge.Ribbon>
                                                </Table.Summary.Row>
                                            ))}
                                        </>
                                    ) : null}


                                    <Table.Summary.Row className=''>
                                        <Table.Summary.Cell index={0} colSpan={3}>
                                            <span className='block'>Tổng sản phẩm</span>
                                            {order?.voucher_code ? <span className='block'>Khuyến mãi</span> : ""}
                                            <span className='block'>Vận chuyển</span>
                                            <span className='block'>Tổng</span>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>
                                            <div className='text-end'>
                                                {totalCart?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </div>
                                            {order?.voucher_code && <div className='text-end'>
                                                -{voucherByOrder?.[0]?.type === "value" ? voucherByOrder?.[0]?.discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ((Number(voucherByOrder?.[0]?.discount) * totalCart!) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                {/* {totalCart?} */}
                                            </div>}
                                            {order?.pay_method === "FREE" || (totalCart && totalCart > 500000) ? (
                                                <div className='text-end'>
                                                    Miễn phí
                                                </div>
                                            ) : (
                                                <div className='text-end'>
                                                    {(order?.pay_method === "FREE" || (totalCart && totalCart < 500000)) && order?.orderReturn ? (
                                                        <div className='text-end'>
                                                            Miễn phí
                                                        </div>
                                                    ) : (
                                                        <div className='text-end'>
                                                            40,000đ
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className='text-end'>
                                                {order?.totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </div>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>

                                </>
                            );
                        }}
                    />
                </div>
                <div className="">
                    <div className="">
                        <div className="p-4">
                            <h2 className='text-base mb-3 font-bold text-gray-900 '>Thông tin giao hàng</h2>
                            <div className="flex space-x-3">
                                <div className="space-y-1">
                                    <div className="flex space-x-3">
                                        <div className="">
                                            <span className='block text-sm font-bold'>Người nhận:</span>
                                            <span className='block text-sm font-bold'>SĐT:</span>
                                        </div>
                                        <div className="">
                                            <span className='block text-sm'>{order?.fullName}</span>
                                            <span className='block text-sm'>{order?.phoneNumber}</span>
                                        </div>
                                    </div>
                                    <span className='block text-sm font-bold'>Địa chỉ:</span>
                                    <div className="">
                                        <span className='block text-sm'>{order?.address?.myProvince}</span>
                                        <span className='block text-sm'>{order?.address?.myDistrict}</span>
                                        <span className='block text-sm'>{order?.address?.myWard}</span>
                                        <span className='block text-sm'>{order?.address?.detailAddress}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">


                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>

        <div className='px-10 '>
            <div className="space-y-2 py-5 w-[85%] mx-auto">
                <div className="flex items-center space-x-2">
                    <span className='block text-lg font-medium'>#{order?._id}</span>
                    <Tooltip title="In đơn" color={'orange'} key={'orange'}>
                        <button
                            onClick={handlePrint}
                        >
                            <PrinterFilled className='text-lg text-orange-500' />
                        </button>
                    </Tooltip>
                </div>
                <div className="flex space-x-1 text-gray-400">
                    <span className='block'>{moment(order?.createdAt as string, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("HH:mm DD/MM/YYYY")}</span>
                    <span className='border-l border-gray-300'></span>
                    <span className='block'>
                        Trạng thái: {order && order.status === 5 ? (
                            <span className='text-green-500'>Hoàn thành</span>
                        ) : (
                            <span className='text-blue-500'>{mapStatusToText(Number(order?.status))}</span>
                        )}
                    </span>
                </div>
            </div>

            <div className="flex w-[85%] mx-auto space-x-10">

                <div className="border bg-white w-2/3">

                    <div className="">
                        <h2 className='text-[#1677ff] text-lg border-b border-t px-5 py-3'>
                            Chi tiết đơn hàng
                        </h2>
                        <div className="">
                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                summary={(pageData) => {
                                    let total = 0;
                                    pageData.forEach((record) => {
                                        total += record.price * record.quantity;
                                    });

                                    return (
                                        <>
                                            {order?.orderReturn?.status !== 0 && order?.orderReturn?.status !== 1 ? (
                                                <>
                                                    {orderReturnDetail?.map((item: any, index) => (

                                                        <Table.Summary.Row className='opacity-80 bg-slate-100'>
                                                            <Table.Summary.Cell
                                                                className=''
                                                                key={item.key}
                                                                colSpan={1}
                                                                index={0}
                                                            >
                                                                <div className='flex'>
                                                                    <div className='mr-2'>
                                                                        <img src={item?.productInfo.imageColor} alt="" className='w-14 h-20 object-cover' />
                                                                    </div>
                                                                    <div className="space-y-3 py-2 font-light">
                                                                        <span className='block'>{item?.productName}</span>
                                                                        <span className='block text'>{item?.productInfo.nameColor} / {item.size}</span>
                                                                    </div>
                                                                </div>

                                                            </Table.Summary.Cell>
                                                            <Table.Summary.Cell key={item.key} colSpan={1} index={index}>
                                                                {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                            </Table.Summary.Cell>
                                                            <Table.Summary.Cell key={item.key} colSpan={1} index={index}>
                                                                {item.quantity}
                                                            </Table.Summary.Cell>

                                                            <Table.Summary.Cell key={item.key} colSpan={1} index={index}>

                                                                <div className='text-end'>{(item.price * item.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                                                            </Table.Summary.Cell>
                                                            <Badge.Ribbon text="Đổi hàng" className='opacity-100'>
                                                            </Badge.Ribbon>
                                                        </Table.Summary.Row>
                                                    ))}
                                                </>
                                            ) : null}


                                            <Table.Summary.Row className=''>
                                                <Table.Summary.Cell index={0} colSpan={3}>
                                                    <span className='block'>Tổng sản phẩm</span>
                                                    {order?.voucher_code ? <span className='block'>Khuyến mãi</span> : ""}
                                                    <span className='block'>Vận chuyển</span>
                                                    <span className='block'>Tổng</span>
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={1}>
                                                    <div className='text-end'>
                                                        {totalCart?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </div>
                                                    {order?.voucher_code && <div className='text-end'>
                                                        -{voucherByOrder?.[0]?.type === "value" ? voucherByOrder?.[0]?.discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ((Number(voucherByOrder?.[0]?.discount) * totalCart!) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                        {/* {totalCart?} */}
                                                    </div>}
                                                    {order?.pay_method === "FREE" || (totalCart && totalCart > 500000) ? (
                                                        <div className='text-end'>
                                                            Miễn phí
                                                        </div>
                                                    ) : (
                                                        <div className='text-end'>
                                                            {(order?.pay_method === "FREE" || (totalCart && totalCart < 500000)) && order?.orderReturn ? (
                                                                <div className='text-end'>
                                                                    Miễn phí
                                                                </div>
                                                            ) : (
                                                                <div className='text-end'>
                                                                    40,000đ
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className='text-end'>
                                                        {order?.totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                    </div>
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                            <Table.Summary.Row className=''>
                                                {order?.pay_method === "FREE" ? (
                                                    <Table.Summary.Cell index={0} colSpan={3}>
                                                        <div className="flex items-center space-x-2">
                                                            <CheckCircleOutlined className='text-green-500 text-2xl' />
                                                            <div className="">
                                                                <span className='text-xs font-semibold block'>
                                                                    ĐƠN HÀNG ĐÃ XÁC NHẬN THANH TOÁN
                                                                    {/* {(order as any).totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ */}
                                                                </span>
                                                                <span className='block text-gray-800 text-xs'>
                                                                    (Đơn hàng đổi hàng)
                                                                </span>
                                                            </div>
                                                        </div>

                                                    </Table.Summary.Cell>
                                                ) : (
                                                    <Table.Summary.Cell index={0} colSpan={3}>
                                                        {(order as any)?.paymentStatus === 1 ? (
                                                            <div className="flex items-center space-x-2">
                                                                <CheckCircleOutlined className='text-green-500 text-2xl' />
                                                                <div className="">
                                                                    <span className='text-xs font-semibold'>
                                                                        ĐƠN HÀNG ĐÃ XÁC NHẬN THANH TOÁN
                                                                        {/* {(order as any).totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ */}
                                                                    </span>
                                                                    <span className='block text-gray-800 text-xs'>
                                                                        {order?.pay_method === "COD" ? "Thu hộ (COD)" : "Chuyển khoản ngân hàng"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center space-x-2 ">
                                                                <CreditCardOutlined className='text-[#1677ff] text-lg' />
                                                                <span className='block text-xs'>{order?.pay_method === "COD" ? "THU HỘ (COD)" : "CHUUYỂN KHOẢN"}</span>
                                                            </div>
                                                        )}
                                                    </Table.Summary.Cell>
                                                )}

                                                <Table.Summary.Cell index={1}>
                                                    {(order as any)?.paymentStatus !== 1 && (order as any)?.pay_method === "COD" ? (
                                                        <div className="flex justify-end">
                                                            <Popconfirm
                                                                title="Xác nhận thanh toán"
                                                                description={`Xác nhận khách hàng đã thanh toán số tiền ${order?.totalMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ cho phương thức thanh toán cho đơn hàng này`}
                                                                onConfirm={updatePaymentStatus}
                                                                okButtonProps={{ className: "text-white bg-blue-500" }}
                                                            // onOpenChange={() => console.log('open change')}
                                                            >
                                                                <Button type="primary" className='bg-blue-500'>Xác nhận thanh toán</Button>

                                                            </Popconfirm>
                                                        </div>
                                                    ) : null}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>

                                            {
                                                orderReturn?.status === 2 ? (
                                                    <Table.Summary.Row className=''>
                                                        <Table.Summary.Cell index={0} colSpan={3}>
                                                            <span className='text-xs font-semibold'>
                                                                YÊU CẦU ĐỔI HÀNG
                                                            </span>
                                                        </Table.Summary.Cell>
                                                        <Table.Summary.Cell index={1}>
                                                            <Link to={`/admin/orderreturn/${orderReturn._id}`}><Button className='w-full bg-yellow-500 text-white hover:text-white hover:bg-yellow-400'>Kiểm tra</Button></Link>
                                                        </Table.Summary.Cell>
                                                    </Table.Summary.Row >
                                                ) : ""
                                            }

                                            <Table.Summary.Row className=''>
                                                <Table.Summary.Cell index={0} colSpan={3}>
                                                    {order?.status === 6 ? (
                                                        <div className="flex items-center space-x-1">
                                                            <span className='block '>YÊU CẦU ĐỔI TRẢ</span>
                                                        </div>
                                                    ) : order?.status === 5 ? (
                                                        <div className="flex items-center space-x-1">
                                                            <span className='block '>ĐƠN HÀNG</span>
                                                        </div>
                                                    ) : order?.status === 4 && order.paymentStatus === 1 ? (
                                                        <div className="flex items-center space-x-1">
                                                            <span className='block '>ĐƠN HÀNG</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-1">
                                                            <span className='block '>GIAO HÀNG</span>
                                                        </div>
                                                    )}

                                                </Table.Summary.Cell>

                                                <Table.Summary.Cell index={1}>
                                                    <div className="">
                                                        {order?.status === 0 && (
                                                            <div className='w-[160px] leading-[30px] rounded-md text-center bg-red-500 text-white outline-none hover:text-white'>Hủy đơn hàng</div>
                                                        )}
                                                        {/* {order?.status === 4 && (
                                                            <div className='w-[160px] leading-[30px] rounded-md text-center font-semibold bg-green-500 text-white outline-none hover:text-white'>Đã nhận hàng</div>
                                                        )} */}
                                                        {order?.status === 4 && order?.paymentStatus === 1 ? (
                                                            <Popconfirm
                                                                title="Xác nhận"
                                                                description={`Xác nhận hoàn thành đơn hàng `}
                                                                onConfirm={updateStatusComplte}
                                                                okButtonProps={{ className: "text-white bg-blue-500" }}
                                                            // onOpenChange={() => console.log('open change')}
                                                            >
                                                                <Button type="primary" className='bg-blue-500'>Xác nhận hoàn thành đơn hàng</Button>
                                                            </Popconfirm>
                                                        ) : order?.status === 4 ? (
                                                            <div className='w-[160px] leading-[30px] text-center text-green-500 '>Đã nhận hàng</div>
                                                        ) : ""}
                                                        {order?.status === 5 && (
                                                            <div className='w-[160px] leading-[30px] text-center  text-green-500  ' >Hoàn thành</div>
                                                        )}
                                                        {order?.status === 3 && (
                                                            <div className='w-[160px] leading-[30px] rounded-md text-center  bg-blue-500 text-white outline-none hover:text-white' >Đang giao hàng</div>
                                                        )}
                                                        {order?.status === 6 && (
                                                            <div className="flex justify-end">
                                                                <span className="inline-block cursor-pointer border rounded-lg p-2 font-medium text-xs text-yellow-500 border-yellow-500 transition-transform transform hover:scale-105"
                                                                    onClick={() => setOpenFormConfirmOrderReturn(true)}
                                                                >
                                                                    Kiểm tra
                                                                </span>
                                                                {/* <Button className='bg-yellow-500 text-white hover:text-white hover:bg-yellow-400' onClick={() => setOpenFormConfirmOrderReturn(true)}>Kiểm tra</Button> */}
                                                            </div>
                                                        )}
                                                        {order?.status === 1 || order?.status === 2 ? (
                                                            <div className="flex justify-end">
                                                                <Button type="primary" className='bg-blue-500' onClick={() => setOpenFormUpdateStatus(true)}>Cập nhật trạng thái giao hàng</Button>
                                                            </div>
                                                        ) : ""}

                                                        <Modal
                                                            title="Yêu cầu đổi hàng"
                                                            // centered
                                                            open={openFormConfirmOrderReturn}
                                                            onOk={() => setOpenFormConfirmOrderReturn(false)}
                                                            onCancel={() => setOpenFormConfirmOrderReturn(false)}
                                                            okButtonProps={{ hidden: true }}
                                                            cancelButtonProps={{ hidden: true }}
                                                            width={500}
                                                        >
                                                            <div className="space-y-1">
                                                                <span className='font-medium'>Khách hàng: </span>
                                                                <span>{orderReturn?.fullName}</span>
                                                                <span className='block mb-2 font-medium'> Lí do: </span>
                                                                <div className="">
                                                                    <FrownOutlined className='text-red-500 px-1' />  {orderReturn?.reason}
                                                                    {/* <TextArea value={orderReturn?.reason} rows={3} /> */}
                                                                </div>
                                                                <Image.PreviewGroup>
                                                                    <div className='flex space-x-2 py-3'>
                                                                        {orderReturn?.images?.map((url: any) => (
                                                                            <div
                                                                                className='w-24 h-24 border flex justify-center items-center rounded-md hover:border-blue-400 shadow-xl '
                                                                            >
                                                                                <Image height={80} src={url} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </Image.PreviewGroup>
                                                                <div className="">
                                                                    <h2 className=' font-medium text-gray-800 my-3'>Sản phẩm đổi trả</h2>
                                                                    {orderReturnDetail.map((item: any) => (
                                                                        <div className="flex items-center justify-between space-x-2 mb-3">
                                                                            <div className="flex items-center space-x-2">
                                                                                <div className="">
                                                                                    <img className='h-16 w-16' src={item.productInfo.imageColor} alt="" />
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                    <span className='block text-gray-800'><Link to={`/admin/product/${item.productInfo.product_id}`}>{item.productName}</Link></span>
                                                                                    <div className="flex space-x-3">
                                                                                        <div className="space-x-1 text-xs">
                                                                                            <span>Phân loại:</span>
                                                                                            <span className='text-blue-500'>{item.color}</span>
                                                                                            <span className='border-l text-gray-400'></span>
                                                                                            <span className='text-blue-500'>{item.size}</span>
                                                                                        </div>
                                                                                        <div className="text-xs">
                                                                                            <span>Mã SP: <Link to={`/admin/product/${item.productInfo.product_id}`}>{item.sku}</Link></span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className=" space-x-3">
                                                                                <span className='text-[12px] text-gray-500'>SL: 1</span>
                                                                                {/* <span className='text-[12px] text-gray-500'>320,000 đ</span> */}
                                                                            </div>
                                                                        </div>
                                                                    ))}


                                                                </div>
                                                                <div className="flex justify-end pt-8 space-x-3">
                                                                    <Button
                                                                        onClick={() => unConfirmOrderReturn()}>
                                                                        Từ chối yêu cầu
                                                                    </Button>
                                                                    <Button type="primary"
                                                                        className='bg-blue-500'
                                                                        onClick={() => confirmOrderReturn()}>
                                                                        Xác nhận
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Modal>

                                                        <Modal
                                                            title="Cập nhật trạng thái giao hàng"
                                                            centered
                                                            open={openFormUpdateStatus}
                                                            onOk={() => setOpenFormUpdateStatus(false)}
                                                            onCancel={() => setOpenFormUpdateStatus(false)}
                                                            okButtonProps={{ hidden: true }}
                                                            cancelButtonProps={{ hidden: true }}
                                                            width={500}
                                                        >
                                                            <Form
                                                                form={form}
                                                                name="validateOnly"
                                                                layout="vertical"
                                                                onFinish={updateStatus}
                                                                autoComplete="off"
                                                                className="mx-auto"
                                                            >
                                                                <Form.Item name="status" label="Trạng thái giao hàng">
                                                                    {form.getFieldValue('status') === 0 ? (
                                                                        <div className='w-full leading-[30px] rounded-md text-center font-semibold bg-red-500 text-white outline-none hover:text-white'>Hủy đơn hàng</div>
                                                                    ) : form.getFieldValue('status') === 4 ? (
                                                                        <div className='w-full leading-[30px] rounded-md text-center font-semibold bg-green-500 text-white outline-none hover:text-white' >Đã hoàn thành</div>
                                                                    ) : (
                                                                        <Select
                                                                            allowClear
                                                                            options={[
                                                                                { value: 0, label: 'Hủy đơn hành' },
                                                                                { value: 1, label: 'Chờ xử lí' },
                                                                                { value: 2, label: 'Chờ lấy hàng' },
                                                                                { value: 3, label: 'Đang giao' },
                                                                                { value: 4, label: 'Hoàn thành', disabled: true },
                                                                            ].filter(option => form.getFieldValue('status') <= option.value)}
                                                                            disabled={form.getFieldValue('status') === 0 || form.getFieldValue('status') === 4}
                                                                        ></Select>
                                                                    )}
                                                                </Form.Item>
                                                                <Form.Item >
                                                                    <Button type="primary" htmlType="submit" className='bg-blue-500 flex '>
                                                                        Lưu
                                                                    </Button>
                                                                </Form.Item>
                                                            </Form>
                                                        </Modal>
                                                    </div>

                                                </Table.Summary.Cell>
                                            </Table.Summary.Row >


                                        </>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-1/3 space-y-5">
                    <div className="border w-full bg-white p-3">
                        <div className="flex mb-2 items-center justify-between">
                            <h2 className='text-sm font-medium text-gray-900 '>Ghi chú</h2>
                            <Button type="link" onClick={() => setOpenFormUpdateNote(true)}>
                                <span className='underline italic'>Sửa</span>
                            </Button>
                            <Modal
                                title="Sửa ghi chú"
                                centered
                                open={openFormUpdateNote}
                                onOk={() => setOpenFormUpdateNote(false)}
                                onCancel={() => setOpenFormUpdateNote(false)}
                                okButtonProps={{ hidden: true }}
                                cancelButtonProps={{ hidden: true }}
                                width={500}
                            >
                                <Form
                                    form={form}
                                    name="validateOnly"
                                    layout="vertical"
                                    onFinish={updateNote}
                                    autoComplete="off"
                                    className="mx-auto"
                                >
                                    <Form.Item
                                        name="note"
                                    >
                                        <TextArea rows={4} />
                                    </Form.Item>
                                    <Form.Item >
                                        <Button type="primary" htmlType="submit" className='bg-blue-500 flex '>
                                            Lưu
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
                        {order?.note === "" ? (
                            <span>Không có ghi chú</span>
                        ) : (
                            <span>
                                {order?.note}
                            </span>
                        )}
                    </div>
                    <div className="border w-full bg-white">
                        <div className="border-b p-4">
                            <h2 className='text-sm mb-2  font-medium text-gray-900 '>Khách hàng</h2>
                            <span className='block text-blue-500 underline'><Link to={``}>{(order as any)?.userId?.fullname}</Link></span>
                        </div>
                        <div className="border-b p-4">
                            <h2 className='text-sm mb-2 font-medium text-gray-900 '>Thông tin liên hệ</h2>
                            <span className='block'>{(order as any)?.userId?.email}</span>
                        </div>
                        <div className="border-b p-4">
                            <div className="flex mb-2 items-center justify-between">
                                <h2 className='text-sm font-medium text-gray-900 '>ĐỊA CHỈ GIAO HÀNG</h2>
                                <Button type="link" onClick={() => setOpenFormUpdateInfo(true)}>
                                    <span className='underline italic'>Sửa</span>
                                </Button>

                                <Modal
                                    title="Sửa địa chỉ giao hàng"
                                    centered
                                    open={openFormUpdateInfo}
                                    onOk={() => setOpenFormUpdateInfo(false)}
                                    onCancel={() => setOpenFormUpdateInfo(false)}
                                    okButtonProps={{ hidden: true }}
                                    cancelButtonProps={{ hidden: true }}
                                    width={500}
                                >
                                    <Form
                                        form={form}
                                        name="validateOnly"
                                        layout="vertical"
                                        onFinish={updateInfo}
                                        autoComplete="off"
                                        className="mx-auto"
                                    >
                                        <Form.Item
                                            name="fullName"
                                            label="Khách hàng"
                                            rules={[
                                                {
                                                    required: true,
                                                }
                                            ]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            name="phoneNumber"
                                            label="Số điện thoại"
                                            rules={[{ required: true }]}
                                        >
                                            <Input
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name="myProvince"
                                            label="Tỉnh/thành phố"
                                            rules={[{ required: true }]}
                                        >
                                            <Select
                                                defaultValue={provinceUpdate?.code}
                                                onChange={handleProvinceChange}
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="Chọn tỉnh, thành phố"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) =>
                                                    (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                optionLabelProp="customLabel"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                    </div>
                                                )}
                                            >
                                                {provinces.map((item: any) => (
                                                    <Option key={item.code} value={item.code} label={item.name}
                                                        customLabel={
                                                            <span>{item.name}</span>
                                                        }>
                                                        <span>{item.name}</span>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="myDistrict"
                                            label="Quận/huyện"
                                            rules={[{ required: true }]}
                                        >
                                            <Select
                                                defaultValue={codeDistrict}
                                                onChange={handleDistrictChange}
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="Chọn quận, huyện"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) =>
                                                    (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                optionLabelProp="customLabel"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                    </div>
                                                )}
                                            >
                                                {districts?.districts?.map((item: any) => (
                                                    <Option key={item.code} value={item.code} label={item.name}
                                                        customLabel={
                                                            <span>{item.name}</span>
                                                        }>
                                                        <span>{item.name}</span>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="myWard"
                                            label="Xã/phường"
                                            rules={[{ required: true }]}
                                        >
                                            <Select
                                                defaultValue={codeWard}
                                                onChange={handleWardChange}
                                                showSearch
                                                style={{ width: '100%' }}
                                                placeholder="Chọn xã, phường"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) =>
                                                    (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                                                }
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                optionLabelProp="customLabel"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                    </div>
                                                )}
                                            >
                                                {wards?.wards?.map((item: any) => (
                                                    <Option key={item.code} value={item.code} label={item.name}
                                                        customLabel={
                                                            <span>{item.name}</span>
                                                        }>
                                                        <span>{item.name}</span>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="detailAddress"
                                            label="Địa chỉ"
                                            rules={[{ required: true }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item >
                                            <Button type="primary" htmlType="submit" className='bg-blue-500 flex '>
                                                Lưu
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                            <span className='block'>{order?.fullName}</span>
                            <span className='block'>{order?.phoneNumber}</span>
                            <span className='block'>{order?.address?.myProvince}</span>
                            <span className='block'>{order?.address?.myDistrict}</span>
                            <span className='block'>{order?.address?.myWard}</span>
                            <span className='block'>{order?.address?.detailAddress}</span>
                        </div>
                        <div className="border-b p-4">
                            <h2 className='text-sm mb-2 font-medium text-gray-900 '>Phương thức vận chuyển</h2>
                            <span className='block'>Giao hàng tận nơi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    </>
}

export default orderUpdate;