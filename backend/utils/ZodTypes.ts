import z from "zod";

export const URLValidation = z.url();

export const QueryValidation = z.string().min(1);

export const fileValidation = z.object({
    size: z.number().min(1).max(1024 * 1024), // 1MB
    mimetype: z.string().refine((val) => val === "application/pdf", {
        message: "Only PDF files are allowed"
    }),
    originalname: z.string()
});

export const retrieveShchema = z.object({query : z.string()});

export const textValidDation = z.string().min(20);