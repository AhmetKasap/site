import Blog from "../database/blog.model.js";

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json(blogs);
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  res.status(200).json(blog);
};

export const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.create({ title, content });
  res.status(201).json(blog);
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const blog = await Blog.findByIdAndUpdate(id, { title, content }, { new: true });
  res.status(200).json(blog);
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.status(200).json({ message: "Blog deleted successfully" });
};





