import React from "react";

export interface VideoInfoProps {
    imageUrl?: string;
    title?: string;
    from?: string;  
    description?: string;
    character?: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({imageUrl, title, from, character, description}) => {
    return (
        <div className="w-[1206px] [h-256px] flex rounded-[16px] border border-gray-300 bg-white shadow-md overflow-hidden">
            {/* 왼쪽: 이미지 */}
            <div className="flex-shrink-0 p-3">
             {imageUrl ? ( <img src={imageUrl} alt="Video thumbnail" className="w-[398px] h-[224px] border-2 rounded-[12px] object-cover" style={{ borderColor: "#AEAEAE" }}/>
             ) : (<div className="w-[398px] h-[224px] rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm"> No Image </div>)}
            </div>
            
            {/* 오른쪽: 텍스트 */}
            <div className="flex flex-col justify-center flex-1 gap-2">
                <div className="text-[24px] font-bold">{title}</div>
                {from && <p className="text-[18px] text-gray-500 mb-4 font-semibold">from: {from}</p>}
                <div className="w-[700px] h-[95px] rounded-[12px] bg-gray-100 px-2">
                    <span className="font-bold text-[16px]">Character:</span>
                    <span className="font-bold text-[16px]">{character}</span>
                    <div className="text-gray-700 text-[16px]">{description}</div>
                </div>
            </div>
        </div>
    );
};

export default VideoInfo;


