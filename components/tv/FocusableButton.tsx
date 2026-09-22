import React from 'react';
import {Text, StyleSheet, ViewStyle, StyleProp} from 'react-native';
import Focusable from './Focusable';
import {isTV} from './tv';
import {tvFontScale} from './tvTheme';

interface FocusableButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color?: string;
  accessibilityLabel: string;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FocusableButton: React.FC<FocusableButtonProps> = ({
  title,
  onPress,
  disabled,
  color = '#BB86FC',
  accessibilityLabel,
  hasTVPreferredFocus,
  style,
}) => {
  return (
    <Focusable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hasTVPreferredFocus={hasTVPreferredFocus}
      disabled={disabled}
      style={[
        styles.button,
        {borderColor: color},
        disabled && styles.disabled,
        style,
      ]}>
      <Text style={[styles.text, {color}, isTV && {fontSize: tvFontScale(18)}]}>
        {title}
      </Text>
    </Focusable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
  },
  text: {
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default FocusableButton;
