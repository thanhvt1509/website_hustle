import {
    TeamOutlined,
    SolutionOutlined,
    SkinOutlined,
    BarChartOutlined,
    InboxOutlined,
    DeleteOutlined,
    CaretRightOutlined,
    SendOutlined
} from '@ant-design/icons';
import { useGetDashboardStatisticQuery, useGetOrderRevenueByMonthQuery, useGetOrderRevenueByQuarterQuery, useGetOrderRevenueByWeekQuery, useGetOrderRevenueQuery, useGetProductRevenueQuery } from '../../../store/statistic/statistic.service';
import Highcharts from 'highcharts';
import { MonthlyStatistics, DashboardStatistic } from '../../../store/statistic/statistic.interface';
import HighchartsReact from 'highcharts-react-official';
import {
    Button,
    Collapse,
    Empty,
    Form,
    Image,
    Input,
    List,
    Popconfirm,
    Rate,
    Spin,
    TreeSelect,
    message,
    Typography
} from 'antd';
import { useFetchListProductQuery } from '../../../store/product/product.service';
import { useListOrderQuery } from '../../../store/order/order.service';
import { Dispatch, useEffect, useState } from 'react';
import OrderRevanueByWeek from '../statistic/OrderRevanueByWeek';
import OrderRevanueByMonth from '../statistic/OrderRevanueByMonth';
import OrderRevanueByQuarter from '../statistic/OrderRevanueByQuarter';
import OrderStatistic from '../statistic/OrderStatistic';
import ProductStatistic from '../statistic/ProductStatistic';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useRemoveReviewMutation, useReplyCommentMutation } from '../../../store/reviews/review.service';
import { deleteReviewSlice } from '../../../store/reviews/reviewSlice';
import { useDispatch, useSelector } from 'react-redux';
import { listSatisticSlice } from '../../../store/statistic/statisticSlice';
import { RootState } from '../../../store';
const { Paragraph } = Typography;

