import express from 'express';
import {
  getIssues,
  getMyIssues,
  getAssignedIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getIssues)
  .post(protect, upload.single('image'), createIssue);

router.get('/my', protect, getMyIssues);
router.get('/assigned', protect, authorize('officer', 'admin'), getAssignedIssues);

router.route('/:id')
  .get(getIssueById)
  .put(protect, authorize('officer', 'admin'), updateIssue)
  .delete(protect, authorize('admin'), deleteIssue);

export default router;
