import Color from "../models/color.js"
import { colorSchema } from "../validations/color.js"

export const create = async (req, res) => {
    try {
        const { error } = colorSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            })
        }
        const color = await Color.create(req.body)
        if (!color) {
            return res.status(400).json({
                message: "them khong thanh cong!"
            })
        }
        return res.status(200).json({
            message: 'thanh cong',
            data: color
        })
    } catch (error) {
        return res.status(500).json({
            message: "Loi server",
            error
        })
    }
}   