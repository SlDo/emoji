const scrollbar = document.querySelector("[data-scroll='container']");
const scrollLine = scrollbar.querySelector('.scrollbar__line');
const scrollContent = document.querySelector("[data-scroll='content']");

const getElementHeight = (elem) => ('getComputedStyle' in window
  ? parseFloat(
    window.getComputedStyle(elem, null).getPropertyValue('height'),
  )
  : parseFloat(elem.currentStyle.height));

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

const addCustomScroll = (scrollbarElement, scrollLineElement, scrollContentElement) => {
  let scrollbarHeight = getElementHeight(scrollbarElement);
  let scrollContentHeight = getElementHeight(scrollContentElement);

  // Высота с областью прокрутки
  let contentScrollHeight = scrollContentElement.scrollHeight;

  scrollbarElement.style.display = null;

  let ratio = scrollContentHeight / contentScrollHeight;
  let scrollLineHeight = scrollbarHeight * ratio;

  let startTransform = 0;
  let startY = 0;
  let limitY = scrollbarHeight - scrollLineHeight;

  let startTouchScrollY = 0;
  let startTouchContentY = 0;

  scrollLineElement.style.height = `${scrollLineHeight}px`;

  const setScrollbarVisibility = () => {
    if (contentScrollHeight > Math.ceil(scrollContentHeight)) {
      scrollbarElement.style.display = null;
    } else {
      scrollbarElement.style.display = 'none';
    }
  };

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

  const scrollTransform = (scrollLineTransform, scrollContentTransform) => {
    scrollLineElement.style.transform = `translateY(${scrollLineTransform}px)`;
    scrollContentElement.style.transform = `translateY(${scrollContentTransform}px)`;
  };

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
    document.addEventListener('touchmove', mouseMoveHandle);
  };

  scrollLineElement.addEventListener('mousedown', mouseDownHandle);
  scrollLineElement.addEventListener('touchstart', mouseDownHandle);

  const removeListeners = () => {
    document.removeEventListener('mousemove', mouseMoveHandle);
    document.removeEventListener('touchmove', mouseMoveHandle);

    // Возвращает transition-duration
    scrollLineElement.style.transition = null;
    scrollContentElement.style.transition = null;
  };

  document.addEventListener('mouseup', removeListeners);
  document.addEventListener('touchend', removeListeners);

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
      const delta = currentTransform - (contentScrollHeight / 10);

      if (-delta * ratio <= limitY) {
        scrollTransform(-delta * ratio, delta);
      } else {
        scrollTransform(limitY, scrollContentElement.clientHeight - contentScrollHeight);
      }
    } else if (e.deltaY != null ? e.deltaY < 0 : e.touches[0].clientY > startTouchContentY) {
      const delta = currentTransform + (contentScrollHeight / 10);

      if (-delta * ratio >= 0) {
        scrollTransform(-delta * ratio, delta);
      } else {
        scrollTransform(0, 0);
      }
    }
  };

  scrollbarElement.addEventListener('touchstart', (e) => startTouchScrollY = e.touches[0].clientY);
  scrollContentElement.addEventListener('touchstart', (e) => startTouchContentY = e.touches[0].clientY);

  scrollbarElement.addEventListener('wheel', scrollbarWheel);
  scrollbarElement.addEventListener('touchmove', scrollbarWheel);
  scrollContentElement.addEventListener('wheel', contentWheel);
  scrollContentElement.addEventListener('touchmove', contentWheel);
};

addCustomScroll(scrollbar, scrollLine, scrollContent);
addCustomScroll(document.querySelectorAll("[data-scroll='container']")[1], document.querySelectorAll("[data-scroll='container']")[1].querySelector('.scrollbar__line'), document.querySelectorAll("[data-scroll='content']")[1]);
