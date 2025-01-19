import { Router } from "express";
import { getUser } from "../controllers/user.controller";

const UserRoute = () => {
    const router = Router();

    router.get("/user", getUser);

    return router;
};

export { UserRoute };
