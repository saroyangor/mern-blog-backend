import express from "express"
import mongoose from "mongoose"
import multer from "multer"
import cors from "cors"

import {
    registerValidator,
    loginValidator,
    postCreateValidator,
} from "./validators/index.js"
import { UserController, PostController } from "./controllers/index.js"
import { checkAuth, handleValidationErrors } from "./utils/index.js"

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => console.log("DB error", err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads")
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"))

app.post(
    "/auth/login",
    loginValidator,
    handleValidationErrors,
    UserController.login
)
app.post(
    "/auth/register",
    registerValidator,
    handleValidationErrors,
    UserController.register
)
app.get("/auth/me", checkAuth, UserController.getMe)

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get("/tags", PostController.getLastTags)
app.get("/users", UserController.getUsers)

app.get("/posts", PostController.getAll)
app.get("/posts/:id", PostController.getOne)
app.post(
    "/posts",
    checkAuth,
    postCreateValidator,
    handleValidationErrors,
    PostController.create
)
app.delete("/posts/:id", checkAuth, PostController.remove)
app.patch(
    "/posts/:id",
    checkAuth,
    postCreateValidator,
    handleValidationErrors,
    PostController.update
)

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log("Server run")
})
