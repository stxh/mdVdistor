import i18next from "/dist/js/i18next/i18next.min.js";
import LanguageDetector from "/dist/js/i18next/i18next-browser-languagedetector.min.js";

async function fetchJson(url, defaultValue = null) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSON:", error);
    return defaultValue;
  }
}

async function loadResouse() {
  const translationEN = await fetchJson("./locales/en.json");
  const translationZH = await fetchJson("./locales/zh.json");
  const resources = {
      "en": {
        translation: translationEN,
      },
      "zh-CN": {
        translation: translationZH,
      },
    }
  return resources
}

loadResouse().then((res)=>{
  i18next
  .use(LanguageDetector)
  // .use(initReactI18next) // 将 i18next 实例传递给 react-i18next
  .init({
    fallbackLng: "en",
    debug: false,
    resources: res,
    interpolation: {
      escapeValue: false,
    },
  });
})



// const i18n = createI18nStore(i18next);

console.log(i18next.t("new"));
// export default i18n;

// // 直接从 i18next 实例获取 t 函数
// const { t } = i18next;

// // 导出 i18n 实例和 t 函数
// export { i18next, t }; // 导出 i18next 实例，而不是自定义的 i18n 变量

// // 导出翻译函数，方便直接使用 (可选，通常直接使用 t 更简洁)
// export function translate(key, options) {
//   return t(key, options);
// }

// export default i18next; // 推荐导出 i18next 实例作为默认导出
