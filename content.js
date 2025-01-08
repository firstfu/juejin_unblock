/**
 * @ Author: 1891
 * @ Create Time: 2024-03-20
 * @ Description: 自動移除掘金網站遮罩層的內容腳本
 */

// 監聽 DOM 變化
const observer = new MutationObserver(() => {
  removeOverlay();
});

// 配置觀察選項
const config = {
  childList: true,
  subtree: true,
};

// 移除遮罩層函數
function removeOverlay() {
  // 移除手機綁定彈窗
  const phoneModals = document.querySelectorAll(".bind-phone-number-modal-box");
  phoneModals.forEach(modal => {
    if (modal) {
      modal.remove();
    }
  });

  // 移除登入彈窗
  const loginModals = document.querySelectorAll(".login-popover");
  loginModals.forEach(modal => {
    if (modal) {
      modal.remove();
    }
  });

  // 移除其他可能的遮罩層
  const masks = document.querySelectorAll(".modal-mask");
  masks.forEach(mask => {
    if (mask) {
      mask.remove();
    }
  });

  // 移除 body 的 overflow: hidden
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
}

// 初始執行
removeOverlay();

// 開始觀察整個文檔
observer.observe(document.documentElement, config);

// 在頁面卸載時斷開觀察器連接
window.addEventListener("unload", () => {
  observer.disconnect();
});
