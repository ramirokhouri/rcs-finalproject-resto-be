import { body } from "express-validator";
import jwt from 'jsonwebtoken';
import userModel from "../models/users.model.js";


// Verifica token
export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ status: 'ERR', data: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ status: 'ERR', data: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

// Verifica si el email enviado en el body ya se encuentra registrado
export const checkRegistered = async (req, res, next) => {
  const existingUser = await userModel.findOne({ email: req.body.email });

  if (!existingUser) {
    next();
  } else {
    res.status(400).json({
      status: "ERR",
      data: "El correo electrónico ya está registrado",
    });
  }
};

// Valida los elementos del body utilizando express-validator
export const validateCreateFields = [
  body("name")
    .isLength({ min: 2, max: 32 })
    .withMessage("El nombre debe tener entre 2 y 32 caracteres"),
  body("email").isEmail().withMessage("El formato de mail no es válido"),
  body("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("La clave debe tener entre 6 y 12 caracteres"),
];

// Valida los elementos del body utilizando express-validator
export const validateLoginFields = [
    body('email').isEmail().withMessage('El formato de mail no es válido'),
    body('password').isLength({ min: 6, max: 12 }).withMessage('La clave debe tener entre 6 y 12 caracteres')
]

//Verifica que el mail enviado en el body exista en la colección de usuarios
export const checkReadyLogin = async (req, res, next) => {
   res.locals.foundUser = await userModel.findOne({ email: req.body.email })
   if (res.locals.foundUser !== null) {
       next()
   } else {
       res.status(400).send({ status: 'ERR', data: 'El email no se encuentra registrado' })
   }
}