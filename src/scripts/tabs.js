const tabs = document.querySelectorAll("[data-emoji-section='tab']");
const tabsContent = document.querySelector('.tabs__content');
const allEmojiButton = document.querySelector('[data-tab="all"]');
const recentlyEmojiButton = document.querySelector('[data-tab="recently"]');

const hasProperty = (object, property) => Object.prototype.hasOwnProperty.bind(object, property);

const createTabs = (settings) => {
  let activeTab = null;

  const setTab = (tab) => {
    activeTab = tab;
    tabsContent.style.transform = `translateX(-${settings[tab].tabContent.offsetLeft}px)`;

    Object.keys(settings).forEach((key) => {
      const tabSetting = settings[key];
      const hasActiveButtonClass = hasProperty(tabSetting, 'activeButtonClass');

      if (hasActiveButtonClass) {
        if (tab === key) {
          tabSetting.button.classList.add('active');
        } else tabSetting.button.classList.remove('active');
      }
    });
  };

  Object.keys(settings).forEach((key) => {
    const tabSetting = settings[key];

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Tab') {
        if (tabSetting.tabContent.contains(document.activeElement) && key !== activeTab) setTab(key);
      }
    });

    if (hasProperty(tabSetting, 'button')) {
      tabSetting.button.addEventListener('click', () => setTab(key));
    }

    if (hasProperty(tabSetting, 'default') && tabSetting.default === true) {
      setTab(key);
    }
  });
};

createTabs({
  1: {
    tabContent: tabs[0],
    button: allEmojiButton,
    activeButtonClass: 'active',
    default: true,
  },
  2: {
    tabContent: tabs[1],
    activeButtonClass: 'active',
    button: recentlyEmojiButton,
  },
});
