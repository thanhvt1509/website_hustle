import React, { Dispatch, useEffect, useState } from 'react';
import type { FormInstance, Pagination, UploadFile, UploadProps } from 'antd';
import {
    Badge,
    Breadcrumb,
    Collapse,
    Table,
    Typography
} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    PlusOutlined,
    CaretRightOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useGetInfoUserQuery } from '../../../store/user/user.service';
import moment from 'moment';
import { useListOrderQuery } from '../../../store/order/order.service';
import { listOrderSlice } from '../../../store/order/orderSlice';
import { ColumnsType } from 'antd/es/table';
const { Text } = Typography;

interface DataType {
    key: React.Key;
    _id: string;
    date: any;
    fullName: string;
    status: number;
    pay_method: number;
    totalMoney: number;
    paymentStatus: number;
}

const userInfo = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { id } = useParams();
    const { data: user } = useGetInfoUserQuery(id!)
    const { data: orders, isLoading, isError, isSuccess } = useListOrderQuery()
    useEffect(() => {
        if (orders) {
            if (orders) {
                dispatch(listOrderSlice(orders))
            }
        }
    }, [isSuccess])

    const orderSByUser = orders?.filter((order: any) => order.userId === id)
    console.log(orderSByUser);

    function orderStatus(satus: number) {
        switch (satus) {
            case 0:
                return "Đơn hàng bị hủy";
            case 1:
                return "Chờ xử lí";
            case 2:
                return "Chờ lấy hàng";
            case 3:
                return "Đang giao";
            case 4:
                return "Đã nhận hàng"
            case 5:
                return "Hoàn thành"
            case 6:
                return "Y/C đổi hàng"
            default:
                return "Trạng thái không xác định";
        }
    }
    const columns: ColumnsType<DataType> = [
        {
            title: <span className='text-[13px] font-medium'>STT</span>,
            dataIndex: 'key',
            render: (value: any) => <Link to={``} className='uppercase font-bold text-[13px]'>{value}</Link>,
        },
        {
            title: <span className='text-[13px] font-medium'>MÃ ĐƠN HÀNG</span>,
            key: '_id',
            render: (record: any) => (<Link to={`/admin/order/${record?._id}`} className='uppercase text-[13px]'>#{record?._id}</Link>),
            className: 'w-1/6',
        },
        {
            title: <span className='text-[13px] font-medium'>NGÀY ĐẶT</span>,
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => {
                const dateA = moment(a.date);
                const dateB = moment(b.date);

                // So sánh theo thời gian
                return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
            },
            render: (value: any) => <span className='text-[13px]'>{value}</span>,
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: <span className='text-[13px] font-medium'>TỔNG</span>,
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            sorter: (a, b) => a.totalMoney - b.totalMoney, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
            render: (value: number) => <span className='text-[13px]'>{value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>,
        },
        {
            title: <span className='text-[13px] font-medium'>THANH TOÁN</span>,
            key: 'paymentStatus',
            render: (value: any) => (value.paymentStatus === 1 ? (
                <Badge status="success" text={<Text type="success" className='text-[13px]'>Đã thanh toán</Text>} />
            ) : (
                <Badge status="default" text={<Text className='text-[13px]'>Chưa thanh toán</Text>} />
            )),
            sorter: (a, b) => a.paymentStatus - b.paymentStatus, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: <span className='text-[13px] font-medium'>TRẠNG THÁI</span>,
            key: 'status',
            render: (value: any) => {

                switch (value.status) {
                    case 'Đơn hàng bị hủy':
                        return (
                            <Badge status={"error"} text={<Text type="danger" className='text-[13px]'>Hủy đơn hàng</Text>} />
                        )
                    case 'Chờ xử lí':
                        return (
                            <Badge status="default" text={<Text className='text-[13px]'>Chờ xử lí</Text>} />
                        )
                    case 'Chờ lấy hàng':
                        return (
                            <Badge color={"cyan"} text={<Text className='text-cyan-500 text-[13px]'>Chờ lấy hàng</Text>} />
                        )
                    case 'Đang giao':
                        return (
                            <Badge status="processing" text={<Text className='text-blue-400 text-[13px]'>Đang giao</Text>} />
                        )
                    case 'Đã nhận hàng':
                        return (
                            <Badge color={"lime"} text={<Text type="success" className='text-lime-300 text-[13px]'>Đã nhận hàng</Text>} />
                        )
                    case 'Hoàn thành':
                        return (
                            <Badge status={"success"} text={<Text type="success" className='text-[13px]'>Hoàn thành</Text>} />
                        )
                    case 'Y/C đổi hàng':
                        return (
                            <Badge status={"warning"} text={<Text type="warning" className='text-[13px]'>Y/C đổi hàng</Text>} />
                        )
                    default:
                        return "Không xác định"
                }
            },
            sorter: (a, b) => {
                const customOrder = [0, 1, 2, 3, 4, 5, 6];

                const orderA = customOrder.indexOf(a.status);
                const orderB = customOrder.indexOf(b.status);

                return orderA - orderB;
            },
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
    ];

    let data: DataType[] = [];

    if (orderSByUser) {
        data = orderSByUser?.map((order: any, index) => ({
            key: index + 1,
            _id: order._id,
            date: moment(order.createdAt as string).format("HH:mm DD/MM/YYYY"),
            fullName: order.fullName,
            totalMoney: order.totalMoney,
            pay_method: order.pay_method,
            paymentStatus: order.paymentStatus,
            status: orderStatus(order.status),
        }));
    }

    return <>
        <Breadcrumb className='pb-3'
            items={[
                {
                    title: <Link to={`/admin/user`}>Khách hàng</Link>,
                },
                {
                    title: 'Thông tin',
                    className: 'uppercase'
                },
            ]}
        />
        <div className="w-[85%] mx-auto my-5">
            <span className='block text-lg font-semibold'>MÃ KHÁCH HÀNG</span>
            <span className='block text-lg font-bold'>#{user?._id}</span>
        </div>
        <div className="w-[85%] mx-auto flex space-x-5 ">
            <div className="w-2/3  space-y-6">
                <div className="border bg-white rounded-md">
                    <h3 className='text-base font-medium border-b p-3'>Thông tin chung</h3>
                    <div className=" flex px-3 p-1 space-x-3">
                        <div className="space-y-1 ">
                            <span className='block text-[13px]'>Họ tên:</span>
                            <span className='block text-[13px]'>Email:</span>
                            <span className='block text-[13px]'>SĐT:</span>
                            {/* <span className='block text-[13px]'>Ngày đăng kí:</span> */}
                        </div>
                        <div className=" space-y-1">
                            <span className='block text-[13px]'>{user?.fullname}</span>
                            <span className='block text-[13px]'>{user?.email}</span>
                            <span className='block text-[13px]'>{user?.phoneNumber ? user?.phoneNumber : ""}</span>
                            {/* <span className='block text-[13px]'>{moment(user?.createtdAt as string).format("HH:mm DD/MM/YYYY")}</span> */}

                        </div>
                    </div>
                </div>
                {orderSByUser && orderSByUser?.length > 0 ? (
                    <Collapse
                        size="small"
                        // defaultActiveKey={['1']}
                        ghost
                        className="p-0"
                        style={{ padding: 0 }}
                        expandIcon={({ isActive }) => <CaretRightOutlined className={`text-blue-500`} rotate={isActive ? 90 : 0} />}
                    >
                        <Collapse.Panel key={1} header={<span className="text-blue-500">Đơn hàng đã đặt ({orderSByUser?.length} đơn hàng)</span>} className="m-0">
                            <div className="border bg-white rounded-md">
                                {/* <h3 className='text-base font-medium border-b p-3'>Đơn hàng đã đặt</h3> */}
                                <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                ) : (
                    <span className='text-blue-500 my-5 block px-3'>Khách hàng chưa có đơn hàng nào</span>
                )}



            </div>
            <div className="w-1/3 space-y-5">
                <div className="border w-full bg-white p-3">
                    <div className="flex mb-2 items-center justify-between">
                        <h2 className='text-sm font-medium text-gray-900 '>Trạng thái</h2>

                    </div>
                    <Badge status={"success"} text={<Text type="success" className='text-[13px]'>Đang hoạt động</Text>} />
                </div>
                <div className="border w-full bg-white p-3">
                    <div className="flex mb-2 items-center justify-between">
                        <h2 className='text-sm font-medium text-gray-900 '>Ngày đăng kí</h2>

                    </div>
                    <span className='block text-[13px]'>{moment(user?.createtdAt as string).format("HH:mm DD/MM/YYYY")}</span>
                </div>
                <div className="border w-full bg-white">
                    <div className="border-b p-4">
                        <h2 className='text-sm mb-2  font-medium text-gray-900 '>Khách hàng</h2>
                        <span className='block text-blue-500 underline'><Link to={``}>{user?.fullname}</Link></span>
                    </div>
                    <div className="border-b p-4">
                        <h2 className='text-sm mb-2 font-medium text-gray-900 '>Thông tin liên hệ</h2>
                        <span className='block'>{user?.email}</span>
                    </div>
                    {/* <div className="border-b p-4">
                        <div className="flex mb-2 items-center justify-between">
                            <h2 className='text-sm font-medium text-gray-900 '>ĐỊA CHỈ GIAO HÀNG</h2>
                        </div>

                    </div> */}
                </div>
            </div>
        </div>

    </>
}
export default userInfo;