const DashboardPage = () => {
    const { data: dashboardStatistic, isSuccess } = useGetDashboardStatisticQuery()
    const { data: orderRevanueMonth } = useGetOrderRevenueByMonthQuery()
    const { data: orderRevanueQuarter, } = useGetOrderRevenueByQuarterQuery();
    const { data: orderRevanueWeek } = useGetOrderRevenueByWeekQuery()
    const { data: productRevanue } = useGetProductRevenueQuery();
    const { data: orderRevanue } = useGetOrderRevenueQuery();

    const [form] = Form.useForm();
    const dispatch: Dispatch<any> = useDispatch()

    const [onReplyComment] = useReplyCommentMutation()
    const [onRemoveComment] = useRemoveReviewMutation()

    // const { data: listProduct } = useFetchListProductQuery()
    // const { data: listOrder } = useListOrderQuery()
    const [value, setValue] = useState<string>("week");

    const dashboardStatisticState = useSelector((state: RootState) => state.statisticSlice.satistics)

    useEffect(() => {
        if (dashboardStatistic) {
            dispatch(listSatisticSlice(dashboardStatistic))
        }
    }, [isSuccess])
    const treeData = [
        {
            title: '24 giờ qua',
            value: 'date',
            children: [
                {
                    title: 'Theo tuần',
                    value: 'week',
                },
                {
                    title: 'Theo tháng',
                    value: 'month',
                },
                {
                    title: 'Theo quý',
                    value: 'quarter',
                },
            ],
        },
    ];
    if (!isSuccess) {
        return <>
            <div className="flex justify-center items-center h-[600px]">
                <Spin size='large' />
            </div>
        </>;
    }
    // const caculateAvgRevalueByMonth = (data: MonthlyStatistics[]) => {
    //     if (data) {
    //         const total = data.reduce((acc, item) => acc += item.totalRevenue, 0) / 12;
    //         return total.toFixed()
    //     }
    // }

    const columnChartData = [
        {
            name: 'Doanh số',
            y: dashboardStatistic?.revenue,
        },
        {
            name: 'Lợi nhuận',
            y: dashboardStatistic?.profit,
        },
    ];

    const columnChartOptions = {
        chart: {
            type: 'column', // Chọn loại biểu đồ cột
        },
        title: {
            text: 'Doanh số và Lợi nhuận',
        },
        xAxis: {
            categories: ['Doanh số', 'Lợi nhuận'],
        },
        yAxis: {
            title: {
                text: 'Số liệu',
            },
        },
        series: [
            {
                name: 'Số liệu trong 24 giờ',
                data: columnChartData,
            },
        ],
    };
    const onChange = (newValue: string) => {
        // navigate(`/admin/statistic/by_` +newValue)
        setValue(newValue);
    };
    const renderComponent = () => {
        switch (value) {
            case 'week':
                return <OrderRevanueByWeek />;
            case 'month':
                return <OrderRevanueByMonth showTable={false} />;
            case 'quarter':
                return <OrderRevanueByQuarter />;
            case 'product':
                return <ProductStatistic />;
            case 'order':
                return <OrderStatistic />;
            default:
                return <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
                    ;
        }
    };
    const replyComment = async (id: any, values: any) => {
        try {
            const value = {
                comment: values.comment,
            }

            await onReplyComment({ id: id, ...value });
            message.success(`Thành công`);
        } catch (error) {
            console.log(error);
        }
    };
    const editReplyComment = async (id: any, values: any) => {
        try {
            const value = {
                comment: values.commentEdit,
            };

            await onReplyComment({ id: id, ...value });

            message.success(`Thành công`);
        } catch (error) {
            console.log(error);
        }
    };


    const removeComment = async (id: string) => {
        try {
            if (id) {
                await onRemoveComment(id).then(() => dispatch(deleteReviewSlice(id)))
                message.success("Xóa thành công")
            }
        } catch (error) {
            console.log(error);
        }

    }
    console.log(dashboardStatistic.newReviews);

    return <>
        <h2 className='text-2xl p-4 font-bold pb-2'>KẾT QUẢ KINH DOANH TRONG NGÀY</h2>
        <p className='text-sm italic px-4'>Trong vòng 24 giờ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
            <div
                className="bg-violet-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-violet-600 dark:border-gray-600 text-white font-medium group"
            >
                <div
                    className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12"
                >
                    <TeamOutlined className="text-3xl text-violet-500 transform transition-transform duration-500 ease-in-out" />
                </div>
                <div className="text-right">
                    <p className="text-2xl">{dashboardStatistic.newUsersCount}</p>
                    <p>Người dùng mới</p>
                </div>
            </div>

            <div
                className="bg-orange-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-orange-600 dark:border-gray-600 text-white font-medium group"
            >
                <div
                    className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12"
                >
                    <SolutionOutlined className='text-orange-500 text-3xl transform transition-transform duration-500 ease-in-out' />
                </div>
                <div className="text-right">
                    <p className="text-2xl">{dashboardStatistic.newOrdersCount}</p>
                    <p>Đơn hàng</p>
                </div>
            </div>

            <div
                className="bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 dark:border-gray-600 text-white font-medium group"
            >
                <div
                    className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12"
                >
                    <SkinOutlined className='text-blue-500 text-3xl transform transition-transform duration-500 ease-in-out' />
                </div>
                <div className="text-right">
                    <p className="text-2xl">{dashboardStatistic.bestSellingProduct.reduce((acc, curr) => acc += curr.totalQuantitySold, 0)}</p>
                    <p>Sản phẩm bán được</p>
                </div>
            </div>

            <div
                className="bg-lime-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-lime-600 dark:border-gray-600 text-white font-medium group"
            >
                <div
                    className="flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12"
                >
                    <BarChartOutlined className='text-lime-500 text-3xl transform transition-transform duration-500 ease-in-out' />
                </div>
                <div className="text-right">
                    <p className="text-2xl">
                        {/* {orderRevanueMonth ? caculateAvgRevalueByMonth(orderRevanueMonth)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}đ */}
                        {dashboardStatistic?.revenue?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ
                    </p>
                    <p>Doanh số</p>
                </div>
            </div>

        </div>


        <div className='flex justify-between'>
            <div className='w-2/3 p-4'>
                <h3 className='px-4 text-lg font-medium'>Tổng quan báo cáo</h3>
                <label htmlFor="" className='block ml-10 text my-3'>Loại báo cáo:
                    <TreeSelect
                        style={{ width: 200, marginLeft: 10 }}
                        value={value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        treeDefaultExpandAll
                        onChange={onChange}
                        defaultValue='1'
                    />
                </label>
                {renderComponent()}
                <div>
                    <h3 className='text-2xl font-medium'>Đánh giá gần đây</h3>

                    {dashboardStatistic.newReviews.length > 0 ? (
                        <List
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                onChange: (page) => {
                                    console.log(page);
                                },
                                pageSize: 10,
                            }}
                            dataSource={dashboardStatistic.newReviews}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <div className="flex justify-between items-start">
                                        <div className="w-3/5">
                                            <div >
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium"><Link to={``}>{item.productId.title}</Link></span>
                                                    <span className="block"><Rate value={item.rating} disabled className="text-xs mb-0"></Rate></span>
                                                </div>
                                                <div className="flex mt-0 items-center ">
                                                    <span className="block text-end text-xs text-gray-400  border-r border-gray-300 pr-1">{moment(item.createdAt as string, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("HH:mm DD/MM/YYYY")}</span>
                                                    <div className="px-1">
                                                        <span className="text-xs text-gray-400 ">Phân loại: </span><span className="text-xs text-blue-500">{item.size}</span> - <span className="text-xs text-blue-500"> {item.color}</span>
                                                    </div>
                                                </div>
                                                <span className="block mt-2">{item.comment}</span>
                                                <div className="flex space-x-3 mx-2">


                                                </div>
                                                <div className="flex items-start ">
                                                    <Popconfirm
                                                        title="Xóa đánh giá"
                                                        description="Bạn có chắc muốn xóa đánh giá này"
                                                        onConfirm={() => removeComment(item._id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                        okButtonProps={{ className: "text-white bg-blue-500" }}
                                                    >
                                                        <div className="leading-9 text-[13px] cursor-pointer hover:underline text-blue-500 w-11">
                                                            Xóa <DeleteOutlined style={{ fontSize: '13px' }} />
                                                        </div>
                                                    </Popconfirm>

                                                    {!item?.reply?.comment && (
                                                        <Collapse
                                                            size="small"
                                                            // defaultActiveKey={[0]}
                                                            ghost
                                                            className="p-0 w-full"
                                                            style={{ padding: 0 }}
                                                            expandIcon={({ isActive }) => <CaretRightOutlined style={{ display: 'none', padding: 0 }} rotate={isActive ? 90 : 0} />}
                                                        >
                                                            <Collapse.Panel key={index}
                                                                header={
                                                                    <div className="flex items-center space-x-1 hover:underline">
                                                                        <span className="block text-[13px] cursor-pointer  text-gray-500">
                                                                            Trả lời
                                                                        </span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3 text-gray-500">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                                                        </svg>
                                                                    </div>
                                                                } >
                                                                <Form
                                                                    form={form}
                                                                    name="validateOnly"
                                                                    layout="vertical"
                                                                    onFinish={(values: any) => replyComment(item._id, values)}
                                                                    autoComplete="off"
                                                                    className="mx-auto w-full "
                                                                    style={{ padding: 0 }}
                                                                >
                                                                    <div className="flex items-end">
                                                                        <Form.Item
                                                                            name="comment"
                                                                            className="w-full"
                                                                        >
                                                                            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
                                                                        </Form.Item>
                                                                        <Form.Item >
                                                                            <Button type="link" htmlType="submit" className='flex items-center justify-center hover:bg-blue-500 rounded-full w-8'>
                                                                                <SendOutlined />
                                                                            </Button>
                                                                        </Form.Item>
                                                                    </div>
                                                                </Form>
                                                            </Collapse.Panel>
                                                        </Collapse>
                                                    )}

                                                </div>
                                            </div>
                                            {item.reply.comment && (
                                                <Collapse
                                                    size="small"
                                                    // defaultActiveKey={['1']}
                                                    ghost
                                                    className="p-0"
                                                    style={{ padding: 0 }}
                                                    expandIcon={({ isActive }) => <CaretRightOutlined className={`text-blue-500`} rotate={isActive ? 90 : 0} />}
                                                >
                                                    <Collapse.Panel key={index} header={<span className="text-gray-400">Replie</span>} className="m-0">
                                                        <div className="ml-5">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">{item.reply.nameUser}</span>
                                                                <span className="block text-end text-xs text-gray-400 pr-1">{moment(item.reply.createdAt as string, "YYYY-MM-DDTHH:mm:ss.SSSZ").format("HH:mm DD/MM/YYYY")}</span>
                                                            </div>
                                                            <Paragraph editable={{ onChange: (newComment: any) => editReplyComment(item._id, { commentEdit: newComment }) }}>{item.reply.comment}</Paragraph>
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
                    ) : (
                        <div className="py-14">
                            <Empty description={
                                (
                                    <span className="text-blue-500 text-lg" >
                                        {/* Hiện tại chưa có đánh giá nào */}
                                    </span>
                                )} />
                        </div>
                    )}
                </div>
            </div >
            <div className='w-1/3 flex flex-col'>
                <div className='my-4 border bg-white p-4'>
                    <h3 className='text-2xl font-medium text-blue-400 mb-2 rounded-md'><InboxOutlined />Sản phẩm bán chạy nhất</h3>
                    {/* {dashboardStatistic.bestSellingProduct && dashboardStatistic.bestSellingProduct.map((item) => {
                        return <div>

                        </div>
                    })} */}
                    <List
                        className='my-3'
                        grid={{
                            gutter: 16,
                            column: 1,
                            xs: 16,

                        }}
                        dataSource={dashboardStatistic?.bestSellingProduct}
                        renderItem={(item) => (
                            <List.Item>
                                <div className='flex  '>
                                    <div className="w-16">
                                        <Image height={60} src={item?.images[0]} />
                                    </div>
                                    <div className=''>
                                        <Link className='font-medium' to={`/admin/product/${item._id}`}>{item.title}</Link>
                                        <p>Đã bán: {item.totalQuantitySold}</p>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>

            </div>
        </div >

    </>

};

export default DashboardPage;