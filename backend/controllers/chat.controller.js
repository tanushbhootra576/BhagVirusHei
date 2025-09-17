const Issue = require('../models/Issue');
const IssueChatMessage = require('../models/IssueChatMessage');
const { log, warn, error } = require('../utils/logger');

class ChatController {
  // GET /api/issues/:id/chat?page=&limit=
  async getMessages(req, res) {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      log('[chat.getMessages] START issueId=', id, 'page=', page, 'limit=', limit);
      let issue = await Issue.findById(id).select('_id mergedInto');
      if (!issue) {
        warn('[chat.getMessages] issue not found id=', id);
        return res.status(404).json({ success: false, error: 'Issue not found' });
      }
      if (issue.mergedInto) {
        log('[chat.getMessages] redirected to canonical', issue.mergedInto.toString());
        issue = await Issue.findById(issue.mergedInto).select('_id');
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const messages = await IssueChatMessage.find({ issue: issue._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('author', 'name role');
      const total = await IssueChatMessage.countDocuments({ issue: issue._id });
      log('[chat.getMessages] fetched count=', messages.length, 'total=', total);

      res.json({
        success: true,
        data: messages.reverse(), // return oldest -> newest after reversing
        pagination: {
          total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (e) {
      error('[chat.getMessages] error', e);
      res.status(500).json({ success: false, error: 'Failed to fetch messages', message: e.message });
    }
  }

  // POST /api/issues/:id/chat
  async postMessage(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      log('[chat.postMessage] START issueId=', id, 'user=', req.user?.id);
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, error: 'Message required' });
      }
  let issue = await Issue.findById(id).select('_id reportedBy mergedInto reporters');
      if (!issue) {
        warn('[chat.postMessage] issue not found id=', id);
        return res.status(404).json({ success: false, error: 'Issue not found' });
      }
        if (issue.mergedInto) {
          log('[chat.postMessage] redirected to canonical', issue.mergedInto.toString());
          issue = await Issue.findById(issue.mergedInto).select('_id reportedBy reporters');
        }

      // Basic permission: reporter, any voter, or government user can chat
      const userId = req.user.id;
      const isGov = req.user.role === 'government';
      const isReporter = issue.reportedBy.toString() === userId;
      const reporterEntry = (issue.reporters || []).find(r => r.user?.toString() === userId && r.consent === true);
      if (!isGov && !reporterEntry && !isReporter) {
        warn('[chat.postMessage] permission denied user=', userId, 'issue=', issue._id.toString());
        return res.status(403).json({ success: false, error: 'Consent required to participate in chat' });
      }

        const chatMessage = await IssueChatMessage.create({
          issue: issue._id,
        author: userId,
        message: message.trim()
      });
      await chatMessage.populate('author', 'name role');

      // Emit real-time event
      log('[chat.postMessage] message persisted id=', chatMessage._id.toString());
      req.io?.emit('issueChatMessage', {
        issueId: id,
        message: chatMessage
      });

      res.status(201).json({ success: true, data: chatMessage });
    } catch (e) {
      error('[chat.postMessage] error', e);
      res.status(500).json({ success: false, error: 'Failed to post message', message: e.message });
    }
  }
}

module.exports = new ChatController();
