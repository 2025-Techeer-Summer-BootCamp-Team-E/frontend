import React, { useState, useEffect } from "react";
import VideoInfo from "./VideoInfo";
import type { VideoInfoProps } from "./VideoInfo";

// 예시 데이터
/*const sampleData = [
  {
    imageUrl: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    title: "나의 작은 별 B-612에서의 하루",
    from: "어린 왕자",
    character: "어린 왕자",
    description: "자신이 사는 작은 별을 사랑하고, 장미와의 관계를 통해 사랑의 의미를 배워가는 순수한 영혼"
  }
];*/

const VideoInfoFetch: React.FC = () => {
  const [videoList, setVideoList] = useState<VideoInfoProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch로 외부 데이터 받아오기 (예시: /api/videoList)
    fetch("public/SampleVideoInfo.json")
      .then(res => res.json())
      .then(data => {
        setVideoList(data); // 배열 저장
        setLoading(false);
      });
    
    // 예시 데이터 사용
    /*setVideoList(sampleData);
    setLoading(false);*/
  }, []);

if (loading) return <div>로딩 중...</div>;

 return (
    <div className="flex flex-col gap-4">
      {videoList.map((info, idx) => (
        <VideoInfo key={idx} {...info} />
      ))}
    </div>
  );
};

export default VideoInfoFetch;