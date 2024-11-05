import { useMemo } from "react";
const VideoPreview = ({ percentage, aRWidthPercent, children }) => {
    const clipPathValues = useMemo(() => {
        // Calculate how far right the overlay can move
        const maxRightPosition = 100 - aRWidthPercent;

        // Calculate the left clip position
        let leftClip;
        if (percentage >= maxRightPosition) {
            // When overlay is at or beyond maximum right position,
            // adjust left clip to maintain aspect ratio width
            leftClip = percentage - aRWidthPercent;
        } else {
            // Otherwise, use percentage directly
            leftClip = percentage;
        }

        // Calculate the right clip position
        // This remains consistent with the original formula
        // hello
        const rightClip = (100 - aRWidthPercent) - percentage;

        return {
            left: Math.max(0, leftClip), // Ensure we don't go below 0
            right: Math.max(0, rightClip), // Ensure we don't go below 0
        };
    }, [percentage, aRWidthPercent]);

    return (
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
    );
};

export default VideoPreview
