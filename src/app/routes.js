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
const { getUsers } = require("./controllers/users/getUsers");
const { getAllFarms } = require("./controllers/farms/getAllFarms");
const { getAllLivestock } = require("./controllers/livestock/getAllLivestock");
const { getVets } = require("./controllers/users/getVets");
const {
  getVerificationRequests
} = require("./controllers/verificationRequests/getVerificationRequests");

// Stats
const { getFarmerStats } = require("./controllers/stats/getFarmerStats");
const { getVetStats } = require("./controllers/stats/getVetStats");
const { getAdminStats } = require("./controllers/stats/getAdminStats");

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

// FARM MANAGEMENT (Farmers only)
router.get("/farms", authentication, authorise({ roles: [FARMER] }), getFarms);
router.post("/farms", authentication, authorise({ roles: [FARMER] }), postFarm);
router.get(
  "/farms/:farmId",
  authentication,
  authorise({ roles: [FARMER] }),
  getFarmById
);
router.put(
  "/farms/:farmId",
  authentication,
  authorise({ roles: [FARMER] }),
  putFarm
);
router.delete(
  "/farms/:farmId",
  authentication,
  authorise({ roles: [FARMER] }),
  deleteFarm
);

// LIVESTOCK MANAGEMENT (Farmers only - now under farms)
router.get(
  "/farms/:farmId/livestock",
  authentication,
  authorise({ roles: [FARMER] }),
  getLivestock
);
router.post(
  "/farms/:farmId/livestock",
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

// LIVESTOCK METADATA (Available to all authenticated users)
router.get("/livestock-categories", authentication, getLivestockCategories);
router.get(
  "/livestock-features/:categoryId",
  authentication,
  getLivestockFeatures
);

// ADMIN MANAGEMENT (Admins only)
router.get(
  "/admin/farmers",
  authentication,
  authorise({ roles: [ADMIN] }),
  getUsers
);
router.get(
  "/admin/farms",
  authentication,
  authorise({ roles: [ADMIN] }),
  getAllFarms
);
router.get(
  "/admin/livestock",
  authentication,
  authorise({ roles: [ADMIN] }),
  getAllLivestock
);
router.get(
  "/admin/vets",
  authentication,
  authorise({ roles: [ADMIN] }),
  getVets
);
router.get(
  "/admin/verification-requests",
  authentication,
  authorise({ roles: [ADMIN] }),
  getVerificationRequests
);
router.get(
  "/admin/stats",
  authentication,
  authorise({ roles: [ADMIN] }),
  getAdminStats
);

// STATS ENDPOINTS
router.get(
  "/stats/farmer",
  authentication,
  authorise({ roles: [FARMER] }),
  getFarmerStats
);
router.get(
  "/stats/vet",
  authentication,
  authorise({ roles: [VET] }),
  getVetStats
);
router.get(
  "/stats/admin",
  authentication,
  authorise({ roles: [ADMIN] }),
  getAdminStats
);
router.get("/healthcheck", healthcheck);
module.exports = router;
