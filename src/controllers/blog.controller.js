import Blog from "../database/blog.model.js";
import sanitizeHtml from "sanitize-html";

export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Her sayfada 6 blog gösterelim
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("blog", { 
      title: "Blog",
      path: "/blog",
      blogs,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    res.status(500).render("error", { title: "Hata", path: "/error", error: "Blog listesi alınamadı" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    // API isteği için JSON yanıtı
    if (req.headers.accept?.includes('application/json')) {
      if (!blog) {
        return res.status(404).json({ message: "Blog bulunamadı" });
      }
      return res.json(blog);
    }
    
    // Sayfa görüntüleme için render
    if (!blog) {
      return res.status(404).render("error", { 
        title: "Hata", 
        path: "/error", 
        error: "Blog bulunamadı" 
      });
    }

    res.render("blog-detay", { 
      title: blog.title,
      path: "/blog",
      blog
    });
  } catch (error) {
    console.error("Get blog by id error:", error);
    if (req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ message: "Blog detayı alınamadı" });
    }
    res.status(500).render("error", { 
      title: "Hata", 
      path: "/error", 
      error: "Blog detayı alınamadı" 
    });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // HTML içeriğini temizle
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'iframe' ],
      allowedAttributes: {
        'a': [ 'href', 'name', 'target' ],
        'img': [ 'src', 'alt', 'title', 'width', 'height' ],
        'iframe': [ 'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen' ],
        '*': [ 'class', 'id', 'style' ]
      },
      allowedStyles: {
        '*': {
          'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
          'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
          'font-size': [/^\d+(?:px|em|%)$/],
          'text-decoration': [/^underline$/],
          'font-weight': [/^bold$/],
          'font-style': [/^italic$/],
          'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/]
        }
      }
    });

    const blog = await Blog.create({ title, content: sanitizedContent });
    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Blog oluşturma hatası" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // HTML içeriğini temizle
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'iframe' ],
      allowedAttributes: {
        'a': [ 'href', 'name', 'target' ],
        'img': [ 'src', 'alt', 'title', 'width', 'height' ],
        'iframe': [ 'src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen' ],
        '*': [ 'class', 'id', 'style' ]
      },
      allowedStyles: {
        '*': {
          'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
          'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
          'font-size': [/^\d+(?:px|em|%)$/],
          'text-decoration': [/^underline$/],
          'font-weight': [/^bold$/],
          'font-style': [/^italic$/],
          'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/]
        }
      }
    });

    const blog = await Blog.findByIdAndUpdate(id, { title, content: sanitizedContent }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Blog güncelleme hatası" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }
    res.status(200).json({ message: "Blog başarıyla silindi" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Blog silme hatası" });
  }
};





