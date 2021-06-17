![Emoji logo](https://github.com/SlDo/emoji/blob/main/logo.png?raw=true)

[Emoji Chat](https://sldo.github.io/emoji/)


## 🛸 Управление с клавиатуры

1. При сфокусированном чате нажать Tab
2. Стрелочка вверх - сфокусировать на Emoji
3. Tab при сфокусированной emoji-панели - переключение на следующий Emoji
4. Shift + Tab при сфокусированной emoji-панели - переключение на предыдущий Emoji

## ✨ Подстветка 

1. При введение адреса электронной почты, хэштега, упоминания (через @) или ссылки и нажатии пробела слово будет выделено синим цветом

## 🎊 Tabs.js 

```javascript
const tabs = document.querySelectorAll("[data-emoji-section='tab']");
const tabsContent = document.querySelector('.tabs__content');
const allEmojiButton = document.querySelector('[data-tab="all"]');
const recentlyEmojiButton = document.querySelector('[data-tab="recently"]');

// Проверяет, есть ли свойство в объекте
const hasProperty = (object, property) => Object.prototype.hasOwnProperty.bind(object, property);

// Создает функционал вкладок
const createTabs = (settings) => {
  let activeTab = null;

  // Устанавливает tab
  const setTab = (tab) => {
    activeTab = tab;
    tabsContent.style.transform = `translateX(-${settings[tab].tabContent.offsetLeft}px)`;

    // Обходим объект с tabs 
    Object.keys(settings).forEach((key) => {
      const tabSetting = settings[key];
      // Записываем в переменную boolean свойство (есть ли 'activeButtonClass' в tabSettings)
      const hasActiveButtonClass = hasProperty(tabSetting, 'activeButtonClass');

      if (hasActiveButtonClass) {
        if (tab === key) {
          // Добавляем иконка active class
          tabSetting.button.classList.add('active');
        } else tabSetting.button.classList.remove('active');
      }
    });
  };

  Object.keys(settings).forEach((key) => {
    const tabSetting = settings[key];

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Tab') {
        // Переключать вкладку, если элемент вкладки попал в фокус и ключ не равен активной вкладке
        if (tabSetting.tabContent.contains(document.activeElement) && key !== activeTab) setTab(key);
      }
    });

    if (hasProperty(tabSetting, 'button')) {
      // Добавляем обработчик на кнопку
      tabSetting.button.addEventListener('click', () => setTab(key));
    }
    
    // Если default === true, то устанавливаем активную вкладку на этот tab
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
```

## 🎊 Scroll.js 

```javascript
const scrollbar = document.querySelector("[data-scroll='container']");
const scrollLine = scrollbar.querySelector('.scrollbar__line');
const scrollContent = document.querySelector("[data-scroll='content']");

// Возвращает Height элемента
const getElementHeight = (elem) => ('getComputedStyle' in window
  ? parseFloat(
    window.getComputedStyle(elem, null).getPropertyValue('height'),
  )
  : parseFloat(elem.currentStyle.height));

// Получает translateY
const getTranslateY = (element) => {
  if (!('getComputedStyle' in window)) return;

  const computedStyle = getComputedStyle(element);
  const crossBrowserTransform = computedStyle.transform
    || computedStyle.webkitTransform
    || computedStyle.mozTransform;
  let parseMatrix = crossBrowserTransform.match(/^matrix3d\((.+)\)$/);

  if (parseMatrix) return parseFloat(parseMatrix[1].split(', ')[12]);

  parseMatrix = crossBrowserTransform.match(/^matrix\((.+)\)$/);

  return parseMatrix ? parseFloat(parseMatrix[1].split(', ')[5]) : 0;
};

// Добавляет функционал скроллинга
const addCustomScroll = (scrollbarElement, scrollLineElement, scrollContentElement) => {
  // Получаем высоту скроллбара
  let scrollbarHeight = getElementHeight(scrollbarElement);
  // Получаем высота контента скролла
  let scrollContentHeight = getElementHeight(scrollContentElement);

  // Высота области прокрутки
  let contentScrollHeight = scrollContentElement.scrollHeight;
  // Убираем невидимость скроллбара
  scrollbarElement.style.display = null;

  // Получаем соотношение (высота области видимости контента деленная на высоту области прокрутки контена)
  let ratio = scrollContentHeight / contentScrollHeight;
  // Высота ползунка - произведение высоты скроллбара на отношение
  let scrollLineHeight = scrollbarHeight * ratio;

  let startTransform = 0;
  let startY = 0;
  let limitY = scrollbarHeight - scrollLineHeight;

  let startTouchScrollY = 0;
  let startTouchContentY = 0;

  scrollLineElement.style.height = `${scrollLineHeight}px`;
  
  // Устанавливает видимость скроллбара. Если высота области прокрутки больше высоты области просмотра - делаем ползунок видимым, иначе скрываем
  const setScrollbarVisibility = () => {
    if (contentScrollHeight > Math.ceil(scrollContentHeight)) {
      scrollbarElement.style.display = null;
    } else {
      scrollbarElement.style.display = 'none';
    }
  };

  // Отслеживаем изменение контента внутри области прокрутки, если изменилось - меняем параметры 
  const mutationObserver = new MutationObserver(() => {
    scrollbarHeight = getElementHeight(scrollbarElement);
    scrollContentHeight = getElementHeight(scrollContentElement);

    // Высота с областью прокрутки
    contentScrollHeight = scrollContentElement.scrollHeight;

    scrollbarElement.style.display = null;

    ratio = scrollContentHeight / contentScrollHeight;
    scrollLineHeight = scrollbarHeight * ratio;

    startTransform = 0;
    startY = 0;
    limitY = scrollbarHeight - scrollLineHeight;

    startTouchScrollY = 0;
    startTouchContentY = 0;

    scrollLineElement.style.height = `${scrollLineHeight}px`;

    setScrollbarVisibility();
  });

  mutationObserver.observe(scrollContentElement, {
    childList: true,
    subtree: true,
  });

  setScrollbarVisibility();

  // Меняет transform у линии прокрутки и контента
  const scrollTransform = (scrollLineTransform, scrollContentTransform) => {
    scrollLineElement.style.transform = `translateY(${scrollLineTransform}px)`;
    scrollContentElement.style.transform = `translateY(${scrollContentTransform}px)`;
  };

  // Добавляем скроллинг к фокусируемому элементу
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Tab' && scrollContentElement.contains(document.activeElement) && document.activeElement.offsetTop < contentScrollHeight - scrollContentHeight) {
      scrollTransform(document.activeElement.offsetTop * ratio, -document.activeElement.offsetTop);
    }
  });
 
  const mouseMoveHandle = (e) => {
    e.preventDefault();
    
    const transform = startTransform + (e.clientY || e.touches[0].clientY) - startY;

    if (transform >= 0 && transform <= limitY) scrollTransform(transform, -transform / ratio);
  };

  const mouseDownHandle = (e) => {
    e.preventDefault();

    startTransform = getTranslateY(scrollLineElement);

    // Сбросить transition-duration на время скроллинга;
    scrollLineElement.style.transition = '0s';
    scrollContentElement.style.transition = '0s';

    startY = e.clientY || e.touches[0].clientY;

    document.addEventListener('mousemove', mouseMoveHandle);
    document.addEventListener('touchmove', mouseMoveHandle, { passive: true });
  };

  scrollLineElement.addEventListener('mousedown', mouseDownHandle);
  scrollLineElement.addEventListener('touchstart', mouseDownHandle, { passive: true });

  const removeListeners = () => {
    document.removeEventListener('mousemove', mouseMoveHandle);
    document.removeEventListener('touchmove', mouseMoveHandle, { passive: true });

    // Возвращает transition-duration
    scrollLineElement.style.transition = null;
    scrollContentElement.style.transition = null;
  };

  document.addEventListener('mouseup', removeListeners);
  document.addEventListener('touchend', removeListeners, { passive: true });

  const scrollbarWheel = (e) => {
    e.preventDefault();
    const currentTransform = getTranslateY(scrollLineElement);

    if (e.deltaY != null ? e.deltaY > 0 : e.touches[0].clientY < startTouchContentY) {
      const delta = currentTransform + scrollLineElement.scrollHeight / 20 / ratio;

      if (delta < limitY) {
        scrollTransform(delta, -(delta / ratio));
      } else {
        scrollTransform(limitY, (scrollContentElement.clientHeight - contentScrollHeight));
      }
    } else if (e.deltaY != null ? e.deltaY < 0 : e.touches[0].clientY > startTouchContentY) {
      const delta = currentTransform - scrollLineElement.clientHeight / 20 / ratio;

      if (delta > 0) {
        scrollTransform(delta, -(delta / ratio));
      } else {
        scrollTransform(0, 0);
      }
    }
  };

  const contentWheel = (e) => {
    e.preventDefault();

    const currentTransform = getTranslateY(scrollContentElement);

    if (e.deltaY != null ? e.deltaY > 0 : e.touches[0].clientY < startTouchContentY) {
      const delta = currentTransform - (contentScrollHeight / 25);

      if (-delta * ratio <= limitY) {
        scrollTransform(-delta * ratio, delta);
      } else {
        scrollTransform(limitY, scrollContentElement.clientHeight - contentScrollHeight);
      }
    } else if (e.deltaY != null ? e.deltaY < 0 : e.touches[0].clientY > startTouchContentY) {
      const delta = currentTransform + (contentScrollHeight / 25);

      if (-delta * ratio >= 0) {
        scrollTransform(-delta * ratio, delta);
      } else {
        scrollTransform(0, 0);
      }
    }
  };

  scrollbarElement.addEventListener('touchstart', (e) => startTouchScrollY = e.touches[0].clientY, { passive: true });
  scrollContentElement.addEventListener('touchstart', (e) => startTouchContentY = e.touches[0].clientY, { passive: true });

  scrollbarElement.addEventListener('wheel', scrollbarWheel, { passive: true });
  scrollbarElement.addEventListener('touchmove', scrollbarWheel, { passive: true });
  scrollContentElement.addEventListener('wheel', contentWheel, { passive: true });
  scrollContentElement.addEventListener('touchmove', contentWheel, { passive: true });
};

addCustomScroll(scrollbar, scrollLine, scrollContent);
addCustomScroll(document.querySelectorAll("[data-scroll='container']")[1], document.querySelectorAll("[data-scroll='container']")[1].querySelector('.scrollbar__line'), document.querySelectorAll("[data-scroll='content']")[1]);
```

## 🎊 Highlight.js 

```javascript
const input = document.querySelector('#chatInput');

// Проверяем, соответствует ли слово регулярному выражению
const isHighlight = (word) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(word) || /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(word) || /^#/.test(word) || /^@/.test(word);

const highlightWords = (e) => {
  // Если нажат пробел
  if (e.code === 'Space' || e.key === ' ') {
    // Фокусируем на элемент
    input.focus();
    // Получаем Selection объект
    const sel = document.getSelection();
   
    // Получаем ноды input'а, отбрасывая пустые значения
    const nodes = [...input.childNodes].filter((node) => node.length > 0);
    // Получаем последнюю последнюю ноду
    const lastNode = nodes[nodes.length - 1];
    // Разбиваем последнюю ноду на слова
    const words = lastNode.textContent.trim().split(' ');
    // Получаем последнее слово
    const lastWord = words[words.length - 1];
    // Создаем Range
    const ran = new Range();

    // Задаем старт и конец для Range
    ran.setStart(lastNode, lastNode.length - lastWord.length);
    ran.setEnd(lastNode, lastNode.length);
    // Добавляем range в Select
    sel.addRange(ran);
    
    // Если выделенное слово соответствует регулярки, то удаляем контент из выделенного, создаем ссылку, добавляем последнее слово в ссылку, вставляем в Range
    if (isHighlight(ran.toString())) {
      ran.deleteContents();

      const el = document.createElement('a');
      el.classList.add('highlight');
      el.setAttribute('href', lastWord);
      el.innerText = lastWord.trim();

      ran.insertNode(el);

      sel.removeAllRanges();
      sel.addRange(ran);
    }

    ran.collapse();
  }
};

input.addEventListener('keydown', highlightWords);
```
