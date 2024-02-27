import * as yup from "yup"

export const orderReturnSchema = yup.object({
    _id: yup.string(),
    userId: yup.string().required("Bạn cần phải đăng nhập"),
    images: yup.array().of(
        yup.object().shape({
            url: yup.string()
        })
    ),
    fullName: yup.string().trim("Hãy nhập tên người gửi ").required("Trường tên người gửi bắt buộc nhập"),
    phoneNumber: yup.string().trim("Hãy nhập số điện thoại người gửi").required("Trường số điện thoại người gửi bắt buộc nhập"),
    orderDetailIds: yup.array().of(
        yup.object().shape({
            productDetailId: yup.string(),
            orderDetailId: yup.string(),
            quantity: yup.number(),
            color: yup.string(),
            size: yup.string(),
            price: yup.number(),
            // totalMoney: yup.number().required("truong totalMoney bat buoc")
        })
    ),
    orderId: yup.string().required(),
    address: yup.object().shape({
        myProvince: yup.string().required('trường tỉnh/thành phố bắt buộc nhập'),
        myDistrict: yup.string().required('trường quận/huyện bắt buộc nhập'),
        myWard: yup.string().required('trường phường/xã bắt buộc nhập'),
        detailAddress: yup.string().required('trường địa chỉ bắt buộc nhập')
    }),
    reason: yup.string().required(),
    note: yup.string(),
    // totalMoney: yup.number().required(),
    createdAt: yup.date()
})

export type orderReturnForm = yup.InferType<typeof orderReturnSchema>