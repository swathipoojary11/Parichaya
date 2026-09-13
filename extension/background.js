// Parichaya — Interview Coach
// Background service worker: keeps a live WPM readout on the toolbar badge
// even while the popup is the active focus, and clears it on idle.

const ZONE_COLORS = {
  idle: "#8e94a3",
  good: "#34b08c",
  warn: "#e8604a",
};

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "WPM_UPDATE") return;

  const { wpm, zone } = message;
  chrome.action.setBadgeText({ text: wpm > 0 ? String(wpm) : "" });
  chrome.action.setBadgeBackgroundColor({ color: ZONE_COLORS[zone] || ZONE_COLORS.idle });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "" });
});
