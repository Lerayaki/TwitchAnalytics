import { Router } from "express";
import { getUser } from "../controllers/user.controller";

const UserRoute = () => {
    const router = Router();
    const path = "/user";

    router.get(`${path}`, getUser);

    return router;
};

export { UserRoute };
