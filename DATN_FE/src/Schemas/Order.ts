import * as yup from "yup"

export const orderSchema = yup.object({
    _id: yup.string(),
    userId: yup.string().required("Bạn cần phải đăng nhập"),
    fullName: yup.string().trim("Hãy nhập tên của bạn").required("Trường tên bắt buộc nhập"),
    email: yup.string().trim("Hãy nhập email của bạn").required("Trường email bắt buộc nhập"),
    phoneNumber: yup.string().trim("Hãy nhập số điện thoại của bạn").required("Trường số điện thoại bắt buộc nhập"),
    carts: yup.array().of(
        yup.object().shape({
            productDetailId: yup.string().required("truong productDetailId bat buoc"),
            quantity: yup.number().required("truong quantity bat buoc"),
            color: yup.string().required("truong color bat buoc"),
            size: yup.string().required("truong size bat buoc"),
            price: yup.number().required("truong price bat buoc"),
            totalMoney: yup.number().required("truong totalMoney bat buoc")
        })
    ),
    address: yup.object().shape({
        myProvince: yup.string().required('trường tỉnh/thành phố bắt buộc nhập'),
        myDistrict: yup.string().required('trường quận/huyện bắt buộc nhập'),
        myWard: yup.string().required('trường phường/xã bắt buộc nhập'),
        detailAddress: yup.string().required('trường địa chỉ bắt buộc nhập')
    }),
    voucher_code: yup.string(),
    note: yup.string(),
    status: yup.number().required(),
    paymentStatus: yup.number().default(0),
    pay_method: yup.string().required("Vui lòng chọn phương thức thanh toán"),
    totalMoney: yup.number().required(),
    createdAt: yup.date()
})

export type orderForm = yup.InferType<typeof orderSchema>