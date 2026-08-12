import mongoose from 'mongoose';

// ── Department collection ─────────────────────────────────────────────────────
// Stored in: esamadhan.departments
const departmentSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: [true, 'Department name is required'],
                  unique: true,
                  trim: true,
            },
            slug: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
                  trim: true,
            },
            description: {
                  type: String,
                  trim: true,
            },
            icon: {
                  type: String,
                  default: 'Building2',
            },
            color: {
                  type: String,
                  default: 'from-blue-500 to-blue-600',
            },
            headOfficer: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: 'User',
                  default: null,
            },
            officers: [
                  {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                  },
            ],
            // SLA in hours
            slaHours: {
                  low: { type: Number, default: 72 },
                  medium: { type: Number, default: 48 },
                  high: { type: Number, default: 24 },
                  emergency: { type: Number, default: 4 },
            },
            stats: {
                  totalComplaints: { type: Number, default: 0 },
                  resolvedComplaints: { type: Number, default: 0 },
                  pendingComplaints: { type: Number, default: 0 },
                  avgResolutionHours: { type: Number, default: 0 },
            },
            isActive: {
                  type: Boolean,
                  default: true,
            },
            contactEmail: { type: String, trim: true },
            contactPhone: { type: String, trim: true },
      },
      { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);
export default Department;
