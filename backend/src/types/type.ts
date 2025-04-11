import { z } from 'zod';
import { Request } from 'express';

export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email(),
  password: z.string()
  .min(8, 'Password must be at least 8 characters')
  .refine(password => /[A-Z]/.test(password), {
    message: 'Password must contain at least one capital letter'
  })
  .refine(password => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: 'Password must contain at least one special character'
  }),
  profile_img:  z.string().regex(/^https?:\/\/.+/, "Invalid image URL"),
});

export const habitSchema = z.object({
  user_id: z.string(),
  habit_name: z.string(),
  habit_img: z.string().regex(/^https?:\/\/.+/, "Invalid image URL"),
  habit_target_time: z.number(),
  habit_target_type: z.enum(['hours', 'days']),
  habit_accumulating_time: z.number().optional(),
  habit_progress: z.number().optional(),
  is_checked: z.boolean(),
  checked_dates: z.array(z.string()),
  hours_accumulated_period: z.array(
    z.object({
      start_time: z.string(),
      end_time: z.string(),
    })
  ),
  goal_reached: z.boolean(),
});

export const eventSchema = z.object({
  user_id: z.string(),
  start: z.object({ dateTime: z.string() }),
  end: z.object({ dateTime: z.string() }),
  title: z.string().optional(),
  status: z.enum(['Pending', 'Completed', 'Overdue']),
  color: z.string().optional(),
  recurrence: z.string().optional(),
  recurringEventId: z.string().optional(),
  excludeDates: z.array(z.string()).optional(),
  originalStartTime: z.date().optional(),
  localId: z.string().optional(),
  isFirstOccurrence: z.boolean().optional(),
  resourceId: z.string().optional(),
});

export type UserData = z.infer<typeof userSchema>;
export type EventData = z.infer<typeof eventSchema>;
export type HabitData = z.infer<typeof habitSchema>;

export interface AuthenticatedRequest extends Request {
  user_id: string;
  username: string;
}