import {body} from "express-validator"

export const loginValidator = [
    body("email", "Неверный формат почты").isEmail(),
    body("password", "Пароль должен содержать минимум 6 символов").isLength({ min: 6 }),
]