import * as yup from "yup"

export const productDetailSchema = yup.object({
    product_id: yup.string().required("Vui lòng chọn biến thể"),
    nameColor: yup.string().required("Vui lòng chọn biến thể"),
    size: yup.string().required("Vui lòng chọn biến thể"),
    quantity: yup.number().min(1).required("thieu quantity"),
})

export type productDetailForm = yup.InferType<typeof productDetailSchema>

