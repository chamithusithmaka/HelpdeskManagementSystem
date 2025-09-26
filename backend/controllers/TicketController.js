const Ticket = require('../models/Ticket');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { studentId, title, issueType, description, priority } = req.body;

    // Check for duplicate submission
    const duplicateTicket = await Ticket.checkDuplicate(studentId, description);
    if (duplicateTicket) {
      return res.status(400).json({
        success: false,
        message: 'A similar ticket was recently submitted. Please check existing tickets.'
      });
    }

    // Create new ticket
    const ticket = await Ticket.create({
      studentId,
      title,
      issueType,
      description,
      priority: priority || 'Medium'
    });

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully',
      data: ticket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all tickets with optional filtering
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, isArchived, uni_id } = req.query;
    
    // Build filter object based on query parameters
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (isArchived !== undefined) filter.isArchived = isArchived === 'true';
 if (uni_id) filter.studentId = uni_id;
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Open', 'In Progress', 'Resolved', 'Closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add response to a ticket
exports.addResponse = async (req, res) => {
  try {
    const { responder, message } = req.body;
    
    if (!responder || !message) {
      return res.status(400).json({
        success: false,
        message: 'Responder and message are required'
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.responses.push({ responder, message });
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Assign ticket to an agent
exports.assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    
    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID is required'
      });
    }

    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.assignedTo = agentId;
    ticket.status = 'In Progress';
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket assigned successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Archive/close a ticket
exports.archiveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.isArchived = true;
    ticket.status = 'Closed';
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket archived successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get ticket statistics for dashboard
exports.getTicketStats = async (req, res) => {
  try {
    const stats = {
      total: await Ticket.countDocuments(),
      open: await Ticket.countDocuments({ status: 'Open' }),
      inProgress: await Ticket.countDocuments({ status: 'In Progress' }),
      resolved: await Ticket.countDocuments({ status: 'Resolved' }),
      closed: await Ticket.countDocuments({ status: 'Closed' }),
      byPriority: {
        low: await Ticket.countDocuments({ priority: 'Low' }),
        medium: await Ticket.countDocuments({ priority: 'Medium' }),
        high: await Ticket.countDocuments({ priority: 'High' }),
        critical: await Ticket.countDocuments({ priority: 'Critical' })
      }
    };

    // Get issue type distribution
    const issueTypeCounts = await Ticket.aggregate([
      { $group: { _id: '$issueType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    stats.byIssueType = issueTypeCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a ticket (only if it's open)
exports.updateTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Only allow updates if ticket is open
    if (ticket.status !== 'Open') {
      return res.status(403).json({
        success: false,
        message: 'Only open tickets can be updated'
      });
    }

    // Update fields
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;
    
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a ticket (only if it's open)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Only allow deletion if ticket is open
    if (ticket.status !== 'Open' && ticket.status !== 'Closed') {
  return res.status(403).json({
    success: false,
    message: 'Only open or closed tickets can be deleted'
  });
}

    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
