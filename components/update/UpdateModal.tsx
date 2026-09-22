import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TVFocusGuideView,
  ActivityIndicator,
} from 'react-native';
import {Focusable, isTV, OVERSCAN, tvFontScale, tvPadding} from '../tv';

interface UpdateModalProps {
  visible: boolean;
  versionName: string;
  downloading: boolean;
  progress: number;
  onUpdate: () => void;
  onLater: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  versionName,
  downloading,
  progress,
  onUpdate,
  onLater,
}) => {
  const cardContent = (
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
        {downloading ? 'Downloading Update...' : 'Update Available'}
      </Text>
      {downloading ? (
        <View style={styles.progressContainer}>
          <ActivityIndicator size="large" color="#BB86FC" />
          <Text style={[styles.body, isTV && {fontSize: tvFontScale(16)}]}>
            {progress > 0 ? `${progress}%` : 'Starting download...'}
          </Text>
        </View>
      ) : (
        <Text style={[styles.body, isTV && {fontSize: tvFontScale(16)}]}>
          New version {versionName} is available. Would you like to update now?
        </Text>
      )}
      <View style={styles.buttonRow}>
        <Focusable
          style={[
            styles.button,
            styles.updateButton,
            isTV && styles.tvButton,
            downloading && styles.disabledButton,
          ]}
          onPress={onUpdate}
          disabled={downloading}
          accessibilityLabel="Update now"
          hasTVPreferredFocus={true}>
          <Text
            style={[styles.buttonText, isTV && {fontSize: tvFontScale(16)}]}>
            Update now
          </Text>
        </Focusable>
        <Focusable
          style={[
            styles.button,
            styles.laterButton,
            isTV && styles.tvButton,
            downloading && styles.disabledButton,
          ]}
          onPress={onLater}
          disabled={downloading}
          accessibilityLabel="Later">
          <Text
            style={[
              styles.buttonText,
              styles.laterButtonText,
              isTV && {fontSize: tvFontScale(16)},
            ]}>
            Later
          </Text>
        </Focusable>
      </View>
    </View>
  );

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onLater}>
      <View style={styles.overlay}>
        {isTV ? (
          <TVFocusGuideView autoFocus style={styles.tvFocusGuide}>
            {cardContent}
          </TVFocusGuideView>
        ) : (
          cardContent
        )}
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
  body: {
    fontSize: 16,
    color: '#E0E0E0',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#BB86FC',
  },
  laterButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  tvButton: {
    paddingVertical: 20,
    minHeight: 56,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  laterButtonText: {
    color: '#BB86FC',
  },
  tvFocusGuide: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UpdateModal;
