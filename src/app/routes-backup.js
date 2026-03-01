const express = require("express");

const { ADMIN, FARMER, VET } = require("~root/constants/userTypes");
const postLogin = require("./controllers/users/login");
const postUser = require("./controllers/users/register");
const putUserDetails = require("./controllers/users/putUserDetails");
const authentication = require("./middlewares/authentication");
const authorise = require("./middlewares/authorisation");
const getUserTypes = require("./controllers/users/userTypes");
const putPassword = require("./controllers/password-recovery/putPassword");
const postRecoveryRequest = require("./controllers/password-recovery/postRecoveryRequest");
const healthcheck = require("./platform/healthcheck");

// Farm Management
const getFarms = require("./controllers/farms/getFarms");
const postFarm = require("./controllers/farms/postFarm");
const getFarmById = require("./controllers/farms/getFarmById");
const putFarm = require("./controllers/farms/putFarm");
const deleteFarm = require("./controllers/farms/deleteFarm");

// Livestock Management
const getLivestock = require("./controllers/livestock/getLivestock");
const postLivestock = require("./controllers/livestock/postLivestock");
const getLivestockById = require("./controllers/livestock/getLivestockById");
const putLivestock = require("./controllers/livestock/putLivestock");
const deleteLivestock = require("./controllers/livestock/deleteLivestock");
const getLivestockCategories = require("./controllers/livestock/getLivestockCategories");
const getLivestockFeatures = require("./controllers/livestock/getLivestockFeatures");

// Admin Management
const getAdminFarmers = require("./controllers/admin/getFarmers");
const getAdminFarms = require("./controllers/admin/getFarms");
const getAdminLivestock = require("./controllers/admin/getLivestock");
const getAdminVets = require("./controllers/admin/getVets");
const getAdminVerificationRequests = require("./controllers/admin/getVerificationRequests");
const getAdminStats = require("./controllers/admin/getStats");

// Stats
const getFarmerStats = require("./controllers/stats/getFarmerStats");
const getVetStats = require("./controllers/stats/getVetStats");
const getAdminDashboardStats = require("./controllers/stats/getAdminStats");

const router = express.Router();

// USER MANAGEMENT
router.post("/login", postLogin);

router.post(
  "/register",
  authentication,
  authorise({ roles: [ADMIN] }),
  postUser
);

router.put("/edit/user", authentication, putUserDetails);

router.get("/user-types", getUserTypes);

router.post("/recovery-request", postRecoveryRequest);

router.put("/update-password/:shortcode", putPassword);

// LIVESTOCK MANAGEMENT (Farmers only)
router.get(
  "/livestock",
  authentication,
  authorise({ roles: [FARMER] }),
  getLivestock
);

router.post(
  "/livestock",
  authentication,
  authorise({ roles: [FARMER] }),
  postLivestock
);

router.get(
  "/livestock/:livestockId",
  authentication,
  authorise({ roles: [FARMER] }),
  getLivestockById
);

router.put(
  "/livestock/:livestockId",
  authentication,
  authorise({ roles: [FARMER] }),
  putLivestock
);

router.delete(
  "/livestock/:livestockId",
  authentication,
  authorise({ roles: [FARMER] }),
  deleteLivestock
);

router.get("/livestock-categories", authentication, getLivestockCategories);

router.get(
  "/livestock-features/:categoryId",
  authentication,
  getLivestockFeatures
);

router.get("/healthcheck", healthcheck);

router.get("/healthcheck", healthcheck);

module.exports = router;
