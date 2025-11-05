// backend/src/controllers/categoryController.js
import prisma from '../prisma/client.js';

// READ OPERATIONS
// Get all categories
export async function getAllCategories(req, res) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: true, // optional - you can remove if you only want names
      },
      orderBy: { name: 'asc' },
    });

    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

// Get single category by ID (with related posts)
export async function getCategoryById(req, res) {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch category' });
  }
}

// CREATE OPERATIONS
// Create a new category (admin-only)
export async function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategory) {
      return res.status(409).json({ error: 'Category already exists' });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
}

// UPDATE OPERATION
export async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });

    return res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update category' });
  }
}

// DELETE OPERATION
export async function deleteCategory(req, res) {
  const { id } = req.params;

  try {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await prisma.category.delete({ where: { id } });

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
}
