//controllers/postConroller
const Post = require('../models/Post');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const crypto = require('crypto');

// Configure multer storage
const storage = new GridFsStorage({
 url: process.env.MONGODB_URI, // Ensure this is correctly set
 file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
 }
});

const upload = multer({ storage });

// Create a new post
exports.createPost = [
  upload.single('image'),
  async (req, res) => {
    console.log('req.file:', req.file);
    const { title, content } = req.body;
    const userId = req.user.id;
    const image = req.file ? req.file.id : ''; // Get the _id of the uploaded file

    try {
      const newPost = new Post({
        title,
        content,
        user: userId,
        image, // Save the file _id
      });

      const post = await newPost.save();

      res.json({ ...post._doc, image: post.image._id }); // Return the _id of the saved file
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  },
];
// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', ['name', 'email']);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Like a post
exports.likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post is already liked by the user
    if (post.likes.includes(userId)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.push(userId);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
