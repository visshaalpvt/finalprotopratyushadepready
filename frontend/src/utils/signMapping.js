/**
 * signMapping.js
 * Defines the vocabulary for classroom sign language gestures.
 */

export const CLASSROOM_SIGNS = {
  UNDERSTAND: {
    id: 'understand',
    label: 'I understand',
    meaning: 'Student understands the lecture',
    icon: '✅',
    color: 'text-green-500'
  },
  NOT_UNDERSTAND: {
    id: 'not_understand',
    label: "I don't understand",
    meaning: 'Student needs clarification',
    icon: '❌',
    color: 'text-red-500'
  },
  QUESTION: {
    id: 'question',
    label: 'I have a question',
    meaning: 'Student has a question',
    icon: '❓',
    color: 'text-blue-500'
  },
  REPEAT: {
    id: 'repeat',
    label: 'Please repeat',
    meaning: 'Student requests repetition',
    icon: '🔁',
    color: 'text-yellow-500'
  },
  SLOW_DOWN: {
    id: 'slow_down',
    label: 'Please slow down',
    meaning: 'Student requests slower explanation',
    icon: '🐌',
    color: 'text-orange-500'
  },
  THANK_YOU: {
    id: 'thank_you',
    label: 'Thank you',
    meaning: 'Student appreciated the explanation',
    icon: '🙏',
    color: 'text-pink-500'
  }
};

export const getSignById = (id) => {
  return Object.values(CLASSROOM_SIGNS).find(sign => sign.id === id);
};
