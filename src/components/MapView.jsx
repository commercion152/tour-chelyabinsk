import React from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import PlacePopup from './PlacePopup.jsx';

import attractionsIcon from '/icons/attractions.png';
import zooIcon from '/icons/zoo.png';
import monumentIcon from '/icons/monument.png';
import museumIcon from '/icons/museum.png';
import foodIcon from '/icons/food.png';
import teatherIcon from '/icons/teather.png';
import universityIcon from '/icons/university.png';
import churchIcon from '/icons/church.png';
import mosqueIcon from '/icons/mosque.png';
import stationIcon from '/icons/station.png';
import parkIcon from '/icons/park.png';
import airplaneIcon from '/icons/airplane.png';
import circusIcon from '/icons/circus.png';
import prospectsIcon from '/icons/prospects.png';

const CHELYABINSK_CENTER = [55.1644, 61.4368];

const CHELYABINSK_BOUNDS = [
  [55.06, 61.26],
  [55.29, 61.54]
];

const CATEGORY_STYLES = {
  attractions: { color: '#d94841' },
  monuments: { color: '#f59f00' },
  museum: { color: '#7b61ff' },
  hotel: { color: '#0b7285' },
  teather: { color: '#c2255c' },
  university: { color: '#8c52ff' },
  arch: { color: '#5f3dc4' },
  chtzz_obj: { color: '#e8590c' },
  prospects: { color: '#495057' }
};

const FALLBACK_CATEGORY_ICONS = {
  attractions: attractionsIcon,
  monuments: monumentIcon,
  museum: museumIcon,
  hotel: foodIcon,
  teather: teatherIcon,
  university: universityIcon,
  arch: churchIcon,
  chtzz_obj: stationIcon,
  prospects: prospectsIcon
};

function isValidFeature(datasetKey, feature) {
  const properties = feature?.properties || {};
  const name = String(properties.name || '').trim();

  if (!name) {
    return false;
  }

  return true;
}

function getCoordinates(feature) {
  const geometry = feature?.geometry;

  if (!geometry) {
    return null;
  }

  if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
    const [lng, lat] = geometry.coordinates;

    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return null;
    }

    return [lat, lng];
  }

  return null;
}

function normalizeValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function getFeatureSearchText(feature) {
  const properties = feature?.properties || {};

  const values = Object.values(properties)
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value).toLowerCase());

  return values.join(' | ');
}

