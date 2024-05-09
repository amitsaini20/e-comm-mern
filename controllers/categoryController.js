// import categoryModle from "../models/categoryModle.js";
import Category from "../models/categoryModle.js";
import slugify from 'slugify';

export const createCategoryController = async(req,resp)=>{
    try{
        const {name} = req.body;
        if(!name){
            return resp.status(401).send({message:'Name is required'})
        }

        const exisitingCategory = await Category.findOne({name});
        if(exisitingCategory){
            return resp.status(200).send({message:'Category is Already Existed'})
        }

        // const category = await new Category(name,{slug:slugify(name)}).save()
        const category = await new Category({ name, slug: slugify(name) }).save();
        resp.status(201).send(({
            success:true,
            message:'New Category Created',
            category,
        }))
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            error,
            message:'Error in Category'
        });
    }
};
//update category
export const updateCategoryController=async(req,resp)=>{
    try{
        const {name} = req.body
        const {id} = req.params
        const slug = typeof name === 'string' ? slugify(name) : '';
        const category = await Category.findByIdAndUpdate(id,{ name,slug });
        resp.status(200).send({
            success:true,
            message:'Category updated Successfully',
            category,
        });
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            error,
            message:'Error while updating category'
        })
    }

}
// export const updateCategoryController = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const { id } = req.params;
        
//         // Check if category with the provided ID exists
//         const category = await Category.findById(id);
//         if (!category) {
//             return res.status(404).send({
//                 success: false,
//                 message: 'Category not found'
//             });
//         }

//         // Update category with new name and generate slug
//         category.name = name;
//         category.slug = slugify(name);

//         // Save the updated category
//         const updatedCategory = await category.save();

//         res.status(200).send({
//             success: true,
//             message: 'Category updated successfully',
//             category: updatedCategory
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({
//             success: false,
//             error: error.message,
//             message: 'Error while updating category'
//         });
//     }
// };

export const categoryController =async(req,resp)=>{
    try{
        const category = await Category.find({});
        resp.status(200).send({
            success:true,
            message:'all catrgory list',
            category,
        })
    }catch(error){ccc
        console.log(error)
        resp.status(500).send({
            success:false,
            error,
            message:'error while getting all category'
        })
    }
}

export const singleCategory = async(req,resp)=>{
    try{
        const category = await Category.find({slug:req.params.slug})
        resp.status(200).send({
            success:true,
            message:'single category',
            category,
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

export const deleteCategory=async(req,resp)=>{
    try{
        const{id}= req.params;
        await Category.findByIdAndDelete(id)
        resp.status(200).send({
            success:true,
            message:'delete successfully'

        })
    }catch(error){
        console.log(error)
        resp.status(500).send({
            success:false,
            message:'error',
            error,
        })
    }
}