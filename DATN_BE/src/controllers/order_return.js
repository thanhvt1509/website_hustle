import OrderReturn from '../models/order_return.js'
import Order from '../models/order.js'
import OrderReturnDetail from '../models/order_return_detail.js'
import ProductDetail from '../models/product_detail.js';
import Product from '../models/product.js';

export const getAll = async (req, res) => {
    const {
        _page = 1,
        _limit = 100,
        _sort = "createdAt",
        _order = "desc",
        _search
    } = req.query;

    const searchQuery = {};
    if (_search) {
        searchQuery.name = { $regex: _search, $options: "i" };
    }
    const optinos = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order === "desc" ? "-1" : "1",
        },
        populate: 'orderReturnDetails',
    };
    try {
        const { docs: orderReturns } = await OrderReturn.paginate(searchQuery, optinos);
        // const orders = await Order.find()
        if (!orderReturns) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        return res.status(200).json(orderReturns);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const get = async (req, res) => {
    try {
        const order = await OrderReturn.findById(req.params.id).populate(
            "orderReturnDetails"
        ).populate("newOrder");
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        return res.status(200).json(
            order
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const create = async (req, res) => {
    try {
        const { orderId, userId, fullName, phoneNumber, images, address, reason, note, orderDetailIds } = req.body
        const newOrder = { orderId, userId, fullName, images, phoneNumber, address, reason, note }
        const orderReturn = await OrderReturn.create(newOrder);
        if (!orderReturn) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        await Order.findByIdAndUpdate(orderReturn.orderId, {
            $addToSet: {
                orderReturn: orderReturn._id,
            },
        });

        const orderReturnDetails = await Promise.all(orderDetailIds.map(async ({ productDetailId, orderDetailId, price, quantity, color, size }) => {
            const product = await Product.findOne({ "variants": productDetailId });
            return {
                orderReturnId: orderReturn._id,
                productDetailId,
                orderDetailId,
                price,
                costPrice: product.costPrice,
                quantity,
                color,
                size,
            };
        }));

        await Promise.all(orderReturnDetails.map(async (newOrderReturnDetail) => {
            if (newOrderReturnDetail.quantity > 0) {

                const orderReturnDetail = await OrderReturnDetail.create(newOrderReturnDetail);
                if (!orderReturnDetail) {
                    return res.status(404).json({
                        message: "orderDetail not found",
                    });
                }
                await OrderReturn.findByIdAndUpdate(orderReturnDetail.orderReturnId, {
                    $addToSet: {
                        orderReturnDetails: orderReturnDetail._id,
                    },
                });
                const productDetail = await ProductDetail.findById({ _id: orderReturnDetail.productDetailId });
                await ProductDetail.findByIdAndUpdate(
                    { _id: orderReturnDetail.productDetailId },
                    {
                        sold: productDetail.sold - orderReturnDetail.quantity,
                        quantity: productDetail.quantity + orderReturnDetail.quantity
                    },
                    { new: true }
                );
            }
        }));

        return res.status(200).json(orderReturn);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const update = async (req, res) => {
    try {
        const order = await OrderReturn.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const deleteOrderReturnByAdmin = async (req, res) => {
    try {

        const deletedOrderReturnDetails = await OrderReturnDetail.deleteMany({ orderReturnId: req.params.id });

        if (!deletedOrderReturnDetails) {
            return res.status(400).json({ message: "Lỗi khi xóa chi tiết đơn đổi" });
        }

        const deletedOrderReturn = await OrderReturn.findByIdAndDelete(req.params.id);

        if (!deletedOrderReturn) {
            return res.status(400).json({ message: "Lỗi khi xóa đơn hàng đổi" });
        }

        return res.status(200).json({ message: "Đã xóa đơn hàng và chi tiết đơn hàng", deletedOrderReturn: deletedOrderReturn });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
