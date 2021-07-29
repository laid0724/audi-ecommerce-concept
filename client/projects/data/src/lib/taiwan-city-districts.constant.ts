import data from './tw-city-districts.json';

export interface TaiwanCityDistricts {
  cityZh: string;
  districtsZh: string[];
  cityEn: string;
  districtsEn: string[];
}

// tslint:disable-next-line: max-line-length
// see: https://en.wikipedia.org/wiki/List_of_townships/cities_and_districts_in_Taiwan

export const TAIWAN_CITY_DISTRICT_LIST: TaiwanCityDistricts[] = data.reduce(
  (
    payload: TaiwanCityDistricts[],
    d: {
      cityZh: string;
      districtZh: string;
      cityEn: string;
      districtEn: string;
    }
  ) => {
    const targetCity = payload.find(
      (p) => p.cityZh === d.cityZh && p.cityEn === d.cityEn
    );
    if (targetCity === undefined) {
      payload.push({
        cityZh: d.cityZh,
        districtsZh: [d.districtZh],
        cityEn: d.cityEn,
        districtsEn: [d.districtEn],
      });
    } else {
      const { districtsZh, districtsEn } = targetCity;
      districtsZh.push(d.districtZh);
      districtsEn.push(d.districtEn);
    }
    return payload;
  },
  []
);
