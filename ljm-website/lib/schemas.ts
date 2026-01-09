import { title } from "process";
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
  phone: z
    .string()
    .min(8, { message: "Please enter a valid phone number" })
    .max(20),
  emergencyContact: z
    .string()
    .min(8, { message: "Please enter a valid emergency contact number" })
    .max(20),
  activities: z
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

  interests: z.string().max(250).optional(),
  skills: z.string().max(250).optional(),
  story: z.string().max(400).optional(),
  inspiration: z
    .string()
    .min(3, { message: "this field is mondatory" })
    .max(250),
  availability: z
    .string()
    .min(3, { message: "this field is mondatory" })
    .max(200),
  certificate: z.array(z.enum(["clearance", "childrenCheck"])),
});

const eventRole = z.object({
  role_name: z.string().min(1, { message: "Role name is required" }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1" }),
});

export const eventForm = z.object({
  title: z.string().min(3, { message: "This field is mondatory" }),
  description: z.string().min(3, { message: "This field is mondatory" }),
  date: z.date(),
  starts_at: z.string(),
  ends_at: z.string(),
  location: z.string().min(1, { message: "Location is required" }),
  image_url: z.string(),
  roles: z.array(eventRole).min(1, { message: "At least one role is required" }),
});
