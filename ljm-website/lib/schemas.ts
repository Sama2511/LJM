import { z } from "zod";

export const formSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: "First Name should be at least 3 characters" }),
  lastname: z
    .string()
    .min(3, { message: "Last Name should be at least 3 characters" }),
  email: z.email({ message: "Please enter a valid Email" }),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters.")
    .max(500, "Message must be at most 500 characters."),
});

export const signUpSchema = z
  .object({
    firstname: z
      .string()
      .min(3, { message: "First Name should be at least 3 characters" }),
    lastname: z
      .string()
      .min(3, { message: "Last Name should be at least 3 characters" }),
    email: z.email({ message: "Please enter a valid Email" }),
    phoneNumber: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
    password: z
      .string()
      .min(8, { message: "Minimum 8 characters" })
      .max(20, { message: "Maximum 20 Characters" }),

    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export const volunteerForm = z.object({
  activitites: z
    .array(
      z.enum([
        "events",
        "gardening",
        "companionship",
        "transport",
        "kitchen-help",
        "administration",
      ]),
    )
    .min(1, "Choose at least 1 option"),

  intrests: z.string().max(100).optional(),
  skills: z.string().max(200).optional(),
  story: z.string().max(400).optional(),
  inspiration: z.string().max(200),
  availability: z.string().max(50),
  certificate: z.array(z.enum(["clearance", "childrenCheck"])),
});
