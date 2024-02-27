import React, { useEffect, useState } from 'react';
import type { FormInstance, UploadFile, UploadProps } from 'antd';
import { Breadcrumb, Button, Form, Input, Space, Spin, Upload, message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFetchOneCategoryQuery, useUpdateCategoryMutation } from '../../../store/category/category.service';
import {
    PlusOutlined
} from "@ant-design/icons";
import { RcFile } from 'antd/es/upload';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';


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

const categoryUpdate = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [onUpdate] = useUpdateCategoryMutation()
    const { id } = useParams();
    const { data: fetchOneCategory, isSuccess: isSuccessGetCate } = useFetchOneCategoryQuery(id)
    const [newImage, setNewImage] = useState(false);
    const categoryState = useSelector((state: RootState) => state.categorySlice.categories)
    const cateById = categoryState.find(category => category._id === id);

    form.setFieldsValue({
        _id: fetchOneCategory?._id,
        name: fetchOneCategory?.name,
        images: fetchOneCategory?.images,
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: `1`,
            name: 'image',
            status: 'done',
            url: (cateById && cateById.images ? cateById.images.url : ''),
        },
    ]);
    console.log(fileList);

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
        try {
            if (id) {
                if (newImage === true) {
                    let newImages;
                    if (values.images && values.images.file) {
                        newImages = values.images.file.response[0];
                    } else {
                        newImages = [];
                    }
                    const value = {
                        ...values,
                        images: newImages
                    };

                    await onUpdate({ id, ...value })
                } else {
                    await onUpdate({ id, ...values })
                }

                message.success(`Cập nhật thành công`);
                navigate("/admin/category");
            }
        } catch (error) {
            console.log(error);

        }
    };

    const props: UploadProps = {
        listType: "picture-card",
        name: "images",
        multiple: true,
        action: " http://localhost:8080/api/images/upload",

    };
    return <>
        <Breadcrumb className='pb-3'
            items={[

                {
                    title: <Link to={`/admin/category`}>Danh mục</Link>,
                },
                {
                    title: 'Cập nhật ',
                    className: 'uppercase'
                },
            ]}
        />
        <div className="border p-10 rounded-lg  bg-white w-1/2 mx-auto">
            {/* <h3 className="text-center text-2xl font-bold uppercase text-[#1677ff]">
                Cập nhật danh mục
            </h3> */}
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="mx-auto max-w-[500px]"
            >
                <Form.Item name="_id" style={{ display: "none" }}>
                    <Input />
                </Form.Item>
                {/* Name Category */}
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[
                        { required: true, message: '* Không được để trống' },
                        {
                            validator: (_, value) => {
                                if (value && value.trim() === '') {
                                    return Promise.reject('Không được để khoảng trắng');
                                }
                                return Promise.resolve();
                            },
                        },
                        { min: 3, message: 'Tối thiểu 3 kí tự' },

                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Ảnh"
                    name="images"
                    rules={[{ required: true }]}
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
                <Form.Item>
                    <Space>
                        <SubmitButton form={form} />
                        {/* <Button htmlType="reset">Reset</Button> */}
                    </Space>
                </Form.Item>
            </Form>
        </div>

    </>
}
export default categoryUpdate;