const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Resource = require('../models/Resource');
const DetailedResource = require('../models/DetailedResource');
const UserProgress = require('../models/UserProgress');
const Admin = require('../models/Admin'); // Use Admin model instead of User
const multer = require('multer');
const sanitize = require('sanitize-html'); // For input sanitization
const authenticateToken = require('../middleware/authenticateToken');

// Valid domains, levels, and types
const validDomains = [
  'cs', 'data', 'pm', 'content', 'engineering', 'psychology', 'writing',
  'design', 'art', 'finance', 'science', 'teaching', 'entrepreneur',
  'journalism', 'architecture', 'gamedesign', 'math', 'anthropology',
  'crafts', 'philosophy',
];
const validLevels = ['beginner', 'intermediate', 'advanced'];
const validTypes = ['video', 'blog', 'pdf', 'link']; // Added 'link' to match AddResource

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${sanitize(file.originalname)}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'video/mp4'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF and MP4 files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});


// Admin-only middleware
const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Validate resource fields
const validateResource = (body) => {
  const { domain, level, type, title, description, estimatedTime, unlockRequirement } = body;
  const errors = [];

  if (!domain || !validDomains.includes(domain)) errors.push('Invalid or missing domain');
  if (!level || !validLevels.includes(level)) errors.push('Invalid or missing level');
  if (!type || !validTypes.includes(type)) errors.push('Invalid or missing type');
  if (!title || typeof title !== 'string' || title.trim() === '' || title.length > 100) {
    errors.push('Title is required and must be 100 characters or less');
  }
  if (!description || typeof description !== 'string' || description.trim() === '' || description.length > 1000) {
    errors.push('Description is required and must be 1000 characters or less');
  }
  if (!estimatedTime || !/^\d+\s*(min|hour|hours)$/i.test(estimatedTime.trim())) {
    errors.push('Invalid estimated time format (e.g., "30 min" or "1 hour")');
  }
  if (unlockRequirement && !isValidObjectId(unlockRequirement)) {
    errors.push('Invalid unlockRequirement ID');
  }

  return errors;
};

// Validate detailed resource fields
const validateDetailedResource = (body) => {
  const { domain, level, type, title, description, url, estimatedTime, resourceId, unlockRequirement } = body;
  const errors = [];

  if (!domain || !validDomains.includes(domain)) errors.push('Invalid or missing domain');
  if (!level || !validLevels.includes(level)) errors.push('Invalid or missing level');
  if (!type || !validTypes.includes(type)) errors.push('Invalid or missing type');
  if (!title || typeof title !== 'string' || title.trim() === '' || title.length > 100) {
    errors.push('Title is required and must be 100 characters or less');
  }
  if (!description || typeof description !== 'string' || description.trim() === '' || description.length > 1000) {
    errors.push('Description is required and must be 1000 characters or less');
  }
  if (!url || !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(url) || url.length > 2000) {
    errors.push('Invalid or missing URL (must be 2000 characters or less)');
  }
  if (!estimatedTime || !/^\d+\s*(min|hour|hours)$/i.test(estimatedTime.trim())) {
    errors.push('Invalid estimated time format (e.g., "15 min" or "1 hour")');
  }
  if (!resourceId || !isValidObjectId(resourceId)) errors.push('Invalid or missing resourceId');
  if (unlockRequirement && !isValidObjectId(unlockRequirement)) {
    errors.push('Invalid unlockRequirement ID');
  }

  return errors;
};

