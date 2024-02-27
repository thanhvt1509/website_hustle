import Order from '../models/order.js'
import OrderDetail from '../models/order_detail.js'

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
        populate: "orderId",
    };
    try {
        const { docs: OrderDetails } = await OrderDetail.paginate(searchQuery, optinos);
        if (!OrderDetails) {
            return res.status(404).json({
                message: "OrderDetail not found",
            });
        }
        return res.status(200).json(OrderDetails);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const get = async (req, res) => {
    try {
        const order = await OrderDetail.findById(req.params.id)
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
export const update = async (req, res) => {
    try {
        const order = await OrderDetail.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        return res.status(200).json({
            message: "update thanh cong",
            order
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

export const remove = async (req, res) => {
    try {
        const orderDetail = await OrderDetail.findByIdAndRemove(req.params.id);
        if (!orderDetail) {
            return res.status(400).json({
                message: "Xóa orderDetail không thành công!",
            });
        }
        return res.status(200).json({
            message: 'Xóa orderDetail thành công',
            data: voucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};