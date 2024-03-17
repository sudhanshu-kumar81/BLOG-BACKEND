
import { Router } from 'express'
import bcrypt, { compareSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from './model/user.js'
import { authenticate } from './middleware/authenticate.js'
import { upload } from './middleware/upload.js'
import Post from './model/post.js'
import { uploadOncloudinary } from './middleware/cloudinary.js'
import Comment from './model/comment.js'
import Feedback from './model/feedback.js'

const router = Router()
router.post('/register', async (req, res) => {
    try {
        // console.log("i am body of register", req.body)
        const { name, email, password } = req.body
        if (!email || !name || !password) {
            return res.status(401).json({
                success: false,
                message: "enter all credientials"
            })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(403).json({
                success: false,
                message: "This Email Already Exist"
            })
        }
        const userName=await User.findOne({name})
        if(userName){
            return res.status(403).json({
                success: false,
                message: "user Name already exist"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const registeredUser = await User.create({ name: name, email: email, password: hashedPassword })
        res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            user: registeredUser
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "internal error"
        })
    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email, !password) {
            return res.status(401).send({
                success: false,
                message: "enter all credientials"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "register first"
            })
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "incorrect password"
            })
        }
        console.log("matched", match)
        if (match) {
            const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '30m' })
            console.log("token is ", token)
            user.tokens.push({ token: token })
            await user.save();
            res.cookie("mycookie", token, { expires: new Date(Date.now() + 60* 1000*25), httpOnly: true,secure:true,sameSite:'None' }).status(200).send({
                success: true,
              
                message: "you are logined",
                token: token,
                user: user
            })

        }
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "internal error"
        })
    }
})
// router.get('/home', authenticate, async (req, res) => {
//     res.send({
//         rootUser: req.rootUser,
//         success: true,
//         message: "you are authorized"
//     })
// })
router.get('/check',async(req,res)=>{
    const user=await User.find({});
    res.status(200).json({
        "success":true,
        message:'working properly',
        user:user,
    })

})
router.get('/logout',(req,res)=>{
    // console.log('Cookies: ', req.cookies)
    // console.log("hello my logout page")
   
       res.clearCookie('mycookie');
       res.status(200).send({
          message:"logged out successfully",
          success:true, 
 })})

router.post('/profile', authenticate, upload.single('avatar'), async (req, res, next) => {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    try {
        console.log("do i have url");
        const localFilePath = req.file.path;
        const cloudinaryResponse = await uploadOncloudinary(localFilePath);
        if (cloudinaryResponse) {
            res.status(200).json({
                        success: true,
                        message: "image updated successfully",
                        url:cloudinaryResponse.url
                    })
        } else {
            return res.status(500).json({
                success: false,
                message: "error in uploading  file to cloudinary"
            })
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "internal error"
        })
    }
})
router.post('/savepost', authenticate, async (req, res, next) => {
    
    try{
        // console.log("arrived in backend");
    let {title,description,avatar,username,categories}=req.body;
    if(!title||!description||!avatar||!username||!categories){
        return res.status(403).send({
            success:false,
            message:"enter all credientilas"
        })
    }
    const post=await Post.create({
        title,description,avatar,username,categories
    })
    console.log("post is ",post);
    res.status(200).json({
        success:true,
        message:"post saved successfully",
        post:post
    })
    }catch(e){
        // console.log("error is ",e);
        return res.status(500).send({
            success:false,
            message:"internal error"
        })
    }

    
})

router.get('/getAllPosts', async (req, res) => {
    try {
        const category = req.query.category;
        
   console.log("category is ",category)
        if(category){
            const posts = await Post.find({ categories: category });
            console.log("posts are ",posts);
            res.status(200).json({
                success: true,
                posts: posts,
                message: "Retrieved all posts based on category"
            });
        }
      else{
        console.log("entered anside Null");
        const posts = await Post.find({});
        return res.status(200).json({
            success: true,
            posts: posts,
            message: "Retrieved all posts based on category"
        });
      }
        
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});

router.get('/postDetails', async (req, res) => {
    try {
        const id = req.query._id;
        // console.log("id is ".id);   
        const posts = await Post.findById(id);
        res.status(200).json({
            success: true,
            posts: posts,
            message: "Details of post"
        });
    } catch (e) {
      
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});
router.get('/edit', authenticate, async (req, res) => {
    try {
        const id = req.query._id;
        console.log("id is ".id);   
        const posts = await Post.findById(id);
        res.status(200).json({
            success: true,
            posts: posts,
            message: "Retrieved all posts based on category"
        });
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});
router.post('/updatepost', authenticate, async (req, res) => {
    try {
        const id = req.query._id;
        console.log("id is ".id);  
      const  {title,description,avatar,username,categories}=req.body; 
    //   console.log(title,description,avatar,username,categories)
        const posts = await Post.findByIdAndUpdate(id,{title,description,avatar,username,categories},{new:true})
        res.status(200).json({
            success: true,
            posts: posts,
            message: "updated dated successfully"
        });
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});

router.get('/delete', authenticate, async (req, res) => {
    try {
        console.log("arrived in deleted route")
        const id = req.query._id;
        console.log("id is ".id);  

        const response = await Post.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "deleted successfully"
        });
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});
router.post('/addComment', authenticate, async (req, res) => {
    try { 
     const {name,postId,comments,date}=req.body;
    //  console.log(name,postId,comments,date)
     if(!comments){
        return res.status(403).send({
            success: false,
            message: "can`t post empty"
        });
     }
     const comment=await Comment.create({name,postId,comments,commentedAt:date})
        res.status(200).json({
            success: true,
            comment:comment,
            message: "comment saved"
        });
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});
router.get('/showAllComments', async (req, res) => {
    try {
        console.log("arrived in show all comments")
        console.log();
        const id = req.query._id;
        console.log("id is ".id);  
    // const comment=await Comment.findById(id);
    const comment=await Comment.find({postId:id})
        res.status(200).json({
            success: true,
            comment:comment,
            message: "these are all comments"
        });
    } catch (e) {
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});
router.get('/deleteComment', authenticate, async (req, res) => {
    try {
        const id = req.query._id;
        console.log("id is ".id);  
    const DeletedComment=await Comment.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            DeletedComment:DeletedComment,
            message: "comment deleted"
        });
    } catch (e) {
      
        return res.status(500).send({
            success: false,
            message: "Internal error"
        });
    }
});

router.get('/Islogin', authenticate, async (req, res) => {
    try {
        // req.userID=rootUser._id; 
        const user=req.rootUser;
     res.status(200).json({
        success:true,
        message:"you are already logined",
        user:user,
     })
    } catch (e) {
      return res.status(500).json({
            success:false,
            message:"internal error",
         })    
    }
});

router.get('/getDetails', authenticate, async (req, res) => {
    console.log("entered in getDetails")
    try {
        const user=req.rootUser;
     res.status(200).json({
        success:true,
        message:"your info",
        user:user,
     })
    } catch (e) {
      return res.status(500).json({
            success:false,
            message:"internal error",
         })    
    }
});

router.post('/saveSuggestion', authenticate, async (req, res) => {
    console.log("entered in saving suggestion")
    try {
        const {name,email,suggestion,issue}=req.body;
        console.log(name,email,suggestion,issue)
     const feedback=await Feedback.create({name,email,issue,suggestion})
     res.status(200).json({
        success:true,
        message:"feedback saved",
        feedback:feedback
     }) 
    } catch (e) {
      return res.status(500).json({
            success:false,
            message:"internal error",
         })    
    }
});

export { router }
