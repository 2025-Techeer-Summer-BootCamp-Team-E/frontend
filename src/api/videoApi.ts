import axios from "axios";
import { ENDPOINTS } from "./endpoints";

export interface VideoApiResponse {
  video_id: number;
  character_id: number;
  video_url: string;
  thumbnail_url: string;
  title: string;
  is_bookmarked: boolean;
  created_at?: string;
}

export const createVideo = async (scriptId: string) => {
  //   try {
  //     const response = await axios.post(ENDPOINTS.videos.createVideo(), {
  //       scriptId,
  //     });
  //     console.log(response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Failed to fetch videos`);
  //     throw error;
  //   }

  return {
    videoUrl: "https://www.youtube.com/embed/kBHIhq_meAI",
    videoId: 9999,
  };
};

export const getVideos = () => {
  return axios.get(ENDPOINTS.videos.get);
};

// 북마크 함수
export const bookmarkVideo = (videoId: number) => {
  return axios.patch(ENDPOINTS.booksmarks.update(videoId), {
    is_bookmarked: true, // 고정
  });
};

// 북마크 취소 함수
export const unbookmarkVideo = (videoId: number) => {
  return axios.patch(ENDPOINTS.booksmarks.update(videoId), {
    is_bookmarked: false,
  });
};
