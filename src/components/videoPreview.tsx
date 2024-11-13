import { useMemo } from "react";

interface VideoPreviewProps {
    percentage: number;
    aRWidthPercent: number;
    children: React.ReactNode;
};

const VideoPreview = ({ percentage, aRWidthPercent, children }: VideoPreviewProps) => {
    const clipPathValues = useMemo(() => {
        // Calculate how far right the overlay can move
        const maxRightPosition = 100 - aRWidthPercent + 5;
        // const maxRightPosition = 100;

        // Calculate the left clip position
        let leftClip;
        if (percentage >= maxRightPosition) {
            // When overlay is at or beyond maximum right position,
            // adjust left clip to maintain aspect ratio width
            leftClip = percentage - aRWidthPercent;
        }
        else {
            // Otherwise, use percentage directly
            leftClip = percentage;
        }

        // Calculate the right clip position
        // This remains consistent with the original formula
        // hello
        const rightClip = (100 - aRWidthPercent) < 0 ? percentage : (100 - aRWidthPercent) - percentage;

        return {
            left: Math.max(0, leftClip), // Ensure we don't go below 0
            right: Math.max(0, rightClip), // Ensure we don't go below 0
        };
    }, [percentage, aRWidthPercent]);

    return (
        <div>
            <div
                className="relative"
                style={{
                    overflow: "hidden",
                    position: "relative",
                    clipPath: `inset(0 ${clipPathValues.right}% 0 ${clipPathValues.left}%)`,
                }}
            >
                {children}
            </div>
            <div className="absolute inset-x-0 bottom-0 text-white text-xs bg-black bg-opacity-50 p-1">
                {clipPathValues.right.toFixed(2)}% <br />
                {clipPathValues.left.toFixed(2)}% <br />
                {aRWidthPercent.toFixed(2)}%
            </div>
        </div>
    );
};

export default VideoPreview





















// import { useMemo } from "react";

// interface VideoPreviewProps {
//     percentage: number;
//     aRWidthPercent: number;
//     children: React.ReactNode;
// };

// const VideoPreview = ({ percentage, aRWidthPercent, children }: VideoPreviewProps) => {
//     const clipPathValues = useMemo(() => {
//         // Calculate how far right the overlay can move
//         const maxRightPosition = 100 - aRWidthPercent;

//         // Calculate the left clip position
//         let leftClip;
//         if (percentage >= maxRightPosition) {
//             // When overlay is at or beyond maximum right position,
//             // adjust left clip to maintain aspect ratio width
//             leftClip = percentage - aRWidthPercent;
//         } else {
//             // Otherwise, use percentage directly
//             leftClip = percentage;
//         }



//         // const rightClip = (100 - aRWidthPercent) - percentage;
//         const rightClip = percentage > aRWidthPercent ? (100) - percentage : (100 - aRWidthPercent) - percentage;

//         return {
//             left: Math.max(0, leftClip), // Ensure we don't go below 0
//             right: Math.max(0, rightClip), // Ensure we don't go below 0
//         };
//     }, [percentage, aRWidthPercent]);

//     return (
//         <div>
//             <div
//                 className="relative"
//                 style={{
//                     overflow: "hidden",
//                     position: "relative",
//                     clipPath: `inset(0 ${clipPathValues.right}% 0 ${clipPathValues.left}%)`,
//                 }}
//             >
//                 {children}
//             </div>
//             <div className="absolute inset-x-0 bottom-0 text-white text-xs bg-black bg-opacity-50 p-1">
//                 right: {clipPathValues.right.toFixed(2)}% <br />
//                 left:  {clipPathValues.left.toFixed(2)}% <br />
//                 overlayWidth: {aRWidthPercent.toFixed(2)}% <br />

//             </div>
//         </div>
//     );
// };

// export default VideoPreview