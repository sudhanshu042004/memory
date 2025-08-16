import expres from "express"
import multer from "multer";
import path from "path";
import fs from "fs";

export const imageRouter = expres.Router();

const uploadDir = path.join(process.cwd(),"uploads","images");
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination : (_req:Express.Request,_file : Express.Multer.File,cb:(err:Error | null,destination:string)=>void)=>{
        cb(null,uploadDir);
    },
    filename : (_req:Express.Request,file : Express.Multer.File,cb:(err:Error|null,filename : string)=>void)=>{
        const ext  = path.extname(file.originalname);
        const name = path.basename(file.originalname,ext);
        cb(null,`${name}-${Date.now()}${ext}`);
    }
})

const fileFilter = (_req:Express.Request,file:Express.Multer.File,cb:multer.FileFilterCallback) =>{
    if(file.mimetype === "image/jpeg"){
        cb(null,true);
    } else {
        cb(new Error("Only jpeg/jpg format allowed"));
    }
}

const upload = multer({storage:storage,fileFilter});

imageRouter.post('/postImage', upload.single("image"),(req:expres.Request,res:expres.Response)=>{
    res.json({
        "message" : "request comming to our server"
    })
})
