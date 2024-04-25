const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const { MongoClient, ObjectId } = require('mongodb');
const { GridFSBucket } = require('mongodb');

// Assuming you have a MongoDB connection string
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let bucket;

// Function to initialize the bucket and routes
const initializeBucketAndRoutes = async () => {
  try {
    await client.connect();
    bucket = new GridFSBucket(client.db(), { bucketName: 'uploads' });

    // Routes for posts
    router.post('/create', authMiddleware, postController.createPost);
    router.get('/all', postController.getAllPosts);
    router.put('/like/:postId', authMiddleware, postController.likePost);
    router.post('/comment/:postId', authMiddleware, postController.commentOnPost);

    // Route to serve images
    router.get('/images/:fileId', async (req, res) => {
      const { fileId } = req.params;
      try {
        const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
        downloadStream.on('error', (error) => {
          console.error(`Error serving image: ${fileId}`, error);
          res.status(500).send('Server error');
        });
        downloadStream.pipe(res);
      } catch (error) {
        console.error(`Error serving image: ${fileId}`, error);
        res.status(500).send('Server error');
      }
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error appropriately, e.g., by setting up a fallback route or middleware
  }
};

// Call the function to initialize the bucket and routes
initializeBucketAndRoutes();

module.exports = router;