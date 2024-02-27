import React, { useEffect, useState } from 'react';
import type { FormInstance, UploadFile, UploadProps } from 'antd';
import {
    Button,
    Form,
    Input,
    Select,
    Space,
    message,
    Upload,
    Spin,
    Typography,
    Breadcrumb,
    Tooltip,
    InputNumber
} from 'antd';
import {
    PlusOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFetchListProductByAdminQuery } from '../../../store/product/product.service';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useAddOutfitMutation, useFetchListOutfitQuery, useFetchOneOutfitQuery, useUpdateOutfitMutation } from '../../../store/outfit/outfit.service';
import { useListProductDetailQuery } from '../../../store/productDetail/productDetail.service';
import { RcFile } from 'antd/es/upload';
const { Dragger } = Upload;
const { Option } = Select;

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
        <Button type="primary" htmlType="submit"
            // disabled={!submittable}
            className='bg-blue-500'>
            Lưu
        </Button>
    );
};

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const outfitUpdate = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [onUpdate] = useUpdateOutfitMutation()
    const [description, setDescription] = useState('');
    const [valueHide, setValueHide] = useState(false);
    const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductByAdminQuery()
    const { data: listOutfit, isSuccess: isSuccessListOutfit } = useFetchListOutfitQuery()
    const { data: listProductDeatil, isSuccess: isSuccessListProductDetail } = useListProductDetailQuery()
    const { data: outfitById } = useFetchOneOutfitQuery(id!)
    const outfitSearchState = useSelector((state: RootState) => state.searchOutfitReducer.outfits)

    const filterOutfitById = outfitSearchState.find(outfit => outfit._id === id);
    const filteredProductOne = listProduct?.filter(product => {
        const titleLowerCase = product.title.toLowerCase();
        return !product.hide && (titleLowerCase.includes('áo') || titleLowerCase.includes('sơ mi'));
    }) || [];
    const filteredProductTwo = listProduct?.filter(product => {
        const titleLowerCase = product.title.toLowerCase();
        return !product.hide && (titleLowerCase.includes('quần') || titleLowerCase.includes('short'));
    }) || [];
    const [newImage, setNewImage] = useState(false);

    const filteredProducts = listProduct?.filter(product => !product.hide) || [];
    const [productOne, setProductOne] = useState<any>()
    const [productTwo, setProductTwo] = useState<any>()

    const [productDetailByOne, setProductDetailByOne] = useState<any[]>()
    const [productDetailByTwo, setProductDetailByTwo] = useState<any[]>()

    const [productDeatilOne, setProductDetailOne] = useState<any>()
    const [productDetailTwo, setProductDetailTwo] = useState<any>()

    useEffect(() => {
        if (outfitById && listProduct && listProductDeatil) {
            const productOneById = filteredProducts?.find((product: any) => product._id === outfitById.items[0].product_id);
            const productTwoById = filteredProducts?.find((product: any) => product._id === outfitById.items[1].product_id);

            setProductOne(productOneById);
            setProductTwo(productTwoById);

            const listProductDetailOne = listProductDeatil?.filter((productDetail: any) => {
                return productDetail.product_id === outfitById.items[0].product_id;
            });
            const listProductDetailTwo = listProductDeatil?.filter((productDetail: any) => {
                return productDetail.product_id === outfitById.items[1].product_id;
            });

            setProductDetailByOne(listProductDetailOne);
            setProductDetailByTwo(listProductDetailTwo);

            setProductDetailOne(outfitById?.items[0]?._id)
            setProductDetailTwo(outfitById?.items[1]?._id)

            form.setFieldsValue({
                _id: outfitById?._id,
                title: outfitById?.title,
                sku: outfitById?.sku,
                // discount: outfitById?.discount,
                image: outfitById?.image,
                productOne: outfitById?.items?.[0].product_id,
                productTwo: outfitById?.items?.[1].product_id,
                productDetailOne: outfitById?.items?.[0]._id,
                productDetailTwo: outfitById?.items?.[1]._id,
                description: outfitById?.description,
            });
        }
    }, [outfitById, listProduct, listProductDeatil]);

    const listSku = listOutfit
        ?.filter((v) => v.sku !== outfitById?.sku)
        .map((outfit: any) => outfit.sku);
    const handleCheckSku = async (rule: any, value: any) => {
        if (listSku?.includes(value)) {
            throw new Error('Mã đã tồn tại. Vui lòng chọn mã khác.');
        }
    };



    const handleProductOneChange = (selectedProductId: any) => {
        const listProductDetail = listProductDeatil?.filter((productDetail: any) => {
            return productDetail.product_id === selectedProductId;
        });
        const productById = filteredProductOne?.find((product: any) => product._id === selectedProductId);

        setProductOne(productById)
        setProductDetailByOne(listProductDetail);

    };
    const handleProductTwoChange = (selectedProductId: any) => {
        const listProductDetail = listProductDeatil?.filter((productDetail: any) => {
            return productDetail.product_id === selectedProductId;
        });
        const productById = filteredProductTwo?.find((product: any) => product._id === selectedProductId);

        setProductTwo(productById)
        setProductDetailByTwo(listProductDetail);

    };

    const handleSetproductDetailOne = (productDetail: any) => {
        setProductDetailOne(productDetail)
    };
    const handleSetproductDetailTwo = (productDetail: any) => {
        setProductDetailTwo(productDetail)
    };

    const validateProducts = (fieldName: any, otherFieldName: any, value: any, callback: any) => {
        const formValues = form.getFieldsValue();
        const otherValue = formValues[otherFieldName];

        if (otherValue === value) {
            callback(`Bạn đã chọn sản phẩm này rồi. Vui lòng chọn sản phẩm khác`);
        } else {
            callback();
        }
    };


    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: `1`,
            name: 'image',
            status: 'done',
            url: (filterOutfitById && filterOutfitById.image ? filterOutfitById.image.url : outfitById?.image.url),
        },
    ]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setNewImage(true)
    }



    const onFinish = async (values: any) => {

        if (newImage === true) {
            let valueImage;

            if (values.image && values.image.file) {
                valueImage = values.image.file.response[0];
            } else {
                valueImage = [];
            }
            const valueUpdate: any = {
                title: values.title,
                // discount: values.discount,
                sku: values.sku,
                items: [productDeatilOne, productDetailTwo],
                description: description,
                image: valueImage
            };

            await onUpdate({ _id: id, ...valueUpdate })
        } else {
            const valueUpdate: any = {
                title: values.title,
                // discount: values.discount,
                sku: values.sku,
                items: [productDeatilOne, productDetailTwo],
                description: description,
                image: outfitById?.image
            };

            await onUpdate({ _id: id, ...valueUpdate })
        }

        message.success(`Tạo mới thành công`);
        navigate("/admin/outfit");
    };

    const props: UploadProps = {
        listType: "picture-card",
        name: "images",
        multiple: true,
        action: " http://localhost:8080/api/images/upload",
    };

    const handleSwitchChange = (checked: any) => {
        form.setFieldsValue({ hide: !checked });
        setValueHide(!valueHide)
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);

    return <>
        <Breadcrumb className='pb-3'
            items={[
                {
                    title: <Link to={`/admin/outfit`}>Outfit</Link>,
                },
                {
                    title: 'CẬP NHẬT',
                },
            ]}
        />
        <div className='p-10'>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="mx-auto"
            >
                <div className="flex space-x-10">
                    <div className="w-3/4 mx-auto space-y-5">
                        <div className="bg-white border space-y-3 rounded-sm">
                            <h1 className='border-b p-5 font-medium text-lg'>Thông tin chung</h1>
                            <div className="px-5">
                                <div className="flex space-x-5">
                                    <Form.Item
                                        name="title"
                                        label="Tên sản phẩm"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Không được để trống!'
                                            }
                                        ]}
                                        className='w-1/2'

                                    >
                                        <Input
                                            placeholder='Nhập tên sản phẩm'
                                            className='py-2' />
                                    </Form.Item>
                                    <Form.Item
                                        name="sku"
                                        label="Mã sản phẩm/SKU"
                                        rules={[{ required: true, message: 'Không được để trống!' }, { validator: handleCheckSku },]}
                                        normalize={(value) => value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}
                                        className='w-1/2'>
                                        <Input className='py-2' />
                                    </Form.Item>
                                </div>
                                {/* <div className="flex w-full space-x-5 pr-5">
                                    <Form.Item
                                        name="discount"
                                        label="Giảm giá(%)"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Không được để trống!'
                                            }
                                        ]}
                                        className='w-1/2'
                                    >
                                        <InputNumber
                                            placeholder='Nhập giảm giá'
                                            className='py-1'
                                            max={100}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </div> */}
                                <details className="pb-2 overflow-hidden [&_summary::-webkit-details-marker]:hidde">
                                    <summary
                                        className="flex w-[250px] cursor-pointer p-2 transition"
                                    >
                                        <span className="text-sm text-blue-500">Mô tả sản phẩm</span>
                                    </summary>
                                    <div className="pt-3">
                                        <Form.Item
                                            name="description"
                                        >
                                            <CKEditor
                                                editor={ClassicEditor}
                                                onReady={editor => {
                                                    // console.log('Editor is ready to use!', editor);
                                                    editor.editing.view.change((writer) => {
                                                        writer.setStyle(
                                                            "height",
                                                            "300px",
                                                            editor.editing.view.document.getRoot()
                                                        )
                                                    })
                                                }}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    setDescription(data);
                                                    // console.log({ event, editor, data });
                                                }}
                                                onBlur={(event, editor) => {
                                                    // console.log('Blur.', editor);
                                                }}
                                                onFocus={(event, editor) => {
                                                    // console.log('Focus.', editor);
                                                }}
                                            />
                                        </Form.Item>
                                    </div>
                                </details>
                            </div>
                        </div>
                        <div className="bg-white border p-5 space-y-3 rounded-sm">
                            <div className="flex items-center space-x-1">
                                <h1 className='font-medium text-lg'>Ảnh</h1>
                                {/* <Tooltip title="Ảnh tải đầu tiên sẽ được chọn làm ảnh đại diện" color={'blue'} key={'blue'}>
                                    <InfoCircleOutlined className='text-blue-500' />
                                </Tooltip> */}
                            </div>
                            <Form.Item
                                name="image"
                                rules={[{ required: true, message: 'Không được để trống!' }]}
                            >
                                <Upload {...props}
                                    maxCount={1}
                                    defaultFileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    <div className=''>
                                        <PlusOutlined />
                                        <div>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </div>
                        <div className="bg-white border space-y-3 rounded-sm">
                            <h1 className='border-b p-5 font-medium text-lg'>Set Outfit</h1>
                            <div className=" px-5 ">
                                <div className="flex space-x-5">
                                    <Form.Item
                                        name='productOne'
                                        label='Sản phẩm áo'
                                        rules={[
                                            { required: true, message: 'Không được để trống' },
                                            { validator: (_, value, callback) => validateProducts('productOne', 'productTwo', value, callback) },
                                        ]}
                                        className='w-1/2'
                                        initialValue={outfitById?.items?.[0].product_id}
                                    >
                                        <Select
                                            showSearch
                                            onChange={(selectedValue) => handleProductOneChange(selectedValue)}
                                            style={{ height: 60 }}
                                            placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm"
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
                                            {filteredProductOne?.map((product: any) => (
                                                <Option key={product._id}
                                                    value={product._id}
                                                    label={product.title}
                                                    sku={product.sku}
                                                    customLabel={
                                                        <div className='flex items-center space-x-2'>
                                                            <img className='h-14' src={product.images[0]} alt="" />
                                                            <span>{product.title} {product.sku}</span>
                                                        </div>
                                                    }

                                                >
                                                    <div className='flex items-center space-x-2'>
                                                        <img className='h-14' src={product.images[0]} alt="" />
                                                        <span>{product.title} {product.sku}</span>
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    {productDetailByOne && productDetailByOne?.length > 0 ? (
                                        <Form.Item
                                            name='productDetailOne'
                                            label='Chi tiết sản phẩm'
                                            rules={[{ required: true, message: 'Không được để trống' }]}
                                            className='w-1/2'
                                            initialValue={outfitById?.items?.[0]._id}
                                        >
                                            <Select
                                                showSearch
                                                onChange={(productDetailId) => handleSetproductDetailOne(productDetailId)}
                                                style={{ height: 60 }}
                                                placeholder="Tìm kiếm theo kích thước, màu sắc"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) => {
                                                    const lowerCaseInput = input.toLowerCase();
                                                    const sizeIncludesInput = (option?.size?.toLowerCase() ?? '').includes(lowerCaseInput);
                                                    const colorIncludesInput = (option?.color?.toLowerCase() ?? '').includes(lowerCaseInput);
                                                    return colorIncludesInput || sizeIncludesInput;
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
                                                {productDetailByOne && Array.isArray(productDetailByOne) && productDetailByOne?.map((product: any) => (
                                                    <Option key={product._id}
                                                        value={product._id}
                                                        label={product.nameColor}
                                                        size={product.size}
                                                        color={product.nameColor}
                                                        customLabel={
                                                            <div className='flex items-center space-x-2'>
                                                                <div className="">
                                                                    <img className='h-14' src={product.imageColor} alt="" />
                                                                </div>
                                                                <div className="space-x-1">
                                                                    <span className='block'>{productOne?.title} {productOne?.sku}</span>

                                                                    <span className='block text-[12px] text-blue-500'>{product.nameColor}-{product.size}</span>
                                                                </div>
                                                            </div>
                                                        }
                                                        className='cursor-pointer'

                                                    >
                                                        <div className='flex items-center space-x-2'>
                                                            <div className="">
                                                                <img className='h-14' src={product.imageColor} alt="" />
                                                            </div>
                                                            <div className="space-x-1">
                                                                <span className='block'>{productOne?.title} {productOne?.sku}</span>

                                                                <span className='block text-[12px] text-blue-500'>{product.nameColor}-{product.size}</span>
                                                            </div>
                                                        </div>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    ) : ""}

                                </div>
                                <div className="flex space-x-5">
                                    <Form.Item
                                        name='productTwo'
                                        label='Sản phẩm quần'
                                        rules={[
                                            { required: true, message: 'Không được để trống' },
                                            { validator: (_, value, callback) => validateProducts('productTwo', 'productOne', value, callback) },
                                        ]}
                                        className='w-1/2'
                                        initialValue={outfitById?.items?.[1].product_id}
                                    >
                                        <Select
                                            showSearch
                                            onChange={(selectedValue) => handleProductTwoChange(selectedValue)}
                                            style={{ height: 60 }}
                                            placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm"
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
                                            {filteredProductTwo?.map((product: any) => (
                                                <Option key={product._id}
                                                    value={product._id}
                                                    label={product.title}
                                                    sku={product.sku}
                                                    customLabel={
                                                        <div className='flex items-center space-x-2'>
                                                            <img className='h-14' src={product.images[0]} alt="" />
                                                            <span>{product.title} {product.sku}</span>
                                                        </div>
                                                    }

                                                >
                                                    <div className='flex items-center space-x-2'>
                                                        <img className='h-14' src={product.images[0]} alt="" />
                                                        <span>{product.title} {product.sku}</span>
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    {productDetailByTwo && productDetailByTwo?.length > 0 ? (
                                        <Form.Item
                                            name='productDetailTwo'
                                            label='Chi tiết sản phẩm'
                                            rules={[{ required: true, message: 'Không được để trống' }]}
                                            className='w-1/2'
                                            initialValue={outfitById?.items?.[1]._id}
                                        >
                                            <Select
                                                showSearch
                                                onChange={(productDetailId) => handleSetproductDetailTwo(productDetailId)}
                                                style={{ height: 60 }}
                                                placeholder="Tìm kiếm theo kích thước, màu sẵc"
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) => {
                                                    const lowerCaseInput = input.toLowerCase();
                                                    const sizeIncludesInput = (option?.size?.toLowerCase() ?? '').includes(lowerCaseInput);
                                                    const colorIncludesInput = (option?.color?.toLowerCase() ?? '').includes(lowerCaseInput);
                                                    return colorIncludesInput || sizeIncludesInput;
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
                                                {productDetailByTwo && Array.isArray(productDetailByTwo) && productDetailByTwo?.map((product: any) => (
                                                    <Option key={product._id}
                                                        value={product._id}
                                                        label={product.nameColor}
                                                        size={product.size}
                                                        color={product.nameColor}
                                                        customLabel={
                                                            <div className='flex items-center space-x-2'>
                                                                <div className="">
                                                                    <img className='h-14' src={product.imageColor} alt="" />
                                                                </div>
                                                                <div className="space-x-1">
                                                                    <span className='block'>{productTwo?.title} {productTwo?.sku}</span>

                                                                    <span className='block text-[12px] text-blue-500'>{product.nameColor}-{product.size}</span>
                                                                </div>
                                                            </div>
                                                        }
                                                        className='cursor-pointer'

                                                    >
                                                        <div className='flex items-center space-x-2'>
                                                            <div className="">
                                                                <img className='h-14' src={product.imageColor} alt="" />
                                                            </div>
                                                            <div className="space-x-1">
                                                                <span className='block'>{productTwo?.title} {productTwo?.sku}</span>
                                                                <span className='block text-[12px] text-blue-500'>{product.nameColor}-{product.size}</span>
                                                            </div>
                                                        </div>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    ) : ""}

                                </div>

                            </div>
                        </div>
                    </div>

                </div >

                {/* <Form.Item noStyle shouldUpdate>
                    {() => (
                        <Typography>
                            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                        </Typography>
                    )}
                </Form.Item> */}

                <Form.Item className='my-5 w-3/4 mx-auto'>
                    <Space>
                        <SubmitButton form={form} />
                        {/* <Button htmlType="reset">Reset</Button> */}
                    </Space>
                </Form.Item>
            </Form >
        </div >

    </>
}
export default outfitUpdate;