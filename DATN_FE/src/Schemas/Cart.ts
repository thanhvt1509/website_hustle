import * as yup from "yup"

export const CartSchema = yup.object({
    user_id: yup.string(),
    productDetailId: yup.string().required(),
    color: yup.string().required(),
    size: yup.string().required(),
    price: yup.string().required(),
    quantity: yup.number().required(),
    totalMoney: yup.number().required()
})

export type cartForm = yup.InferType<typeof CartSchema>

