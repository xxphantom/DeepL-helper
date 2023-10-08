const DEBOUNCE_DELAY = 100;
let lastClickTime = 0;

const containsNotCirillic = (text) => {
  const englishRegex = /[^\u0400-\u04FF\W\d]/;
  return englishRegex.test(text);
};

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};


const clickElementWithAttribute = (inlineTrigger) => {
  const translateTooltip = document.querySelector("deepl-inline-translate-tooltip");
  const element = inlineTrigger
    ?.shadowRoot?.querySelector(`[data-qa="deepl-inline-translate-menu-icon"]`);

  if (element && !translateTooltip) {
    element.click();
    inlineTrigger.remove();
  }
};

const debouncedHandleMutations = debounce((inlineTrigger) => {
  clickElementWithAttribute(inlineTrigger);
}, DEBOUNCE_DELAY);

const observer = new MutationObserver((mutationsList) => {
  const inlineTrigger = document.querySelector("deepl-inline-trigger");
  if (!inlineTrigger) return;

  const selection = window.getSelection();

  if (!containsNotCirillic(selection)) {
    inlineTrigger.remove();
    return;
  }

  inlineTrigger.style.opacity = 0;

  debouncedHandleMutations(inlineTrigger);
});

const onPageLoad = () => {
  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
  });
};

window.addEventListener("load", onPageLoad);

