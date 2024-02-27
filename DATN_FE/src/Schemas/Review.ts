import * as yup from "yup"

export const ReviewSchema = yup.object({
    user_id: yup.string().required("userId bat buoc"),
    product_id: yup.string().required("productId bat buoc"),
    rating: yup.number(),
    color: yup.string(),
    size: yup.string(),
    comment: yup.string().required("comment bat buoc"),
    images: yup.array().of(
        yup.object().shape({
            url: yup.string()
        })
    )
})

export type ReviewForm = yup.InferType<typeof ReviewSchema>

