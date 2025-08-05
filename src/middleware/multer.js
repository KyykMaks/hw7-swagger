import multer from "multer";
import { TEM_UNPLOAD_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,TEM_UNPLOAD_DIR);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}_${file.originalname}`);
    },
});

export const upload = multer({storage});
