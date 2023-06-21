import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://khorevspb:wwwwww@cluster0.duerdul.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB Err", err));

const app = express();

const storage = multer.diskStorage({
  // Указываем путь файла:
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  // Получаем название файла перед сохранением:
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

// Создаем хранилище
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Hello World Server");
});

app.use(express.json());
app.use(cors());
// Возвращаем статические файлы загрузки
app.use("/uploads", express.static("uploads"));

// Делаем авторизацию
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

// Делаем регистрацию
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

// Внутри checkAuth необходим next() для выполнения дальнейшей функции
app.get("/auth/me", checkAuth, UserController.getMe);

// Роут для сохранения файлов
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  // Отдаем клиенту ссылку на файл
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Создаём все роуты
app.get("/tags", PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Okey");
});
