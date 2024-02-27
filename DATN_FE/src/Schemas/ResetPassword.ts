import * as yup from "yup"

export const ResetPasswordSchema = yup.object({
    newPassword: yup.string().required("newPassword bat buoc"),
    confirmNewPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'confirmPassword phai giong voi newPassword')
        .required("ConfirmPassword"),
})

export type ResetPasswordForm = yup.InferType<typeof ResetPasswordSchema>

