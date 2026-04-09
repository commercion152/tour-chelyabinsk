import React from 'react';

const FALLBACK_TEXT = {
  ru: 'Краткое описание пока не добавлено.',
  en: 'Short description has not been added yet.',
  zh: '暂无简短说明。'
};

const CATEGORY_TEXT = {
  ru: 'Категория',
  en: 'Category',
  zh: '分类'
};

const IMAGE_TEXT = {
  ru: 'Открыть изображение',
  en: 'Open image',
  zh: '打开图片'
};

const UNTITLED_TEXT = {
  ru: 'Без названия',
  en: 'Untitled',
  zh: '未命名'
};

function getLocalizedDescription(properties, language) {
  if (language === 'en') {
    return (
      properties.description_en ||
      properties.description ||
      properties.inscription ||
      properties['memorial:subject'] ||
      properties.alt_name ||
      FALLBACK_TEXT.en
    );
  }

  if (language === 'zh') {
    return (
      properties.description_zh ||
      properties.description ||
      properties.inscription ||
      properties['memorial:subject'] ||
      properties.alt_name ||
      FALLBACK_TEXT.zh
    );
  }

  return (
    properties.description ||
    properties.inscription ||
    properties['memorial:subject'] ||
    properties.alt_name ||
    FALLBACK_TEXT.ru
  );
}

function PlacePopup({ feature, categoryTitle, language }) {
  const properties = feature?.properties || {};
  const name = properties.name || UNTITLED_TEXT[language];
  const description = getLocalizedDescription(properties, language);
  const image = properties.image || null;

  return (
    <div className="popup-content">
      <h3>{name}</h3>
      <p>
        <strong>{CATEGORY_TEXT[language]}:</strong> {categoryTitle}
      </p>
      <p>{description}</p>

      {image && (
        <p className="popup-link">
          <a href={image} target="_blank" rel="noreferrer">
            {IMAGE_TEXT[language]}
          </a>
        </p>
      )}
    </div>
  );
}

export default PlacePopup;