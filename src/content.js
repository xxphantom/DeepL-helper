const DEBOUNCE_DELAY = 100;
let debounceTimer = null;

const containsNotCyrillic = (text) => {
  const englishRegex = /[^\u0400-\u04FF\W\d]/;
  return englishRegex.test(text);
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

const handleMouseUp = () => {

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    const inlineTrigger = document.querySelector("deepl-inline-trigger");

    if (!inlineTrigger) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection.toString();

    if (!containsNotCyrillic(selectedText)) {
      return;
    }

    clickElementWithAttribute(inlineTrigger);
  }, DEBOUNCE_DELAY);
};

document.addEventListener("mouseup", handleMouseUp);
