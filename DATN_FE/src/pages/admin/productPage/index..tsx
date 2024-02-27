import {
    Space,
    Table,
    Popconfirm,
    Image,
    Button,
    message,
    Spin,
    Slider,
    InputNumber,
    Select,
    MenuProps,
    Dropdown,
    Tooltip
} from 'antd';
import {
    EditFilled,
    DeleteFilled,
    PlusOutlined,
    EyeOutlined,
    DownOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useFetchListProductByAdminQuery, useFetchListProductQuery, useRemoveProductMutation } from '../../../store/product/product.service';
import { useEffect, useState } from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { deleteProductSearchSlice, listProductSearch, listProductSearchBySkuSlice, listProductSearchSlice } from '../../../store/product/productSlice';
import { useForm } from "react-hook-form";
import { listCategorySlice } from '../../../store/category/categorySlice';
import { useFetchListCategoryQuery } from '../../../store/category/category.service';
import { ColumnsType, TableProps } from 'antd/es/table';
import moment from 'moment';
interface DataType {
    _id: React.Key;
    sku: string;
    title: string;
    images: any[];
    price: number;
    discount: number;
    description: string;
    categoryId: string;
    createdAt: string;
}

const productPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { handleSubmit } = useForm();
    const [onRemove] = useRemoveProductMutation()
    const [search, setSearch] = useState<string>("")
    const [messageApi, contextHolder] = message.useMessage();
    const { data: listProduct, isLoading, isError, isSuccess } = useFetchListProductByAdminQuery()
    const productSearchState = useSelector((state: RootState) => state.productSearchReducer.products)
    const { data: listCategory } = useFetchListCategoryQuery()
    // const productState = useSelector((state: RootState) => state.productSlice.products)
    const categoryState = useSelector((state: RootState) => state.categorySlice.categories)

    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    const [sortOption, setSortOption] = useState<Number>(1);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const [visibleCate, setVisibleCate] = useState(false);
    const [visiblePrice, setVisiblePrice] = useState(false);

    useEffect(() => {
        if (listProduct) {
            if (search === "" || !search) {
                dispatch(listProductSearch(listProduct))
            }
        }
        if (listCategory) {
            dispatch(listCategorySlice(listCategory));
        }
    }, [isSuccess, search, listCategory])

    const handleSearch = () => {
        if (listProduct && search) {
            dispatch(listProductSearchSlice({ searchTerm: search, products: listProduct }));
        }
    };

    useEffect(() => {
        if (productSearchState?.length === 0 && listProduct) {
            if (search) {
                dispatch(listProductSearchBySkuSlice({ searchTerm: search, products: listProduct }));
            }
        }
    }, [productSearchState.length === 0]);

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
                await onRemove(id).then(() => dispatch(deleteProductSearchSlice(id)))
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
            title: 'MÃ SẢN PHẨM',
            dataIndex: 'sku',
        },
        {
            title: 'TÊN SẢN PHẨM',
            key: 'name',
            render: (record: any) => (
                <div className="flex items-center  ">
                    <Image.PreviewGroup items={record?.images?.map((image: any, index: number) => ({ src: image, alt: `Product Image ${index}` }))}>
                        <Image
                            width={70}
                            src={record?.images[0]}
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
            title: 'GIÁ',
            dataIndex: 'price',
            key: 'price',
            render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            sorter: (a, b) => a.price - b.price, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: 'GIẢM GIÁ',
            dataIndex: 'discount',
            key: 'discount',
            render: (value: number) => value > 0 ? (`-${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`) : "",
            sorter: (a, b) => a.discount - b.discount, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: 'DANH MỤC',
            dataIndex: 'categoryId',
            key: 'categoryId',
            render: (cateId: any) => {
                const category = categoryState.find((cate: any) => cate._id === (cateId && cateId?._id));
                return category ? category.name : 'N/A';
            },
            className: 'w-[150px]',
        },
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
                    <Tooltip title="Xem" color={'green'} key={'green'}>
                        <Link to={`/admin/product/${record?._id}`}>
                            <EyeOutlined className='text-xl text-green-500' />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc muốn xóa sản phảm này"
                        onConfirm={() => confirm(record?._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ className: "text-white bg-blue-400" }}
                    >
                        <Tooltip title="Xóa" color={'red'} key={'red'}>
                            <DeleteFilled className='text-xl text-red-400' />
                        </Tooltip>
                    </Popconfirm>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <Link to={`/admin/product/update/${record?._id}`}>
                            <EditFilled className='text-xl text-yellow-400' />
                        </Link>
                    </Tooltip>

                </Space>
            ),
        },

    ];

    const toggleCategory = (categoryId: any) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const filteredProducts = productSearchState?.filter((product: any) => {
        // Lọc theo danh mục đã chọn
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId._id)) {
            return false;
        }
        // Lọc theo giá
        // const productPrice = product.discount || 0;
        const productPrice = (product.discount === 0 ? product.price : product.discount);
        if ((minPrice > 0 && productPrice < minPrice) || (maxPrice > 0 && productPrice > maxPrice)) {
            return false;
        }
        return true;
    });

    const handleResetClick = () => {
        setSelectedCategories([]);
    };

    const handleResetPrice = () => {
        // setSelectedCategories([]);
        setMinPrice(0);
        setMaxPrice(0);
    };

    const handlePriceFilter = (min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    const sortedProducts = [...filteredProducts];

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
            // Giá: Tăng dần
            sortedProducts.sort((a, b) => {
                const discountA = a.discount > 0 ? a.price - a.discount : a.price;
                const discountB = b.discount > 0 ? b.price - b.discount : b.price;
                return discountA - discountB;
            });
            break;
        case 4:
            // Giá: Giảm dần
            sortedProducts.sort((a, b) => {
                const discountA = a.discount > 0 ? a.price - a.discount : a.price;
                const discountB = b.discount > 0 ? b.price - b.discount : b.price;
                return discountB - discountA;
            });
            break;
        case 5:
            // Tên: A - Z
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 6:
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
        title: product.title,
        images: product.images,
        price: product.price,
        discount: product.discount,
        description: product.description,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
    }));

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleClickFilterCate = () => {
        setVisibleCate(!visibleCate);
    };
    const handleClickFilterPrice = () => {
        setVisiblePrice(!visiblePrice);
    };

    const filterCate: MenuProps['items'] = [
        {
            label: (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{selectedCategories?.length} đã chọn</span>
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
        ...(categoryState?.map((cate: any) => ({
            label: (
                <label htmlFor={`FilterPrice-${cate._id}`} className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`FilterPrice-${cate._id}`}
                        className="h-5 w-5 rounded border-gray-300"
                        checked={selectedCategories?.includes(cate._id)}
                        onChange={() => toggleCategory(cate._id)}
                    />

                    <span className="text-sm font-medium text-gray-700">{cate.name}</span>
                    {/* ({cate.products.length - 1}) */}
                </label>
            ),
            key: cate._id,
        })) || []),
    ];
    const filterPrice: MenuProps['items'] = [
        {
            label: (
                <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-gray-700">Giá cao nhất 1,000,000đ</span>
                    <button
                        type="button"
                        className="text-sm text-gray-900 underline underline-offset-4"
                        onClick={handleResetPrice}
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
                <label htmlFor="FilterPrice" className="inline-flex items-center gap-2">
                    <input
                        name="FilterPrice"
                        type="radio"
                        id="FilterPrice"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => handlePriceFilter(0, 150000)}
                        checked={minPrice >= 0 && maxPrice === 150000}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        0đ - 150,000đ
                    </span>
                </label>
            ),
            key: '1',
        },
        {
            label: (
                <label htmlFor="FilterPrice" className="inline-flex items-center gap-2">
                    <input
                        name="FilterPrice"
                        type="radio"
                        id="FilterPrice"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => handlePriceFilter(150000, 300000)}
                        checked={minPrice >= 150000 && maxPrice === 300000}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        150,000đ - 300,000đ
                    </span>
                </label>
            ),
            key: '2',
        },
        {
            label: (
                <label htmlFor="FilterPrice" className="inline-flex items-center gap-2">
                    <input
                        name="FilterPrice"
                        type="radio"
                        id="FilterPrice"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => handlePriceFilter(300000, 450000)}
                        checked={minPrice >= 300000 && maxPrice === 450000}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        300,000đ - 450,000đ
                    </span>
                </label>
            ),
            key: '3',
        },
        {
            label: (
                <label htmlFor="FilterPrice" className="inline-flex items-center gap-2">
                    <input
                        name="FilterPrice"
                        type="radio"
                        id="FilterPrice"
                        className="h-5 w-5 rounded border-gray-300"
                        onChange={() => handlePriceFilter(450000, 1000000)}
                        checked={minPrice === 450000 && 1000000 >= maxPrice}
                    />

                    <span className="text-sm font-medium text-gray-700">
                        450,000đ trở lên
                    </span>
                </label>
            ),
            key: '4',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <div className="border-t border-gray-200 p-4 ">
                    <div className="flex justify-between gap-4 items-center">
                        <InputNumber
                            formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            value={minPrice}
                            min={0}
                            onChange={(value: any) => setMinPrice(value)} />
                        <span className="text-gray-400 font-light text-sm">đến</span>
                        <InputNumber
                            formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            value={(maxPrice)}
                            min={0}
                            onChange={(value: any) => setMaxPrice(value)} />
                    </div>
                </div>

            ),
            key: '5',
        },
        {
            label: (
                <div className="px-4">
                    <Slider
                        range
                        min={0}
                        max={1000000}
                        step={1000}
                        tooltip={{ formatter: null }}
                        value={[minPrice, maxPrice]}
                        // defaultValue={[minPrice, maxPrice]}
                        onChange={(values: [number, number]) => {
                            setMinPrice(values[0]);
                            setMaxPrice(values[1]);
                        }}
                    />
                </div>
            ),
            key: '6',
        },

    ];

    // useEffect(() => {
    //     window.scrollTo({ top: 0, left: 0 });
    // }, []);

    return (
        <div className="">
            {contextHolder}
            <Space className='flex justify-between mb-5'>
                <div className="">
                    <span className="block text-xl text-[#1677ff]">
                        QUẢN LÝ SẢN PHẨM
                    </span>
                    {/* <span className="block text-base  text-[#1677ff]">
                        Manage your products
                    </span> */}
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
                <div className="flex justify-between  items-center">
                    <div className="flex  space-x-3 ">
                        <Dropdown
                            menu={{ items: filterCate }}
                            trigger={['click']}
                            visible={visibleCate}
                            onOpenChange={handleClickFilterCate}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Button className='w-[200px]'>
                                    <Space className='flex justify-between' >
                                        <span>  Lọc theo danh mục</span>
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </a>
                        </Dropdown>
                        <Dropdown
                            menu={{ items: filterPrice }}
                            trigger={['click']}
                            visible={visiblePrice}
                            onOpenChange={handleClickFilterPrice}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Button className='w-[200px]'>
                                    <Space className='flex justify-between' >
                                        <span>  Lọc theo Giá</span>
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
                                { value: 3, label: 'Giá: Tăng dần' },
                                { value: 4, label: 'Giá: Giảm dần' },
                                { value: 5, label: 'Tên: A - Z' },
                                { value: 6, label: 'Tên: Z - A' },

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
export default productPage;