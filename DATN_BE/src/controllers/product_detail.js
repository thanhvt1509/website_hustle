import Product from "../models/product.js";
import ProductDetail from "../models/product_detail.js";
export const getAll = async (req, res) => {
    // req.query._sort => price

    try {
        const  productDetails  = await ProductDetail.find()
        if (!productDetails) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        return res.status(200).json(productDetails);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findById(req.params.id);
        if (!productDetail) {
            return res.status(404).json({
                message: "productDetail not found",
            });
        }
        return res.status(200).json(
            productDetail,
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const create = async (req, res) => {
    try {
        // const { error } = productDetailSchema.validate(req.body);
        // if (error) {
        //     res.json({
        //         message: error.details[0].message,
        //     });
        // }
        const productDetail = await ProductDetail.create(req.body);
        if (!productDetail) {
            return res.status(404).json({
                message: "productDetail not found",
            });
        }
        await Product.findByIdAndUpdate(productDetail.product_id, {
            $addToSet: {
                productDetails: productDetail._id,
            },
        });
        return res.status(200).json(
            productDetail,
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const productDetail = await ProductDetail.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json(
            productDetail,
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const update = async (req, res) => {
    try {
        // const { error } = productDetailSchema.validate(req.body);
        // if (error) {
        //     res.json({
        //         message: error.details[0].message,
        //     });
        // }
        const productDetail = await ProductDetail.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!productDetail) {
            return res.status(404).json({
                message: "productDetail not found",
            });
        }
        return res.status(200).json(
            productDetail,
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
