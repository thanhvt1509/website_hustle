import {
    Space,
    Table,
    Button,
    Popconfirm,
    message,
    Image,
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
import { Dispatch, useEffect, useState } from 'react';
import { useFetchListCategoryQuery, useRemoveCategoryMutation } from '../../../store/category/category.service';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategorySlice, listCategorySearchSlice, listCategorySlice } from '../../../store/category/categorySlice';
import { RootState } from '../../../store';
import { ICategory } from '../../../store/category/category.interface';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useForm } from 'react-hook-form';
import moment from 'moment';
const { Option } = Select;
interface DataType {
    _id: React.Key;
    name: string;
    images: any;
    products: any;
    createdAt: any;
    ICategory: string;
}

const categoryPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const [onRemove] = useRemoveCategoryMutation()
    const [messageApi, contextHolder] = message.useMessage();
    const { data: listCategory, isLoading, isError, isSuccess } = useFetchListCategoryQuery()
    const categoryState = useSelector((state: RootState) => state.categorySlice.categories)
    const categoryData = categoryState.filter(category => category.name !== 'Chưa phân loại');
    const [cateOption, setCateOption] = useState<Number>(1);

    const { handleSubmit } = useForm()
    const [search, setSearch] = useState<string>("")
    useEffect(() => {
        if (listCategory) {
            if (search === "" || !search) {
                dispatch(listCategorySlice(listCategory))
            }
        }
    }, [isSuccess, search])
    const handleSearch = () => {
        if (listCategory) {
            dispatch(listCategorySearchSlice({ searchTerm: search, categories: listCategory }))
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
    const confirm = async (id: string) => {
        try {
            if (id) {
                await onRemove(id).then(() => dispatch(deleteCategorySlice(id)))
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
            title: 'ẢNH',
            render: (value: any) => (
                <Image
                    width={70}
                    src={value.images?.url}
                    alt="Image"
                    className=""
                />
            ),
            className: 'w-1/5'
        },
        {
            title: ' TÊN DANH MỤC',
            key: 'name',
            render: (record: ICategory) => (
                <div className="flex items-center  ">
                    <a className='w-full overflow-hidden'>{record.name}</a>
                </div>
            ),
            showSorterTooltip: false,
        },
        {
            title: 'SẢN PHẨM',
            dataIndex: 'products',
            key: 'products',
            render: (value) => (
                <div className="">
                    <span className='block my-2'>Tổng: {value.length} sản phẩm</span>
                    <Select
                        showSearch
                        style={{ width: 400 }}
                        placeholder="Tìm kiếm tên sản phẩm, mã sản phẩm "
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) => {
                            const lowerCaseInput = input.toLowerCase();
                            const labelIncludesInput = (option?.label?.toLowerCase() ?? '').includes(lowerCaseInput);
                            const skuIncludesInput = (option?.sku?.toLowerCase() ?? '').includes(lowerCaseInput);
                            return labelIncludesInput || skuIncludesInput;
                        }}
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
                        {value.map((product: any) => (
                            <Option key={product._id} value={product._id} label={product.title} sku={product.sku}>
                                <Link to={`/admin/product/${product._id}`}>
                                    <div className='flex items-center space-x-2'>
                                        <img className='h-14' src={product.images[0]} alt="" />
                                        <span>{product.title} {product.sku}</span>
                                    </div>
                                </Link>
                            </Option>
                        ))}
                    </Select>
                </div>
            )

        },
        {
            title: 'NGÀY ĐẶT',
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
            render: (record: ICategory) => (
                <div className="">
                    <Space size="middle" className='flex justify-end'>
                        <Popconfirm
                            title="Xóa danh mục"
                            description="Bạn có chắc muốn xóa danh mục này"
                            onConfirm={() => confirm(record._id!)}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{ className: "text-white bg-blue-500" }}
                        >
                            <Tooltip title="Xóa" color={'red'} key={'red'}>
                                <DeleteFilled className='text-xl text-red-500' />
                            </Tooltip>
                        </Popconfirm>
                        <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                            <Link to={`/admin/category/update/${record._id}`}>
                                <EditFilled className='text-xl text-yellow-400' />
                            </Link>
                        </Tooltip>

                    </Space>
                </div>

            ),
        },

    ];

    const sortCate = [...categoryData];

    switch (cateOption) {
        case 1:
            // Mới nhất
            sortCate.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case 2:
            // Cũ nhất
            sortCate.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        case 3:
            // Tên: A - Z
            sortCate.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 4:
            // Tên: Z - A
            sortCate.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            break;
    }

    const data: DataType[] = sortCate.map((category: any, index) => ({
        key: index + 1,
        _id: category._id,
        name: category.name,
        images: category.images,
        createdAt: category.createdAt,
        products: category.products,
        ICategory: category.ICategory,
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
                        QUẢN LÝ DANH MỤC
                    </span>
                    {/* <span className="block text-base  text-[#1677ff]">
                        Quản lý danh mục
                    </span> */}
                </div>
                <Link to={`add`}>
                    <Button type='primary' className='bg-blue-500'
                        icon={<PlusOutlined />}
                    >
                        Tạo mới
                    </Button>
                </Link>
            </Space>
            <div className="border min-h-[300px] p-3 rounded-lg  bg-white">
                <div className="flex pb-6 pt-3 justify-between">
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
                                placeholder='Tìm kiếm theo tên danh mục'
                                onChange={(e) => setSearch(e.target.value)}
                                type="text" id="default-search" className="block w-full outline-none p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#1677ff] hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tìm kiếm</button>
                        </div>
                    </form>


                </div>
                <div className="flex justify-end items-start mb-6">
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
                            onChange={(value: Number) => setCateOption(value)}
                        />
                    </div>
                </div>
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 20 }} onChange={onChange} />
            </div>
        </div>
    )
}
export default categoryPage;