import browser from "webextension-polyfill";

console.log("Background script loaded");

browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

browser.tabs.onCreated.addListener((tab) => {
  console.log("New tab created:", tab.id);
});

browser.tabs.onRemoved.addListener((tabId) => {
  console.log("Tab closed:", tabId);
});

export {};
