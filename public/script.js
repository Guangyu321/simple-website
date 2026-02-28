// 复用根目录下的脚本逻辑
//@ts-nocheck
// 直接引入上一级的 script.js 内容以保持单一逻辑来源
// 在实际项目中可以使用打包工具进行构建，这里简化为引用同名逻辑

document.addEventListener("DOMContentLoaded", () => {
  // “了解更多”按钮：跳转到单独的关于页面
  const learnMoreBtn = document.getElementById("learnMoreBtn");
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", () => {
      window.location.href = "about.html";
    });
  }

  // Blog / Markdown 展示（从 blog 文件夹读取）
  const previewContent = document.getElementById("blogPreviewContent");
  const blogList = document.getElementById("blogList");
  const servicesSection = document.getElementById("services");

  const BLOG_INDEX_URL = "/api/blogs";
  let currentMarkdownText = "";
  let blogIndex = [];

  function renderMarkdown(text) {
    if (!previewContent) return;
    if (!text.trim()) {
      previewContent.textContent = "从右侧列表选择一篇文章后，这里会显示渲染后的内容。";
      previewContent.classList.add("empty-state");
      return;
    }
    if (window.marked) {
      previewContent.innerHTML = window.marked.parse(text);
    } else {
      previewContent.textContent = text;
    }
    previewContent.classList.remove("empty-state");
  }

  function renderBlogList(list) {
    if (!blogList) return;
    blogIndex = Array.isArray(list) ? list : [];
    blogList.innerHTML = "";

    if (!blogIndex.length) {
      const li = document.createElement("li");
      li.textContent =
        "暂时还没有发现博客文章。请在 blog 文件夹中添加 Markdown 文件（.md / .markdown），然后刷新页面。";
      li.className = "blog-list-empty";
      blogList.appendChild(li);
      return;
    }

    blogIndex.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "blog-list-item";

      const btn = document.createElement("button");
      btn.className = "blog-list-title";
      btn.dataset.index = String(index);
      btn.innerHTML = `
        <span>${item.title || "未命名文章"}</span>
        <span class="blog-list-meta">${item.date || ""}</span>
      `;

      li.appendChild(btn);
      blogList.appendChild(li);
    });
  }

  async function loadBlogIndex() {
    if (!blogList) return;
    blogList.innerHTML = "";
    try {
      const res = await fetch(`${BLOG_INDEX_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error("加载失败");
      const data = await res.json();
      renderBlogList(data);
    } catch (error) {
      const li = document.createElement("li");
      li.textContent =
        "暂时无法加载博客列表，请确认服务器已启动（npm start），并已在 blog 文件夹中添加 Markdown 文件。";
      li.className = "blog-list-empty";
      blogList.appendChild(li);
    }
  }

  if (blogList) {
    blogList.addEventListener("click", (event) => {
      const target = event.target;
      const btn = target.closest && target.closest(".blog-list-title");
      if (!btn) return;
      const index = Number(btn.dataset.index);
      if (Number.isNaN(index)) return;

      const item = blogIndex[index];
      if (!item) return;

      const id = item.id || item.filename;
      if (!id) return;

      fetch(`${BLOG_INDEX_URL}/${encodeURIComponent(id)}/content?t=${Date.now()}`)
        .then((res) => res.text())
        .then((text) => {
          currentMarkdownText = text;
          renderMarkdown(currentMarkdownText);
        })
        .catch(() => {
          alert("无法加载该文章，请检查 blog 文件夹中的文件是否存在。");
        });

      if (servicesSection) {
        const top = servicesSection.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }

  // 初次加载时渲染空预览并加载博客列表
  renderMarkdown("");
  loadBlogIndex();
});

