import {View, Text, Image, ScrollView} from 'react-native';
export const useSharedValue = initialValue => ({value: initialValue});
export const useAnimatedStyle = fn => fn();
export const withTiming = (value, _opts) => value;
export const withSpring = (value, _opts) => value;
export const runOnJS = fn => fn;
export const Animated = {View, Text, Image, ScrollView};
export default {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Animated,
  View,
  Text,
  Image,
  ScrollView,
};
