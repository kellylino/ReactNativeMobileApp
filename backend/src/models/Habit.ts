import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habit_name: { type: String, required: true },
    habit_img: { type: String },
    habit_target_time: { type: Number, required: true },
    habit_target_type: { type: String, enum: ['hours', 'days'], default: 'days' },
    habit_accumulating_time: { type: Number, default: 0 },
    habit_progress: { type: Number, default: 0 },
    is_checked: {type: Boolean},
    checked_dates: [Date],
    hours_accumulated_period: [{ start_time: Date, end_time: Date }],
    goal_reached: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);