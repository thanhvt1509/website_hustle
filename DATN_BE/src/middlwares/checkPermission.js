import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
const { SECRET_CODE } = process.env;

export const checkPermission = async (req, res, next) => {
  try {
    
    const autho = req.headers.authorization;
    if (!autho) {
      return res.status(400).json({
        message: "Ban chua dang nhap!",
      });
    }
  const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, SECRET_CODE, async (err, payload) => {
      if (err) {
        console.log(err)
        if (err.name === "JsonWebTokenError") {
          return res.status(400).json({
            message: "Token loi",
          });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token het han",
          });
        }
      }

      // lấy thông tin user từ database
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(400).json({
          message: "User khong ton tai trong he thong",
        });
      }
      // kiểm tra xem user có đủ quyền để thực hiện hành động đó không
      if (user && user.role !== "admin") {
        return res.status(400).json({
          message: "Bạn không có quyền để thực hiện hành động này",
        });
      }
      // lưu thông tin user vào request để sử dụng trong các middleware khác
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi Server",
    });
  }
};
export const checkUserPermission = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Kiểm tra xem người dùng đã xác thực hay chưa
      const autho = req.headers.authorization;
      if (!autho) {
        return res.status(401).json({
          message: "Bạn chưa đăng nhập!",
        });
      }

      // Lấy token từ header
      const token = req.headers.authorization.split(" ")[1];

      // Xác thực token
      jwt.verify(token, SECRET_CODE, async (err, payload) => {
        if (err) {
          if (err.name === "JsonWebTokenError") {
            return res.status(400).json({
              message: "Lỗi token",
            });
          }
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              message: "Token hết hạn",
            });
          }
        }

        // Lấy thông tin người dùng từ database
        const user = await User.findById(payload.id);
        if (!user) {
          return res.status(400).json({
            message: "Người dùng không tồn tại trong hệ thống",
          });
        }

        // Kiểm tra xem người dùng có đủ quyền hay không
        if (user && user.role !== requiredRole) {
          return res.status(403).json({
            message: "Bạn không có quyền thực hiện hành động này",
          });
        }

        // Lưu thông tin người dùng vào request để sử dụng trong các middleware khác
        req.user = user;
        next();
      });
    } catch (error) {
      return res.status(500).json({
        message: "Lỗi server",
      });
    }
  };
};
export const checkAuthenticatedUser = async (req, res, next) => {
  try {
    // Kiểm tra xem người dùng đã xác thực hay chưa
    const autho = req.headers.authorization;
    if (!autho) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập!",
      });
    }

    // Lấy token từ header
    const token = req.headers.authorization.split(" ")[1];

    // Xác thực token
    jwt.verify(token, SECRET_CODE, async (err, payload) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          return res.status(400).json({
            message: "Lỗi token",
          });
        }
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token hết hạn",
          });
        }
      }

      // Lấy thông tin người dùng từ database
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(400).json({
          message: "Người dùng không tồn tại trong hệ thống",
        });
      }

      // Lưu thông tin người dùng vào request để sử dụng trong các middleware khác
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};
