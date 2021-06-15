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
  const transform = e.clientY - startY;
  const translateY = transform > 0 ? transform : startTransform + transform;

  if (translateY >= 0 && translateY <= limitY) {
    scrollLine.style.transform = `translateY(${translateY}px)`;
    scrollContent.style.transform = `translateY(${-translateY * ratio}px)`;
  }
};

const scroll = (e) => {
  startTransform = +/\.*translateY\((.*)px\)/i.exec(
    scrollLine.style.transform
  )[1];
  startY = e.clientY;

  document.addEventListener("mousemove", transformScroll);
};

scrollLine.addEventListener("mousedown", scroll);
document.addEventListener("mouseup", () => {
  document.removeEventListener("mousemove", transformScroll);
});

scrollbar.addEventListener("wheel", (e) => {
  const currentTransform = +/\.*translateY\((.*)px\)/i.exec(
    scrollLine.style.transform
  )[1];

  if (e.deltaY > 0) {
    const delta = currentTransform + 1;

    scrollLine.style.transform = `translateY(${delta}px)`;
    scrollContent.style.transform = `translateY(-${delta * ratio}px)`;
  } else {
    const delta = currentTransform - 1;

    if (delta > 0) {
      scrollLine.style.transform = `translateY(${delta}px)`;
      scrollContent.style.transform = `translateY(-${delta * ratio}px)`;
    }
  }
});

scrollContent.addEventListener("wheel", (e) => {
  const currentTransform = +/\.*translateY\((.*)px\)/i.exec(
    scrollContent.style.transform
  )[1];

  const delta = currentTransform - e.deltaY / 5;

  if (-delta * ratio < limitY && -delta * ratio >= 0) {
    scrollLine.style.transform = `translateY(${-delta * ratio}px)`;
    scrollContent.style.transform = `translateY(${delta}px)`;
  }
});
