import {
    Space,
    Table,
    Button,
    message,
    Spin,
    Select,
    MenuProps,
    Dropdown,
    DatePicker,
    Tooltip,
    Badge,
    Typography,
    Modal
} from 'antd';
import {
    EyeOutlined,
    DownOutlined,
    FileExcelFilled,
    PrinterFilled
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useListOrderQuery } from '../../../store/order/order.service';
import { listOrderSearchSlice, listOrderSlice } from '../../../store/order/orderSlice';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import React from 'react';
import { } from 'antd';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
const { RangePicker } = DatePicker;
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

const ordersPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { data: orders, isLoading, isError, isSuccess } = useListOrderQuery()
    const { handleSubmit } = useForm();
    const [search, setSearch] = useState<string>("")
    const orderState = useSelector((state: RootState) => state.orderSlice.orders)
    const componentRef = useRef();

    const [selectedStatus, setSelectedStatus] = useState<any[]>([]);
    const [dateFrom, setDateFrom] = useState<any>(null);
    const [dateTo, setDateTo] = useState<any>(null);
    const [selectedFilterType, setSelectedFilterType] = useState('');

    const [orderOption, setOrderOption] = useState<Number>(1);
    const [visibleStatus, setVisibleStatus] = useState(false);
    const [visibleDate, setVisibleDate] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (orders) {
            if (search === "" || !search) {
                dispatch(listOrderSlice(orders))
            }
        }
    }, [isSuccess, search])

    const handleSearch = () => {
        if (orders) {
            dispatch(listOrderSearchSlice({ searchTerm: search, orders: orders }))
        }
    }

    if (isError) {
        return <>error</>;
    }

    if (isLoading) {
        return <>
            <div className="fixed inset-0 flex justify-center items-center bg-gray-50 ">
                <Spin size='large' />
            </div>
        </>;
    }
    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (value: any) => <Link to={``} className='uppercase font-bold '>{value}</Link>,
            className: 'w-[100px]'
        },
        {
            title: 'MÃ ĐƠN HÀNG',
            key: '_id',
            render: (record: any) => (<Link to={`/admin/order/${record?._id}`} className='uppercase'>#{record?._id}</Link>),
            className: 'w-1/6',
        },
        {
            title: 'NGÀY ĐẶT',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => {
                const dateA = moment(a.date);
                const dateB = moment(b.date);

                // So sánh theo thời gian
                return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
            },
            render: (value: any) => <span>{value}</span>,
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: 'KHÁCH HÀNG',
            dataIndex: 'fullName',
            key: 'fullName',
            className: 'w-1/4',
        },
        {
            title: 'TỔNG',
            dataIndex: 'totalMoney',
            key: 'totalMoney',
            sorter: (a, b) => a.totalMoney - b.totalMoney, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
            render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
        {
            title: 'THANH TOÁN',
            key: 'paymentStatus',
            render: (value: any) => (value.paymentStatus === 'Đã thanh toán' ? (
                <Badge status="success" text={<Text type="success" className=''>Đã thanh toán</Text>} />
            ) : (
                <Badge status="default" text={<Text className=''>Chưa thanh toán</Text>} />
            )),
            sorter: (a, b) => a.paymentStatus - b.paymentStatus, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: 'TRẠNG THÁI',
            key: 'status',
            render: (value: any) => {

                switch (value.status) {
                    case 'Đơn hàng bị hủy':
                        return (
                            <Badge status={"error"} text={<Text type="danger" >Hủy đơn hàng</Text>} />
                        )
                    case 'Chờ xử lí':
                        return (
                            <Badge status="default" text={<Text >Chờ xử lí</Text>} />
                        )
                    case 'Chờ lấy hàng':
                        return (
                            <Badge color={"cyan"} text={<Text className='text-cyan-500'>Chờ lấy hàng</Text>} />
                        )
                    case 'Đang giao':
                        return (
                            <Badge status="processing" text={<Text className='text-blue-400'>Đang giao</Text>} />
                        )
                    case 'Đã nhận hàng':
                        return (
                            <Badge color={"lime"} text={<Text type="success" className='text-lime-300'>Đã nhận hàng</Text>} />
                        )
                    case 'Hoàn thành':
                        return (
                            <Badge status={"success"} text={<Text type="success" className=''>Hoàn thành</Text>} />
                        )
                    case 'Y/C đổi hàng':
                        return (
                            <Badge status={"warning"} text={<Text type="warning" >Y/C đổi hàng</Text>} />
                        )
                    default:
                        return "Không xác định"
                }

                // return (

                //     <Badge key={statusColor} status={"success"} text={<Text type="success" className=''>{statusText}</Text>} />
                //     // <span className={`border rounded-lg px-2 py-1 text-xs  ${statusColor}`}>
                //     //     {statusText}
                //     // </span>
                // );
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

        {
            title: '',
            key: 'action',
            render: (record: any) => (
                <Space size="middle" className='flex justify-end'>
                    <Tooltip title="Xem" color={'green'} key={'green'}>
                        <Link to={`/admin/order/${record?._id}`}>
                            <EyeOutlined className='text-xl text-green-500' />
                        </Link>
                    </Tooltip>
                </Space>
            ),
        },

    ];

    const toggleStatus = (status: any) => {
        if (selectedStatus.includes(status)) {
            setSelectedStatus(selectedStatus.filter(item => item !== status));
        } else {
            setSelectedStatus([...selectedStatus, status]);
        }
    };

    const filteredOrder = orderState?.filter((order: any) => {
        // Lọc theo danh mục đã chọn
        if (selectedStatus.length > 0 && !selectedStatus.includes(order.status)) {
            return false;
        }
        // Lọc theo thời gian
        if (dateFrom && dateTo) {
            const createdAtMoment = moment(order.createdAt, 'YYYY-MM-DD HH:mm:ss');

            if (!createdAtMoment.isBetween(dateFrom, dateTo)) {
                return false;
            }
        }

        return true;
    });
    const handleResetClick = () => {
        setSelectedStatus([]);
    };

    const handleClickFilterStatus = () => {
        setVisibleStatus(!visibleStatus);
    };

    const listStatusByOrder = [0, 1, 2, 3, 4, 5, 6];
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
    const filterStatus: MenuProps['items'] = [
        {
            label: (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{selectedStatus?.length} đã chọn</span>

                    <button
                        type="button"
                        className="text-sm text-gray-900 underline underline-offset-4"
                        onClick={handleResetClick}
                    >
                        Reset
                    </button>
                </div>
            ),
            key: '0',
        },
        {
            type: 'divider',
        },
        ...(listStatusByOrder?.map((status: any) => ({
            label: (
                <label htmlFor={`FilterStatus-${status}`} className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`FilterStatus-${status}`}
                        className="h-5 w-5 rounded border-gray-300"
                        checked={selectedStatus?.includes(status)}
                        onChange={() => toggleStatus(status)}
                    />

                    <span className="text-sm font-medium text-gray-700">{orderStatus(status)}</span>
                    {/* ({cate.products.length - 1}) */}
                </label>
            ),
            key: status,
        })) || []),
    ];

    const handleClickFilterDate = () => {
        setVisibleDate(!visibleDate);
    };
    const handleResetDate = () => {
        setSelectedFilterType("")
        setDateFrom(null);
        setDateTo(null);
    };

    const handleDateFilter = (filterType: string) => {
        let fromDate, toDate;

        switch (filterType) {
            case 'today':
                fromDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
                toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'oneWeekAgo':
                fromDate = moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
                toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            case 'oneMonthAgo':
                fromDate = moment().subtract(1, 'months').startOf('day').format('YYYY-MM-DD HH:mm:ss');
                toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
            default:
                fromDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
                toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                break;
        }

        setDateFrom(fromDate);
        setDateTo(toDate);
    };

    const handleDateChange = (dates: [moment.Moment, moment.Moment] | null) => {
        if (dates) {
            const fromDate = dates[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const toDate = dates[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');
            setDateFrom(fromDate);
            setDateTo(toDate);
            setSelectedFilterType('');
        } else {
            setDateFrom(null);
            setDateTo(null);
        }
    };

    const filterDate: MenuProps['items'] = [
        {
            label: (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Thời gian</span>

                    <button
                        type="button"
                        className="text-sm text-gray-900 underline underline-offset-4"
                        onClick={handleResetDate}
                    >
                        Reset
                    </button>
                </div>
            ),
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <label htmlFor="FilterToday" className="inline-flex items-center gap-2">
                    <input
                        name="FilterToday"
                        type="radio"
                        id="FilterToday"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => {
                            handleDateFilter('today');
                            setSelectedFilterType('today');
                        }}
                        checked={selectedFilterType === 'today'}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        Hôm nay
                    </span>
                </label>
            ),
            key: 'today',
        },
        {
            label: (
                <label htmlFor="FilterOneWeekAgo" className="inline-flex items-center gap-2">
                    <input
                        name="FilterOneWeekAgo"
                        type="radio"
                        id="FilterOneWeekAgo"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => {
                            handleDateFilter('oneWeekAgo');
                            setSelectedFilterType('oneWeekAgo');
                        }}
                        checked={selectedFilterType === 'oneWeekAgo'}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        1 tuần trước
                    </span>
                </label>
            ),
            key: 'oneWeekAgo',
        },
        {
            label: (
                <label htmlFor="FilterOneMonthAgo" className="inline-flex items-center gap-2">
                    <input
                        name="FilterOneMonthAgo"
                        type="radio"
                        id="FilterOneMonthAgo"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => {
                            handleDateFilter('oneMonthAgo');
                            setSelectedFilterType('oneMonthAgo');
                        }}
                        checked={selectedFilterType === 'oneMonthAgo'}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        1 tháng trước
                    </span>
                </label>
            ),
            key: 'oneMonthAgo',
        },

        {
            label: (
                <RangePicker
                    bordered={false}
                    onChange={(dates: any) => handleDateChange(dates)}
                    format={'DD/MM/YYYY'}
                />
            ),
            key: 1,
        },

    ];

    const sortOrder = [...filteredOrder];

    switch (orderOption) {
        case 1:
            // Mới nhất
            sortOrder.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case 2:
            // Cũ nhất
            sortOrder.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        default:
            break;
    }

    let data: DataType[] = [];

    if (orderState) {
        data = sortOrder?.map((order: any, index) => ({
            key: index + 1,
            _id: order._id,
            date: moment(order.createdAt as string).format("HH:mm DD/MM/YYYY"),
            fullName: order.fullName,
            totalMoney: order.totalMoney,
            pay_method: order.pay_method,
            paymentStatus: order.paymentStatus === 1 ? 'Đã thanh toán' : 'Chưa thanh toán',
            status: orderStatus(order.status),
        }));
    }
    const exportExcel = () => {
        if (data.length === 0) {
            return;
        }

        // Tên cột tùy chỉnh
        const columnHeaders = [
            'STT',
            'MÃ ĐƠN HÀNG',
            'NGÀY ĐẶT',
            'KHÁCH HÀNG',
            'TỔNG TIỀN',
            'PHƯƠNG THỨC THANH TOÁN',
            'TRẠNG THÁI THANH TOÁN',
            'TRẠNG THÁI',
        ];

        // Map data to match the column order
        const mappedData = data.map((item, index) => ({
            'STT': index + 1,
            'MÃ ĐƠN HÀNG': item._id,
            'NGÀY ĐẶT': item.date,
            'KHÁCH HÀNG': item.fullName,
            'TỔNG TIỀN': item.totalMoney,
            'PHƯƠNG THỨC THANH TOÁN': item.pay_method,
            'TRẠNG THÁI THANH TOÁN': item.paymentStatus,
            'TRẠNG THÁI': item.status,
        }));

        const ws = XLSX.utils.json_to_sheet(mappedData, { header: columnHeaders });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        const fileName = 'exported_data.xlsx';
        XLSX.writeFile(wb, fileName);
    };



    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div className="">
            <Space className='mb-5'>
                <div className="">
                    <span className="block text-xl text-[#1677ff]">
                        QUẢN LÝ ĐƠN HÀNG
                    </span>
                </div>
            </Space>

            <div className="border p-3 rounded-lg min-h-screen bg-white">
                <div className="flex pb-6 pt-3 justify-between items-end">
                    <form
                        onSubmit={handleSubmit(handleSearch)}
                        className='w-[500px]'>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                placeholder='Tìm kiếm theo tên khách hàng'
                                onChange={(e) => setSearch(e.target.value)}
                                type="text" id="default-search" className="block w-full outline-none p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#1677ff] hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tìm kiếm</button>
                        </div>
                    </form>

                    <div className="space-x-3 px-3">
                        <Tooltip title="Xuất FilePDF" color={'orange'} key={'orange'}>
                            <button
                                onClick={handlePrint}
                            >
                                <PrinterFilled className='text-lg text-orange-500' />
                            </button>
                        </Tooltip>
                        <Tooltip title="Xuất FileExcel" color={'green'} key={'green'}>
                            <button
                                onClick={exportExcel}
                            >
                                <FileExcelFilled className='text-lg text-green-600' />
                            </button>
                        </Tooltip>

                    </div>

                </div>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-3">
                        <Dropdown
                            menu={{ items: filterStatus }}
                            trigger={['click']}
                            visible={visibleStatus}
                            onOpenChange={handleClickFilterStatus}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Button className='w-[250px]'>
                                    <Space className='flex justify-between' >
                                        <span>Lọc theo trạng thái đơn hàng</span>
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </a>
                        </Dropdown>
                        <Dropdown
                            menu={{ items: filterDate }}
                            trigger={['click']}
                            visible={visibleDate}
                            onOpenChange={handleClickFilterDate}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Button className='w-[250px]'>
                                    <Space className='flex justify-between' >
                                        <span>Lọc theo thời gian</span>
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </a>
                        </Dropdown>
                    </div>
                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-[#333333]">Sắp xếp theo:</span>
                        <Select
                            defaultValue={1}
                            style={{ width: 200 }}
                            options={[
                                { value: 1, label: 'Mới nhất' },
                                { value: 2, label: 'Cũ nhất' },
                            ]}
                            onChange={(value: Number) => setOrderOption(value)}
                        />
                    </div>
                </div>
                <div className="hidden">
                    <div className="" ref={componentRef} >
                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 9999 }} />
                    </div>
                </div>
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} onChange={onChange} />
            </div>
        </div>
    )
}

export default ordersPage;