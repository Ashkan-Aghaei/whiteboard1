// import { useNavigate } from "react-router-dom";
import { useAppLangCode } from "./language-state";
import React, { useEffect, useState } from "react";
import {
  languages,
  type Language,
  setLanguage,
  defaultLang,
  useI18n,
} from "../../packages/excalidraw/i18n";

export const AuthLanguageList = ({
  style,
}: {
  style?: React.CSSProperties;
}) => {
  const { t } = useI18n();
  const [langCode, setLangCode] = useAppLangCode();
  const [showSelect, setShowSelect] = useState(false); // 默认显示为展开状态
  const handleImageClick = () => {
    setShowSelect((prev) => !prev); // 切换显示状态
  };

  const handleOptionClick = async (lang: Language) => {
    await setLanguage(lang);
    await setLangCode(lang.code);
    document.title = t("logo.title");
    setShowSelect(false); // 选择后关闭下拉菜单
  };

  // 读取当前用户语言
  useEffect(() => {
    const windowLanguage = window.navigator.language;
    let lang: Language =
      languages.find((f) => f.code.indexOf(windowLanguage) > -1) || defaultLang;
    lang = languages.find((f) => f.code.indexOf(langCode) > -1) || defaultLang;
    const searchLang = new URLSearchParams(window.location.search).get("lang");
    if (searchLang) {
      lang =
        languages.find((f) => f.code.indexOf(searchLang) > -1) || defaultLang;
    }
    handleOptionClick(lang);
  }, []);

  return (
    <div style={{ position: "relative", ...style }}>
      <img
        src="/langIcon.png"
        alt=""
        style={{ width: 25, cursor: "pointer" }} // 添加 cursor 样式提示可点击
        onClick={handleImageClick} // 点击图片时切换 select 显示状态
      />
      {showSelect && ( // 如果 showSelect 为 true，才显示下拉菜单
        <ul
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ccc",
            listStyleType: "none",
            padding: 0,
            margin: 0,
            zIndex: 1000,
            width: "180px",
            height: "30vh",
            overflowY: "auto",
            right: 0,
          }}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleOptionClick(lang)}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: lang.code === langCode ? "#f0f0f0" : "white", // 高亮当前选择
              }}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
