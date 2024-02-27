import * as yup from "yup"

export const PasswordSchema = yup.object({
    oldPassword: yup.string().required("Bạn cần nhập mật khẩu cũ"),
    newPassword: yup.string().required("Bạn cần nhập mật khẩu mới"),
    confirmNewPassword: yup.string().oneOf([yup.ref("newPassword")]).required("Bạn cần nhập mật khẩu "),
})

export type PasswordForm = yup.InferType<typeof PasswordSchema>

export const AccountSchema = yup.object({
    _id: yup.string().required(),
    fullname: yup.string().required("Bạn cần phải nhập tên"),
    email: yup.string().email("Email bạn nhập không đúng định dạng").required("Email bắt buộc phải nhập"),
})

export type AccountForm = yup.InferType<typeof AccountSchema>

export const AddressSchema = yup.object({
    fullname: yup.string().required("Bạn cần phải nhập tên người nhận"),
    phone: yup.string().required("Bạn cần phải nhập số điện thoại người nhận"),
    address: yup.string().required("Bạn cần phải nhập địa chỉ nhận hàng"),
    myProvince: yup.string().required("Bạn cần phải chọn tỉnh thành"),
    myDistrict: yup.string().required("Bạn cần phải chọn huyện"),
    myWard: yup.string().required("Bạn cần phải chọn xã"),
})

export type AddressForm = yup.InferType<typeof AddressSchema>

