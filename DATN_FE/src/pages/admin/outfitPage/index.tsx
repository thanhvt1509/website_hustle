import {
    Space,
    Table,
    Popconfirm,
    Image,
    Button,
    message,
    Spin,
    Select,
    Tooltip
} from 'antd';
import {
    EditFilled,
    DeleteFilled,
    PlusOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { useForm } from "react-hook-form";
import { ColumnsType, TableProps } from 'antd/es/table';
import moment from 'moment';
import { useFetchListOutfitQuery, useRemoveOutfitMutation } from '../../../store/outfit/outfit.service';
import { deleteOutfitSlice, listSearchOutfit, listSearchOutfitBySkuSlice, listSearchOutfitByTitleSlice } from '../../../store/outfit/outfitSlice';
interface DataType {
    _id: React.Key;
    sku: string;
    title: string;
    discount: number;
    image: any[];
    productOne: string;
    productTwo: string;
    description: string;
    createdAt: string;
}

const outfitPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { handleSubmit } = useForm();
    const [onRemove] = useRemoveOutfitMutation()
    const [search, setSearch] = useState<string>("")
    const [messageApi, contextHolder] = message.useMessage();
    const { data: listOutfit, isLoading, isError, isSuccess } = useFetchListOutfitQuery()
    const outfitSearchState = useSelector((state: RootState) => state.searchOutfitReducer.outfits)

    // const productState = useSelector((state: RootState) => state.productSlice.products)
    const [sortOption, setSortOption] = useState<Number>(1)

    useEffect(() => {
        if (listOutfit) {
            if (search === "" || !search) {
                dispatch(listSearchOutfit(listOutfit))
            }
        }

    }, [listOutfit, search])

    const handleSearch = () => {
        if (listOutfit && search) {
            console.log(1)
            dispatch(listSearchOutfitByTitleSlice({ searchTerm: search, outfits: listOutfit }));
        }
    };

    useEffect(() => {
        if (outfitSearchState?.length === 0 && listOutfit) {
            if (search) {
                dispatch(listSearchOutfitBySkuSlice({ searchTerm: search, outfits: listOutfit }));
            }
        }
    }, [outfitSearchState.length === 0]);

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

    const confirm = async (id: string) => {
        try {
            if (id) {
                await onRemove(id).then(() => dispatch(deleteOutfitSlice(id)))
                messageApi.open({
                    type: 'success',
                    content: 'Xóa thành công',
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (value: any) => <Link to={``} className='uppercase font-bold '>{value}</Link>,
            className: 'w-[100px]'
        },
        {
            title: 'MÃ OUTFIT',
            dataIndex: 'sku',
        },
        {
            title: 'TÊN OUTFIT',
            key: 'name',
            render: (record: any) => (
                <div className="flex items-center  ">
                    <Image.PreviewGroup items={record?.images?.map((image: any, index: number) => ({ src: image, alt: `Product Image ${index}` }))}>
                        <Image
                            width={70}
                            src={record?.image.url}
                        />
                    </Image.PreviewGroup>

                    <a className='w-full overflow-hidden ml-2'>{record?.title}</a>
                </div>
            ),
            sorter: (a, b) => a.title.localeCompare(b.title), // Sắp xếp theo bảng chữ cái
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
            className: 'w-1/4',
        },
        {
            title: 'SẢN PHẨM ÁO',
            dataIndex: 'productOne',
            key: 'productOne',
            render: (value: any) => (
                <div className="flex items-center space-x-2 ">
                    <Image
                        height={70}
                        width={54}
                        src={value?.imageColor}
                    />
                    <div className="">
                        <span className='block text-[13px]'>Phân loại:</span>
                        <a className='w-full overflow-hidden text-[13px]'>{value?.nameColor}-{value?.size}</a>
                    </div>
                </div>
            ),
        },
        {
            title: 'SẢN PHẨM QUẦN',
            dataIndex: 'productTwo',
            key: 'productOne',
            render: (value: any) => (
                <div className="flex items-center space-x-2 ">
                    <Image
                        height={70}
                        width={54}
                        src={value?.imageColor}
                    />
                    <div className="">
                        <span className='block text-[13px]'>Phân loại:</span>
                        <a className='w-full overflow-hidden text-[13px]'>{value?.nameColor}-{value?.size}</a>
                    </div>
                </div>
            ),
        },
        // {
        //     title: 'GIẢM GIÁ',
        //     dataIndex: 'discount',
        //     key: 'discount',
        //     render: (value: number) => value > 0 ? (`${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}%`) : "",
        //     sorter: (a, b) => a.discount - b.discount, // Sắp xếp theo số
        //     sortDirections: ['ascend', 'descend'],
        //     showSorterTooltip: false,
        // },
        {
            title: 'NGÀY KHỞI TẠO',
            dataIndex: 'createdAt',
            key: 'date',
            sorter: (a, b) => {
                const dateA = moment(a.createdAt);
                const dateB = moment(b.createdAt);

                // So sánh theo thời gian
                return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
            },
            render: (value: any) => <span>{moment(value as string).format("HH:mm DD/MM/YYYY")}</span>,
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: '',
            key: 'action',
            render: (record: any) => (
                <Space size="middle" className='flex justify-end'>
                    <Popconfirm
                        title="Xóa outfit"
                        description="Bạn có chắc muốn xóa Outfit này không"
                        onConfirm={() => confirm(record?._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: "text-white bg-blue-400" }}
                    >
                        <Tooltip title="Xóa" color={'red'} key={'red'}>
                            <DeleteFilled className='text-xl text-red-500' />
                        </Tooltip>
                    </Popconfirm>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <Link to={`/admin/outfit/update/${record?._id}`}>
                            <EditFilled className='text-xl text-yellow-400' />
                        </Link>
                    </Tooltip>

                </Space>
            ),
        },

    ];

    const sortedProducts = [...outfitSearchState];

    switch (sortOption) {
        case 1:
            // Mới nhất
            sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case 2:
            // Cũ nhất
            sortedProducts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        case 3:
            // Tên: A - Z
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 4:
            // Tên: Z - A
            sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            break;
    }

    const data: DataType[] = sortedProducts?.map((product: any, index) => ({
        key: index + 1,
        _id: product._id!,
        sku: product.sku,
        discount: product.discount,
        title: product.title,
        image: product.image,
        productOne: product.items && product.items[0],
        productTwo: product.items && product.items[1],
        description: product.description,
        createdAt: product.createdAt,
    }));

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className="">
            {contextHolder}
            <Space className='flex justify-between mb-5'>
                <div className="">
                    <span className="block text-xl text-[#1677ff]">
                        QUẢN LÝ OUTFIT
                    </span>
                </div>
                <Link to={`add`}>
                    <Button type='primary' className='bg-[#1677ff]'
                        icon={<PlusOutlined />}
                    >
                        Tạo mới
                    </Button>
                </Link>
            </Space>
            <div className="border p-3 rounded-lg min-h-screen bg-white relative">
                <div className="flex pb-6 pt-3 justify-between">
                    <form onSubmit={handleSubmit(handleSearch)} className='w-[500px]'>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                placeholder='Tìm kiếm theo mã sản phẩm, tên sản phẩm'
                                onChange={(e) => setSearch(e.target.value)}
                                type="text" id="default-search"
                                className="block w-full outline-none p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#1677ff] hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
                <div className="flex justify-end items-start">
                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-[#333333]">Sắp xếp theo:</span>
                        <Select
                            defaultValue={1}
                            style={{ width: 200 }}
                            options={[
                                { value: 1, label: 'Mới nhất' },
                                { value: 2, label: 'Cũ nhất' },
                                { value: 3, label: 'Tên: A - Z' },
                                { value: 4, label: 'Tên: Z - A' },
                            ]}
                            onChange={(value: Number) => setSortOption(value)}
                        />
                    </div>
                </div>
                <Table columns={columns} dataSource={data && data} pagination={{ pageSize: 20 }} onChange={onChange}
                    className='absolute top-40 right-3 left-3' />
            </div>
        </div>
    )
}
export default outfitPage;