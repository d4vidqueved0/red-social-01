import z from "zod"

export const CATEGORIES = ['reciclaje', 'compostaje', 'reutilizacion', 'educacion', 'consumo_responsable', 'naturaleza'] as const

export const postSchema = z.object({
    content: z.string().min(1, 'Ingrese al menos un caracter.').max(200, 'Maximo 200 caracteres.'),
    category: z.enum(CATEGORIES, { message: 'Seleccione una de las opciones.' }),
    file: z.instanceof(FileList)
        .optional()
        .refine(
            (files) => !files || files.length === 0 || files[0].size <= 1 * 1024 * 1024,
            'La imagen no puede superar 1MB'
        )
        .refine(
            (files) => !files || files.length === 0 || files[0].type.startsWith('image/'),
            'Solo se permiten imágenes'
        )
})

export type postSchemaType = z.infer<typeof postSchema>