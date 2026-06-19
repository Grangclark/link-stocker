// background.js

// 1. 拡張機能がインストール、または更新された時に実行されるイベント
chrome.runtime.onInstalled.addListener(() => {
  // 右クリックメニュー（コンテキストメニュー）を登録
  chrome.contextMenus.create({
    id: "stock-link",               // このメニューの固有ID（プログラム内で識別用）
    title: "ストッカーに追加 📥",    // 右クリックした時に画面に出る文字
    contexts: ["link"]              // ★超重要：リンクの上で右クリックした時だけ出す！
  });
  console.log("LinkStocker: 右クリックメニューが正常に登録されました。");
});

// 2. 右クリックメニューが実際にクリックされた時のイベント（ログを出すだけ）
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "stock-link") {
    // info.linkUrl の中に、右クリックしたリンクのURLが自動で入ってきます
    console.log("リンクを検知しました！ターゲットURL:", info.linkUrl);
  }
});