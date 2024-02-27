import React, { useState } from 'react';
import type { FormInstance, UploadProps } from 'antd';
import {
    Breadcrumb,
    Button,
    Form,
    Input,
    Space,
    Upload,
    message,
} from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { useAddCategoryMutation } from '../../../store/category/category.service';

const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
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
            Thêm
        </Button>
    );
};

const categoryAdd = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [onAdd] = useAddCategoryMutation()

    const onFinish = async (values: any) => {
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

        await onAdd(value)
        message.success(`Tạo mới thành công`);
        navigate("/admin/category");
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
                    title: 'Tạo mới',
                    className: 'uppercase'
                },
            ]}
        />
        <div className="border p-10 rounded-lg  bg-white w-1/2 mx-auto">
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
                onFinish={onFinish}
                className="mx-auto max-w-[500px]"
            >
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
                {/* Upload Images */}
                <Form.Item label="Ảnh" name="images" rules={[{ required: true }]}>
                    <Upload {...props}
                        maxCount={1}
                    >
                        <div>
                            <PlusOutlined />
                            <div>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <SubmitButton form={form} />
                        <Button htmlType="reset">Reset</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div >
    </>
}
export default categoryAdd;