function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function detectFeatureIcon(feature, datasetKey) {
  const properties = feature?.properties || {};
  const searchText = getFeatureSearchText(feature);

  const type = normalizeValue(properties.type);
  const kind = normalizeValue(properties.kind);
  const category = normalizeValue(properties.category);
  const amenity = normalizeValue(properties.amenity);
  const tourism = normalizeValue(properties.tourism);
  const building = normalizeValue(properties.building);
  const railway = normalizeValue(properties.railway);
  const religion = normalizeValue(properties.religion);
  const historic = normalizeValue(properties.historic);
  const leisure = normalizeValue(properties.leisure);
  const aeroway = normalizeValue(properties.aeroway);
  const office = normalizeValue(properties.office);
  const shop = normalizeValue(properties.shop);
  const name = normalizeValue(properties.name);

  const exactFields = [
    type,
    kind,
    category,
    amenity,
    tourism,
    building,
    railway,
    religion,
    historic,
    leisure,
    aeroway,
    office,
    shop,
    name
  ].filter(Boolean);

  const hasField = (value) => exactFields.includes(value);

  if (
    hasField('mosque') ||
    religion === 'muslim' ||
    includesAny(searchText, ['мечеть', 'mosque'])
  ) {
    return mosqueIcon;
  }

  if (
    hasField('church') ||
    hasField('cathedral') ||
    hasField('chapel') ||
    religion === 'christian' ||
    includesAny(searchText, [
      'церковь',
      'храм',
      'собор',
      'часовн',
      'church',
      'cathedral',
      'chapel'
    ])
  ) {
    return churchIcon;
  }

  if (
    hasField('station') ||
    hasField('train_station') ||
    railway === 'station' ||
    railway === 'halt' ||
    includesAny(searchText, [
      'вокзал',
      'станц',
      'ж/д',
      'железнодорож',
      'railway station',
      'train station',
      'station'
    ])
  ) {
    return stationIcon;
  }

  if (
    aeroway === 'aerodrome' ||
    hasField('airport') ||
    includesAny(searchText, ['аэропорт', 'airport'])
  ) {
    return airplaneIcon;
  }

  if (
    hasField('university') ||
    amenity === 'university' ||
    office === 'university' ||
    building === 'university' ||
    includesAny(searchText, ['университет', 'институт', 'академи', 'university'])
  ) {
    return universityIcon;
  }

  if (
    hasField('theatre') ||
    hasField('theater') ||
    amenity === 'theatre' ||
    amenity === 'theater' ||
    includesAny(searchText, ['театр', 'theatre', 'theater'])
  ) {
    return teatherIcon;
  }

  if (
    hasField('circus') ||
    includesAny(searchText, ['цирк', 'circus'])
  ) {
    return circusIcon;
  }

  if (
    hasField('museum') ||
    tourism === 'museum' ||
    amenity === 'museum' ||
    includesAny(searchText, ['музей', 'museum'])
  ) {
    return museumIcon;
  }

  if (
    hasField('zoo') ||
    tourism === 'zoo' ||
    includesAny(searchText, ['зоопарк', 'zoo'])
  ) {
    return zooIcon;
  }

  if (
    hasField('park') ||
    leisure === 'park' ||
    leisure === 'garden' ||
    includesAny(searchText, ['парк', 'сквер', 'сад', 'park', 'garden'])
  ) {
    return parkIcon;
  }

  if (
    hasField('restaurant') ||
    hasField('cafe') ||
    hasField('fast_food') ||
    amenity === 'restaurant' ||
    amenity === 'cafe' ||
    amenity === 'fast_food' ||
    tourism === 'hotel' ||
    includesAny(searchText, [
      'ресторан',
      'кафе',
      'кофейн',
      'столов',
      'бар',
      'пицц',
      'restaurant',
      'cafe',
      'food'
    ])
  ) {
    return foodIcon;
  }

  if (
    hasField('monument') ||
    historic === 'monument' ||
    historic === 'memorial' ||
    includesAny(searchText, ['памятник', 'монумент', 'мемориал', 'monument', 'memorial'])
  ) {
    return monumentIcon;
  }

  if (
    includesAny(searchText, [
      'проспект',
      'улица',
      'street',
      'avenue',
      'prospect'
    ])
  ) {
    return prospectsIcon;
  }

  return FALLBACK_CATEGORY_ICONS[datasetKey] || attractionsIcon;
}

function createFeatureIcon(datasetKey, feature) {
  const style = CATEGORY_STYLES[datasetKey] || { color: '#1971c2' };
  const iconUrl = detectFeatureIcon(feature, datasetKey);

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${style.color};
        border: 2px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img
          src="${iconUrl}"
          alt=""
          style="
            width: 18px;
            height: 18px;
            object-fit: contain;
            display: block;
            pointer-events: none;
            user-select: none;
          "
        />
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16]
  });
}

function MapView({ datasets, language }) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={CHELYABINSK_CENTER}
        zoom={12}
        minZoom={12}
        maxZoom={17}
        maxBounds={CHELYABINSK_BOUNDS}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        attributionControl={false}
        className="leaflet-map"
      >
        <TileLayer
          url="/tiles/{z}/{x}/{y}.png"
          noWrap={true}
        />

        {datasets.map((dataset) => {
          const features = dataset?.data?.features || [];

          return features
            .filter((feature) => isValidFeature(dataset.key, feature))
            .map((feature, index) => {
              const coordinates = getCoordinates(feature);

              if (!coordinates) {
                return null;
              }

              const markerIcon = createFeatureIcon(dataset.key, feature);

              const featureId =
                feature?.properties?.id ||
                feature?.properties?.['@id'] ||
                `${dataset.key}-${index}`;

              return (
                <Marker
                  key={featureId}
                  position={coordinates}
                  icon={markerIcon}
                >
                  <Popup>
                    <PlacePopup
                      feature={feature}
                      categoryTitle={dataset.title}
                      language={language}
                    />
                  </Popup>
                </Marker>
              );
            });
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;