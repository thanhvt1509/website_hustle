import { log } from "console";
import Category from "../models/category.js";
import Product from "../models/product.js";
import ProductDetail from "../models/product_detail.js";
import { productSchema } from "../validations/product.js";
export const getAll = async (req, res) => {
    // req.query._sort => price
    const {
        _page = 1,
        _limit = 100,
        _sort = "createdAt",
        _order = "desc",
        _search
    } = req.query;

    const searchQuery = {};
    if (_search) {
        searchQuery.title = { $regex: _search, $options: "i" };
    }
    const optinos = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order === "desc" ? "-1" : "1",
        },
        populate: "categoryId",
        select: '-costPrice'
    };
    try {
        const { docs: products } = await Product.paginate(searchQuery, optinos);
        if (!products) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "categoryId",
            "products"
        );
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        product.costPrice = null;
        return res.status(200).json(
            product
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

// tìm sản phẩm theo tên
export const getOne = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name }).populate(
            "categoryId",
            "products"
        );
        console.log(1);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        product.costPrice = null;
        return res.status(200).json(
            product
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const create = async (req, res) => {
    try {

        const { title, price, description, discount, images, categoryId, variants, hide, costPrice, sku } = req.body
        const newProduct = { title, price, description, discount, images, categoryId, hide, costPrice, sku }
        const product = await Product.create(newProduct);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        const productDetails = [];

        variants.forEach(variant => {
            const { nameColor, imageColor, sold, items } = variant;
            items.forEach(item => {
                const { size, quantity } = item;
                productDetails.push({ product_id: product._id, nameColor, imageColor, sold, size, quantity });
            });
        });
        await Category.findByIdAndUpdate(product.categoryId, {
            $addToSet: {
                products: product._id,
            },
        });
        await productDetails.forEach(async (newproductDetail) => {
            const productDetail = await ProductDetail.create(newproductDetail)
            if (!productDetail) {
                return res.status(404).json({
                    message: "productDetail not found",
                });
            }
            const newProduct = await Product.findByIdAndUpdate(productDetail.product_id, {
                $addToSet: {
                    variants: productDetail._id,
                },
            });
        });
        console.log(product);
        return res.status(200).json(
            product
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const remove = async (req, res) => {
    try {
        const deletedProductDetails = await ProductDetail.deleteMany({ product_id: req.params.id });

    if (!deletedProductDetails) {
      return res.status(400).json({ message: "Lỗi khi xóa chi tiết sản phẩm" });
    }
        const product = await Product.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json(
            product,
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const update = async (req, res) => {
    try {
        const { title, price, description, discount, images, categoryId, variants, hide, costPrice, sku } = req.body
        const newProduct = { title, price, description, discount, images, categoryId, hide, costPrice, sku }
        // Lấy thông tin sản phẩm trước khi cập nhật
        const product = await Product.findOne({ _id: req.params.id });

        const productIdToRemove = req.params.id;

        // Xóa sản phẩm khỏi danh mục cũ
        await Category.updateOne({ _id: product.categoryId }, {
            $pull: { products: productIdToRemove }
        });

        // Sau đó, thêm sản phẩm vào danh mục mới
        await Category.updateOne({ _id: categoryId }, {
            $addToSet: { products: productIdToRemove }
        });

        const productDetails = [];

        variants.forEach(variant => {
            if (variant.product_id) {
                const { nameColor, imageColor, sold, items, product_id } = variant;
                items.forEach(item => {
                    if (item._id) {
                        const { size, quantity, _id } = item;
                        productDetails.push({ _id, product_id, nameColor, imageColor, sold, size, quantity });
                    } else {
                        const { size, quantity } = item;
                        productDetails.push({ product_id, nameColor, imageColor, sold, size, quantity });
                    }
                });
            } else {
                const { nameColor, imageColor, sold, items } = variant;
                items.forEach(item => {
                    const { size, quantity } = item;
                    productDetails.push({ product_id: product.id, nameColor, imageColor, sold, size, quantity });
                });
            }
        });
        productDetails.forEach(async (newproductDetail) => {
            if (!newproductDetail._id || !newproductDetail.product_id) {
                const productDetail = await ProductDetail.create(newproductDetail)
                if (!productDetail) {
                    return res.status(404).json({
                        message: "productDetail not found",
                    });
                }
                await Product.findByIdAndUpdate(productDetail.product_id, {
                    $addToSet: {
                        variants: productDetail._id,
                    },
                });
            } else {
                const productDetail = await ProductDetail.findOneAndUpdate(
                    { _id: newproductDetail._id },
                    newproductDetail,
                    { new: true }
                );
                if (!productDetail) {
                    return res.status(404).json({
                        message: "productDetail not found",
                    });
                }
            }
        });

        // Cập nhật thông tin sản phẩm
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: req.params.id },
            newProduct,
            { new: true }
        );
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

//admin
export const getAllByAdmin = async (req, res) => {
    // req.query._sort => price
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
        populate: "categoryId",
    };
    try {
        const { docs: products } = await Product.paginate(searchQuery, optinos);
        if (!products) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const getByAdmin = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: "variants",
            options: { sort: { createdAt: 1 } }
        }).populate('categoryId');
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        return res.status(200).json(
            product
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

// tìm sản phẩm theo tên
export const getOneByAdmin = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name }).populate(
            "categoryId",
            "products"
        );
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        return res.status(200).json(
            product
        );
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
