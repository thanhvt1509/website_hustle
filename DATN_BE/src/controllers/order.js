import Order from "../models/order.js";
import Cart from "../models/cart.js";
import User from "../models/user.js";
import Voucher from "../models/voucher.js";
import OrderDetail from "../models/order_detail.js";
import ProductDetail from "../models/product_detail.js";
import Product from "../models/product.js";
import order_return from "../models/order_return.js";
import { mailOrder } from "./mailer.js";
export const getAll = async (req, res) => {
    const {
        _page = 1,
        _limit = 100,
        _sort = "createdAt",
        _order = "desc",
        _search,
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
    };
    try {
        const { docs: orders } = await Order.paginate(searchQuery, optinos);
        // const orders = await Order.find()
        if (!orders) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const get = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("orderDetails")
            .populate("userId")
            .populate("orderReturn");
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

export const create = async (req, res) => {
    try {
        const {
            userId,
            fullName,
            email,
            phoneNumber,
            address,
            voucher_code,
            note,
            pay_method,
            totalMoney,
            carts,
            orderId,
            paymentStatus,
        } = req.body;
        const newOrder = {
            userId,
            fullName,
            email,
            phoneNumber,
            address,
            voucher_code,
            note,
            pay_method,
            totalMoney,
            orderId,
            paymentStatus,
        };
        const order = await Order.create(newOrder);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        const orderDetails = await Promise.all(
            carts.map(
                async ({
                    productDetailId,
                    price,
                    quantity,
                    color,
                    size,
                    totalMoney,
                }) => {
                    const product = await Product.findOne({ variants: productDetailId });
                    const checkProductDetail = await ProductDetail.findById(productDetailId).populate('product_id');
                    if (checkProductDetail.quantity < quantity) {
                        return {
                            orderId: order._id,
                            productDetailId,
                            price,
                            costPrice: product.costPrice,
                            quantity,
                            color,
                            size,
                            totalMoney,
                        };
                    } else {
                        return res.status(400).json({ message: "san pham het hang" })
                    }
                }
            )
        );

        await Promise.all(
            orderDetails.map(async (newOrderDetail) => {
                const orderDetail = await OrderDetail.create(newOrderDetail);
                if (!orderDetail) {
                    return res.status(404).json({
                        message: "orderDetail not found",
                    });
                }
                await Order.findByIdAndUpdate(orderDetail.orderId, {
                    $addToSet: {
                        orderDetails: orderDetail._id,
                    },
                });
                // const productDetail = await ProductDetail.findById({
                //   _id: orderDetail.productDetailId,
                // });
                await ProductDetail.findByIdAndUpdate(
                    { _id: orderDetail.productDetailId },
                    {
                        $inc: {
                            sold: orderDetail.quantity,
                            quantity: -orderDetail.quantity
                        }
                    },
                    { new: true }
                );
            })
        );

        const allCart = await Cart.find();
        const userCart = await allCart.filter(
            (cart) => cart.userId === newOrder.userId
        );

        await Promise.all(
            userCart.map(async (item) => {
                await Cart.findOneAndDelete({ _id: item._id });
            })
        );
        if (voucher_code) {
            const voucher = await Voucher.findOne({ code: voucher_code });
            console.log(voucher);
            const remove = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { voucherwallet: voucher._id } },
                { new: true }
            );
            console.log(remove);
        }
        let ordermail = await Order
            .findById(order._id)
            .populate({
                path: "orderDetails",
                populate: {
                    path: "productDetailId",
                    model: "ProductDetail",
                    populate: {
                        path: "product_id",
                        model: "Product"
                    }
                }
            })
            .exec();

        mailOrder(email, ordermail)

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const update = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
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
export const createOrderByAdmin = async (req, res) => {
    try {
        const {
            userId,
            fullName,
            email,
            phoneNumber,
            address,
            //   voucher_code,
            note,
            pay_method,
            totalMoney,
            items,
            paymentStatus,
            employeeId,
            orderReturnId
        } = req.body;
        const newOrder = {
            userId,
            fullName,
            email,
            phoneNumber,
            address,
            //   voucher_code,
            note,
            pay_method,
            totalMoney,
            paymentStatus,
            employeeId,

        };

        const order = await Order.create(newOrder);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        let arrItem = [];
        for (const item of items) {
            const product = await Product.findOne({
                "variants": item.productDetailId,
            });
            arrItem.push({
                orderId: order._id,
                productDetailId: item.productDetailId,
                price: item.price,
                costPrice: product.costPrice,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
                totalMoney: item.totalMoney,
            });
        }

        if (!arrItem || arrItem.length === 0) {
            return res.status(400).json({ message: "err arrItem" });
        }
        for (const item of arrItem) {
            const orderDetail = await OrderDetail.create(item);
            if (!orderDetail) {
                return res.status(404).json({
                    message: "orderDetail not found",
                });
            }
            await Order.findByIdAndUpdate(orderDetail.orderId, {
                $addToSet: {
                    orderDetails: orderDetail._id,
                },
            });
        }

        await order_return.findByIdAndUpdate(orderReturnId, {
            $addToSet: {
                newOrder: order._id,
            },
        });

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};


export const deleteOrderByAdmin = async (req, res) => {
    try {

        const deletedOrderDetails = await OrderDetail.deleteMany({ orderId: req.params.id });

        if (!deletedOrderDetails) {
            return res.status(400).json({ message: "Lỗi khi xóa chi tiết đơn hàng" });
        }

        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(400).json({ message: "Lỗi khi xóa đơn hàng" });
        }

        return res.status(200).json({ message: "Đã xóa đơn hàng và chi tiết đơn hàng", deletedOrder: deletedOrder });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

