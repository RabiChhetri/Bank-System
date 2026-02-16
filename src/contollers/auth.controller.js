const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken')
const emailService=require('../services/email.service')

async function registerUser(req,res){
    const {email,name,password}=req.body
    const isUserAlreadyExists=await userModel.findOne({email:email})
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:'User Already Exists'
        })
    }
    const user=await userModel.create({
        email,
        name,
        password
    })
    const token=jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,{expiresIn:'3d'})
    res.cookie('token',token)
    res.status(201).json({
        message:'User registered successfully',
        user:{
            name:user.name,
            email:user.email,
            password:user.password,
            id:user._id
        },token
    })
    await emailService.sendRegistrationEmail(user.email,user.name)
}
async function loginUser(req,res) {
    const {email,name,password}=req.body
    const user=await userModel.findOne({
        $or:[
            {email},
            {name}
        ]
    }).select('+password')
    if(!user){
        return res.status(401).json({
            message:'Invalid gmail or username'
        })
    }
    const isValidPassword=await user.comparePassword(password)
    if(!isValidPassword){
         return res.status(401).json({
            message:'Invalid Password'
        })
    }
    const token=jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,{expiresIn:'3d'})
    res.cookie('token',token)
    res.status(201).json({
        message:'Login Sucessfully',
        user:{
            name:user.name,
            email:user.email,
            password:user.password,
            id:user._id
        },token
    })
}

module.exports={registerUser,loginUser}