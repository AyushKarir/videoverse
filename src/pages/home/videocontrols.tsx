import React from 'react';

const VideoControls: React.FC = () => {
    return (
        <div className="flex flex-col items-start w-full max-md:mt-1 max-md:max-w-full">
            <header className="flex flex-wrap gap-5 justify-between self-stretch w-full text-white max-md:max-w-full">
                <h1 className="my-auto text-base font-bold">Cropper</h1>
                <nav className="flex gap-1 px-1 py-1 text-xs font-medium text-center rounded-md bg-zinc-700">
                    <button className="px-1 py-2 rounded-md bg-zinc-700" tabIndex={0}>Preview Session</button>
                    <button className="px-4 py-2 rounded-md bg-neutral-700" tabIndex={0}>Generate Session</button>
                </nav>
            </header>
            <section className="flex relative flex-col mt-5 max-w-full rounded-md min-h-[307px] w-[460px]">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/981a568f35c28e275c1f3b2e987c2d1899dbedf50f7cbf5b7c216502cc684352?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="Video preview" className="object-cover absolute inset-0 size-full" />
                <div className="flex relative flex-col items-center px-20 rounded-md bg-black bg-opacity-30 max-md:px-5 max-md:max-w-full">
                    <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/ef5b9e9050e3ae1df6a45757dd9047e9b0f36974fe4b7f53747d30849ae6fd39?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="" className="object-contain max-w-full aspect-[0.45] w-[137px]" />
                </div>
            </section>
        </div>
    );
};

export default VideoControls;