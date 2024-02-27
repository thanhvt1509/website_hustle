import React, { useEffect, useState } from 'react';
import type { FormInstance, UploadProps } from 'antd';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    message,
    Upload,
    Spin,
    Card,
    Typography,
    Breadcrumb,
    Switch,
    Tag,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { useFetchListCategoryQuery } from '../../../store/category/category.service';
import { ICategory } from '../../../store/category/category.interface';
import { useAddProductMutation } from '../../../store/product/product.service';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
const { Dragger } = Upload;
const { TextArea } = Input;

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
            Thêm
        </Button>
    );
};

const productAdd = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { data: categories, } = useFetchListCategoryQuery();
    const [onAdd] = useAddProductMutation()
    const [description, setDescription] = useState('');
    const [valueHide, setValueHide] = useState(false);

    const productSearchState = useSelector((state: RootState) => state.productSearchReducer.products)
    const listSku = productSearchState.map((product) => product.sku);
    const handleCheckSku = async (rule: any, value: any) => {
        if (listSku.includes(value)) {
            throw new Error('Mã sản phẩm đã tồn tại. Vui lòng chọn mã khác.');
        }
    };

    const selectOptions = categories
        ?.filter((cate: ICategory) => cate.name !== "Chưa phân loại")
        .map((cate: ICategory) => ({
            label: `${cate.name}`,
            value: `${cate._id!}`,
        }));
    const onFinish = async (values: any) => {
        console.log(values);
        let newImages;

        if (values.images && values.images.fileList) {
            newImages = values.images.fileList.map(({ response }: any) => response[0].url);
        } else if (values.images && values.images.file) {
            newImages = values.images.file.response[0].url;
        } else {
            newImages = [];
        }

        if (values.variants && values.variants.length > 0) {
            values.variants.forEach((variant: any) => {
                if (variant.imageColor) {
                    if (variant.imageColor.fileList && variant.imageColor.fileList.length === 1) {
                        variant.imageColor = variant.imageColor.fileList[0].response[0].url;
                    }
                }
            });
        }
        const newValues = { ...values, hide: valueHide, description: description, images: newImages, colors: colors, sizes: sizes };

        console.log(newImages);
        console.log("Values Data:", newValues);

        await onAdd(newValues)
        message.success(`Tạo mới thành công`);
        navigate("/admin/product");
    };

    const props: UploadProps = {
        listType: "picture",
        name: "images",
        multiple: true,
        action: " http://localhost:8080/api/images/upload",
    };

    const handleSwitchChange = (checked: any) => {
        form.setFieldsValue({ hide: !checked });
        setValueHide(!valueHide)
    };

    const [valueColor, setValueColor] = useState('');
    const [colors, setColors] = useState<any[]>([]);

    const handleInputColor = (e: any) => {
        setValueColor(e.target.value);
    };

    const handleInputColorEnter = () => {
        if (valueColor && !colors.includes(valueColor)) {
            setColors([...colors, valueColor]);
            setValueColor('');
        } else {
            setValueColor('');
        }
    };

    const handleColorClose = (removedTag: any) => {
        const updatedColor = colors.filter(color => color !== removedTag);
        setColors(updatedColor);
    };

    const [valueSize, setValueSize] = useState('');
    const [sizes, setSizes] = useState<any[]>([]);

    const handleInputSize = (e: any) => {
        setValueSize(e.target.value);
    };
    const handleInputSizeEnter = () => {
        if (valueSize && !sizes.includes(valueSize)) {
            setSizes([...sizes, valueSize]);
            setValueSize('');
        } else {
            setValueSize('');
        }
    };

    const handleSizeClose = (removedTag: any) => {
        const updatedSize = sizes.filter(size => size !== removedTag);
        setSizes(updatedSize);
    };

    const initial = {
        variants: colors.map(color => ({
            nameColor: color,
            items: sizes.map(size => ({
                size: size,
            }))
        }))
    }
    useEffect(() => {
        form.setFieldsValue(initial);
    }, [form, initial]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);

    const handleFormKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    return <>
        <Breadcrumb className='pb-3'
            items={[
                {
                    title: <Link to={`/admin/product`}>Sản phẩm</Link>,
                },
                {
                    title: 'TẠO MỚI',
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
                // initialValues={initial}
                className="mx-auto"
            >
                <div className="flex space-x-10">
                    <div className="w-3/4 space-y-5">
                        <div className="bg-white border space-y-3 rounded-sm">
                            <h1 className='border-b p-5 font-medium text-lg'>Thông tin chung</h1>
                            <div className="px-5">
                                <Form.Item
                                    name="title"
                                    label="Tên sản phẩm"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Không được để trống!'
                                        }
                                    ]}>
                                    <Input
                                        placeholder='Nhập tên sản phẩm'
                                        className='py-2' />
                                </Form.Item>
                                <div className="flex space-x-5">
                                    <Form.Item
                                        name="categoryId"
                                        label="Loại sản phẩm"
                                        rules={[{ required: true, message: 'Không được để trống!' }]}
                                        className='w-1/2'
                                    >
                                        <Select
                                            size='large'
                                            placeholder="Chọn loại sản phẩm"
                                            allowClear
                                            options={selectOptions}
                                            className='bg-red'
                                        ></Select>
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
                                <h1 className='font-medium text-lg'>Ảnh sản phẩm</h1>
                                <Tooltip title="Ảnh tải đầu tiên sẽ được chọn làm ảnh đại diện" color={'blue'} key={'blue'}>
                                    <InfoCircleOutlined className='text-blue-500' />
                                </Tooltip>
                            </div>
                            <Form.Item
                                name="images"
                                rules={[{ required: true, message: 'Không được để trống!' }]}
                            >
                                <Dragger
                                    {...props}
                                    className='text-gray-500'

                                >
                                    <PlusOutlined className='pr-5 text-lg' />  Kéo thả hoặc <a className='text-blue-500'>tải ảnh lên từ thiết bị</a>
                                </Dragger>
                            </Form.Item>

                        </div>
                        <div className="bg-white border pb-5 space-y-3 rounded-sm">
                            <h1 className='border-b p-5 font-medium text-lg'>Giá sản phẩm</h1>
                            <div className="flex mx-5 space-x-5 border-b">
                                <Form.Item
                                    name="price"
                                    label="Giá bán "
                                    rules={[{ required: true, message: 'Không được để trống!' }]}
                                    className='w-1/2'
                                >
                                    <InputNumber
                                        min={0}
                                        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        className='py-1'
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="discount"
                                    label="Giảm giá"
                                    rules={[
                                        {
                                            validator: async (_, value) => {
                                                if (value > form.getFieldValue('price')) {
                                                    return Promise.reject('Giảm giá không thể lớn hơn giá');
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        },
                                    ]}
                                    className='w-1/2'
                                >
                                    <InputNumber
                                        min={0}
                                        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        className='py-1'
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </div>
                            <Form.Item
                                name="costPrice"
                                label="Giá nhập "
                                rules={[{ required: true, message: 'Không được để trống!' }]}
                                className='w-1/2 px-5'
                            >
                                <InputNumber
                                    min={0}
                                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    className='py-1'
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>
                        <div className="bg-white border space-y-3 rounded-sm ">
                            <h1 className='border-b p-5 font-medium text-lg'>Bộ sưu tập</h1>
                            <div className="px-5 pb-5">
                                <div className="flex space-x-5 ">
                                    <Form.Item
                                        label="Màu sắc"
                                        name='colors'
                                        className='w-1/2'
                                    >
                                        <div className="border rounded-md hover:border-blue-500 ">
                                            {colors.map(color => (
                                                <Tag className='m-1 px-2 py-1 rounded-md' key={color} closable onClose={() => handleColorClose(color)}
                                                >
                                                    {color}
                                                </Tag>
                                            ))}
                                            <Input
                                                value={valueColor}
                                                bordered={false}
                                                placeholder='Gõ ký tự và ấn Enter để thêm thuộc tính'
                                                onChange={handleInputColor}
                                                onPressEnter={handleInputColorEnter}
                                                className='py-2'
                                                onKeyPress={handleFormKeyPress}
                                            />
                                        </div>
                                    </Form.Item>
                                    <Form.Item label="Kích thước"
                                        name="sizes"
                                        className='w-1/2'>
                                        <div className="border rounded-md hover:border-blue-500 ">
                                            {sizes.map(size => (
                                                <Tag className='m-1 px-2 py-1 rounded-md' key={size} closable onClose={() => handleSizeClose(size)}
                                                >
                                                    {size}
                                                </Tag>
                                            ))}
                                            <Input
                                                value={valueSize}
                                                bordered={false}
                                                placeholder='Gõ ký tự và ấn Enter để thêm thuộc tính'
                                                onChange={handleInputSize}
                                                onPressEnter={handleInputSizeEnter}
                                                className='py-2'
                                                onKeyPress={handleFormKeyPress}
                                            />
                                        </div>

                                    </Form.Item>
                                </div>
                                {colors.length > 0 && sizes.length > 0 ? (
                                    <Form.List name="variants">
                                        {(fields) => (
                                            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                                                {fields.map((field) => (
                                                    <Card
                                                        className='bg-stone-50'
                                                        size="small"
                                                        title={`Mẫu ${field.name + 1}`}
                                                        key={field.key}
                                                    >
                                                        <div className="flex justify-between px-10 py-3">
                                                            <div className="text-center w-[300]">
                                                                <Form.Item name={[field.name, 'imageColor']} rules={[{ required: true, message: 'Không được để trống!' }]}>
                                                                    <Upload
                                                                        {...props}
                                                                        listType="picture-card"
                                                                        className="avatar-uploader"
                                                                        maxCount={1}
                                                                    >
                                                                        <div>
                                                                            <PlusOutlined />
                                                                            <div>Upload</div>
                                                                        </div>
                                                                    </Upload>
                                                                </Form.Item>
                                                                <Form.Item label="Màu sắc" name={[field.name, 'nameColor']}>
                                                                    <Input disabled />
                                                                </Form.Item>
                                                            </div>

                                                            <div className="w-2/3">
                                                                <Form.Item label="">
                                                                    <Form.List name={[field.name, 'items']} initialValue={[{}]}>
                                                                        {(subFields, subOpt) => (
                                                                            <div className="">
                                                                                <div className="flex space-x-32 py-2">
                                                                                    <span>Kích thước</span>
                                                                                    <span>Số lượng</span>
                                                                                </div>
                                                                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                                                    {subFields.map((subField) => (


                                                                                        <Space key={subField.key} className='flex ' >
                                                                                            <Form.Item noStyle name={[subField.name, 'size']}
                                                                                                className='w-full'>
                                                                                                <Input
                                                                                                    style={{ width: '100%' }

                                                                                                    }
                                                                                                    disabled
                                                                                                />
                                                                                            </Form.Item>
                                                                                            <Form.Item noStyle name={[subField.name, 'quantity']} rules={[{ required: true }]}>
                                                                                                <InputNumber
                                                                                                    placeholder='Số lượng'
                                                                                                    min={0}
                                                                                                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                                                    style={{ width: '100%' }}
                                                                                                />
                                                                                            </Form.Item>

                                                                                        </Space>
                                                                                    ))}

                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Form.List>
                                                                </Form.Item>
                                                            </div>
                                                        </div >
                                                    </Card >
                                                ))}
                                            </div >
                                        )}
                                    </Form.List >
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="w-1/4">
                        <div className="bg-white border rounded-sm">
                            <Form.Item
                                name="hide"
                                valuePropName="checked"
                                initialValue={false}
                                className='px-3 space-y-3'
                            >
                                <h1 className='border-b py-2 font-semibold'>Trạng thái</h1>
                                <Space className="flex justify-between py-2" >
                                    <span className='block'>Cho phép bán</span>
                                    <Switch
                                        size="small"
                                        className=''
                                        defaultChecked={true}
                                        onChange={(checked) => handleSwitchChange(checked)}
                                    />
                                </Space>
                            </Form.Item>
                        </div>
                    </div>
                </div>
                {/* 
                // <Form.Item noStyle shouldUpdate>
                //     {() => (
                //         <Typography>
                //             <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                //         </Typography>
                //     )}
                // </Form.Item> */}

                <Form.Item className='my-5'>
                    <Space>
                        <SubmitButton form={form} />
                        <Button htmlType="reset">Reset</Button>
                    </Space>
                </Form.Item>
            </Form >
        </div >

    </>
}
export default productAdd;