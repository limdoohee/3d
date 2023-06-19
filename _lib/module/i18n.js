import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import cookie from "cookie";

//JSON 파일 import
import translationEn from "../locales/en/translation.en.json";
import translationKo from "../locales/ko/translation.ko.json";

const resources = {
    //국가 코드와 JSON 파일 match
    ko: {
        translation: translationKo,
    },
    en: {
        translation: translationEn,
    },
};

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        lng: "en", //default 국가 코드
        debug: false,
        interpolation: { escapeValue: false },
    });

//브라우저 DB에 기록된 언어가 있으면 해당 언어를 불러온다.
// let language = localStorage.getItem("language");
// if (language !== null) i18n.changeLanguage(language);

//국가 코드를 변경하는 함수
export function changeLanguage() {
    i18n.changeLanguage(i18n.language === "ko" ? "en" : "ko");
    //브라우저 DB에 기록
    localStorage.setItem("lang", i18n.language);
}

export default i18n;