// Create a new resource (admin-only)
router.post('/resources', authenticateToken, isAdmin, async (req, res) => {
  try {
    const sanitizedBody = {
      ...req.body,
      title: sanitize(req.body.title || ''),
      description: sanitize(req.body.description || ''),
    };
    const errors = validateResource(sanitizedBody);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });

    const { domain, level, type, title, description, estimatedTime, unlockRequirement } = sanitizedBody;

    // Validate unlockRequirement existence
    if (unlockRequirement) {
      const exists = await Resource.findById(unlockRequirement) || await DetailedResource.findById(unlockRequirement);
      if (!exists) return res.status(400).json({ error: 'Invalid unlockRequirement ID' });
    }

    const newResource = new Resource({
      domain,
      level,
      type,
      title,
      description,
      estimatedTime,
      unlockRequirement: unlockRequirement || null,
      createdAt: new Date(),
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single resource by ID
router.get('/resources/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid resource ID' });

    const resource = await Resource.findById(id).lean();
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/resources', authenticateToken, async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: 1 }).lean();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching all resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a resource (admin-only)
router.patch('/resources/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid resource ID' });

    const sanitizedUpdates = {
      ...req.body,
      title: sanitize(req.body.title || ''),
      description: sanitize(req.body.description || ''),
    };
    const allowedUpdates = ['domain', 'level', 'type', 'title', 'description', 'estimatedTime', 'unlockRequirement'];
    const updateKeys = Object.keys(sanitizedUpdates);
    const isValidOperation = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation || updateKeys.length === 0) {
      return res.status(400).json({ error: 'Invalid or no updates provided' });
    }

    const errors = validateResource({
      ...sanitizedUpdates,
      title: sanitizedUpdates.title || 'temp',
      description: sanitizedUpdates.description || 'temp',
      estimatedTime: sanitizedUpdates.estimatedTime || '30 min',
    });
    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });

    // Validate unlockRequirement existence
    if (sanitizedUpdates.unlockRequirement) {
      const exists = await Resource.findById(sanitizedUpdates.unlockRequirement) || await DetailedResource.findById(sanitizedUpdates.unlockRequirement);
      if (!exists) return res.status(400).json({ error: 'Invalid unlockRequirement ID' });
    }

    const resource = await Resource.findByIdAndUpdate(id, sanitizedUpdates, { new: true, runValidators: true }).lean();
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    res.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a resource and its sub-resources (admin-only)
router.delete('/resources/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid resource ID' });

    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    // Delete associated sub-resources
    const subResources = await DetailedResource.find({ resourceId: id });
    await DetailedResource.deleteMany({ resourceId: id });

    // Update dependent sub-resources
    await DetailedResource.updateMany(
      { unlockRequirement: { $in: subResources.map((sr) => sr._id) } },
      { $set: { unlockRequirement: null } }
    );

    // Remove from user progress
    await UserProgress.updateMany(
      { completedResources: id },
      { $pull: { completedResources: id } }
    );
    await UserProgress.updateMany(
      { completedSubResources: { $in: subResources.map((sr) => sr._id) } },
      { $pull: { completedSubResources: { $in: subResources.map((sr) => sr._id) } } }
    );

    await resource.deleteOne();
    res.json({ message: 'Resource and associated sub-resources deleted' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new detailed resource (admin-only)
router.post('/detailed-resources', authenticateToken, isAdmin, async (req, res) => {
  try {
    const sanitizedBody = {
      ...req.body,
      title: sanitize(req.body.title || ''),
      description: sanitize(req.body.description || ''),
      url: sanitize(req.body.url || '', { allowedTags: [] }), // No HTML in URLs
    };
    const errors = validateDetailedResource(sanitizedBody);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });

    const { domain, level, type, title, description, url, estimatedTime, resourceId, unlockRequirement } = sanitizedBody;

    // Validate resourceId existence
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(400).json({ error: 'Invalid resourceId' });

    // Ensure domain and level match the parent resource
    if (resource.domain !== domain || resource.level !== level) {
      return res.status(400).json({ error: 'Domain and level must match the parent resource' });
    }

    // Validate unlockRequirement existence
    if (unlockRequirement) {
      const exists = await DetailedResource.findById(unlockRequirement);
      if (!exists || exists.resourceId.toString() !== resourceId.toString()) {
        return res.status(400).json({ error: 'Invalid unlockRequirement ID or does not belong to the same resource' });
      }
    }

    const newDetailedResource = new DetailedResource({
      domain,
      level,
      type,
      title,
      description,
      url,
      estimatedTime,
      resourceId,
      unlockRequirement: unlockRequirement || null,
      createdAt: new Date(),
    });

    await newDetailedResource.save();
    res.status(201).json(newDetailedResource);
  } catch (error) {
    console.error('Error creating detailed resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all detailed resources (with optional filters)
router.get('/detailed-resources', authenticateToken, async (req, res) => {
  try {
    const { resourceId, domain, level, type } = req.query;

    // Build query object
    const query = {};
    if (resourceId) {
      if (!isValidObjectId(resourceId)) return res.status(400).json({ error: 'Invalid resourceId' });
      query.resourceId = resourceId;
    }
    if (domain) query.domain = domain;
    if (level) query.level = level;
    if (type) query.type = type;

    const detailedResources = await DetailedResource.find(query).sort({ createdAt: 1 }).lean();
    res.json(detailedResources);
  } catch (error) {
    console.error('Error fetching detailed resources:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/resources/:resourceId/complete', authenticateToken, async (req, res) => {
  try {
    const resourceId = req.params.resourceId;
    console.log('POST /resources/:resourceId/complete - resourceId:', resourceId);
    console.log('POST /resources/:resourceId/complete - req.user:', req.user);

    // Validate resourceId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      console.log('POST /resources/:resourceId/complete - Invalid resourceId format:', resourceId);
      return res.status(400).json({ error: 'Invalid resourceId format; must be a valid ObjectId' });
    }

    // Check if req.user.email exists
    if (!req.user || !req.user.email) {
      console.log('POST /resources/:resourceId/complete - No email in req.user; authentication failed');
      return res.status(401).json({ error: 'Authentication failed; no user email provided' });
    }

    // Find or create UserProgress
    let userProgress = await UserProgress.findOne({ userId: req.user.email });
    if (!userProgress) {
      userProgress = new UserProgress({ userId: req.user.email, completedResources: [], completedSubResources: [], levelProgress: {} });
      console.log('POST /resources/:resourceId/complete - Created new userProgress:', userProgress);
    }

    const resourceObjectId = mongoose.Types.ObjectId(resourceId);

    // Find resource (main or sub)
    let resource = await Resource.findById(resourceId);
    let isSubResource = false;
    if (!resource) {
      resource = await DetailedResource.findById(resourceId);
      isSubResource = true;
    }

    if (!resource) {
      console.log('POST /resources/:resourceId/complete - Resource not found:', resourceId);
      return res.status(404).json({ error: 'Resource not found' });
    }

    const { domain, level } = resource;
    console.log('POST /resources/:resourceId/complete - Resource details:', { domain, level, isSubResource });

    // Update completed resources
    if (isSubResource) {
      if (!userProgress.completedSubResources.includes(resourceObjectId)) {
        userProgress.completedSubResources.push(resourceObjectId);
        console.log('POST /resources/:resourceId/complete - Added sub-resource:', resourceObjectId);
      }
    } else {
      if (!userProgress.completedResources.includes(resourceObjectId)) {
        userProgress.completedResources.push(resourceObjectId);
        console.log('POST /resources/:resourceId/complete - Added main resource:', resourceObjectId);
      }
    }

    // Calculate progress for domain and level
    const allResources = await Resource.find({ domain, level });
    const allSubResources = await DetailedResource.find({ resourceId: { $in: allResources.map(r => r._id) } });
    const totalItems = allResources.length + allSubResources.length;

    const completedMain = allResources.filter(r => userProgress.completedResources.includes(r._id)).length;
    const completedSub = allSubResources.filter(r => userProgress.completedSubResources.includes(r._id)).length;
    const completedItems = completedMain + completedSub;
    const progressPercentage = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

    console.log('POST /resources/:resourceId/complete - Progress calculation:', {
      domain,
      level,
      totalItems,
      completedMain,
      completedSub,
      progressPercentage,
    });

    // Initialize levelProgress for the domain if not exists
    if (!userProgress.levelProgress.get(domain)) {
      userProgress.levelProgress.set(domain, { beginner: 0, intermediate: 0, advanced: 0 });
    }

    // Update levelProgress
    userProgress.levelProgress.get(domain)[level] = progressPercentage;

    // Save progress
    await userProgress.save();
    console.log('POST /resources/:resourceId/complete - Saved userProgress:', userProgress);

    // Prepare response
    const responseCompletedResources = {};
    userProgress.completedResources.forEach(id => {
      responseCompletedResources[id.toString()] = true;
    });
    userProgress.completedSubResources.forEach(id => {
      responseCompletedResources[id.toString()] = true;
    });

    res.json({
      completedResources: responseCompletedResources,
      levelProgress: Object.fromEntries(userProgress.levelProgress), // Convert Map to object for JSON
    });
  } catch (error) {
    console.error('POST /resources/:resourceId/complete - Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single detailed resource by ID
router.get('/detailed-resources/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid detailed resource ID' });

    const detailedResource = await DetailedResource.findById(id).lean();
    if (!detailedResource) return res.status(404).json({ error: 'Detailed resource not found' });

    res.json(detailedResource);
  } catch (error) {
    console.error('Error fetching detailed resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a detailed resource (admin-only)
router.patch('/detailed-resources/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid detailed resource ID' });

    const sanitizedUpdates = {
      ...req.body,
      title: sanitize(req.body.title || ''),
      description: sanitize(req.body.description || ''),
      url: sanitize(req.body.url || '', { allowedTags: [] }),
    };
    const allowedUpdates = ['domain', 'level', 'type', 'title', 'description', 'url', 'estimatedTime', 'resourceId', 'unlockRequirement'];
    const updateKeys = Object.keys(sanitizedUpdates);
    const isValidOperation = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidOperation || updateKeys.length === 0) {
      return res.status(400).json({ error: 'Invalid or no updates provided' });
    }

    const detailedResource = await DetailedResource.findById(id);
    if (!detailedResource) return res.status(404).json({ error: 'Detailed resource not found' });

    const errors = validateDetailedResource({
      ...sanitizedUpdates,
      title: sanitizedUpdates.title || detailedResource.title,
      description: sanitizedUpdates.description || detailedResource.description,
      estimatedTime: sanitizedUpdates.estimatedTime || detailedResource.estimatedTime,
      url: sanitizedUpdates.url || detailedResource.url,
      resourceId: sanitizedUpdates.resourceId || detailedResource.resourceId,
      domain: sanitizedUpdates.domain || detailedResource.domain,
      level: sanitizedUpdates.level || detailedResource.level,
    });
    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });

    // Validate resourceId existence
    if (sanitizedUpdates.resourceId) {
      const resource = await Resource.findById(sanitizedUpdates.resourceId);
      if (!resource) return res.status(400).json({ error: 'Invalid resourceId' });
      if (sanitizedUpdates.domain && sanitizedUpdates.level && (resource.domain !== sanitizedUpdates.domain || resource.level !== sanitizedUpdates.level)) {
        return res.status(400).json({ error: 'Domain and level must match the parent resource' });
      }
    }

    // Validate unlockRequirement existence
    if (sanitizedUpdates.unlockRequirement) {
      const exists = await DetailedResource.findById(sanitizedUpdates.unlockRequirement);
      if (!exists || (sanitizedUpdates.resourceId && exists.resourceId.toString() !== sanitizedUpdates.resourceId.toString())) {
        return res.status(400).json({ error: 'Invalid unlockRequirement ID or does not belong to the same resource' });
      }
    }

    const updatedResource = await DetailedResource.findByIdAndUpdate(id, sanitizedUpdates, { new: true, runValidators: true }).lean();
    res.json(updatedResource);
  } catch (error) {
    console.error('Error updating detailed resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a detailed resource (admin-only)
router.delete('/detailed-resources/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: 'Invalid detailed resource ID' });

    const detailedResource = await DetailedResource.findById(id);
    if (!detailedResource) return res.status(404).json({ error: 'Detailed resource not found' });

    // Update dependent sub-resources
    await DetailedResource.updateMany(
      { unlockRequirement: id },
      { $set: { unlockRequirement: null } }
    );

    // Remove from user progress
    await UserProgress.updateMany(
      { completedSubResources: id },
      { $pull: { completedSubResources: id } }
    );

    await detailedResource.deleteOne();
    res.json({ message: 'Detailed resource deleted' });
  } catch (error) {
    console.error('Error deleting detailed resource:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark sub-resource as completed
router.post('/detailed-resources/:id/complete', authenticateToken, async (req, res) => {
  try {
    const subResourceId = req.params.id;
    const userId = req.user.id; // Use _id from JWT

    if (!isValidObjectId(subResourceId)) return res.status(400).json({ error: 'Invalid sub-resource ID' });

    const subResource = await DetailedResource.findById(subResourceId);
    if (!subResource) return res.status(404).json({ error: 'Sub-resource not found' });

    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({ userId, completedSubResources: [], completedResources: [] });
    }

    // Check if sub-resource is already completed
    if (progress.completedSubResources.includes(subResourceId)) {
      return res.status(400).json({ error: 'Sub-resource already completed' });
    }

    // Check if the sub-resource is unlocked
    if (subResource.unlockRequirement) {
      if (!progress.completedSubResources.includes(subResource.unlockRequirement.toString())) {
        return res.status(403).json({ error: 'Sub-resource is locked; complete the previous sub-resource first' });
      }
    }

    // Check if parent resource is unlocked
    const resource = await Resource.findById(subResource.resourceId);
    if (resource.unlockRequirement) {
      const requiredResource = await Resource.findById(resource.unlockRequirement) || await DetailedResource.findById(resource.unlockRequirement);
      if (requiredResource && !progress.completedSubResources.includes(resource.unlockRequirement.toString()) && !progress.completedResources.includes(resource.unlockRequirement.toString())) {
        return res.status(403).json({ error: 'Parent resource is locked; complete the required resource first' });
      }
    }

    progress.completedSubResources.push(subResourceId);
    await progress.save();

    // Check if all sub-resources for the parent resource are completed
    const resourceId = subResource.resourceId;
    const subResources = await DetailedResource.find({ resourceId });
    const completedSubResources = progress.completedSubResources.map(String);
    const allCompleted = subResources.every((sr) => completedSubResources.includes(sr._id.toString()));

    if (allCompleted && !progress.completedResources.includes(resourceId.toString())) {
      progress.completedResources.push(resourceId);
      await progress.save();
    }

    res.json({ message: 'Sub-resource marked as completed' });
  } catch (error) {
    console.error('Error marking sub-resource as completed:', error);
    res.status(500).json({ error: 'Failed to mark sub-resource as completed' });
  }
});

// Get user progress
router.get('/user-progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Use _id from JWT
    const progress = await UserProgress.findOne({ userId }).lean();
    res.json(progress || { userId, completedSubResources: [], completedResources: [] });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

// Get current resource card
router.get('/current-resource', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Use _id from JWT
    const progress = await UserProgress.findOne({ userId }).lean();
    const completedResources = progress?.completedSubResources ? progress.completedResources.map(String) : [];
    const completedSubResources = progress?.completedSubResources ? progress.completedSubResources.map(String) : [];

    // Find the first resource that is unlocked and not completed
    const currentResource = await Resource.findOne({
      $or: [
        { unlockRequirement: null },
        { unlockRequirement: { $in: completedSubResources.concat(completedResources) } },
      ],
      _id: { $nin: completedResources },
    })
      .sort({ createdAt: 1 })
      .lean();

    // Fallback to first resource if none are unlocked or all are completed
    if (!currentResource) {
      const fallbackResource = await Resource.findOne().sort({ createdAt: 1 }).lean();
      if (!fallbackResource) {
        return res.json({ resource: null, subResources: [] });
      }
      const subResources = await DetailedResource.find({ resourceId: fallbackResource._id }).sort({ createdAt: 1 }).lean();
      return res.json({ resource: fallbackResource, subResources });
    }

    const subResources = await DetailedResource.find({ resourceId: currentResource._id }).sort({ createdAt: 1 }).lean();
    res.json({ resource: currentResource, subResources });
  } catch (error) {
    console.error('Error fetching current resource:', error);
    res.status(500).json({ error: 'Failed to fetch current resource' });
  }
});

// File upload (admin-only)
router.post('/upload', authenticateToken, isAdmin, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;