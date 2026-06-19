// background.js

// 1. 拡張機能インストール時に右クリックメニューを登録（既存）
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "stock-link",
    title: "ストッカーに追加 📥",
    contexts: ["link"]
  });
  console.log("LinkStocker: 右クリックメニューが正常に登録されました。");
});

// 2. ★【今日の一撃】クリックされたらURLをストレージに保存する
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "stock-link" && info.linkUrl) {
    const targetUrl = info.linkUrl;

    // ストレージから現在のリストを取得
    chrome.storage.local.get(["stockedLinks"], (result) => {
      let links = result.stockedLinks || [];

      // すでに同じURLが登録されていないかチェック（重複排除）
      if (!links.includes(targetUrl)) {
        links.push(targetUrl); // リストの末尾に追加

        // ストレージを更新
        chrome.storage.local.set({ stockedLinks: links }, () => {
          console.log("リンクをストックしました:", targetUrl);
        });
      } else {
        console.log("このリンクはすでにストックされています:", targetUrl);
      }
    });
  }
});