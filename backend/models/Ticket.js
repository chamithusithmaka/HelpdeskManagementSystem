const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: ['Missing Book Listing', 'Failed Exchange', 'Account Issue', 'Payment Problem', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description should be at least 10 characters']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  assignedTo: {
    type: String,
    ref: 'User',
    default: null
  },
  responses: [{
    responder: {
      type: String,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-save hook for validation
ticketSchema.pre('save', function(next) {
  // Update the updatedAt field
  this.updatedAt = Date.now();
  
  // If status is changing to Resolved, set resolvedAt
  if (this.isModified('status') && this.status === 'Resolved' && !this.resolvedAt) {
    this.resolvedAt = Date.now();
  }
  
  next();
});

// Virtual for ticket age calculation
ticketSchema.virtual('age').get(function() {
  return Math.round((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Age in days
});

// Method to check for duplicate submissions (backend validation)
ticketSchema.statics.checkDuplicate = async function(studentId, description, timeWindow = 60) {
  // Look for similar tickets from same student in the last hour (or custom timeWindow in minutes)
  const timeThreshold = new Date(Date.now() - timeWindow * 60 * 1000);
  
  return await this.findOne({
    studentId: studentId,
    description: { $regex: description.substring(0, 50), $options: 'i' },
    createdAt: { $gt: timeThreshold },
    status: { $in: ['Open', 'In Progress'] }
  });
};

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;