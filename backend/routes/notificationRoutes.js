import express from 'express';
import { protect } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import { markAsRead, markAllAsRead, getUnreadCount } from '../services/notificationService.js';

const router = express.Router();
router.use(protect);

// GET /api/notifications — get all for current user
router.get('/', async (req, res, next) => {
      try {
            const { page = 1, limit = 20, unreadOnly } = req.query;
            const query = { recipient: req.user._id };
            if (unreadOnly === 'true') query.isRead = false;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await Notification.countDocuments(query);
            const notifications = await Notification.find(query)
                  .populate('complaint', 'complaintId title status')
                  .sort({ createdAt: -1 })
                  .skip(skip)
                  .limit(parseInt(limit));

            const unreadCount = await getUnreadCount(req.user._id);

            res.status(200).json({ success: true, total, unreadCount, notifications });
      } catch (error) { next(error); }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res, next) => {
      try {
            const n = await markAsRead(req.params.id, req.user._id);
            if (!n) return res.status(404).json({ success: false, message: 'Notification not found' });
            res.status(200).json({ success: true, notification: n });
      } catch (error) { next(error); }
});

// PUT /api/notifications/read-all
router.put('/read-all', async (req, res, next) => {
      try {
            await markAllAsRead(req.user._id);
            res.status(200).json({ success: true, message: 'All notifications marked as read' });
      } catch (error) { next(error); }
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res, next) => {
      try {
            await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
            res.status(200).json({ success: true, message: 'Notification deleted' });
      } catch (error) { next(error); }
});

export default router;
