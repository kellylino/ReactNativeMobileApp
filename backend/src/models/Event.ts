import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    start: {
      dateTime: { type: String, required: true },
      timeZone: { type: String, default: 'local' },
    },
    end: {
      dateTime: { type: String, required: true },
      timeZone: { type: String, default: 'local' },
    },
    title: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Overdue'], default: 'Pending' },
    color: { type: String },
    recurrence: { type: String },
    recurringEventId: { type: String },
    excludeDates: [String],
    originalStartTime: { type: Date },
    localId: { type: String },
    isFirstOccurrence: { type: Boolean },
    resourceId: { type: String }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Events', eventSchema);