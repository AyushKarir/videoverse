import React from 'react';
import VideoControls from './videocontrols';
import PreviewSection from './preview';
import ActionButtons from './actions';
import VideoTimeline from './timeline';
import PlaybackControls from './playback';

const VideoEditor: React.FC = () => {
    return (
        <main className="flex flex-col rounded-none shadow-[0px_-2px_82px_rgba(0,0,0,0.75)]">
            <section className="flex flex-col py-6 w-full rounded-xl border border-solid bg-neutral-700 border-neutral-700 max-md:max-w-full">
                <div className="flex flex-col ml-5 w-full max-w-[856px] max-md:max-w-full">
                    <div className="max-md:max-w-full">
                        <div className="flex gap-5 max-md:flex-col">
                            <div className="flex flex-col w-[79%] max-md:ml-0 max-md:w-full">
                                <VideoControls />
                            </div>
                            <PreviewSection />
                        </div>
                    </div>
                    <VideoTimeline />
                    <PlaybackControls />
                    <hr className="flex mt-24 w-full bg-neutral-600 min-h-[1px] max-md:mt-10 max-md:max-w-full" />
                    <ActionButtons />
                </div>
            </section>
        </main>
    );
};

export default VideoEditor;