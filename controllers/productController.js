const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Create Product
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      product: {
        _id: newProduct._id,
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        image: newProduct.image,
        stock: newProduct.stock,
        createdAt: newProduct.createdAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $gt: 0 },
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const { title, description, price, category, stock } = req.body;

    let imageData = product.image;

    if (req.file) {
      // Delete old image
      await cloudinary.uploader.destroy(product.image.public_id);
      imageData = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, stock, image: imageData },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(product.image.public_id);

    await product.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.export = {createProduct , getAllProducts, getVendorProducts,updateProduct,deleteProduct};