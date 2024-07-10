import { Router } from "express";
import { dataUser } from "../controllers/dataController";
import { authenticateToken } from "../middleware/authmiddleware";

const router: Router = Router();

router.post("/data", authenticateToken, dataUser);

export default router;
