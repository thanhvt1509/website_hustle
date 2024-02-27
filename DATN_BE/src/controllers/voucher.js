import Voucher from "../models/voucher.js";
import { voucherValidationSchema } from "../validations/voucher.js";

export const getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find();
        // if (vouchers.length === 0) {
        //     return res.status(400).json({
        //         message: "Không tìm thấy voucher!",
        //     });
        // }

        return res.status(200).json(vouchers);
    } catch (err) {
        return res.status(500).json({
            message: 'Lỗi server!',
            error: err,
        });
    }
};

export const getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (!voucher) {
            return res.status(404).json({
                message: "Không tìm thấy voucher!",
            });
        }
        return res.status(200).json(voucher);
    } catch (err) {
        return res.status(500).json({
            message: 'Lỗi server!',
            error: err.message,
        });
    }
};

export const create = async (req, res) => {
    try {
        const { error } = voucherValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const voucher = await Voucher.create(req.body);
        if (!voucher) {
            return res.status(400).json({
                message: "Thêm voucher không thành công!",
            });
        }

        return res.status(200).json({
            message: 'Thêm voucher thành công',
            data: voucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const remove = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndRemove(req.params.id);
        if (!voucher) {
            return res.status(400).json({
                message: "Xóa voucher không thành công!",
            });
        }
        return res.status(200).json({
            message: 'Xóa voucher thành công',
            data: voucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const update = async (req, res) => {
    try {
        const { error } = voucherValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const updateData = { ...req.body, updatedAt: new Date() };
        const voucher = await Voucher.findByIdAndUpdate(req.params.id, updateData);
        if (!voucher) {
            return res.status(400).json({
                message: "Sửa voucher không thành công!",
            });
        }
        return res.status(200).json({
            message: 'Sửa voucher thành công',
            data: voucher,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const deleteVouchers = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.status(400).json({
                message: "Không có voucher nào để xóa.",
            });
        }

        const deleteVouchers = await Voucher.deleteMany({ _id: { $in: ids } });

        if (deleteVouchers.deletedCount === 0) {
            return res.status(400).json({
                message: "Xóa không thành công!",
            });
        }

        return res.status(200).json({
            message: 'Xóa voucher thành công',
            data: deleteVouchers,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};