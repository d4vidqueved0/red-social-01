import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email('Email no valido. Seguir el formato correo@ejemplo.com.'),
    password: z.string().min(8, 'Ingrese al menos 8 caracteres.').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/, 'La contraseña debe contener al menos una letra mayuscula, minuscula, numero y caracter (@$!%*?&)'),
})

export type loginSchemaType = z.infer<typeof loginSchema>

export const registerSchema = loginSchema.extend({
    name: z.string().trim().min(1, 'Ingrese al menos un caracter.'),
    username: z.string().trim().min(5, 'Su nombre de usuario debe contener al menos 5 caracteres.').regex(/^[a-zA-Z0-9._]+$/, 'Solo estan permitidos los caracteres especiales punto y guion bajo').max(30, 'No puede contener más de 30 caracteres'),
    password_confirm: z.string().min(8, 'Ingrese al menos 8 caracteres.'),
}).refine(registro => registro.password === registro.password_confirm, {
    path: ['password_confirm'],
    message: 'Las contraseñas no coinciden.'
})

export type registerSchemaType = z.infer<typeof registerSchema>