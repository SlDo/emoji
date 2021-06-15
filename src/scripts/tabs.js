const tabs = document.querySelectorAll("[data-emoji-section='tab']");
const tabsIcon = document.querySelectorAll("[data-action='tabIcon']");
const allEmojiButton = document.querySelector('[data-tab="all"]');
const recentlyEmojiButton = document.querySelector('[data-tab="recently"]');

const setActiveIcon = (tabIndex) => {
  tabsIcon.forEach((tab) => tab.classList.remove("active"));
  tabsIcon[tabIndex].classList.add("active");
};

const setTab = (tabIndex) => {
  tabs.forEach((tab) => tab.classList.add("hidden"));
  tabs[tabIndex].classList.remove("hidden");
  setActiveIcon(tabIndex);
};

setTab(0);

allEmojiButton.addEventListener("click", () => {
  setTab(0);
});

recentlyEmojiButton.addEventListener("click", () => {
  setTab(1);
});
