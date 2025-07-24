import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ScriptApiResponse } from "../api/characterApi";

// scenes를 제외한 최소 캐릭터 타입
export type MinimalCharacter = {
  id: number;
  characterName: string;
  isMain: boolean;
  age: number;
  gender: string;
  characterDescription: string;
};

interface BookSession {
  bookId: number;
  bookTitle: string;
  characters: MinimalCharacter[];
  selectedAt: number; // 선택된 시간 (만료 확인용)
}

interface ScriptCache {
  [characterId: number]: {
    data: ScriptApiResponse;
    cachedAt: number; // 캐시된 시간
    characterName: string;
  };
}

interface AppState {
  // 현재 선택된 책과 캐릭터 세션
  currentBookSession: BookSession | null;

  // 스크립트 캐시 (캐릭터별)
  scriptCache: ScriptCache;

  // Actions
  setBookSession: (
    bookId: number,
    bookTitle: string,
    characters: MinimalCharacter[]
  ) => void;
  clearBookSession: () => void;

  // 스크립트 캐시 관리
  setScriptCache: (
    characterId: number,
    characterName: string,
    scriptData: ScriptApiResponse
  ) => void;
  getScriptCache: (characterId: number) => ScriptApiResponse | null;
  clearExpiredScripts: () => void;
  clearAllScripts: () => void;

  // 유틸리티
  isBookSessionValid: () => boolean;
  isScriptCacheValid: (characterId: number) => boolean;
}

// 만료 시간 설정 (밀리초)
const BOOK_SESSION_EXPIRY = 2 * 60 * 60 * 1000; // 2시간
const SCRIPT_CACHE_EXPIRY = 1 * 60 * 60 * 1000; // 1시간

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentBookSession: null,
      scriptCache: {},

      setBookSession: (bookId, bookTitle, characters) => {
        set({
          currentBookSession: {
            bookId,
            bookTitle,
            characters,
            selectedAt: Date.now(),
          },
        });
      },

      clearBookSession: () => {
        set({ currentBookSession: null });
      },

      setScriptCache: (characterId, characterName, scriptData) => {
        set((state) => ({
          scriptCache: {
            ...state.scriptCache,
            [characterId]: {
              data: scriptData,
              cachedAt: Date.now(),
              characterName,
            },
          },
        }));
      },

      getScriptCache: (characterId) => {
        const cache = get().scriptCache[characterId];
        if (!cache) return null;

        // 만료 확인
        if (!get().isScriptCacheValid(characterId)) {
          // 만료된 캐시 삭제
          set((state) => {
            const newCache = { ...state.scriptCache };
            delete newCache[characterId];
            return { scriptCache: newCache };
          });
          return null;
        }

        return cache.data;
      },

      clearExpiredScripts: () => {
        const now = Date.now();
        set((state) => {
          const newCache: ScriptCache = {};
          Object.entries(state.scriptCache).forEach(([characterId, cache]) => {
            if (now - cache.cachedAt < SCRIPT_CACHE_EXPIRY) {
              newCache[Number(characterId)] = cache;
            }
          });
          return { scriptCache: newCache };
        });
      },

      clearAllScripts: () => {
        set({ scriptCache: {} });
      },

      isBookSessionValid: () => {
        const session = get().currentBookSession;
        if (!session) return false;

        const now = Date.now();
        return now - session.selectedAt < BOOK_SESSION_EXPIRY;
      },

      isScriptCacheValid: (characterId) => {
        const cache = get().scriptCache[characterId];
        if (!cache) return false;

        const now = Date.now();
        return now - cache.cachedAt < SCRIPT_CACHE_EXPIRY;
      },
    }),
    {
      name: "vlog-app-storage", // sessionStorage key name
      storage: createJSONStorage(() => sessionStorage),

      // 성능 최적화: 스토리지에서 불러올 때 만료된 데이터 정리
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 만료된 북 세션 확인
          if (!state.isBookSessionValid()) {
            state.clearBookSession();
          }

          // 만료된 스크립트 캐시 정리
          state.clearExpiredScripts();

          console.log("🔄 Store rehydrated with optimizations:", {
            hasValidSession: state.isBookSessionValid(),
            scriptCacheSize: Object.keys(state.scriptCache).length,
          });
        }
      },
    }
  )
);
