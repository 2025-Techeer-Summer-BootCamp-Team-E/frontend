/**
 * 한글 관련 유틸리티 함수들
 */

/**
 * 한글 단어의 마지막 글자에 따라 적절한 조사를 반환합니다.
 * @param word - 조사를 결정할 한글 단어
 * @returns "로" 또는 "으로"
 */
export const getKoreanParticle = (word: string): string => {
  if (!word) return "로";

  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 완성형 문자 범위 확인 (가-힣)
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 받침 확인: (문자코드 - 0xAC00) % 28
    const finalConsonantIndex = (lastCharCode - 0xac00) % 28;

    // 받침이 없거나 'ㄹ' 받침인 경우 '로' 사용
    // ㄹ 받침의 인덱스는 8
    if (finalConsonantIndex === 0 || finalConsonantIndex === 8) {
      return "로";
    } else {
      return "으로";
    }
  }

  // 한글이 아닌 경우 기본값
  return "로";
};

/**
 * 한글 단어에 "을/를" 조사를 붙입니다.
 * @param word - 조사를 결정할 한글 단어
 * @returns "을" 또는 "를"
 */
export const getObjectParticle = (word: string): string => {
  if (!word) return "을";

  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 완성형 문자 범위 확인 (가-힣)
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 받침 확인: (문자코드 - 0xAC00) % 28
    const finalConsonantIndex = (lastCharCode - 0xac00) % 28;

    // 받침이 없으면 "를", 있으면 "을"
    return finalConsonantIndex === 0 ? "를" : "을";
  }

  // 한글이 아닌 경우 기본값
  return "을";
};

/**
 * 한글 단어에 "이/가" 조사를 붙입니다.
 * @param word - 조사를 결정할 한글 단어
 * @returns "이" 또는 "가"
 */
export const getSubjectParticle = (word: string): string => {
  if (!word) return "이";

  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 완성형 문자 범위 확인 (가-힣)
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 받침 확인: (문자코드 - 0xAC00) % 28
    const finalConsonantIndex = (lastCharCode - 0xac00) % 28;

    // 받침이 없으면 "가", 있으면 "이"
    return finalConsonantIndex === 0 ? "가" : "이";
  }

  // 한글이 아닌 경우 기본값
  return "이";
};

/**
 * 한글 단어에 "은/는" 조사를 붙입니다.
 * @param word - 조사를 결정할 한글 단어
 * @returns "은" 또는 "는"
 */
export const getTopicParticle = (word: string): string => {
  if (!word) return "은";

  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 완성형 문자 범위 확인 (가-힣)
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 받침 확인: (문자코드 - 0xAC00) % 28
    const finalConsonantIndex = (lastCharCode - 0xac00) % 28;

    // 받침이 없으면 "는", 있으면 "은"
    return finalConsonantIndex === 0 ? "는" : "은";
  }

  // 한글이 아닌 경우 기본값
  return "은";
};
