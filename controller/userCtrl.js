const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler');
const { validateMongodbId } = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require('jsonwebtoken');



//create user
const createUser = asyncHandler(
    async(req,res,next) =>{
        const email = req.body.email;
        console.log(req.body);
        const findUser = await User.findOne({email:email});
        if(!findUser){
            const newUser = await User.create(req.body);
            res.json(newUser);
        }else{
            throw new Error("User Already Exists");
        }
    }
);

//login as user
const loginUserCtrl = asyncHandler(
    async (req,res,next) =>{
        const {email, password} = req.body;
        //check if user exists
        const findUser = await User.findOne({email});
        if(findUser && await findUser.isPasswordMatched(password)){
            const refreshToken = generateRefreshToken(findUser?._id);
            const updateUser = await User.findOneAndUpdate(findUser?._id,{
                refreshToken: refreshToken
            },{
                new: true,
            });
            res.cookie("refreshToken",refreshToken,{
                httpOnly: true,
                maxAge: 72*60*60*1000,
            })
            res.json({
                _id: findUser?._id,
                firstname: findUser?.firstname,
                lastname : findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                role: findUser?.role,
                token: generateToken(findUser?._id)
            });
        }else{
            throw new Error("Invalid Credentials");
        }
    }
);


//handle refresh token 

const handleRefreshToken = asyncHandler(
    async (req,res) =>{
        const cookie = req.cookies;
        if(!cookie?.refreshToken) throw new Error("No refresh Token in Cookies");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({refreshToken});
        if(!user) throw new Error("No refresh Token Present in db");
        jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) =>{
            if(err || user.id !== decoded.id ){
                throw new Error("There is soemthing wrong with refreshToken");
            }
            const accessToken = generateToken(user?._id)
            res.json({accessToken});
        });
    }
);
//logout function 

const logout = asyncHandler(
    async (req,res) =>{
        const cookie = req.cookies;
        if(!cookie?.refreshToken) throw new Error("No refresh Token in Cookies");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({refreshToken});
        if(!user){
            res.clearCookie("refreshToken",{
                httpOnly: true,
                secure: true,
            })
            res.status(204);
        } 

        await User.findOneAndUpdate(refreshToken,{
            refreshToken:"",
        });

        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,
        })
        res.status(204);
    }
);

//update a user
const updateaUser = asyncHandler(
    async (req,res,next) =>{
        const {_id} = req.user;
        validateMongodbId(_id)
        
        try{
            const updatedUser = await User.findByIdAndUpdate(_id,{
                firstname: req?.body.firstname,
                lastname : req?.body.lastname,
                email:     req?.body.email,
                mobile:    req?.body.mobile,
            },{
                new: true,
            });

            res.json(updatedUser);

        }catch(error){
            throw new Error(error);
        }
    }
);

//get all user
const getallUsers = asyncHandler (
    async (req,res,next) =>{
        try{
            const getUsers = await User.find();
            res.json({
                getUsers
            });
        }catch(error){
            throw new Error(error);
        }
    }
);

//get a single user
const getaUser = asyncHandler (
    async (req,res,next) =>{
        const {id} = req.params;
        validateMongodbId(id)
        try{
            const getaUser = await User.findById(id);
            res.json({
                getaUser
            });
        }catch(error){
            throw new Error(error);
        }
    }
);

//delete a single user
const deleteaUser = asyncHandler (
    async (req,res,next) =>{
        const {id} = req.params;
        validateMongodbId(id)
        try{
            const deleteUser = await User.findByIdAndDelete(id);
            res.json({
                deleteUser
            });
        }catch(error){
            throw new Error(error);
        }
    }
);

//block user
const blockUser = asyncHandler (
    async (req,res,next) =>{
        const {id} = req.params;
        validateMongodbId(id)
        try{
            const blockedUser = await User.findByIdAndUpdate(id,{
                isBlocked: true,
            },{
                new: true,
            });

            res.json({
                message: `${blockedUser.firstname} ${blockedUser.lastname} blocked successfully`
            });

        }catch(error){
            throw new Error(error);
        }
    }
);

//unblock user
const unblockUser = asyncHandler (
    async (req,res,next) =>{
        const {id} = req.params;
        validateMongodbId(id)
        
        try{
            const unblockedUser = await User.findByIdAndUpdate(id,{
                isBlocked: false,
            },{
                new: true,
            });

            res.json({
                message: `${unblockedUser.firstname} ${unblockedUser.lastname} unblocked successfully`
            });

        }catch(error){
            throw new Error(error);
        }
    }
);



module.exports = {
    createUser,
    loginUserCtrl,
    getallUsers,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout
};