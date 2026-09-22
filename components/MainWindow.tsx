import React, {useState, useEffect} from 'react';
import {
  Platform,
  View,
  TextInput,
  Text,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  TVFocusGuideView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EventRegister} from 'react-native-event-listeners';
import RNFS from 'react-native-fs';
import {
  Focusable,
  FocusableSwitch,
  FocusableButton,
  isTV,
  OVERSCAN,
  tvFontScale,
  tvPadding,
} from './tv';
import Ionicons from '@react-native-vector-icons/ionicons';
import HelpModal from './help/HelpModal';

interface MainWindowProps {
  dsIP: string;
  qosValue: number;
  priMode: number;
  priFact: number;
  jpegQuality: number;
  debugging: boolean;
  streaming: boolean;
  hzStreaming: boolean;
  startStream: () => void;
  stopStream: () => void;
  startHzStream: () => void;
  stopHzStream: () => void;
  updateDsIP: (dsIP: string) => void;
  updateJpegQuality: (jpegQuality: number) => void;
  updateCpuLimit: (cpuLimit: number) => void;
  navigateToStreamWindow: (
    mode: 'top' | 'bottom' | 'both',
    showFps: boolean,
  ) => void;
  recordingEnabled: boolean;
  setRecordingEnabled: (enabled: boolean) => void;
  hzModEnabled: boolean;
  setHzModEnabled: (enabled: boolean) => void;
  cpuLimit: number;
  setCpuLimit: (limit: number) => void;
  hzConnected: boolean;
  hzDisconnected: boolean;
}

