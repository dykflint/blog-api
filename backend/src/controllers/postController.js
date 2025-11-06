// backend/src/controllers/postController.js
import prisma from '../prisma/client.js';

// GET LOGIC
// Get all published posts
export async function getAllPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [{ published: true }, { published: false }],
      },
      include: { author: true, category: true, comments: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

// Get a single post by ID (with author, category and comments)
export async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, category: true, comments: true },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
}

// POST LOGIC
// Create a post
export async function createPost(req, res) {
  try {
    const { title, content, categoryId, published, excerpt } = req.body;

    // The authorId now comes fomr the logged-in user's JWT
    const authorId = req.user.userId;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Slug for the post title
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    // Create the post in the database
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published: published ?? false, // default to false if undefined
        author: { connect: { id: authorId } },
        category: categoryId ? { connect: { id: categoryId } } : undefined,
      },
      include: { author: true, category: true },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create post' });
  }
}

// Update a post
export async function updatePost(req, res) {
  const { id } = req.params;
  const { title, content, excerpt, published, categoryId } = req.body;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        published,
        category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
      },
      include: { author: true, category: true },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update post' });
  }
}

// Delete a post
export async function deletePost(req, res) {
  const { id } = req.params;

  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await prisma.post.delete({ where: { id } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
}
