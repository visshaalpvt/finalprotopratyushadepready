/**
 * handLandmarkProcessor.js
 * Utility to process MediaPipe hand landmarks and extract features.
 */

/**
 * Calculates if a finger is "up" based on tip position vs joint positions.
 * @param {Array} landmarks - 21 hand landmarks from MediaPipe
 * @returns {Object} Finger states { thumb, index, middle, ring, pinky }
 */
export const getFingerStates = (landmarks) => {
  if (!landmarks || landmarks.length < 21) return null;

  // Comparison for Thumb is slightly different (horizontal vs vertical)
  // Check if Thumb tip (4) is outside Thumb IP (2) or MCP (1)? 
  // Simple check: is Pinky tip (4) higher than MCP (2) relative to wrist?
  // Let's use a simpler heuristic: Tip Y < PIP Y (coordinate system has 0 at top)
  
  const isUp = (tipIdx, pipIdx) => landmarks[tipIdx].y < landmarks[pipIdx].y;

  // Thumb: compare x position with MCP for horizontal extension
  // Depends on which hand, but let's just check distance for now or use a simple Y check if suitable
  const thumbUp = Math.abs(landmarks[4].x - landmarks[2].x) > Math.abs(landmarks[3].x - landmarks[2].x) + 0.02;

  return {
    thumb: thumbUp,
    index: isUp(8, 6),
    middle: isUp(12, 10),
    ring: isUp(16, 14),
    pinky: isUp(20, 18)
  };
};

/**
 * Helper to get distance between two landmarks
 */
export const getDistance = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow(p1.z - p2.z, 2)
  );
};
