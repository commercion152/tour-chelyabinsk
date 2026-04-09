import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import MapView from './components/MapView.jsx';

const DATASETS = [
  {
    key: 'attractions',
    title: {
      ru: 'Достопримечательности',
      en: 'Attractions',
      zh: '景点'
    },
    file: '/data/attractions.geojson',
  },
  {
    key: 'monuments',
    title: {
      ru: 'Памятники',
      en: 'Monuments',
      zh: '纪念碑'
    },
    file: '/data/monuments.geojson',
  },
  {
    key: 'museum',
    title: {
      ru: 'Музеи',
      en: 'Museums',
      zh: '博物馆'
    },
    file: '/data/museum.geojson',
  },
  {
    key: 'hotel',
    title: {
      ru: 'Гостиницы',
      en: 'Hotels',
      zh: '酒店'
    },
    file: '/data/hotel.geojson',
  },
  {
    key: 'teather',
    title: {
      ru: 'Театры',
      en: 'Theaters',
      zh: '剧院'
    },
    file: '/data/teather.geojson',
  },
  {
    key: 'university',
    title: {
      ru: 'Университеты',
      en: 'Universities',
      zh: '大学'
    },
    file: '/data/university.geojson',
  },
  {
    key: 'arch',
    title: {
      ru: 'Архитектура',
      en: 'Architecture',
      zh: '建筑'
    },
    file: '/data/arch.geojson',
  },
  {
    key: 'chtzz_obj',
    title: {
      ru: 'Интересные места на ЧТЗ',
      en: 'Interesting Places in ChTZ',
      zh: '切特兹有趣地点'
    },
    file: '/data/chtzz_obj.geojson',
  },
  {
    key: 'prospects',
    title: {
      ru: 'Проспекты и улицы',
      en: 'Avenues and Streets',
      zh: '大道和街道'
    },
    file: '/data/prospects.geojson',
  }
];

const UI = {
  ru: {
    pageTitle: 'Туристическая карта Челябинска',
    pageSubtitle: 'Интерактивная карта достопримечательностей и объектов города',
    sidebarTitle: 'Категории',
    sidebarText: 'Выбери, какие объекты показывать на карте',
    enableAll: 'Включить все',
    disableAll: 'Выключить все',
    loading: 'Загрузка карты...',
    adTitle: 'Рекламный блок',
    languages: {
      ru: 'RU',
      en: 'EN',
      zh: '中文'
    }
  },
  en: {
    pageTitle: 'Tourist Map of Chelyabinsk',
    pageSubtitle: 'Interactive map of attractions and city locations',
    sidebarTitle: 'Categories',
    sidebarText: 'Choose which places to show on the map',
    enableAll: 'Enable all',
    disableAll: 'Disable all',
    loading: 'Loading map...',
    languages: {
      ru: 'RU',
      en: 'EN',
      zh: '中文'
    }
  },
  zh: {
    pageTitle: '车里雅宾斯克旅游地图',
    pageSubtitle: '城市景点与重要地点互动地图',
    sidebarTitle: '分类',
    sidebarText: '选择要在地图上显示的地点',
    enableAll: '全部显示',
    disableAll: '全部隐藏',
    loading: '地图加载中...',
    languages: {
      ru: 'RU',
      en: 'EN',
      zh: '中文'
    }
  }
};

function App() {
  const [language, setLanguage] = useState('ru');
  const [geoData, setGeoData] = useState({});
  const [enabledCategories, setEnabledCategories] = useState(
    DATASETS.reduce((acc, item) => {
      acc[item.key] = true;
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const results = await Promise.all(
          DATASETS.map(async (item) => {
            const response = await fetch(item.file);

            if (!response.ok) {
              throw new Error(`Не удалось загрузить ${item.file}`);
            }

            const data = await response.json();
            return [item.key, data];
          })
        );

        setGeoData(Object.fromEntries(results));
      } catch (error) {
        console.error('Ошибка загрузки GeoJSON:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const ui = UI[language];

  const translatedDatasets = useMemo(() => {
    return DATASETS.map((item) => ({
      ...item,
      title: item.title[language]
    }));
  }, [language]);

  const activeDatasets = useMemo(() => {
    return translatedDatasets
      .filter((item) => enabledCategories[item.key])
      .map((item) => ({
        ...item,
        data: geoData[item.key] || null
      }));
  }, [translatedDatasets, enabledCategories, geoData]);

  const toggleCategory = (key) => {
    setEnabledCategories((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const enableAll = () => {
    setEnabledCategories(
      DATASETS.reduce((acc, item) => {
        acc[item.key] = true;
        return acc;
      }, {})
    );
  };

  const disableAll = () => {
    setEnabledCategories(
      DATASETS.reduce((acc, item) => {
        acc[item.key] = false;
        return acc;
      }, {})
    );
  };

  return (
    <div className="app">
      <Sidebar
        title={ui.sidebarTitle}
        description={ui.sidebarText}
        enableAllText={ui.enableAll}
        disableAllText={ui.disableAll}
        adTitle={ui.adTitle}
        adText={ui.adText}
        datasets={translatedDatasets}
        enabledCategories={enabledCategories}
        onToggleCategory={toggleCategory}
        onEnableAll={enableAll}
        onDisableAll={disableAll}
      />

      <main className="map-area">
        <header className="topbar">
          <div>
            <h1>{ui.pageTitle}</h1>
            <p>{ui.pageSubtitle}</p>
          </div>

          <div className="language-switcher">
            <button
              type="button"
              className={language === 'ru' ? 'active' : ''}
              onClick={() => setLanguage('ru')}
            >
              {ui.languages.ru}
            </button>
            <button
              type="button"
              className={language === 'en' ? 'active' : ''}
              onClick={() => setLanguage('en')}
            >
              {ui.languages.en}
            </button>
            <button
              type="button"
              className={language === 'zh' ? 'active' : ''}
              onClick={() => setLanguage('zh')}
            >
              {ui.languages.zh}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="loading">{ui.loading}</div>
        ) : (
          <MapView datasets={activeDatasets} language={language} />
        )}
      </main>
    </div>
  );
}

export default App;