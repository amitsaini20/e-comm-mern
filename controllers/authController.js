import { compareSync } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/authHelper.js"
import userModel from "../models/userModel.js"
import orderModle from "../models/orderModle.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req, resp) => {
    try {
        const { name, email, password, phone, address ,answer} = await req.body
        //validations
        if (!name) {
            return resp.send({ error: 'Name is Required' })
        }
        if (!email) {
            return resp.send({ error: 'Email is Required' })
        }
        if (!password) {
            return resp.send({ error: 'Password is Required' })
        }
        if (!phone) {
            return resp.send({ error: 'Phone is Required' })
        }
        if (!address) {
            return resp.send({ error: 'Address is Required' })
        }
        if (!answer) {
            return resp.send({ error: 'Answer is Required' })
        }
    
    
        //check user
        const exisitingUser = await userModel.findOne({ email })
        //exisiting user
        if (exisitingUser) {
            return resp.status(200).send({
                success: false,
                message: 'Already Register please login',
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({ name, email, address,answer, phone, password: hashedPassword }).save()
        resp.status(201).send({
            success: true,
            message: 'User Register Successfully',
            user
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
}

// export default {registerController};
//Login 
export const loginController = async (req, resp) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return resp.status(404).send({
                success: false,
                message: 'invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return resp.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return resp.status(200).send({
                success: false,
                message: 'invalid password'
            })
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'} );
        resp.status(200).send({
            success:true,
            message:'login successfull',
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
                _id:user._id,
            },
            token,
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }

}

//forgotPasswordController
export const forgotPasswordController=async(req,resp)=>{
    try{
        const {email,answer,newPassword} = req.body;
        if(!email){
            resp.status(400).send({message:'Email is required'})
        }
        if(!answer){
            resp.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            resp.status(400).send({message:'New Password is required'})
        }
        //check
        const user = await userModel.findOne({email,answer});
        if(!user){
            resp.status(404).send({
                success:false,
                message:'Wrong Email or Answer'
            })
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed});
        resp.status(200).send({
            success:true,
            message:'Password Reset Successfully'
        })

    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'Something went wrong',
            error
        })
    }
}




//test controller 
export const testController =async(req,resp)=>{
    resp.send('protected routes')
}

//update Profile
export const updateProfileController=async(req,res)=>{
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
          return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
          req.user._id,
          {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
          },
          { new: true }
        );
        res.status(200).send({
          success: true,
          message: "Profile Updated SUccessfully",
          updatedUser,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "Error WHile Update profile",
          error,
        });
      }
}

//orders
export const getOrdersController = async (req, res) => {
    try {
      const orders = await orderModle
        .find({ buyer: req.user._id })
        .populate("products", "-photo")
        .populate("buyer", "name");
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };

  //orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModle
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };
  
  //order status
  export const orderStatusController = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModle.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };