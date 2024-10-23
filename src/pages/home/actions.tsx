import React from 'react';

const ActionButtons: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-5 justify-between self-center mt-5 w-full text-sm font-medium text-white max-w-[1042px] max-md:max-w-full">
            <div className="flex gap-2 items-start">
                <button className="gap-2.5 self-stretch px-2.5 py-2.5 bg-violet-700 rounded-xl" tabIndex={0}>Start Cropper</button>
                <button className="gap-2.5 self-stretch px-2.5 py-2.5 bg-violet-700 rounded-xl" tabIndex={0}>Remove Cropper</button>
                <button className="gap-2.5 self-stretch px-2.5 py-2.5 bg-violet-700 rounded-xl" tabIndex={0}>Generate Preview</button>
            </div>
            <div className="flex gap-2.5 items-center whitespace-nowrap">
                <button className="gap-2.5 self-stretch px-5 py-2.5 my-auto rounded-xl bg-zinc-700" tabIndex={0}>Cancel</button>
            </div>
        </div>
    );
};

export default ActionButtons;