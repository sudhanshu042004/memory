import z from "zod";

export const URLValidation = z.url();

export const QueryValidation = z.string().min(8);