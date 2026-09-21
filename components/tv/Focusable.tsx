import React, {useState, useCallback} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  GestureResponderEvent,
  AccessibilityRole,
  TouchableOpacityProps,
} from 'react-native';
import {isTV} from './tv';
import {FOCUS_RING_COLOR, FOCUS_RING_WIDTH} from './tvTheme';

const FocusableTouchable = TouchableOpacity as React.ComponentType<
  TouchableOpacityProps & {focusable?: boolean}
>;

interface FocusableProps {
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel: string;
  accessibilityRole?: AccessibilityRole;
  hasTVPreferredFocus?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

const Focusable: React.FC<FocusableProps> = ({
  onPress,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
  hasTVPreferredFocus,
  disabled,
  children,
}) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);
  return (
    <FocusableTouchable
      onPress={onPress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[style, isTV && styles.idleBorder, focused && styles.focusRing]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      focusable={true}
      hasTVPreferredFocus={hasTVPreferredFocus}
      disabled={disabled}>
      {children}
    </FocusableTouchable>
  );
};

const styles = StyleSheet.create({
  idleBorder: {
    borderWidth: FOCUS_RING_WIDTH,
    borderColor: 'transparent',
  },
  focusRing: {
    borderWidth: FOCUS_RING_WIDTH,
    borderColor: FOCUS_RING_COLOR,
    transform: [{scale: 1.02}],
  },
});

export default Focusable;
