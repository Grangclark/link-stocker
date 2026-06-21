// popup.js (完全復活・修正版)

document.addEventListener("DOMContentLoaded", () => {
  // ポップアップが開いた瞬間にリストを描画する（これがいま消えていました！）
  renderLinks();

  // 「一括で全部開く！🚀」ボタンのクリックイベント
  document.getElementById("open-all-btn").addEventListener("click", () => {
    chrome.storage.local.get(["stockedLinks"], (result) => {
      const links = result.stockedLinks || [];
      if (links.length === 0) return;

      // すべてのURLを新規タブとして裏側で同時に開く
      links.forEach(url => {
        chrome.tabs.create({ url: url, active: false });
      });

      // 開き終わったらストッカーを空にする
      chrome.storage.local.set({ stockedLinks: [] }, () => {
        renderLinks(); 
      });
    });
  });
});

// リストを描画する関数
function renderLinks() {
  chrome.storage.local.get(["stockedLinks"], (result) => {
    const links = result.stockedLinks || [];
    const listContainer = document.getElementById("link-list");
    const openAllBtn = document.getElementById("open-all-btn");
    const emptyMessage = document.getElementById("empty-message");

    listContainer.innerHTML = "";

    if (links.length === 0) {
      openAllBtn.disabled = true;
      openAllBtn.innerText = "一括で全部開く！🚀";
      emptyMessage.style.display = "block";
      return;
    }

    openAllBtn.disabled = false;
    openAllBtn.innerText = `一括で全部開く！🚀 (${links.length})`;
    emptyMessage.style.display = "none";

    links.forEach((url, index) => {
      const li = document.createElement("li");

      const linkContainer = document.createElement("div");
      linkContainer.className = "link-container";

      // 👑 Google公式ファビコンAPI（セキュリティ制限を100%回避）
      const img = document.createElement("img");
      img.className = "favicon-img";
      img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}&sz=32`;
      img.onerror = () => { img.src = "chrome://favicon/"; };

      const a = document.createElement("a");
      a.href = url;
      a.className = "link-text";
      a.innerText = url;
      a.target = "_blank";
      a.addEventListener("click", () => {
        deleteLink(index);
      });

      linkContainer.appendChild(img);
      linkContainer.appendChild(a);

      const span = document.createElement("span");
      span.className = "delete-btn";
      span.innerText = "×";
      span.addEventListener("click", () => {
        deleteLink(index);
      });

      li.appendChild(linkContainer);
      li.appendChild(span);
      listContainer.appendChild(li);
    });
  });
}

// 特定のリンクをリストから削除する関数（これも消えてしまっていました！）
function deleteLink(index) {
  chrome.storage.local.get(["stockedLinks"], (result) => {
    let links = result.stockedLinks || [];
    links.splice(index, 1);

    chrome.storage.local.set({ stockedLinks: links }, () => {
      renderLinks();
    });
  });
}