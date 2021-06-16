const tabs = document.querySelectorAll("[data-emoji-section='tab']");
const allEmojiButton = document.querySelector('[data-tab="all"]');
const recentlyEmojiButton = document.querySelector('[data-tab="recently"]');

const hasProperty = (object, property) => Object.prototype.hasOwnProperty.bind(object, property);

const createTabs = (settings) => {
  const setTab = (tab) => {
    Object.keys(settings).forEach((key) => {
      const tabSetting = settings[key];
      const hasActiveButtonClass = hasProperty(tabSetting, 'activeButtonClass');

      if (hasProperty(tabSetting, 'tabContent')) {
        if (tab === key) {
          if (hasActiveButtonClass) tabSetting.button.classList.add('active');
          tabSetting.tabContent.classList.remove('inactive-tab');
        } else {
          if (hasActiveButtonClass) tabSetting.button.classList.remove('active');
          tabSetting.tabContent.classList.add('inactive-tab');
        }
      }
    });
  };

  Object.keys(settings).forEach((key) => {
    const tabSetting = settings[key];

    if (hasProperty(tabSetting, 'tabContent')) {
      tabSetting.tabContent.classList.add('inactive-tab');
    }

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
