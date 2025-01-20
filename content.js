/**
 * @ Author: firstfu
 * @ Create Time: 2025-01-08
 * @ Description: 自動移除掘金網站遮罩層的內容腳本
 */

// 檢查用戶是否來自中國大陸
async function checkIfFromMainlandChina() {
  try {
    // 檢查緩存
    const cached = localStorage.getItem("userLocation");
    if (cached) {
      const { country_code, timestamp } = JSON.parse(cached);

      // 檢查緩存是否在30天內
      const now = Date.now();
      const cacheAge = now - timestamp;
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

      if (cacheAge < THIRTY_DAYS) {
        return country_code === "CN";
      }
    }

    // 如果沒有緩存或緩存已過期，則重新請求
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    // 儲存結果到緩存
    localStorage.setItem(
      "userLocation",
      JSON.stringify({
        country_code: data.country_code,
        timestamp: Date.now(),
      })
    );

    return data.country_code === "CN";
  } catch (error) {
    console.error("無法檢查地理位置:", error);
    return true; // 發生錯誤時預設為中國大陸
  }
}

// 主要功能初始化
async function initialize() {
  const isFromMainlandChina = await checkIfFromMainlandChina();

  if (isFromMainlandChina) {
    console.log("很抱歉，此擴充功能暫時無法在您所在的地區使用");
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
