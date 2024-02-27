import User from "../models/user.js";
import Address from "../models/address.js";
import Voucher from "../models/voucher.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  changePasswordSchema,
  signinSchema,
  signupSchema,
  userInfoSchema,
} from "../validations/auth.js";
import { forgotPasswordMail, sendConfirmationEmail } from "./mailer.js";
dotenv.config();

const { SECRET_CODE } = process.env;

export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({
        messages: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      role: 'user',
      password: hashedPassword,
    });

    const expiresIn = req.body.remember ? "30d" : "1d";

    const token = jwt.sign({ id: user._id }, SECRET_CODE, { expiresIn });
    const confirmationCode = jwt.sign({ id: user._id }, SECRET_CODE, {
      expiresIn: "365d",
    });
    await sendConfirmationEmail(user.email, confirmationCode);
    user.password = undefined;
    return res.status(201).json({
      message: "success",
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server!",
      error: error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        messages: "Email không tồn tại",
      });
    }
    if (!user.isActive) {
      return res.status(400).json({
        messages: "Taì khoản chưa được xác thực"
      })
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        messages: "Sai mật khẩu",
      });
    }
    const expiresIn = req.body.remember ? "7d" : "1d";

    const token = jwt.sign({ id: user._id }, SECRET_CODE, { expiresIn });

    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server!",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    // Sử dụng schema Joi để xác thực dữ liệu cập nhật
    const { error, value } = userInfoSchema.validate(userData);

    if (error) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: error.details.map((err) => err.message),
      });
    }

    console.log(value);

    const user = await User.findByIdAndUpdate(userId, value, { new: true });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng để cập nhật",
      });
    }

    user.password = undefined; // Loại bỏ trường mật khẩu trước khi trả về dữ liệu

    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error,
    });
  }
};

export const getInfoUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("addresses");
    user.password = null
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy người dùng"
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const getAllUsersAsAdmin = async (req, res) => {
  try {
    const requestingUser = req.user; // Đảm bảo bạn đã thiết lập thông tin người dùng trong middleware xác thực

    if (requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    // Lấy danh sách tất cả người dùng từ cơ sở dữ liệu, bao gồm mật khẩu
    const users = await User.find();

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có người dùng nào trong hệ thống" });
    }

    return res.status(200).json({
      message: "Lấy danh sách người dùng thành công",
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Lấy ID của người dùng từ tham số URL

    // Kiểm tra nếu người dùng có quyền xóa (nếu cần)
    const requestingUser = req.user;
    if (
      requestingUser.role !== "admin" &&
      requestingUser._id.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa người dùng này" });
    }

    // Xóa người dùng dựa trên ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({ message: "Người dùng đã được xóa" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const deleteUserPermanently = async (req, res) => {
  try {
    const userId = req.params.id;

    const requestingUser = req.user;
    if (requestingUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa vĩnh viễn người dùng này" });
    }

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res
      .status(200)
      .json({ message: "Người dùng đã được xóa vĩnh viễn" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: error.details.map((err) => err.message),
      });
    }

    const { oldPassword, newPassword } = value;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { address, isDefault, fullname, phone, myProvince, myDistrict, myWard } = req.body;
    const userId = req.user._id;

    if (isDefault) {
      // Tìm và cập nhật địa chỉ mặc định hiện tại của người dùng (nếu có)
      await User.updateOne(
        { _id: userId, "addresses.isDefault": true },
        { $set: { "addresses.$.isDefault": false } }
      );
    }

    const newAddress = await Address.create({
      user_id: userId,
      address,
      fullname,
      phone,
      myProvince,
      myDistrict,
      myWard,
      isDefault: isDefault || false,
    });

    await User.updateOne(
      { _id: userId },
      { $push: { addresses: newAddress._id } }
    );
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { addresses: id } }
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const deletedAddress = await Address.findByIdAndDelete(id);

    return res.status(200).json(deletedAddress);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server!", error: err });
  }
};
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID của địa chỉ cần cập nhật
    const { address, isDefault, fullname, phone, myProvince, myDistrict, myWard } = req.body;

    // Cập nhật trường "address" của địa chỉ cụ thể
    const newAddress = await Address.findByIdAndUpdate(
      id,
      { address, isDefault, fullname, phone, myProvince, myDistrict, myWard },
      { new: true }
    );
    return res.status(200).json(newAddress);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server!", error: err });
  }
};

export const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Người dùng không được xác định",
      });
    }

    const userId = req.user._id;

    const user = await User.findById(userId).populate("addresses");
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi trong quá trình lấy thông tin người dùng: " + error.message,
    });
  }
};

export const confirmRegistration = async (req, res) => {
  try {
    const { confirmationCode } = req.params;
    const decodedToken = jwt.verify(confirmationCode, SECRET_CODE);
    const userId = decodedToken.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    if (user.isActive) {
      return res
        .status(400)
        .json({ error: "Tài khoản đã được xác nhận trước đó" });
    }
    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "Xác nhận đăng ký thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.find({ email, isActive: true })
    console.log(user);
    if (!user || user.isActive == false) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại hoặc chưa kích hoạt"
      })
    }
    const token = jwt.sign({ email }, SECRET_CODE, { expiresIn: "1h" });
    user.forgotPasswordToken = token;

    const result = await User.updateOne(
      { email },
      { $set: { forgotPasswordToken: token } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    await forgotPasswordMail(email, token)


    return res.status(200).json({
      message: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi xử lý yêu cầu.",
      error: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không khớp." });
    }

    const decodedToken = jwt.verify(token, SECRET_CODE);
    const { email } = decodedToken;

    const user = await User.findOne({ email, forgotPasswordToken: token });

    if (!user) {
      return res.status(404).json({ message: "URL đã được sử dụng trước đó" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.forgotPasswordToken = null;
    const result = await User.updateOne(
      { email },
      { $set: { forgotPasswordToken: null, password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }
    return res.status(200).json({
      message: "Đặt lại mật khẩu thành công.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Token đặt lại không hợp lệ hoặc đã hết hạn.",
      error: error.message,
    });
  }
};

export const addVourcher = async (req, res) => {
  try {
    // const { userId, vourcherId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.body.userId },
      { $push: { voucherwallet: req.body.voucherId } },
      { new: true }
    );
    // console.log(vourcherId);
    const vourcher = await Voucher.findById(req.body.voucherId)
    if (vourcher.quantity > 0) {
      if (updatedUser) {
        await Voucher.findByIdAndUpdate(
          { _id: req.body.voucherId },
          { quantity: vourcher.quantity - 1 },
          { new: true }
        )
      }
    }
    res.status(201).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err });
  }
}