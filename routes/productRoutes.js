import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, productCategoryController, productCountController, productFiltersController, productListController, productPhotoController, realtedProductController, searchProductController, singleProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const router = express.Router();

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);
router.get('/get-product',getProductController);

//filter product
router.post("/product-filter",productFiltersController)
//product count
router.get("/product-count", productCountController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);

// router.get('/get-product',getProductController);

router.get("/product-photo/:pid",productPhotoController);

router.delete("/product-delete/:pid",deleteProductController);

router.get('/single-product/:slug',singleProductController);
//product per page
router.get("/product-list/:page", productListController);
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug",productCategoryController)
export default router;