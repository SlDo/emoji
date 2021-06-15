const scrollbar = document.querySelector("[data-scroll='container']");
const scrollLine = scrollbar.querySelector(".scrollbar__line");
const scrollContent = document.querySelector("[data-scroll='content']");

const getElementHeight = (elem) =>
  "getComputedStyle" in window
    ? parseInt(
        window.getComputedStyle(elem, null).getPropertyValue("height"),
        10
      )
    : parseInt(elem.currentStyle.height, 10);

const scrollbarHeight = getElementHeight(scrollbar);
const contentScrollHeight = scrollContent.scrollHeight;
const ratio = getElementHeight(scrollContent) / contentScrollHeight;

let startTransform = 0;

scrollLine.style.height = `${scrollbarHeight * ratio}px`;

let startY = 0;
const limitY = scrollbarHeight - getElementHeight(scrollLine);

const transformScroll = (e) => {
  const transform = startTransform + e.clientY - startY;

  if (transform >= 0 && transform <= limitY) {
    scrollLine.style.transform = `translateY(${transform}px)`;
    scrollContent.style.transform = `translateY(${-transform / ratio}px)`;
  }
};

const scroll = (e) => {
  startTransform = +/\.*translateY\((.*)px\)/i.exec(
    scrollLine.style.transform
  )[1];
  scrollLine.style.transition = "0s";
  scrollContent.style.transition = "0s";
  startY = e.clientY;

  document.addEventListener("mousemove", transformScroll);
};

scrollLine.addEventListener("mousedown", scroll);
document.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", transformScroll);
  scrollLine.style.transition = null;
  scrollContent.style.transition = null;
});

scrollbar.addEventListener("wheel", (e) => {
  const currentTransform = +/\.*translateY\((.*)px\)/i.exec(
    scrollLine.style.transform
  )[1];

  if (e.deltaY > 0) {
    const delta = currentTransform + scrollLine.scrollHeight / 20 / ratio;

    if (delta < limitY) {
      scrollLine.style.transform = `translateY(${delta}px)`;
      scrollContent.style.transform = `translateY(-${delta / ratio}px)`;
    } else {
      scrollContent.style.transform = `translateY(${
        scrollContent.clientHeight - contentScrollHeight
      }px)`;
      scrollLine.style.transform = `translateY(${limitY}px)`;
    }
  } else if (e.deltaY < 0) {
    const delta = currentTransform - scrollLine.clientHeight / 20 / ratio;

    if (delta > 0) {
      scrollLine.style.transform = `translateY(${delta}px)`;
      scrollContent.style.transform = `translateY(-${delta / ratio}px)`;
    } else {
      scrollContent.style.transform = `translateY(${0}px)`;
      scrollLine.style.transform = `translateY(${0}px)`;
    }
  }
});

scrollContent.addEventListener("wheel", (e) => {
  const currentTransform = +/\.*translateY\((.*)px\)/i.exec(
    scrollContent.style.transform
  )[1];

  if (e.deltaY > 0) {
    const delta = currentTransform - (scrollContent.scrollHeight / 20) * 0.1;

    if (-delta * ratio <= limitY) {
      scrollLine.style.transform = `translateY(${-delta * ratio}px)`;
      scrollContent.style.transform = `translateY(${delta}px)`;
    } else {
      scrollContent.style.transform = `translateY(${
        scrollContent.clientHeight - contentScrollHeight
      }px)`;
      scrollLine.style.transform = `translateY(${limitY}px)`;
    }
  } else if (e.deltaY < 0) {
    const delta = currentTransform + (scrollContent.scrollHeight / 20) * 0.1;

    if (-delta * ratio >= 0) {
      scrollLine.style.transform = `translateY(${-delta * ratio}px)`;
      scrollContent.style.transform = `translateY(${delta}px)`;
    } else {
      scrollContent.style.transform = `translateY(${0}px)`;
      scrollLine.style.transform = `translateY(${0}px)`;
    }
  }
});
