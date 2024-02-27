import Review from "../models/review.js"; // Import model của đánh giá
import { replySchema, reviewSchema } from "../validations/review.js"; // Import schema kiểm tra dữ liệu cho đánh giá

// Tạo đánh giá mới
export const createReview = async (req, res) => {
    try {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const review = await Review.create(req.body);
        if (!review) {
            return res.status(400).json({
                message: "Thêm đánh giá không thành công!",
            });
        }

        return res.status(200).json({
            message: 'Thêm đánh giá thành công',
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

// Lấy đánh giá theo ID
export const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({
                message: "Không tìm thấy đánh giá!",
            });
        }
        return res.status(200).json({
            message: "Tìm đánh giá thành công",
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId');
        if (reviews.length === 0) {
            return res.status(200).json(
                []
            );
        }
        return res.status(200).json(
            reviews
        );
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};
// Cập nhật đánh giá
export const updateReview = async (req, res) => {
    try {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const updateData = { ...req.body, updatedAt: new Date() };
        const review = await Review.findByIdAndUpdate(req.params.id, updateData);
        if (!review) {
            return res.status(400).json({
                message: "Sửa đánh giá không thành công!",
            });
        }
        review.userId.password = ''
        return res.status(200).json({
            message: 'Sửa đánh giá thành công',
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

// Xóa đánh giá
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndRemove(req.params.id);
        if (!review) {
            return res.status(400).json({
                message: "Xóa đánh giá không thành công!",
            });
        }
        return res.status(200).json({
            message: 'Xóa đánh giá thành công',
            data: review,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const adminReply = async (req, res) => {
    try {
        const userId = req.user._id
      const { error } = replySchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }
  
      const { id } = req.params;
  
      const adminReply = {
        nameUser: 'Admin',
        comment: req.body.comment,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),

      };
      console.log(adminReply);
      const updatedReview = await Review.findByIdAndUpdate(
        id,
        {
           reply: adminReply, 
          $set: { updatedAt: new Date() },
        },
        { new: true }
      );
  console.log(updatedReview);
      if (!updatedReview) {
        return res.status(404).json({
          message: 'Đánh giá không tồn tại',
        });
      }
  
      updatedReview.userId.password = '';
  
      return res.status(201).json(
        updatedReview,
      );
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi server',
        error,
      });
    }
  };