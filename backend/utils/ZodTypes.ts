import z from "zod";

export const URLValidation = z.url();

export const QueryValidation = z.string().min(8);

export const fileValidation = z.object({
    size: z.number().min(1).max(1024 * 1024), // 1MB
    mimetype: z.string().refine((val) => val === "application/pdf", {
        message: "Only PDF files are allowed"
    }),
    originalname: z.string()
});