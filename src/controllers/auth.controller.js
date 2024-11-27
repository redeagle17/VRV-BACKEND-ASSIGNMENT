import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        return next(new ApiError(500, "Something went wrong while generating refresh and access token"))
    }
}

const registerUser = asyncHandler( async (req, res, next) => {

    const {name, email, password } = req.body

    if (
        [name, email, password].some((field) => field?.trim() === "")
    ) {
        return next( new ApiError(400, "All fields are required"))
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return next(new ApiError(409, "User with email or username already exists"))
    }
   
    const user = await User.create({
        name,
        email, 
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return next(new ApiError(500, "Something went wrong while registering the user"))
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res, next) =>{

    const {email, password} = req.body

    if (!email) {
        return next(new ApiError(400, "Email is required"))
    }

    const user = await User.findOne({ email })

    if (!user) {
        return next(new ApiError(404, "User does not exist"))
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return next(new ApiError(401, "Invalid user credentials"))
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return next(new ApiError(401, "Unauthorized request"))
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            return next(new ApiError(401, "Invalid refresh token"))
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return next(new ApiError(401, "Refresh token is expired or used"))
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        return next(new ApiError(401, error?.message || "Invalid refresh token"))
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
}