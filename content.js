/**
 * @ Author: firstfu
 * @ Create Time: 2025-01-08
 * @ Description: 自動移除掘金網站遮罩層的內容腳本（僅限台灣地區使用）
 */

// 檢查用戶是否來自台灣
async function checkIfFromTaiwan() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data.country_code === "TW";
  } catch (error) {
    console.error("無法檢查地理位置:", error);
    return false;
  }
}

// 主要功能初始化
async function initialize() {
  const isFromTaiwan = await checkIfFromTaiwan();

  if (!isFromTaiwan) {
    console.log("此擴充功能僅供台灣地區使用");
    return;
  }

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
}

initialize();
