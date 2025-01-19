import { Router } from "express";
import { getStreams } from "../controllers/stream.controller";

const StreamRoute = () => {
    const router = Router();

    router.get("/streams", getStreams);

    return router;
};

export { StreamRoute };
