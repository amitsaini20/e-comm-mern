import express from 'express';
import { requireSignIn,isAdmin } from '../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategory, singleCategory, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router();

//route


//get all category
router.get('/all-category',categoryController);

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);


//update category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategory);

//get single category
router.get('/single-category/:slug', singleCategory);

export default router