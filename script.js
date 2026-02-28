// “了解更多”按钮：点击后滚动到“关于我”区域
document.getElementById("learnMoreBtn").addEventListener("click", () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  });