const MainWindow: React.FC<MainWindowProps> = props => {
  const [dsIP, setDsIP] = useState<string>(props.dsIP);
  const [qosValue, setQosValue] = useState<string>(props.qosValue.toString());
  const [jpegQuality, setJpegQuality] = useState<string>(
    props.jpegQuality.toString(),
  );
  const [priorityFactor, setPriorityFactor] = useState<number>(props.priFact);
  const [screenPriority, setScreenPriority] = useState<number>(1);
  const [showFps, setShowFps] = useState<boolean>(false);
  const [bothViewEnabled, setBothViewEnabled] = useState<boolean>(true);
  const [helpVisible, setHelpVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('mainWindowSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.dsIP) {
            setDsIP(settings.dsIP);
          }
          if (settings.qosValue) {
            setQosValue(settings.qosValue);
          }
          if (settings.jpegQuality) {
            setJpegQuality(settings.jpegQuality);
          }
          if (settings.priorityFactor || settings.priorityFactor === 0) {
            setPriorityFactor(settings.priorityFactor);
          }
          if (settings.screenPriority || settings.screenPriority === 0) {
            setScreenPriority(settings.screenPriority);
          }
          if (settings.showFps !== undefined) {
            setShowFps(settings.showFps);
          }
          if (settings.bothViewEnabled !== undefined) {
            setBothViewEnabled(settings.bothViewEnabled);
          }
        }
      } catch (error) {
        console.log('Error loading mainWindowSettings:', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenTutorial');
        if (seen !== 'true') {
          setHelpVisible(true);
          await AsyncStorage.setItem('hasSeenTutorial', 'true');
        }
      } catch (error) {
        console.log('Error reading hasSeenTutorial:', error);
      }
    })();
  }, []);

  useEffect(() => {
    const settings = {
      dsIP,
      qosValue,
      jpegQuality,
      priorityFactor,
      screenPriority,
      showFps,
      bothViewEnabled,
    };
    AsyncStorage.setItem('mainWindowSettings', JSON.stringify(settings)).catch(
      error => console.error('Failed to save mainWindowSettings:', error),
    );
  }, [
    dsIP,
    qosValue,
    jpegQuality,
    priorityFactor,
    screenPriority,
    showFps,
    bothViewEnabled,
  ]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      hasAndroidPermission().then(hasPermission => {
        if (!hasPermission) {
          console.log('Storage permission denied by user.');
        }
      });
    }
  }, []);

  async function hasAndroidPermission() {
    if (Number(Platform.Version) >= 33) {
      return true;
    }

    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission, {
      title: 'Storage Permission',
      message: 'App needs access to your storage to save recordings',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    return status === 'granted';
  }

  useEffect(() => {
    const handleStateChanged = (state: string) => {
      console.log('Stream state changed:', state);
    };

    EventRegister.addEventListener('stateChanged', handleStateChanged);
    return () => {
      EventRegister.removeEventListener('stateChanged');
    };
  }, []);

  const handleStartStopStream = () => {
    props.updateDsIP(dsIP);
    const jpegq = parseInt(jpegQuality, 10);
    const qosvalue = parseInt(qosValue, 10) * 2;

    EventRegister.emit('streamSettings', {
      screenPriority,
      priorityFactor,
      jpegq,
      qosvalue,
    });

    if (props.streaming) {
      props.hzModEnabled ? props.stopHzStream() : props.stopStream();
    } else {
      props.hzModEnabled ? props.startHzStream() : props.startStream();
    }
  };

  const recordingDirectory =
    Platform.OS === 'android'
      ? `${RNFS.ExternalStorageDirectoryPath}/Documents/Recordings`
      : `${RNFS.DocumentDirectoryPath}/Recordings`;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerRow,
          isTV && {paddingHorizontal: OVERSCAN, paddingTop: OVERSCAN},
        ]}>
        <Focusable
          onPress={() => setHelpVisible(true)}
          style={[styles.helpButton, isTV && styles.tvHelpButton]}
          accessibilityLabel="Help"
          accessibilityRole="button">
          <Ionicons
            name="help-circle-outline"
            size={isTV ? 36 : 28}
            color="#BB86FC"
          />
        </Focusable>
      </View>
      <TVFocusGuideView autoFocus style={styles.focusGuide}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            isTV && {padding: tvPadding(20), paddingHorizontal: OVERSCAN},
          ]}>
          {/* Section: IP and Stream Control */}
          <View style={[styles.section, isTV && {padding: tvPadding(16)}]}>
            <Text style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
              IP Address
            </Text>
            <TextInput
              style={styles.input}
              placeholder="DS IP Address"
              placeholderTextColor="#B0B0B0"
              value={dsIP}
              onChangeText={setDsIP}
              accessibilityLabel="DS IP Address"
            />
            <Focusable
              style={[styles.button, isTV && styles.tvButton]}
              onPress={handleStartStopStream}
              hasTVPreferredFocus={isTV}
              accessibilityLabel={
                props.streaming ? 'Stop Stream' : 'Start Stream'
              }>
              <Text
                style={[
                  styles.buttonText,
                  isTV && {fontSize: tvFontScale(16)},
                ]}>
                {props.streaming ? 'Stop Stream' : 'Start Stream'}
              </Text>
            </Focusable>
          </View>

          {/* Section: Priority Settings */}
          <View style={[styles.section, isTV && {padding: tvPadding(16)}]}>
            <Text style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
              Priority Factor
            </Text>
            <View
              accessibilityLabel={`Priority Factor: ${priorityFactor}`}
              style={styles.priorityContainer}>
              <FocusableButton
                title="-"
                onPress={() =>
                  !props.hzModEnabled &&
                  setPriorityFactor(prev => Math.max(prev - 1, 0))
                }
                disabled={props.hzModEnabled}
                color="#BB86FC"
                accessibilityLabel="Decrease priority factor"
              />
              <TextInput
                style={[
                  styles.priorityInput,
                  props.hzModEnabled && styles.disabledInput,
                ]}
                value={priorityFactor.toString()}
                onChangeText={text =>
                  !props.hzModEnabled && setPriorityFactor(parseInt(text, 10))
                }
                keyboardType="numeric"
                editable={!props.hzModEnabled}
                accessibilityLabel="Priority Factor"
              />
              <FocusableButton
                title="+"
                onPress={() =>
                  !props.hzModEnabled && setPriorityFactor(prev => prev + 1)
                }
                disabled={props.hzModEnabled}
                color="#BB86FC"
                accessibilityLabel="Increase priority factor"
              />
            </View>

            <Text style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
              Screen Priority
            </Text>
            <View style={styles.screenPriorityContainer}>
              <Focusable
                style={[
                  styles.screenPriorityButton,
                  screenPriority === 1 && styles.selectedButton,
                  isTV && styles.tvButton,
                ]}
                onPress={() => !props.hzModEnabled && setScreenPriority(1)}
                accessibilityLabel="Top Screen priority">
                <Text
                  style={[
                    styles.buttonText,
                    isTV && {fontSize: tvFontScale(16)},
                  ]}>
                  Top Screen
                </Text>
              </Focusable>
              <Focusable
                style={[
                  styles.screenPriorityButton,
                  screenPriority === 0 && styles.selectedButton,
                  props.hzModEnabled && styles.disabledButton,
                  isTV && styles.tvButton,
                ]}
                onPress={() => !props.hzModEnabled && setScreenPriority(0)}
                disabled={props.hzModEnabled}
                accessibilityLabel="Bottom Screen priority">
                <Text
                  style={[
                    styles.buttonText,
                    isTV && {fontSize: tvFontScale(16)},
                  ]}>
                  Bottom Screen
                </Text>
              </Focusable>
            </View>
          </View>

          {/* Section: JPEG and QoS Settings */}
          <View style={[styles.section, isTV && {padding: tvPadding(16)}]}>
            <Text style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
              JPEG Quality
            </Text>
            <TextInput
              style={styles.input}
              placeholder="JPEG Quality"
              placeholderTextColor="#B0B0B0"
              keyboardType="numeric"
              value={jpegQuality}
              onChangeText={text => {
                setJpegQuality(text);
                props.updateJpegQuality(parseInt(text, 10));
              }}
              accessibilityLabel="JPEG Quality"
            />

            {props.hzModEnabled ? (
              <>
                <Text
                  style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
                  CPU Limit
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="CPU Limit"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="numeric"
                  value={props.cpuLimit.toString()}
                  onChangeText={text => {
                    const limit = parseInt(text, 10);
                    if (!isNaN(limit)) {
                      props.setCpuLimit(limit);
                      props.updateCpuLimit(limit);
                    }
                  }}
                  accessibilityLabel="CPU Limit"
                />
              </>
            ) : (
              <>
                <Text
                  style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
                  QoS Value
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="QoS Value"
                  placeholderTextColor="#B0B0B0"
                  keyboardType="numeric"
                  value={qosValue}
                  onChangeText={setQosValue}
                  accessibilityLabel="QoS Value"
                />
              </>
            )}
          </View>

          {/* Section: Additional Options */}
          <View style={[styles.section, isTV && {padding: tvPadding(16)}]}>
            <FocusableSwitch
              label="Show FPS"
              value={showFps}
              onValueChange={setShowFps}
              style={styles.switchContainer}
            />
            <FocusableSwitch
              label="Enable Recording"
              value={props.recordingEnabled}
              onValueChange={props.setRecordingEnabled}
              style={styles.switchContainer}
            />
            {props.recordingEnabled && (
              <>
                <Text
                  style={[styles.label, isTV && {fontSize: tvFontScale(16)}]}>
                  Recordings will be saved to:
                </Text>
                <Text style={styles.directoryPath}>{recordingDirectory}</Text>
              </>
            )}
            <FocusableSwitch
              label="HzMod"
              value={props.hzModEnabled}
              onValueChange={(enabled: boolean) => {
                props.setHzModEnabled(enabled);
                if (enabled) {
                  setBothViewEnabled(false);
                }
              }}
              style={styles.switchContainer}
            />
            <FocusableSwitch
              label="Both View"
              value={bothViewEnabled}
              onValueChange={setBothViewEnabled}
              disabled={props.hzModEnabled}
              style={styles.switchContainer}
            />
          </View>

          {/* Navigation Buttons */}
          {props.hzModEnabled ? (
            <Focusable
              style={[styles.button, isTV && styles.tvButton]}
              onPress={() => props.navigateToStreamWindow('top', showFps)}
              accessibilityLabel="Go to Stream Window Top">
              <Text
                style={[
                  styles.buttonText,
                  isTV && {fontSize: tvFontScale(16)},
                ]}>
                Go to Stream Window (Top)
              </Text>
            </Focusable>
          ) : bothViewEnabled ? (
            <Focusable
              style={[styles.button, isTV && styles.tvButton]}
              onPress={() => props.navigateToStreamWindow('both', showFps)}
              accessibilityLabel="Go to Stream Window Both">
              <Text
                style={[
                  styles.buttonText,
                  isTV && {fontSize: tvFontScale(16)},
                ]}>
                Go to Stream Window (Both)
              </Text>
            </Focusable>
          ) : (
            <>
              <Focusable
                style={[styles.button, isTV && styles.tvButton]}
                onPress={() => props.navigateToStreamWindow('top', showFps)}
                accessibilityLabel="Go to Stream Window Top">
                <Text
                  style={[
                    styles.buttonText,
                    isTV && {fontSize: tvFontScale(16)},
                  ]}>
                  Go to Stream Window (Top)
                </Text>
              </Focusable>
              <Focusable
                style={[styles.button, isTV && styles.tvButton]}
                onPress={() => props.navigateToStreamWindow('bottom', showFps)}
                accessibilityLabel="Go to Stream Window Bottom">
                <Text
                  style={[
                    styles.buttonText,
                    isTV && {fontSize: tvFontScale(16)},
                  ]}>
                  Go to Stream Window (Bottom)
                </Text>
              </Focusable>
            </>
          )}
        </ScrollView>
      </TVFocusGuideView>
      <HelpModal visible={helpVisible} onClose={() => setHelpVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#E0E0E0',
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  priorityInput: {
    height: 50,
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    flex: 1,
    marginHorizontal: 8,
  },
  disabledInput: {
    backgroundColor: '#555',
  },
  screenPriorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  screenPriorityButton: {
    flex: 1,
    backgroundColor: '#BB86FC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#6200EE',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  directoryPath: {
    color: '#E0E0E0',
    fontSize: 14,
    marginTop: 4,
  },
  tvButton: {
    paddingVertical: 20,
    minHeight: 56,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  helpButton: {padding: 5},
  tvHelpButton: {padding: 12},
  focusGuide: {flex: 1},
});

export default MainWindow;
