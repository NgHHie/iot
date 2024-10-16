import express from "express";
import * as ThietBi from "../controllers/thietbi.js";
import * as CamBien from "../controllers/cambien.js";
import * as DashBoard from "../controllers/dashboard.js";

const router = express.Router();

router.get("/action_history", ThietBi.getThietBi);
router.post("/remote", ThietBi.postThietBi);
router.get("/data_sensor", CamBien.getCamBien);
router.get("/dashboard", DashBoard.getDashBoard);
router.get("/count", CamBien.getCountHiep);

export default router;
