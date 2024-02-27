import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    message,
    Spin,
    Row,
    Col,
    Breadcrumb,
    DatePicker,
    Radio,
    Checkbox,
    Switch
} from 'antd';
import {
    SyncOutlined
} from "@ant-design/icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { useAddVoucherMutation, useGetOneVoucherQuery, useListVoucherQuery, useUpdateVoucherMutation } from '../../../store/vouchers/voucher.service';
import { listVoucherSlice } from '../../../store/vouchers/voucherSlice';
const { TextArea } = Input;
const { RangePicker } = DatePicker;

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
            Cập nhât
        </Button>
    );
};

const VoucherUpdate = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [onAdd] = useAddVoucherMutation()
    const { id } = useParams();
    const { data: voucher, isSuccess } = useGetOneVoucherQuery(id || '')
    const vocherState = useSelector((state: RootState) => state.voucherSlice.vouchers)
    const voucherCodes = vocherState
        .filter((v) => v.code !== voucher?.code)
        .map((voucher) => voucher.code);

    const voucherById = vocherState.find((voucher: any) => voucher._id === id)
    const [statusVoucher, setStatusVoucher] = useState<any>(voucherById?.status)
    console.log(voucherById?.status);



    useEffect(() => {
        if (isSuccess) {
            setIsEndDateDisabled(voucher?.validTo === null || undefined ? true : false)
            setIsQuantityDisabled(voucher?.quantity === null || !voucher?.quantity ? true : false);
            setDiscountType(voucher.type)
            form.setFieldsValue({
                _id: voucher?._id,
                title: voucher?.title,
                code: voucher?.code,
                quantity: voucher?.quantity,
                minOrderValue: voucher?.minOrderValue,
                maxOrderValue: voucher?.maxOrderValue,
                discount: voucher?.discount,
                type: voucher?.type,
                validFrom: dayjs(voucher?.validFrom),
                validTo: voucher.validTo === null ? dayjs() : dayjs(voucher?.validTo),
                description: voucher?.description,
            });
        }
    }, [voucher, isSuccess, form]);

    const [onUpdate] = useUpdateVoucherMutation()



    const [isEndDateDisabled, setIsEndDateDisabled] = useState<boolean | undefined>(voucher?.validTo === null || undefined ? true : false);

    const handleCheckboxEndDate = (e: any) => {
        setIsEndDateDisabled(e.target.checked);
    };

    const [isQuantityDisabled, setIsQuantityDisabled] = useState<boolean | undefined>(voucher?.quantity === null || undefined ? true : false);

    const handleCheckboxQuantity = (e: any) => {
        setIsQuantityDisabled(e.target.checked);
    };

    const [discountType, setDiscountType] = React.useState(voucher?.type);
    const handleDiscountTypeChange = (value: any) => {
        setDiscountType(value.target.value);
    };

    const [promotionType, setPromotionType] = React.useState(1);

    const handlePromotionTypeChange = (value: any) => {
        setPromotionType(value);
    };

    const handleSwitchChange = (checked: any) => {
        setStatusVoucher(checked)
    };

    const formatter = (value: any) => {
        if (discountType === 'value') {
            return ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
            return value === undefined ? '' : value.toString();
        }
    };

    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        const codeLength = 10;

        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        form.setFieldsValue({ code });
    };
    const handleCheckCode = async (rule: any, value: any) => {
        if (voucherCodes.includes(value)) {
            throw new Error('Mã CODE đã tồn tại. Vui lòng chọn mã khác.');
        }
    };

    const onFinish = async (values: any) => {
        try {
            const voucherData = {
                ...values,
                status: statusVoucher,
                quantity: !isQuantityDisabled ? values.quantity : null,
                description: values.description,
                validFrom: values.validFrom.format('YYYY-MM-DD'),
                validTo: !isEndDateDisabled ? values.validTo.format('YYYY-MM-DD') : null
            };
            console.log(voucherData);

            await onUpdate({ _id: id, ...voucherData })
            message.success(`Cập nhật thành công`);
            navigate("/admin/voucher");
        } catch (error) {
            console.log(error);

        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);

    return <>
        <Breadcrumb className='pb-3'
            items={[
                {
                    title: <Link to={`/admin/voucher`}>Voucher</Link>,
                },
                {
                    title: 'CẬP NHẬT',
                },
            ]}
        />
        <div className=' p-10 '>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                className="mx-auto "
            >
                <div className="flex space-x-10">
                    <div className="w-2/3 space-y-5">
                        <div className="bg-white border space-y-3 rounded-sm">
                            <h1 className='border-b p-5 font-medium text-lg'>Thông tin chung</h1>
                            <div className=" px-5 flex space-x-5">
                                <Form.Item
                                    name="title"
                                    label="Tên đợt phát hành"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Không được để trống!'
                                        }
                                    ]}
                                    className='w-1/2'>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="code"
                                    label="Mã đợt phát hành"
                                    rules={[{ required: true, message: 'Không được để trống!' }, { validator: handleCheckCode },]}
                                    normalize={(value) => value.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}
                                    className='w-1/2'
                                >
                                    <Input suffix={<SyncOutlined onClick={generateRandomCode} className='text-gray-400' />} />
                                </Form.Item>
                            </div>
                            <div className=" px-5 flex space-x-5">
                                <div className="w-1/2">
                                    {isQuantityDisabled ? (
                                        <Form.Item
                                            label="Số lượng áp dụng"
                                            className='w-full mb-3'
                                        >
                                            <InputNumber
                                                min={0}
                                                formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                style={{ width: '100%' }}
                                                disabled={isQuantityDisabled}
                                            />
                                        </Form.Item>
                                    ) : (
                                        <Form.Item
                                            name="quantity"
                                            label="Số lượng áp dụng"
                                            rules={isQuantityDisabled ? [] : [{ required: true, message: 'Không được để trống!' }]}
                                            className='w-full mb-3'
                                        >
                                            <InputNumber
                                                min={0}
                                                formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    )}
                                    <Form.Item
                                        className='mb-0'
                                    >
                                        <Checkbox
                                            className=' px-2'
                                            onChange={handleCheckboxQuantity}
                                            checked={isQuantityDisabled}
                                        >
                                            Không giới hạn số lượng
                                        </Checkbox>
                                    </Form.Item>
                                </div>
                            </div>
                            <details className="px-5 mt-[-20px] overflow-hidden [&_summary::-webkit-details-marker]:hidde">
                                <summary
                                    className="flex w-[250px] cursor-pointer pb-3 px-3 transition"
                                >
                                    <span className="text-sm text-blue-500">Mô tả </span>
                                </summary>
                                <div className="">
                                    <Form.Item
                                        name="description"
                                    >
                                        <TextArea rows={4}></TextArea>
                                    </Form.Item>
                                </div>
                            </details>
                        </div>
                        <div className="bg-white border space-y-3 rounded-sm">
                            <h1 className='border-b p-5 font-medium text-lg'>Điều kiện áp dụng</h1>
                            <div className=" px-5 ">
                                <h2 className='text-blue-500 pb-3 font-medium'>Chiết khấu theo tổng đơn hàng</h2>
                                <div className="flex space-x-5 items-end">
                                    <Form.Item name="minOrderValue" label="Giá trị từ" className='border-b'>
                                        <InputNumber
                                            min={0}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            style={{ width: '100%' }}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item name="maxOrderValue" label="Giá trị đến" className='border-b'>
                                        <InputNumber
                                            min={0}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            style={{ width: '100%' }}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                    <Form.Item name="type" initialValue={"value"}>
                                        <Radio.Group buttonStyle="solid" onChange={handleDiscountTypeChange}>
                                            <Radio.Button value="value">Giá trị</Radio.Button>
                                            <Radio.Button value="percent">%</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        name="discount"
                                        label="Giá trị khuyến mại"
                                        rules={[{ required: true, message: 'Không được để trống!' }]}
                                        className='border-b'
                                    >
                                        <InputNumber
                                            min={0}
                                            max={discountType === 'percent' ? 100 : undefined}
                                            formatter={formatter}
                                            style={{ width: '100%' }}
                                            suffix={discountType === 'percent' ? '%' : undefined}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/3 space-y-5">
                        <div className="bg-white border rounded-sm">
                            <Form.Item
                                name="status"
                                valuePropName="checked"
                                // initialValue={false}
                                className=' space-y-3'
                            >
                                <h1 className='border-b px-3 py-2 font-semibold'>Trạng thái</h1>
                                <Space className="flex justify-between px-3 py-2" >
                                    <span className='block'>Kích hoạt</span>
                                    <Switch
                                        size="small"
                                        className=''
                                        defaultChecked={voucherById?.status}
                                        onChange={(checked) => handleSwitchChange(checked)}
                                    />
                                </Space>

                            </Form.Item>
                        </div>
                        <div className="bg-white border rounded-sm">
                            <h1 className='border-b py-2 font-semibold px-3'>Thời gian áp dụng</h1>
                            <div className="px-3 py-2" >
                                <Form.Item
                                    name="validFrom"
                                    label="Ngày bắt đầu"
                                    rules={[{ required: true, message: 'Không được để trống!' }]}
                                    className='mt-3 mb-3 '
                                >
                                    <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />

                                </Form.Item>

                                {isEndDateDisabled ? (
                                    <Form.Item
                                        label="Ngày kết thúc"
                                        className='mt-3 mb-3'
                                    >
                                        <Input style={{ width: '100%' }} value={""} disabled={isEndDateDisabled} />
                                    </Form.Item>

                                ) : (
                                    <Form.Item
                                        name="validTo"
                                        label="Ngày kết thúc"
                                        rules={[{ required: true, message: 'Không được để trống!' }]}
                                        className='mt-3 mb-3'
                                    >
                                        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                                    </Form.Item>

                                )}
                                <Form.Item>
                                    <Checkbox
                                        className='px-2'
                                        onChange={handleCheckboxEndDate}
                                        checked={isEndDateDisabled}
                                    >
                                        Không cần ngày kết thúc
                                    </Checkbox>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Form.Item noStyle shouldUpdate>
                        {() => (
                            <Typography>
                                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                            </Typography>
                        )}
                    </Form.Item> */}

                <Form.Item className='my-5'>
                    <Space>
                        <SubmitButton form={form} />
                    </Space>
                </Form.Item>
            </Form >
        </div >

    </>
}
export default VoucherUpdate;