const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 项目根目录：src 的上一级
const ROOT_DIR = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const BLOG_DIR = path.join(ROOT_DIR, "blog");

// 静态资源（HTML/CSS/JS）从 public 提供
app.use(express.static(PUBLIC_DIR));
// blog 目录中的原始 Markdown 文件也作为静态资源暴露（仅用于调试/直接访问）
app.use("/blog", express.static(BLOG_DIR));

// 首页路由
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// 读取 blog 目录下的所有 Markdown 文件，生成列表
app.get("/api/blogs", (req, res) => {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      return res.json([]);
    }

    const files = fs
      .readdirSync(BLOG_DIR)
      .filter((name) => /\.(md|markdown)$/i.test(name))
      .sort();

    const posts = files.map((filename) => {
      const fullPath = path.join(BLOG_DIR, filename);
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split(/\r?\n/);

      let title = "";
      for (const line of lines) {
        const match = line.match(/^#\s+(.+)/);
        if (match) {
          title = match[1].trim();
          break;
        }
      }

      if (!title) {
        title = path.basename(filename, path.extname(filename));
      }

      const stat = fs.statSync(fullPath);

      return {
        id: filename,
        filename,
        title,
        date: stat.mtime.toISOString(),
      };
    });

    res.json(posts);
  } catch (error) {
    console.error("读取博客列表失败：", error);
    res.status(500).json({ error: "无法读取博客列表" });
  }
});

// 根据文件名读取单篇文章内容
app.get("/api/blogs/:id/content", (req, res) => {
  try {
    const id = req.params.id;
    const safeName = path.basename(id); // 防止路径穿越
    const fullPath = path.join(BLOG_DIR, safeName);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).send("Not Found");
    }

    const content = fs.readFileSync(fullPath, "utf-8");
    res.type("text/markdown").send(content);
  } catch (error) {
    console.error("读取博客内容失败：", error);
    res.status(500).send("读取博客内容失败");
  }
});

app.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});

