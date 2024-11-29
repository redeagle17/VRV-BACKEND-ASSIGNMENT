/*
    This file defines a set of controller functions for managing users and vulnerabilities in a 
    role-based access control (RBAC) system. 
    It includes role-specific validation to restrict access to sensitive operations
*/
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { 
    ROLES,
    GET_ALL_VULNERABILITIES_VALID_ROLES,
    ADD_NEW_VULNERABILITIES_VALID_ROLES,
    ASSIGN_VULNERABILITIES_VALID_ROLES, 
    UPDATE_VULNERABILITIES_STATUS_VALID_ROLES,
    VIEW_RESOLVED_VULNERABILITIES_VALID_ROLES, 
} from "../constants.js";

const createUser = asyncHandler( async (req, res, next) => {
    
    const {name, email, role} = req.body

    if (
        !name?.trim() || 
        !email?.trim() ||
        !role
    ) {
        return next(new ApiError(400, "All fields are required"))
    }
    
    if (role === ROLES["Admin"]){
        return next(new ApiError(401, "You cannot create Admin!"))
    }

    if(req.user.role == ROLES["Auditor"] || req.user.role == ROLES["Security-Analyst"] || req.user.role == ROLES["Responder"]){
        return next(new ApiError(401, "You are not allowed to access this resource. Please contact the admin!"))
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        return next(new ApiError(409, "User with this email already exists"))
    }

    /*
        This is the default password when an user is being created with a specific role. A feature can be added to change this default at later stage.
    */
    const password = process.env.DEFAULT_PASSWORD

    const newUser = await User.create({
        name,
        email, 
        password,
        role,
    })

    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return next(new ApiError(500, "Something went wrong while registering the user"))
    }

    return res.status(201).json(
        new ApiResponse(201, [], "User registered Successfully")
    )
})

const getAllVulnerabilities = asyncHandler( async (req, res, next) => {
    if(!GET_ALL_VULNERABILITIES_VALID_ROLES.includes(req.user.role)){
        return next(new ApiError(401, "You are not allowed to access this resource. Please contact the admin!"))
    }
    return res.status(200).json(
        new ApiResponse(200, [], "You are allowed to access this resource.")
    )
})

const addNewVulnerabilities = asyncHandler( async (req, res, next) => {
    if(!ADD_NEW_VULNERABILITIES_VALID_ROLES.includes(req.user.role)){
        return next(new ApiError(401, "You are not allowed to access this resource. Please contact the admin!"))
    }
    return res.status(200).json(
        new ApiResponse(200, [], "You are allowed to access this resource.")
    )
})

const assignVulnerabilities = asyncHandler( async (req, res, next) => {
    if(!ASSIGN_VULNERABILITIES_VALID_ROLES.includes(req.user.role)){
        return next(new ApiError(401, "You are not allowed to access this resource. Please contact the admin!"))
    }
    return res.status(200).json(
        new ApiResponse(200, [], "You are allowed to access this resource.")
    )
})

const updateVulnerabilitiesStatus = asyncHandler( async (req, res, next) => {
    if(!UPDATE_VULNERABILITIES_STATUS_VALID_ROLES.includes(req.user.role)){
        return next(new ApiError(401, "You are not allowed to access this resource. Please contact the admin!"))
    }
    return res.status(200).json(
        new ApiResponse(200, [], "You are allowed to access this resource.")
    )
})

const viewResolvedVulnerabilities = asyncHandler( async (req, res, next) => {
    if(!VIEW_RESOLVED_VULNERABILITIES_VALID_ROLES.includes(req.user.role)){
        return next(new ApiError(401, "You are not allowed to access this resource. Please contact the admin!"))
    }
    return res.status(200).json(
        new ApiResponse(200, [], "You are allowed to access this resource.")
    )
})

export { 
    createUser, 
    getAllVulnerabilities, 
    addNewVulnerabilities, 
    assignVulnerabilities, 
    updateVulnerabilitiesStatus, 
    viewResolvedVulnerabilities,
}