import React from 'react';
import {Modal, View, Text, ScrollView, StyleSheet} from 'react-native';
import {Focusable, isTV, OVERSCAN, tvFontScale, tvPadding} from '../tv';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const USAGE_STEPS = [
  '1. Launch BootNTR on the 3DS — make sure the 3DS and this device are on the same Wi-Fi network.',
  '2. Enter the 3DS IP address in the connection settings and tap Connect to start streaming.',
  '3. Toggle "Enable Recording" in settings, then use Start/Stop Recording to capture footage.',
];

const TROUBLESHOOTING_ITEMS = [
  'Connection issues: Verify both devices are on the same network and the IP address is correct. If the stream does not start, reboot the 3DS and restart BootNTR.',
  'Recording problems: Make sure the app has write permission to the save location and that recording is enabled in settings before starting.',
];

const HelpModal: React.FC<HelpModalProps> = ({visible, onClose}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            isTV && {
              padding: tvPadding(24),
              marginHorizontal: OVERSCAN,
              marginVertical: OVERSCAN,
            },
          ]}>
          <Text
            style={[styles.title, isTV && {fontSize: tvFontScale(22)}]}
            accessibilityRole="header">
            How to use AdorableNTR
          </Text>
          <ScrollView style={styles.scrollArea}>
            <Text
              style={[
                styles.sectionHeading,
                isTV && {fontSize: tvFontScale(18)},
              ]}
              accessibilityRole="header">
              Usage
            </Text>
            {USAGE_STEPS.map((step, index) => (
              <Text
                key={index}
                style={[styles.body, isTV && {fontSize: tvFontScale(14)}]}>
                {step}
              </Text>
            ))}
            <Text
              style={[
                styles.sectionHeading,
                isTV && {fontSize: tvFontScale(18)},
              ]}
              accessibilityRole="header">
              Troubleshooting
            </Text>
            {TROUBLESHOOTING_ITEMS.map((item, index) => (
              <Text
                key={index}
                style={[styles.body, isTV && {fontSize: tvFontScale(14)}]}>
                {item}
              </Text>
            ))}
          </ScrollView>
          <Focusable
            style={[styles.closeButton, isTV && styles.tvCloseButton]}
            onPress={onClose}
            accessibilityLabel="Close"
            hasTVPreferredFocus={true}>
            <Text
              style={[
                styles.closeButtonText,
                isTV && {fontSize: tvFontScale(16)},
              ]}>
              Close
            </Text>
          </Focusable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    maxHeight: '85%',
    width: '90%',
    maxWidth: 500,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollArea: {marginBottom: 16},
  sectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#BB86FC',
    marginTop: 12,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 22,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  tvCloseButton: {paddingVertical: 20, minHeight: 56},
  closeButtonText: {color: '#FFFFFF', fontWeight: '600', fontSize: 16},
});

export default HelpModal;
