import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 검색된 채용 공고 결과
export const searchResultAtom = atom([]);

// 상세 채용 공고를 열람 할 아이디
export const detailInfoAtom = atom(-1);

// 검색 필터
export const employmentTypeValuesAtom = atomWithStorage(
  "employmentTypeValues",
  []
);
export const workRegionValuesAtom = atomWithStorage("workRegionValues", []);
export const recruitmentFieldValuesAtom = atomWithStorage(
  "recruitmentFieldValues",
  []
);
export const searchTitleAtom = atomWithStorage("searchTitle", "");