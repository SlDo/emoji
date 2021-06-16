const scrollbar = document.querySelector("[data-scroll='container']");
const scrollLine = scrollbar.querySelector('.scrollbar__line');
const scrollContent = document.querySelector("[data-scroll='content']");

const getElementHeight = (elem) => ('getComputedStyle' in window
  ? parseInt(
    window.getComputedStyle(elem, null).getPropertyValue('height'),
    10,
  )
  : parseInt(elem.currentStyle.height, 10));

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
  const scrollbarHeight = getElementHeight(scrollbarElement);
  const scrollContentHeight = getElementHeight(scrollContentElement);

  // Высота с областью прокрутки
  const contentScrollHeight = scrollContentElement.scrollHeight;

  const ratio = scrollContentHeight / contentScrollHeight;
  const scrollLineHeight = scrollbarHeight * ratio;

  let startTransform = 0;
  let startY = 0;
  const limitY = scrollbarHeight - scrollLineHeight;

  scrollLineElement.style.height = `${scrollLineHeight}px`;

  const scrollTransform = (scrollLineTransform, scrollContentTransform) => {
    scrollLineElement.style.transform = `translateY(${scrollLineTransform}px)`;
    scrollContentElement.style.transform = `translateY(${scrollContentTransform}px)`;
  };

  const mouseMoveHandle = (e) => {
    const transform = startTransform + e.clientY - startY;

    if (transform >= 0 && transform <= limitY) scrollTransform(transform, -transform / ratio);
  };

  const mouseDownHandle = (e) => {
    startTransform = getTranslateY(scrollLineElement);

    // Сбросить transition-duration на время скроллинга;
    scrollLineElement.style.transition = '0s';
    scrollContentElement.style.transition = '0s';

    startY = e.clientY;

    document.addEventListener('mousemove', mouseMoveHandle);
  };

  scrollLineElement.addEventListener('mousedown', mouseDownHandle);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', mouseMoveHandle);

    // Возвращает transition-duration
    scrollLineElement.style.transition = null;
    scrollContentElement.style.transition = null;
  });
  // TODO: Сделать прокрутку медленнее
  scrollbarElement.addEventListener('wheel', (e) => {
    const currentTransform = getTranslateY(scrollLineElement);

    if (e.deltaY > 0) {
      const delta = currentTransform + scrollLineElement.scrollHeight / 20 / ratio;

      if (delta < limitY) {
        scrollTransform(delta, -(delta / ratio));
      } else {
        scrollTransform(limitY, (scrollContentElement.clientHeight - contentScrollHeight));
      }
    } else if (e.deltaY < 0) {
      const delta = currentTransform - scrollLineElement.clientHeight / 20 / ratio;

      if (delta > 0) {
        scrollTransform(delta, -(delta / ratio));
      } else {
        scrollTransform(0, 0);
      }
    }
  });

  scrollContentElement.addEventListener('wheel', (e) => {
    const currentTransform = getTranslateY(scrollContentElement);

    if (e.deltaY > 0) {
      const delta = currentTransform - (contentScrollHeight / 20);

      if (-delta * ratio <= limitY) {
        scrollTransform(-delta * ratio, delta);
      } else {
        scrollTransform(limitY, scrollContentElement.clientHeight - contentScrollHeight);
      }
    } else if (e.deltaY < 0) {
      const delta = currentTransform + (contentScrollHeight / 20);

      if (-delta * ratio >= 0) {
        scrollTransform(-delta * ratio, delta);
      } else {
        scrollTransform(0, 0);
      }
    }
  });
};

addCustomScroll(scrollbar, scrollLine, scrollContent);
