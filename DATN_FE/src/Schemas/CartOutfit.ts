import * as yup from "yup"

export const CartOutfitSchema = yup.object({
    user_id: yup.string(),
    nameColor: yup.string(),
    size: yup.string(),
    items: yup.array().of(
        yup.object().shape({
            productDetailId: yup.string().required("truong productDetailId bat buoc"),
        })
    ).required(),
    quantity: yup.number().required(),
    totalMoney: yup.number()
})

export type cartOutfitForm = yup.InferType<typeof CartOutfitSchema>

