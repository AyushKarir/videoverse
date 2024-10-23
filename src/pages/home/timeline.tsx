import React from 'react';

const VideoTimeline: React.FC = () => {
    return (
        <div className="flex gap-2.5 items-center mt-4 max-md:max-w-full">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/20eefa1f896c619d3f4d0608da6b77f709bcb561222a66e33b95fe5b1179fe9c?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="Timeline control" className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square" />
            <div className="flex flex-col self-stretch py-0.5 my-auto rounded-none min-w-[240px] w-[430px] max-md:max-w-full">
                <div className="flex z-10 shrink-0 ml-10 w-3 h-3 bg-white rounded-full shadow-[0px_3px_6px_rgba(0,0,0,0.13)] max-md:ml-2.5" />
                <div className="flex shrink-0 h-1 rounded-md border border-solid bg-white bg-opacity-20 border-black border-opacity-10 max-md:max-w-full" />
            </div>
        </div>
    );
};

export default VideoTimeline;