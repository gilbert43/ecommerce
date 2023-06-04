const Product = require("../models/productModel")
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

//create product
const createProduct = asyncHandler(
    async (req,res,next) =>{
        try{
            if(req.body.title){req.body.slug = slugify(req.body.title);}
            const newProduct = await Product.create(req.body);
            res.json(newProduct);
        }catch(error){
            throw new Error(error);
        }
    }
);

//update a product
const updateProduct = asyncHandler(
    async (req,res,next) =>{
        try{
            const { id } = req.params;
            if(req.body.title){req.body.slug = slugify(req.body.title);}
            const updatedProduct = await Product.findByIdAndUpdate( id,req.body,{new: true}); 
            res.json(updatedProduct);  
        }catch(error){
            throw new Error(error);
        }
    }
);

//delete product
const deleteProduct = asyncHandler(
    async (req,res,next) =>{
        try{
            const { id } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(id); 
            res.json(deletedProduct);  
        }catch(error){
            throw new Error(error);
        }
    }
);

//fetch a product
const getaProduct = asyncHandler(
    async (req,res,next) =>{
        const { id } = req.params;
        try{
            const findProduct = await Product.findById(id);
            res.json(findProduct);
        }catch(error){
            throw new Error(error);
        }
    }
);

//fetch all product
const getallProducts = asyncHandler(
    async (req,res,next) =>{
        try{
            //filtering
            const queryObj = {...req.query};
            const excludeFields = ['page','sort','limit','fields'];
            excludeFields.forEach((el)=>delete queryObj[el]);
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) =>`$${match}`);

            let query = Product.find(JSON.parse(queryStr));

            //sorting
            if(req.query.sort){
                const sortBy = req.query.sort.split(".").json(" ");
                query = query.sort(sortBy);
            }else{
                query = query.sort("-createdAt");
            }

            //limiting fields
            if(req.query.fields){
                const fields = req.query.fields.split(".").json(" ");
                query = query.select(fields);
            }else{
                query = query.select("-__v");
            }

            //pagination
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);

            if(req.query.page){
                const productCount = await Product.countDocuments();
                if(skip >= productCount) throw new Error("This page does not exist");
            }

            const findProducts = await query;
            res.json(findProducts);
        }catch(error){
            throw new Error(error);
        }
    }
);

module.exports = {
    createProduct,
    getaProduct,
    getallProducts,
    updateProduct,
    deleteProduct
}