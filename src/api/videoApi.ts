import axios from "axios";
import { ENDPOINTS } from "./endpoints";

export interface VideoApiResponse {
  video_id: number;
  character_id: number;
  video_url: string;
  thumbnail_url: string;
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
