/**
 * SignClassifier.js
 * Classifies hand landmarks into classroom signs.
 */
import { getFingerStates, getDistance } from '../utils/handLandmarkProcessor';

export const classifySign = (landmarks) => {
  if (!landmarks) return null;

  const fingers = getFingerStates(landmarks);
  if (!fingers) return null;

  const { thumb, index, middle, ring, pinky } = fingers;

  // 1. Thumbs Up -> UNDERSTAND
  if (thumb && !index && !middle && !ring && !pinky) {
    return { id: 'understand', confidence: 0.98 };
  }

  // 2. Pinky Up -> NOT_UNDERSTAND
  if (!thumb && !index && !middle && !ring && pinky) {
    return { id: 'not_understand', confidence: 0.95 };
  }

  // 3. Index Up -> QUESTION
  if (!thumb && index && !middle && !ring && !pinky) {
    return { id: 'question', confidence: 0.97 };
  }

  // 4. Index + Middle Up (V Sign) -> REPEAT
  if (!thumb && index && middle && !ring && !pinky) {
    return { id: 'repeat', confidence: 0.96 };
  }

  // 5. Open Palm -> SLOW_DOWN
  if (thumb && index && middle && ring && pinky) {
    return { id: 'slow_down', confidence: 0.94 };
  }

  // 6. Thumb + Pinky (Shaka) -> THANK_YOU
  if (thumb && !index && !middle && !ring && pinky) {
    return { id: 'thank_you', confidence: 0.92 };
  }

  return null;
};
