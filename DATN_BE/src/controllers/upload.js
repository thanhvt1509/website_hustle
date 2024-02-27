import { Error } from "mongoose";
import cloudinary from "../config/cloudinaryConfig.js"

export const uploadImages = async (req, res) => {
    try {
        const images = req.files.map(file => file.path)
        console.log(req.files);
        let uploadedImages = []

        for (let image of images) {
            const result = await cloudinary.uploader.upload(image)
            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id
            })
        }
        return res.status(200).json(uploadedImages)
    } catch (error) {
        return res.status(400).json({
            name: error.name,
            message: error.message
        })
    }
}
export const removeImages = async (req, res) => {
    try {

        const publicId = req.params.publicId
        const result = await cloudinary.uploader.destroy(publicId)

        if (result.result === "not found") {
            throw new Error('publicId not found')
        }
        return res.status(200).json({
            message: "Delete images successfully",
        })
    } catch (error) {
        return res.status(400).json({
            name: error.name,
            message: error.message
        })
    }
}