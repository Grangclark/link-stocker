// popup.js

document.addEventListener("DOMContentLoaded", () => {
  renderLinks();

  // 「一括で全部開く！🚀」ボタンのクリックイベント
  document.getElementById("open-all-btn").addEventListener("click", () => {
    chrome.storage.local.get(["stockedLinks"], (result) => {
      const links = result.stockedLinks || [];
      if (links.length === 0) return;

      // ★裏技：すべてのURLをループで回し、新規タブとして裏側で同時に開く！
      links.forEach(url => {
        chrome.tabs.create({ url: url, active: false }); // active: false で現在の画面を維持したまま裏で開く
      });

      // 開き終わったらストッカーを綺麗さっぱり空にする
      chrome.storage.local.set({ stockedLinks: [] }, () => {
        renderLinks(); // 画面をリセット
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

    // リンクが空っぽならボタンを無効化してメッセージを出す
    if (links.length === 0) {
      openAllBtn.disabled = true;
      openAllBtn.innerText = "一括で全部開く！🚀";
      emptyMessage.style.display = "block";
      return;
    }

    // リンクがある場合はボタンを有効化
    openAllBtn.disabled = false;
    openAllBtn.innerText = `一括で全部開く！🚀 (${links.length})`;
    emptyMessage.style.display = "none";

    // 配列をループして画面にリストを出力
    links.forEach((url, index) => {
      const li = document.createElement("li");

      // リンク部分（クリックしたら単体でも開ける仕様）
      const a = document.createElement("a");
      a.href = url;
      a.className = "link-text";
      a.innerText = url;
      a.target = "_blank";
      // 単体で開いた時も、そのリンクはストッカーから自動削除する親切設計
      a.addEventListener("click", () => {
        deleteLink(index);
      });

      // 個別削除用の「×」ボタン
      const span = document.createElement("span");
      span.className = "delete-btn";
      span.innerText = "×";
      span.addEventListener("click", () => {
        deleteLink(index);
      });

      li.appendChild(a);
      li.appendChild(span);
      listContainer.appendChild(li);
    });
  });
}

// 特定のリンクをリストから削除する関数
function deleteLink(index) {
  chrome.storage.local.get(["stockedLinks"], (result) => {
    let links = result.stockedLinks || [];
    links.splice(index, 1); // 指定されたインデックスの要素を1つ削除

    chrome.storage.local.set({ stockedLinks: links }, () => {
      renderLinks(); // 再描画
    });
  });
}