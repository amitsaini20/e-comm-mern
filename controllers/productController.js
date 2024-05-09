import productModle from "../models/productModle.js"
import categoryModle from "../models/categoryModle.js";
import orderModle from "../models/orderModle.js";
import fs from 'fs';
import { GridFSBucketReadStream } from "mongodb";
import slugify from 'slugify'

import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProductController=async(req,resp)=>{
    try{

        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo}= req.files;
        switch(true){
            case !name:
                return resp.status(500).send({error:'Name is Required'})
            case !description:
                return resp.status(500).send({error:'Description is Required'})
            case !price:
                return resp.status(500).send({error:'Price is Required'})
            case !category:
                return resp.status(500).send({error:'Category is Required'})
            case !quantity:
                return resp.status(500).send({error:'Quantity is Required'})
            case photo && photo.size > 1000000:
                return resp.status(500).send({error:'Photo is Required'})
            case !shipping:
                return resp.status(500).send({error:'Shipping is Required'})                
        }
        const products = new productModle({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        resp.status(201).send({
            success:true,
            message:'Product Created Successfully',
            products,
        })
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'Error',
            error,
        })
    }
}

export const getProductController=async(req,resp)=>{
    try{
        const products = await productModle.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1});
        resp.status(200).send({
            success:true,
            counTotal:products.length,
            message:'All Products',
            products,
        })
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'error while getting',
            error,
        })
    }
}


export const singleProductController=async(req,resp)=>{
    try{
        const products = await productModle.findOne({slug:req.params.slug}).select('-photo').populate('category');
        resp.status(200).send({
            success:true,
            message:'single product fatched',
            products,
        })
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'error while getting single product',
            error,
        })
    }
}


export const productPhotoController=async(req,resp)=>{
    try{
        const product =await productModle.findById(req.params.pid).select('photo')
        if(product.photo.data){
            resp.set('Content-type',product.photo.contentType)
            return resp.status(200).send(product.photo.data)
        }
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'error while getting product photo',
            error,
        })
    }
}

export const deleteProductController=async(req,resp)=>{
    try{
        await productModle.findByIdAndDelete(req.params.pid).select('-photo')
        resp.status(200).send({
            success:true,
            message:'product is delete successfully'
        })
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'error while getting product photo',
            error,
        })
    }
}

export const updateProductController=async(req,resp)=>{
    try{
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo}= req.files;
        switch(true){
            case !name:
                return resp.status(500).send({error:'Name is Required'})
            case !description:
                return resp.status(500).send({error:'Description is Required'})
            case !price:
                return resp.status(500).send({error:'Price is Required'})
            case !category:
                return resp.status(500).send({error:'Category is Required'})
            case !quantity:
                return resp.status(500).send({error:'Quantity is Required'})
            case photo && photo.size > 1000000:
                return resp.status(500).send({error:'Shipping is Required'})                
        }
        const products = await productModle.findByIdAndUpdate(req.params.pid,{...req.fields, slug:slugify(name)},{new:true});
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        resp.status(201).send({
            success:true,
            message:'Product Update Successfully',
            products,
        })
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'error while update product',
            error,
        })
    }
}

//filter
export const productFiltersController = async(req,resp)=>{
    try{
        const {checked,radio} = req.body
        let args = {}
        if(checked.length>0) args.category=checked
        if(radio.length) args.price= {$gte:radio[0],$lte:radio[1]}
        const products = await productModle.find(args)
        resp.status(200).send({
            success:true,
            products,
        })
    }catch(error){
        console.log(error)
        resp.status(400).send({
            success:false,
            message:"Error while Filtering Product",
            error
        })
    }
}

// product count
export const productCountController = async (req, res) => {
    try {
      const total = await productModle.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };
  
  // product list base on page
  export const productListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModle
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };

  // search product
export const searchProductController = async (req, res) => {
    try {
      const { keyword } = req.params;
      const resutls = await productModle
        .find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        })
        .select("-photo");
      res.json(resutls);
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error In Search Product API",
        error,
      });
    }
  };

  // similar products
export const realtedProductController = async (req, res) => {
    try {
      const { pid, cid } = req.params;
      const products = await productModle
        .find({
          category: cid,
          _id: { $ne: pid },
        })
        .select("-photo")
        .limit(3)
        .populate("category");
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error while geting related product",
        error,
      });
    }
  };

  // get prdocyst by catgory
export const productCategoryController = async (req, res) => {
    try {
      const category = await categoryModle.findOne({ slug: req.params.slug });
      const products = await productModle.find({ category }).populate("category");
      res.status(200).send({
        success: true,
        category,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        message: "Error While Getting products",
      });
    }
  };

  //payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  //payment
  export const brainTreePaymentController = async (req, res) => {
    try {
      const { nonce, cart } = req.body;
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            const order = new orderModle({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };