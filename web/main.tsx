import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import MainWindow from '../components/MainWindow';

const noop = () => {};

const WebApp = () => {
  const [dsIP, setDsIP] = useState('192.168.1.1');
  const [streaming, setStreaming] = useState(false);
  const [hzStreaming, setHzStreaming] = useState(false);
  const [jpegQuality, setJpegQuality] = useState(70);
  const [cpuLimit, setCpuLimit] = useState(45);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [hzModEnabled, setHzModEnabled] = useState(false);

  return (
    <MainWindow
      dsIP={dsIP}
      qosValue={20}
      priMode={1}
      priFact={1}
      jpegQuality={jpegQuality}
      debugging={false}
      streaming={streaming}
      hzStreaming={hzStreaming}
      startStream={() => setStreaming(true)}
      stopStream={() => setStreaming(false)}
      startHzStream={() => setHzStreaming(true)}
      stopHzStream={() => setHzStreaming(false)}
      updateDsIP={setDsIP}
      updateJpegQuality={setJpegQuality}
      updateCpuLimit={setCpuLimit}
      navigateToStreamWindow={noop}
      recordingEnabled={recordingEnabled}
      setRecordingEnabled={setRecordingEnabled}
      hzModEnabled={hzModEnabled}
      setHzModEnabled={setHzModEnabled}
      cpuLimit={cpuLimit}
      setCpuLimit={setCpuLimit}
      hzConnected={false}
      hzDisconnected={false}
    />
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<WebApp />);
