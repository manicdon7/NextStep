const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");
const DetailedResource = require("../models/DetailedResource");
const Resource = require("../models/Resource");
const UserProgress = require("../models/UserProgress");
const { default: mongoose } = require("mongoose");
const router = express.Router();


const domains = [
  'cs', 'data', 'pm', 'content', 'engineering', 'psychology', 'writing',
  'design', 'art', 'finance', 'science', 'teaching', 'entrepreneur',
  'journalism', 'architecture', 'gamedesign', 'math', 'anthropology',
  'crafts', 'philosophy'
];
const levels = ['beginner', 'intermediate', 'advanced'];

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/user/progress/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/user/progress/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/users", authenticateToken, async (req, res) => {
  try {
    await User.deleteMany({});
    return res.status(200).json({ message: "All users deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/user/progress/:userId", authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/user/progress/:userId", authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findOneAndReplace(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User replaced successfully", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get('/profile/:email', authenticateToken, async (req, res) => {
  const email = req.params.email?.trim().toLowerCase();
  try {
    // Sanitize and validate email parameter
    console.log(`Fetching profile for email: ${email}`);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.warn(`Invalid email format received: ${req.params.email}`);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Use lean() for better performance and exclude sensitive fields
    const user = await User.findOne({ email })
      .select('-password -__v -sensitiveField1 -sensitiveField2')
      .lean();

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Successfully fetched profile for email: ${email}`);
    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(`Error fetching user profile for email: ${email}`, err);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.put('/profile/:email', authenticateToken, async (req, res) => {
  const email = req.params.email?.trim().toLowerCase();

  try {
    console.log(`PUT /profile/:email - Updating profile for email: ${email}`, {
      body: req.body,
      authorization: req.headers['authorization'],
      user: req.user,
    });

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.warn(`PUT /profile/:email - Invalid email format`);
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Validate user authentication and authorization
    if (!req.user || req.user.role !== "user") {
      console.warn(`PUT /profile/:email - No authenticated user or invalid role`);
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Check email ownership using user ID from token
    const userRecord = await User.findById(req.user.id).select('email').lean();
    if (!userRecord || userRecord.email.toLowerCase() !== email) {
      console.warn(`PUT /profile/:email - Unauthorized attempt by user ID ${req.user.id} to update ${email}`);
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    // Validate payload
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn(`PUT /profile/:email - Empty update payload`);
      return res.status(400).json({ success: false, message: 'No data provided to update' });
    }

    // Define allowed fields
    const allowedFields = [
      'name',
      'bio',
      'skills',
      'github',
      'socialLinks',
      'certifications',
      'education',
      'experience',
      'learningStreaks',
      'portfolio',
      'linkedin',
    ];

    // Sanitize and validate input
    const updatedData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (
          ['skills', 'socialLinks', 'certifications', 'education', 'experience'].includes(field) &&
          !Array.isArray(req.body[field])
        ) {
          console.warn(`PUT /profile/:email - Invalid format for ${field}: expected array`);
          return res.status(400).json({ success: false, message: `Invalid format for ${field}: expected array` });
        }
        updatedData[field] = req.body[field];
      }
    }

    if (Object.keys(updatedData).length === 0) {
      console.warn(`PUT /profile/:email - No valid fields to update`);
      return res.status(400).json({ success: false, message: 'No valid fields provided' });
    }

    console.log(`PUT /profile/:email - Sanitized updates:`, updatedData);

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(`PUT /profile/:email - Successfully updated profile`, updatedUser);
    res.json({ success: true, data: updatedUser });

  } catch (err) {
    console.error(`PUT /profile/:email - Error:`, err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});


router.get('/progress/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('GET /progress/:userId - userId:', userId);
    console.log('GET /progress/:userId - req.user:', req.user);

    // Validate userId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('GET /progress/:userId - Invalid userId format:', userId);
      return res.status(400).json({ error: 'Invalid userId format; must be a valid ObjectId' });
    }

    // Check authentication
    if (!req.user || !req.user.id || userId !== req.user.id) {
      console.log('GET /progress/:userId - Unauthorized:', { userId, reqUserId: req.user?.id });
      return res.status(req.user?.id ? 403 : 401).json({
        error: req.user?.id ? 'Unauthorized access' : 'Authentication failed; no user ID provided',
      });
    }

    // Fetch progress
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({
        userId: new mongoose.Types.ObjectId(userId),
        completedResources: [],
        completedSubResources: [],
        levelProgress: new Map(), // Initialize empty Map
      });
      await progress.save();
      console.log('GET /progress/:userId - Created new progress:', progress);
    }
    console.log('GET /progress/:userId - Progress found:', progress);

    // Ensure levelProgress is initialized
    if (!progress.levelProgress) {
      console.log('GET /progress/:userId - levelProgress is undefined; initializing');
      progress.levelProgress = new Map();
      await progress.save();
    }

    // Convert arrays to object for Tys
    const completedResources = {};
    progress.completedResources.forEach(id => {
      completedResources[id.toString()] = true;
    });
    progress.completedSubResources.forEach(id => {
      completedResources[id.toString()] = true;
    });

    // Return stored levelProgress or calculate if empty
    let levelProgress = Object.fromEntries(progress.levelProgress);
    if (Object.keys(levelProgress).length === 0) {
      console.log('GET /progress/:userId - Calculating levelProgress');
      // Fetch all resources and sub-resources in bulk
      const [allResources, allSubResources] = await Promise.all([
        Resource.find({ domain: { $in: domains }, level: { $in: levels } }).lean(),
        DetailedResource.find({}).lean(),
      ]);

      // Group resources by domain and level
      const resourceMap = {};
      domains.forEach(domain => {
        resourceMap[domain] = { beginner: [], intermediate: [], advanced: [] };
      });
      allResources.forEach(r => {
        if (resourceMap[r.domain]?.[r.level]) {
          resourceMap[r.domain][r.level].push(r._id.toString());
        }
      });

      // Map sub-resources to their parent resource
      allSubResources.forEach(sr => {
        const parentId = sr.resourceId.toString();
        const parent = allResources.find(r => r._id.toString() === parentId);
        if (parent && resourceMap[parent.domain]?.[parent.level]) {
          resourceMap[parent.domain][parent.level].push(sr._id.toString());
        }
      });

      // Calculate levelProgress
      levelProgress = {};
      domains.forEach(domain => {
        levelProgress[domain] = { beginner: 0, intermediate: 0, advanced: 0 };
        levels.forEach(level => {
          const totalItems = resourceMap[domain][level].length;
          if (totalItems === 0) return;

          const completedItems = resourceMap[domain][level].filter(id => completedResources[id]).length;
          levelProgress[domain][level] = Math.round((completedItems / totalItems) * 100);
        });
      });

      // Update progress with calculated levelProgress
      progress.levelProgress = new Map(Object.entries(levelProgress));
      await progress.save();
      console.log('GET /progress/:userId - Saved calculated levelProgress:', levelProgress);
    }

    console.log('GET /progress/:userId - Response:', { levelProgress, completedResources });

    res.json({ levelProgress, completedResources });
  } catch (error) {
    console.error('GET /progress/:userId - Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /progress/:userId (unchanged from optimized version)
router.post('/progress/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { completedResources: inputResources, resourceId } = req.body;
    console.log('POST /progress/:userId - Request:', { userId, reqUser: req.user, body: req.body });

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('POST /progress/:userId - Invalid userId format:', userId);
      return res.status(400).json({ error: 'Invalid userId format; must be a valid ObjectId' });
    }

    // Check authentication
    if (!req.user || !req.user.id || userId !== req.user.id) {
      console.log('POST /progress/:userId - Unauthorized:', { userId, reqUserId: req.user?.id });
      return res.status(req.user?.id ? 403 : 401).json({
        error: req.user?.id ? 'Unauthorized access' : 'Authentication failed; no user ID provided',
      });
    }

    // Validate input
    if (!inputResources) {
      console.log('POST /progress/:userId - Missing completedResources');
      return res.status(400).json({ error: 'Missing completedResources' });
    }

    // Fetch progress
    let progress = await UserProgress.findOne({ userId });
    if (!progress) {
      progress = new UserProgress({
        userId: mongoose.Types.ObjectId(userId),
        completedResources: [],
        completedSubResources: [],
        levelProgress: new Map(),
      });
      console.log('POST /progress/:userId - Created new progress:', progress);
    }

    // Ensure levelProgress is initialized
    if (!progress.levelProgress) {
      console.log('POST /progress/:userId - levelProgress is undefined; initializing');
      progress.levelProgress = new Map();
    }

    // Validate and categorize resource IDs
    const resourceIds = Object.keys(inputResources).filter(id => inputResources[id]);
    const validIds = resourceIds.filter(id => mongoose.Types.ObjectId.isValid(id));

    const [mainResources, subResources] = await Promise.all([
      Resource.find({ _id: { $in: validIds.map(id => mongoose.Types.ObjectId(id)) } }).lean(),
      DetailedResource.find({ _id: { $in: validIds.map(id => mongoose.Types.ObjectId(id)) } }).lean(),
    ]);

    const mainResourceIds = new Set(mainResources.map(r => r._id.toString()));
    const subResourceIds = new Set(subResources.map(r => r._id.toString()));

    const newMainResourceIds = validIds.filter(id => mainResourceIds.has(id)).map(id => mongoose.Types.ObjectId(id));
    const newSubResourceIds = validIds.filter(id => subResourceIds.has(id)).map(id => mongoose.Types.ObjectId(id));

    // Add new resource if provided
    if (resourceId && mongoose.Types.ObjectId.isValid(resourceId)) {
      const resourceObjectId = mongoose.Types.ObjectId(resourceId);
      const isMain = mainResourceIds.has(resourceId);
      const isSub = subResourceIds.has(resourceId);

      if (isSub && !progress.completedSubResources.includes(resourceObjectId)) {
        progress.completedSubResources.push(resourceObjectId);
        console.log('POST /progress/:userId - Added sub-resource:', resourceObjectId);
      } else if (isMain && !progress.completedResources.includes(resourceObjectId)) {
        progress.completedResources.push(resourceObjectId);
        console.log('POST /progress/:userId - Added main resource:', resourceObjectId);
      }
    }

    // Update progress
    progress.completedResources = newMainResourceIds;
    progress.completedSubResources = newSubResourceIds;

    // Update levelProgress for affected domains/levels
    const affectedResources = resourceId ? [resourceId] : validIds;
    const resourcesToUpdate = await Promise.all(
      affectedResources.map(async id => {
        const resource = mainResources.find(r => r._id.toString() === id) || subResources.find(r => r._id.toString() === id);
        return resource;
      })
    );

    const affectedDomains = new Set(resourcesToUpdate.filter(r => r).map(r => r.domain));
    const levelProgress = Object.fromEntries(progress.levelProgress);

    await Promise.all(
      Array.from(affectedDomains).map(async domain => {
        if (!levelProgress[domain]) {
          levelProgress[domain] = { beginner: 0, intermediate: 0, advanced: 0 };
        }

        await Promise.all(
          levels.map(async level => {
            const domainResources = mainResources.filter(r => r.domain === domain && r.level === level);
            const subResourceIds = domainResources.map(r => r._id);
            const domainSubResources = subResources.filter(sr => subResourceIds.some(id => id.equals(sr.resourceId)));

            const totalItems = domainResources.length + domainSubResources.length;
            if (totalItems === 0) return;

            const completedMain = domainResources.filter(r => progress.completedResources.some(id => id.equals(r._id))).length;
            const completedSub = domainSubResources.filter(r => progress.completedSubResources.some(id => id.equals(r._id))).length;
            const progressPercentage = Math.round(((completedMain + completedSub) / totalItems) * 100);

            levelProgress[domain][level] = progressPercentage;
            console.log(`POST /progress/:userId - Updated ${domain}/${level}: ${progressPercentage}%`);
          })
        );
      })
    );

    progress.levelProgress = new Map(Object.entries(levelProgress));
    await progress.save();
    console.log('POST /progress/:userId - Updated progress:', progress);

    // Prepare response
    const responseCompletedResources = {};
    progress.completedResources.forEach(id => {
      responseCompletedResources[id.toString()] = true;
    });
    progress.completedSubResources.forEach(id => {
      responseCompletedResources[id.toString()] = true;
    });

    res.json({ levelProgress, completedResources: responseCompletedResources });
  } catch (error) {
    console.error('POST /progress/:userId - Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;