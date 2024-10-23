import React from 'react';

const PlaybackControls: React.FC = () => {
    return (
        <div className="flex gap-10 mt-2.5 max-w-full w-[460px]">
            <div className="flex flex-col grow shrink-0 text-xs basis-0 w-fit">
                <div className="flex gap-1.5 items-center self-start font-medium whitespace-nowrap">
                    <time className="self-stretch my-auto text-white">00:10:09</time>
                    <div className="flex shrink-0 self-stretch my-auto w-px bg-white bg-opacity-50 h-[15px]" />
                    <time className="self-stretch my-auto text-white text-opacity-50">00:15:17</time>
                </div>
                <div className="flex gap-2 mt-4 w-full text-white">
                    <button className="flex gap-1.5 items-center px-2.5 py-2 rounded-md border border-solid bg-neutral-700 border-zinc-700" tabIndex={0}>
                        <span className="self-stretch my-auto">Playback speed <span className="text-gray-400">1x</span></span>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/19dbfd428876e7c350ad8f73c6dd5b0824eca17bca9b1dc5fa93586b7ba3d409?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="" className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square" />
                    </button>
                    <button className="flex gap-1.5 items-center px-2.5 py-2 rounded-md border border-solid bg-neutral-700 border-zinc-700" tabIndex={0}>
                        <span className="self-stretch my-auto">Cropper Aspect Ratio <span className="text-gray-400">9:16</span></span>
                        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/19dbfd428876e7c350ad8f73c6dd5b0824eca17bca9b1dc5fa93586b7ba3d409?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="" className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square" />
                    </button>
                </div>
            </div>
            <div className="flex gap-2.5 items-center self-start">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/23d1bc32d44b94e495b326f1567abbd2c1807cd0dc0d673eede14494f15fa0a5?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="Volume control" className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square" />
                <div className="flex self-stretch my-auto rounded-none w-[45px]">
                    <div className="flex shrink-0 w-2.5 h-2.5 bg-white rounded-full shadow-[0px_3px_6px_rgba(0,0,0,0.13)]" />
                    <div className="flex shrink-0 self-start h-1 rounded-md border border-solid bg-white bg-opacity-20 border-black border-opacity-10" />
                </div>
            </div>
        </div>
    );
};

export default PlaybackControls;