import { Animated, Easing } from 'react-native';

/**
 * Animation utilities for the Chinese Chess game
 */

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const EASING_FUNCTIONS = {
  easeInOut: Easing.inOut(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1.3),
};

/**
 * Animate piece selection with a scale effect
 */
export const animatePieceSelection = (
  scaleValue: Animated.Value,
  selected: boolean
): void => {
  Animated.spring(scaleValue, {
    toValue: selected ? 1.1 : 1,
    useNativeDriver: true,
    tension: 100,
    friction: 8,
  }).start();
};

/**
 * Animate piece move with translation
 */
export const animatePieceMove = (
  translateX: Animated.Value,
  translateY: Animated.Value,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  onComplete?: () => void
): void => {
  // Set initial position
  translateX.setValue(fromX);
  translateY.setValue(fromY);

  // Animate to final position
  Animated.parallel([
    Animated.timing(translateX, {
      toValue: toX,
      duration: ANIMATION_DURATIONS.normal,
      easing: EASING_FUNCTIONS.easeInOut,
      useNativeDriver: true,
    }),
    Animated.timing(translateY, {
      toValue: toY,
      duration: ANIMATION_DURATIONS.normal,
      easing: EASING_FUNCTIONS.easeInOut,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

/**
 * Animate capture with a fade out effect
 */
export const animateCapture = (
  opacityValue: Animated.Value,
  scaleValue: Animated.Value,
  onComplete?: () => void
): void => {
  Animated.parallel([
    Animated.timing(opacityValue, {
      toValue: 0,
      duration: ANIMATION_DURATIONS.fast,
      easing: EASING_FUNCTIONS.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(scaleValue, {
      toValue: 0.8,
      duration: ANIMATION_DURATIONS.fast,
      easing: EASING_FUNCTIONS.easeOut,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

/**
 * Animate valid move hint with a pulse effect
 */
export const animateValidMoveHint = (scaleValue: Animated.Value): void => {
  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: ANIMATION_DURATIONS.fast,
        easing: EASING_FUNCTIONS.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.fast,
        easing: EASING_FUNCTIONS.easeInOut,
        useNativeDriver: true,
      }),
    ]).start(() => pulse());
  };
  pulse();
};

/**
 * Animate check warning with a shake effect
 */
export const animateCheckWarning = (
  translateX: Animated.Value,
  onComplete?: () => void
): void => {
  const shakeDistance = 10;
  
  Animated.sequence([
    Animated.timing(translateX, {
      toValue: -shakeDistance,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: shakeDistance,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: -shakeDistance,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: shakeDistance,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]).start(onComplete);
};

/**
 * Animate board entrance with stagger effect
 */
export const animateBoardEntrance = (
  opacityValues: Animated.Value[],
  scaleValues: Animated.Value[],
  onComplete?: () => void
): void => {
  // Create staggered animations for each row
  const animations = opacityValues.map((opacity, index) => {
    const scale = scaleValues[index];
    
    return Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATIONS.normal,
        delay: index * 50,
        easing: EASING_FUNCTIONS.easeOut,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay: index * 50,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);
  });

  Animated.stagger(50, animations).start(onComplete);
};