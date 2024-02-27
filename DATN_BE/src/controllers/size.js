import Size from "../models/size.js"
import { sizeSchema } from "../validations/size.js"

export const create = async (req, res) => {
    try {
        const { error } = sizeSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            })
        }
        const size = await Size.create(req.body)
        if (!size) {
            return res.status(400).json({
                message: "them khong thanh cong!"
            })
        }
        return res.status(200).json(
            size
       )
    } catch (error) {
        return res.status(500).json({
            message: 'loi server',
            error,
        })
    }
}

export const remove = async (req, res) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id)
        if (!category) {
            return res.status(400).json({
                message: "xoa khong thanh cong!"
            })
        }
        return res.status(200).json(
            category
    )
    } catch (error) {
        return res.status(500).json({
            message: 'loi server',
            error,
        })
    }
}