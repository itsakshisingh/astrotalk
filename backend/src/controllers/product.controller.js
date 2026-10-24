const Product = require("../models/product.model");
const User = require("../models/user.model");

// 1. Create a new product (Supports Direct File Upload in multipart/form-data)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      category,
      type,
      shortDescription,
      description,
      originalPrice,
      sellingPrice,
      badge,
      stock,
      isActive,
      createdBy,
    } = req.body;

    if (!name || !category || originalPrice === undefined || sellingPrice === undefined || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Please fill in required fields: name, category, originalPrice, sellingPrice, createdBy",
      });
    }

    // Verify creator user role
    const creatorUser = await User.findById(createdBy);
    if (!creatorUser) {
      return res.status(404).json({
        success: false,
        message: "Creator User ID not found",
      });
    }

    if (creatorUser.role !== "astrologer" && creatorUser.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only Astrologers and Super Admins can post products",
      });
    }

    // Handle Uploaded Images (from form-data files) OR text image URLs
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/uploads/products/${file.filename}`);
    } else if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imagePaths = req.body.images;
      } else if (typeof req.body.images === "string") {
        try {
          imagePaths = JSON.parse(req.body.images);
        } catch (e) {
          imagePaths = [req.body.images];
        }
      }
    }

    // Calculate discount percentage
    const origPriceNum = Number(originalPrice);
    const sellPriceNum = Number(sellingPrice);
    const calcDiscount =
      origPriceNum > sellPriceNum
        ? Math.round(((origPriceNum - sellPriceNum) / origPriceNum) * 100)
        : 0;

    const product = new Product({
      name: name.trim(),
      slug,
      sku,
      category: category.trim(),
      type: type || "Standard",
      images: imagePaths,
      shortDescription: shortDescription || "",
      description: description || "",
      originalPrice: origPriceNum,
      sellingPrice: sellPriceNum,
      discountPercentage: calcDiscount,
      badge: badge || "Verified Vedic Ritual",
      stock: stock !== undefined ? Number(stock) : 100,
      isActive: isActive !== undefined ? (isActive === "false" ? false : Boolean(isActive)) : true,
      createdBy: creatorUser._id,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// 2. Get All Products (With Category & Search Filters)
const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, isActive } = req.query;

    const query = {};

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("createdBy", "fullName email role profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// 3. Get Product by ID or Slug
const getProductByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const product = await Product.findOne(query).populate(
      "createdBy",
      "fullName email role profileImage"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    });
  }
};

// 4. Update Product (Supports Direct Image Upload in form-data)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle Uploaded Images (from form-data files) OR text image URLs
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map((file) => `/uploads/products/${file.filename}`);
      product.images = newImagePaths;
    } else if (req.body.images !== undefined) {
      let imagePaths = [];
      if (Array.isArray(req.body.images)) {
        imagePaths = req.body.images;
      } else if (typeof req.body.images === "string" && req.body.images.trim()) {
        try {
          imagePaths = JSON.parse(req.body.images);
        } catch (e) {
          imagePaths = [req.body.images];
        }
      }
      if (imagePaths.length > 0) {
        product.images = imagePaths;
      }
    }

    const fieldsToUpdate = [
      "name",
      "slug",
      "sku",
      "category",
      "type",
      "shortDescription",
      "description",
      "originalPrice",
      "sellingPrice",
      "badge",
      "stock",
      "isActive",
      "rating",
      "reviewCount",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "originalPrice" || field === "sellingPrice" || field === "stock" || field === "rating" || field === "reviewCount") {
          product[field] = Number(req.body[field]);
        } else if (field === "isActive") {
          product[field] = req.body[field] === "false" ? false : Boolean(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// 5. Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// 6. Get Products created by a specific User
const getProductsByCreator = async (req, res) => {
  try {
    const { userId } = req.params;

    const products = await Product.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get Creator Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user products",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByIdOrSlug,
  updateProduct,
  deleteProduct,
  getProductsByCreator,
};
