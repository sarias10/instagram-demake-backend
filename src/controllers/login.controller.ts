import { NextFunction, Response } from 'express';
import { CustomRequest, UserCreationAttributes } from '../types/types';
import { User } from '../models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { CustomValidationError } from '../utils/errorFactory';
import { config } from '../config/env';

export const login = async (req:CustomRequest<UserCreationAttributes>, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        // Busca en la base de datos y devuelve el primer usuario que coincide con el username del body
        const user = await User.findOne({ where: { username: body.username } });

        // Sino encontro el usuario, entonces passwordCorrect es false.
        // Si encontro al usuario entonces compara la contraseña encriptada con la contraseña del body, usando bcrypt.compare()
        // Si la comparacion es igual devuelve true
        const passwordCorrect = (user===null)
            ? false
            : await bcrypt.compare(body.password, user.password);

        // Si user es null y passwordCorrect es false entonces eso da false. Entonces false negado es true, por tanto se ejecuta este código.
        // Si user es diferente de null y passwordCorrect es igual false entonces true y false da false. Y false negado es true, por tanto se ejecuta este código.
        // Si user o passwordCorrect son falsos entonces se ejecuta este código.
        if(!(user && passwordCorrect)) {
            throw new CustomValidationError('Invalid username or password', 400);
        }

        // Si todo esta correcto se ejecuta lo que sigue

        // Aquí se crea un objeto con atributo username y id del usuario autenticado (usuario existente y contraseña correcta)
        const userForToken = {
            username: user.username,
            id: user.id
        };

        // Se crea un token y se firma
        const token = jwt.sign(
            userForToken,
            config.secret, // jwt.sign() espera que el segundo argumento sea una cadena (string) que representa la clave secreta o la clave privada
            //esto hace que el token solo dure 60*60 segundos, una hora
            // { expiresIn: 60*60 }
        );
        // Nota: si pongo esto antes que otro res.status ... entonces da este error Error: Cannot set headers after they are sent to the client
        // Finalmente se responde la solicitud
        res.status(200).send({ token, username: user.username, name: user.name });
    } catch (error){
        next(error);
    }
};