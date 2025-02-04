import express from 'express';
import {
    registerController,
    loginController,
    forgotPasswordController,
    testController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController} from '../controllers/authController.js';
import {requireSignIn,isAdmin} from '../middlewares/authMiddleware.js';


//router object
const router = express.Router();

//routing
//Register || POST Method
router.post('/register',registerController)

//login || post method
router.post('/login',loginController)

//forgot password || post method
router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignIn,isAdmin,testController)

//Protected User route auth
router.get('/user-auth',requireSignIn,(req,resp)=>{
    resp.status(200).send({ok:true});
})

//Protected Admin route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,resp)=>{
    resp.status(200).send({ok:true});
})

//update Profile
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);

export default router;