import mongoose from "mongoose";
import { BOOKING_STATUSES } from "../constants/status.js";

const bookingSchema = new mongoose.Schema(
  {
    resource: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true, index: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    status: { type: String, enum: BOOKING_STATUSES, default: "Upcoming", index: true },
    reminderAt: Date,
    notes: String
  },
  { timestamps: true }
);

bookingSchema.index({ resource: 1, startAt: 1, endAt: 1 });

export default mongoose.model("Booking", bookingSchema);
