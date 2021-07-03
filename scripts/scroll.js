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
  let scrollbarHeight = 0;
  let scrollContentHeight = 0;

  // Высота с областью прокрутки
  let contentScrollHeight = 0;

  scrollbarElement.style.display = null;

  let startTransform = 0;
  let startY = 0;
  let limitY = 0;
  let scrollLineHeight = 0;
  let ratio = 0;

  let startTouchContentY = 0;

  scrollLineElement.style.height = `${scrollLineHeight}px`;

  const setScrollbarVisibility = () => {
    if (contentScrollHeight > Math.ceil(scrollContentHeight)) {
      scrollbarElement.style.display = null;
    } else {
      scrollbarElement.style.display = 'none';
    }
  };

  const setInitialState = () => {
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

    startTouchContentY = 0;

    scrollLineElement.style.height = `${scrollLineHeight}px`;
  };

  setInitialState();

  const mutationObserver = new MutationObserver(() => {
    setInitialState();
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
    const transform = startTransform + (e.clientY || e.touches[0].clientY) - startY;

    if (transform >= 0 && transform <= limitY) scrollTransform(transform, -transform / ratio);
  };

  const mouseDownHandle = (e) => {
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
    document.removeEventListener('touchmove', mouseMoveHandle);

    // Возвращает transition-duration
    scrollLineElement.style.transition = null;
    scrollContentElement.style.transition = null;
  };

  document.addEventListener('mouseup', removeListeners);
  document.addEventListener('touchend', removeListeners, { passive: true });

  const scrollbarWheel = (e) => {
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

  scrollContentElement.addEventListener('touchstart', (e) => {
    startTouchContentY = e.touches[0].clientY;
    return null;
  }, { passive: true });

  scrollbarElement.addEventListener('wheel', scrollbarWheel, { passive: true });
  scrollbarElement.addEventListener('touchmove', scrollbarWheel, { passive: true });
  scrollContentElement.addEventListener('wheel', contentWheel, { passive: true });
  scrollContentElement.addEventListener('touchmove', contentWheel, { passive: true });
};

addCustomScroll(scrollbar, scrollLine, scrollContent);
addCustomScroll(document.querySelectorAll("[data-scroll='container']")[1], document.querySelectorAll("[data-scroll='container']")[1].querySelector('.scrollbar__line'), document.querySelectorAll("[data-scroll='content']")[1]);
