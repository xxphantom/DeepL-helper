// Объявляем переменную для отслеживания времени последнего клика
const DEBOUNCE_DELAY = 100;
let lastClickTime = 0;


function containsNotCirillic(text) {
  const englishRegex = /[^\u0400-\u04FF\W\d]/;
  return englishRegex.test(text);
}

// Функция debounce для ограничения кликов
function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}

// Функция, которая будет вызывать событие клика на элементе с заданным атрибутом
function clickElementWithAttribute(attributeValue) {
  const inlineTrigger = document.querySelector("deepl-inline-trigger");
  const translateTooltip = document.querySelector("deepl-inline-translate-tooltip");

  const element = document
    .querySelector("deepl-inline-trigger")
    ?.shadowRoot?.querySelector(`[data-qa="${attributeValue}"]`);

  if (element && !translateTooltip) {
    element.click();
    inlineTrigger.remove();
  }
}

// Функция для обработки мутаций DOM с debounce
const debouncedHandleMutations = debounce(function (mutationsList) {
  clickElementWithAttribute("deepl-inline-translate-menu-icon");
}, DEBOUNCE_DELAY);

// Создаем объект для отслеживания изменений DOM
const observer = new MutationObserver(function (mutationsList) {
  const inlineTrigger = document.querySelector("deepl-inline-trigger");
  if (!inlineTrigger) return;

  const selection = window.getSelection();

  if (!containsNotCirillic(selection)) {
    inlineTrigger.remove();
    return;
  }

  inlineTrigger.style.opacity = 0;

  debouncedHandleMutations(mutationsList);
});

// Функция, которая будет вызвана после полной загрузки страницы
function onPageLoad() {
  // Начинаем отслеживать изменения в DOM
  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}

// Добавляем слушатель события load
window.addEventListener("load", onPageLoad);
