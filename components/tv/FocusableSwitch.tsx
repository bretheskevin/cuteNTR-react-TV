import React, {useCallback} from 'react';
import {
  Switch,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Focusable from './Focusable';
import {isTV} from './tv';
import {tvFontScale} from './tvTheme';

interface FocusableSwitchProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FocusableSwitch: React.FC<FocusableSwitchProps> = ({
  label,
  value,
  onValueChange,
  disabled,
  hasTVPreferredFocus,
  style,
}) => {
  const handlePress = useCallback(() => {
    if (!disabled) {
      onValueChange(!value);
    }
  }, [disabled, value, onValueChange]);

  if (!isTV) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          accessibilityLabel={label}
        />
      </View>
    );
  }

  return (
    <Focusable
      onPress={handlePress}
      accessibilityLabel={`${label}, ${value ? 'on' : 'off'}`}
      accessibilityRole="switch"
      hasTVPreferredFocus={hasTVPreferredFocus}
      disabled={disabled}
      style={[styles.container, style]}>
      <Text style={[styles.label, {fontSize: tvFontScale(16)}]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={label}
      />
    </Focusable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
  },
});

export default FocusableSwitch;
