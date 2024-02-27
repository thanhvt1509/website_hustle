import { Dispatch, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { InputNumber, List, Select, Slider, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../layout/Header";
import Footer from "../../../layout/Footer";
import { RootState } from "../../../store";
import { useFetchListCategoryQuery } from "../../../store/category/category.service";
import { listCategorySlice } from "../../../store/category/categorySlice";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { listProductOutStand, listProductOutStandSlice, listProductSlice } from "../../../store/product/productSlice";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import IProduct from "../../../store/product/product.interface";
import {
    FilterOutlined
} from '@ant-design/icons';
const ProductPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { data: listProduct, isSuccess: isSuccessProduct } = useFetchListProductQuery()
    const { data: listCategory } = useFetchListCategoryQuery()

    const products = useSelector((state: RootState) => state.productSlice.products)
    const categoryState = useSelector((state: RootState) => state.categorySlice.categories)
    const categories = categoryState.filter(category => category.name !== 'Chưa phân loại');

    const { data: listProductDetail, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
    const productOutStandState = useSelector((state: RootState) => state.productOutstandReducer.products)
    const productDetailState = useSelector((state: RootState) => state.productDetailSlice.productDetails)
    const productState = useSelector((state: RootState) => state.productSlice.products)

    useEffect(() => {
        if (listCategory) {
            dispatch(listCategorySlice(listCategory));
        }
        // if (listProduct) {
        //     dispatch(listProductSlice(listProduct));
        // }
    }, [dispatch, listProduct, listCategory]);
    const { id } = useParams();

    const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
    useEffect(() => {
        if (id) {
            setSelectedCategories([id]);
        }
    }, [id]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const toggleCategory = (categoryId: any) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const filteredProducts = products.filter((product: any) => {
        // Lọc theo danh mục đã chọn
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId._id)) {
            return false;
        }
        // Lọc theo giá
        const productPrice = (product.discount > 0 ? product.price - product.discount : product.price);
        if ((minPrice > 0 && productPrice < minPrice) || (maxPrice > 0 && productPrice > maxPrice)) {
            return false;
        }
        return true;
    });
    const handleResetClick = () => {
        setSelectedCategories([]);
    };

    const handleResetPrice = () => {
        setSelectedCategories([]);
        setMinPrice(0);
        setMaxPrice(0);
    };
    const handlePriceFilter = (min: number, max: number) => {
        setMinPrice(min);
        setMaxPrice(max);
    };

    useEffect(() => {
        if (isSuccessProduct) {
            const productOutStands: any = []
            const productDetails = productDetailState?.filter((proSold) => proSold && proSold.sold).map((proDetail) => {
                return proDetail.product_id
            })

            const uniqueProductDetail = [...new Set(productDetails.map((proDetail) => proDetail))]
            if (uniqueProductDetail) {
                const filteredProducts = productState.filter((product) => uniqueProductDetail.includes(product._id!));
                filteredProducts.sort((a, b) => {
                    const productA = productDetailState.find((proSold) => proSold.product_id === a._id);
                    const productB = productDetailState.find((proSold) => proSold.product_id === b._id);
                    if (productA && productB) {
                        return productB.sold - productA.sold;
                    }
                    return 0;
                });
                productOutStands.push(...filteredProducts);
            }
            if (productOutStands) {
                dispatch(listProductOutStand(productOutStands))
            }
        }
    }, [isSuccessProduct, productDetailState, productState])
    useEffect(() => {
        if (isSuccessProductDetail) {
            dispatch(listProductDetailSlice(listProductDetail))
        }
    }, [isSuccessProductDetail])

    const sortedProducts = [...filteredProducts];

    const [sortOption, setSortOption] = useState<Number>(1);
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
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    return (
        <div className="">
            <Header />
            <div className=" mx-auto mb-20 px-16 ">

                <div className="flex justify-between">
                    <div className=" w-1/5">
                        <div className="py-8">
                            <span className="text-2xl text-[#333333] font-semibold px-3">Bộ lọc</span>
                        </div>
                        <div className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidde mb-2">
                            <summary
                                className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
                            >
                                <span className="text-sm font-medium">Lọc theo danh mục</span>
                            </summary>

                            <div className="border-t border-gray-200 bg-white">
                                <header className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-700"> {selectedCategories.length} đã chọn </span>

                                    <button
                                        type="button"
                                        className="text-sm text-gray-900 underline underline-offset-4"
                                        onClick={handleResetClick}
                                    >
                                        Reset
                                    </button>
                                </header>

                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                    {categories
                                        .filter((cate: any) => cate.name !== 'Uncategorized')
                                        .map((cate: any) => (
                                            <li key={cate._id}>
                                                <label htmlFor="FilterPrice" className="inline-flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="FilterPrice"
                                                        className="h-5 w-5 rounded border-gray-300"
                                                        checked={selectedCategories.includes(cate._id)}
                                                        onChange={() => toggleCategory(cate._id)}
                                                    />

                                                    <span className="text-sm font-medium text-gray-700">
                                                        {cate.name}
                                                    </span>
                                                </label>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
                            >
                                <span className="text-sm font-medium"> Lọc theo giá </span>
                            </summary>

                            <div className="border-t border-gray-200 bg-white">
                                <header className="flex items-center justify-between p-4">
                                    <span className="text-sm text-gray-700">Giá cao nhất 1,000,000đ</span>
                                    <button
                                        type="button"
                                        className="text-sm text-gray-900 underline underline-offset-4"
                                        onClick={handleResetPrice}
                                    >
                                        Reset
                                    </button>
                                </header>
                                <ul className="space-y-1 border-t border-gray-200 p-4">
                                    <li>
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
                                    </li>
                                    <li>
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
                                    </li>
                                    <li>
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
                                    </li>
                                    <li>
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
                                    </li>

                                </ul>

                                <div className="border-t border-gray-200 p-4">
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
                            </div>
                        </div>
                    </div>
                    <div className="w-4/5 px-5">
                        <div className="flex justify-between py-8">
                            {selectedCategories.length > 0 || minPrice > 0 || maxPrice > 0 ? (
                                <div className="text-lg px-5">
                                    <span className="mr-1">KẾT QUẢ TÌM KIẾM VỚI:</span> ({filteredProducts.length} SẢN PHẨM)
                                </div>
                            ) : (<div className="text-lg px-5">
                                <span className="mr-1">KẾT QUẢ TÌM KIẾM VỚI:</span> ({products.length} SẢN PHẨM)
                            </div>)}
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
                        <List
                            style={{ margin: 0 }}
                            itemLayout="vertical"
                            size="large"
                            pagination={{
                                onChange: (page) => {
                                    console.log(page);
                                },
                                pageSize: 20,
                                style: {
                                    textAlign: 'center' // Căn giữa phân trang
                                }
                            }}
                            grid={{
                                gutter: 4,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 4,
                                xxl: 6,
                            }
                            }
                            dataSource={sortedProducts}
                            renderItem={(product: IProduct, index) => (
                                <List.Item style={{ marginLeft: 10, marginRight: 10, marginBottom: 30, paddingLeft: 8, paddingRight: 8 }}>
                                    <div key={index} className="relative group w-full border">
                                        {productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product?._id).filter((pro) => pro.quantity !== 0))].length != 0 ? <div className="relative group">
                                            <Link to={`/products/${product._id}`}>
                                                <img
                                                    src={product.images?.[0]}
                                                    className="mx-auto h-[295px] w-full "
                                                    alt=""
                                                />
                                            </Link>
                                            <div className="product-info p-[8px] bg-white">
                                                <div className="text-sm flex justify-between mb-3">
                                                    <span>+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.nameColor))].length : 0} màu sắc</span>
                                                    <div className="flex">+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.size))].length : 0}
                                                        <p className="ml-1">Kích thước</p>
                                                    </div>
                                                </div>
                                                <Link to="" className="block font-medium h-12">
                                                    {product.title}
                                                </Link>
                                                <div className="price flex gap-x-[8px] items-baseline">
                                                    <span className="text-sm text-[#FF2C26] font-semibold">
                                                        {product.discount ? (product.price - product.discount).toLocaleString("vi-VN") + 'đ' : product.price.toLocaleString("vi-VN")}đ
                                                    </span>
                                                    {!product.discount ? "" : <span className="text-[13px] text-[#878C8F] ">
                                                        <del>{product.price.toLocaleString("vi-VN")}đ</del>
                                                    </span>}
                                                </div>
                                            </div>
                                            <div>
                                                {product?.discount > 0 ? <span className="width-[52px] absolute top-3 left-3 height-[22px] rounded-full px-3 py-[3px] text-xs font-semibold text-white bg-[#FF0000]">
                                                    -{Math.ceil((product.discount / product.price) * 100)}%
                                                </span> : ""}
                                            </div>
                                            <Link to="" className="rounded-lg opacity-0 absolute bottom-[140px] left-2/4 -translate-x-2/4 bg-white flex gap-x-[5px] items-center p-3 w-[175px] justify-center group-hover:opacity-100 hover:bg-black hover:text-white transition-all">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                    />
                                                </svg>
                                                <span className="uppercase text-xs font-semibold">Thêm vào giỏ</span>
                                            </Link>
                                        </div> :
                                            <div>
                                                {/* soldOut */}
                                                <div className="absolute z-10 bg-red-500 font-semibold top-[50%] left-0 right-0 text-center text-white py-2">Hết hàng</div>
                                                <div className="relative group opacity-60">
                                                    <Link to={`/products/${product._id}`}>
                                                        <img
                                                            src={product.images?.[0]}
                                                            className="mx-auto h-[295px] w-full"
                                                            alt=""
                                                        />
                                                    </Link>
                                                    <div className="product-info p-[8px] bg-white">
                                                        <div className="text-sm flex justify-between mb-3">
                                                            <span>+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.nameColor))].length : 0} màu sắc</span>
                                                            <div className="flex">+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.size))].length : 0}
                                                                <p className="ml-1">Kích thước</p>
                                                            </div>
                                                        </div>
                                                        <Link to="" className="block font-medium h-12">
                                                            {product.title}
                                                        </Link>
                                                        <div className="price flex gap-x-[8px] items-baseline">
                                                            <span className="text-sm text-[#FF2C26] font-semibold">
                                                                {(product.price - product.discount).toLocaleString("vi-VN") + 'đ'}
                                                            </span>
                                                            {!product.discount ? "" : <span className="text-[13px] text-[#878C8F] ">
                                                                <del>{product.price.toLocaleString("vi-VN")}đ</del>
                                                            </span>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {product?.discount > 0 ? <span className="width-[52px] absolute top-3 left-3 height-[22px] rounded-full px-3 py-[3px] text-xs font-semibold text-white bg-[#FF0000]">
                                                            -{Math.ceil((product.discount / product.price) * 100)}%
                                                        </span> : ""}
                                                    </div>
                                                </div>
                                            </div> : ""
                                        }
                                    </div>
                                </List.Item>

                            )}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;