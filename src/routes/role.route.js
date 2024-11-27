import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createUser,
    getAllVulnerabilities, 
    addNewVulnerabilities, 
    assignVulnerabilities, 
    updateVulnerabilitiesStatus, 
    viewResolvedVulnerabilities, 
} from "../controllers/role.controller.js";

const router = Router()

router.route("/create-user").post(verifyJWT, createUser)
router.route("/get-all-vulnerabilities").get(verifyJWT, getAllVulnerabilities)
router.route("/add-new-vulnerabilities").get(verifyJWT, addNewVulnerabilities)
router.route("/assign-vulnerabilities").get(verifyJWT, assignVulnerabilities)
router.route("/update-vulnerabilities-status").get(verifyJWT, updateVulnerabilitiesStatus)
router.route("/view-resolved-vulnerabilities").get(verifyJWT, viewResolvedVulnerabilities)

export default router