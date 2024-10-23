import React from 'react';

const PreviewSection: React.FC = () => {
    return (
        <aside className="flex flex-col ml-5 w-[21%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col items-center self-stretch my-auto text-xs font-bold text-white text-opacity-50 max-md:mt-10">
                <h2>Preview</h2>
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1a0ed6397b0108564415f4f6d65cbb5c330445d52107873a78f4b2217c018261?apiKey=0d077a2acf694b7cb4b62703e3fdb67d&" alt="" className="object-contain mt-44 w-6 aspect-square max-md:mt-10" />
                <p className="mt-2.5 text-center text-white">Preview not available</p>
                <p className="self-stretch mt-2 font-medium text-center">Please click on "Start Cropper" and then play video</p>
            </div>
        </aside>
    );
};

export default PreviewSection;