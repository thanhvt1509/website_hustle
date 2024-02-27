import Cart from "../models/cart.js";
import ProductDetail from "../models/product_detail.js"
import { cartSchema } from "../validations/cart.js";
export const getAll = async (req, res) => {
    try {
        // const { docs: carts } = await Cart.paginate(optinos);
        const carts = await Cart.find().populate("productDetailId")
        if (!carts) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        return res.status(200).json(carts);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate(
            "productDetailId",
            "cart"
        );
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        return res.status(200).json({
            message: "Cart found successfully",
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const create = async (req, res) => {
    try {
        const cart = await Cart.findOne({ productDetailId: req.body.productDetailId, userId: req.body.userId })
        const productDetail = await ProductDetail.findById(req.body.productDetailId).populate("product_id");
        if (!productDetail) {
            return res.status(400).json({
                message: "khon tim thay san pham"
            })
        }
        if (cart) {
            let newQuantity = cart.quantity + req.body.quantity
            let newTotalMoney = cart.totalMoney + req.body.totalMoney
            if (newQuantity > productDetail.quantity) {
                newQuantity = productDetail.quantity;
                newTotalMoney = newQuantity * (productDetail.product_id.price - productDetail.product_id.discount)
            }
            const newCart = await Cart.findOneAndUpdate({
                userId: req.body.userId, productDetailId: req.body.productDetailId
            },
                { quantity: newQuantity, totalMoney: newTotalMoney },
                { new: true }
            );
            if (!newCart) {
                return res.status(404).json({
                    message: "Cart not found",
                });
            }
            return res.status(200).json({
                message: "Cart created successfully",
                data: newCart,
            });
        } else {
            const cart = await Cart.create(req.body);
            if (!cart) {
                return res.status(404).json({
                    message: "Cart not found",
                });
            }
            return res.status(200).json({
                message: "Cart created successfully",
                data: cart,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json({
            message: "Cart delete successfully",
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const update = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }
        return res.status(200).json({
            message: "Cart updated successfully",
            data: cart,
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

