import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import ScreenCaptureUtil, {
  ScreenCaptureResult,
} from 'react-native-lewin-screen-capture';
import {Tester, TestCase, TestSuite} from '@rnoh/testerino';

type MethodName = 'startListener' | 'stopListener' | 'screenCapture' | 'clearCache';

function formatCapture(data: ScreenCaptureResult): string {
  const base64 = data?.base64 ?? '';
  return `code=${data?.code ?? 'unknown'} uri=${data?.uri ?? ''} base64=${base64.length} chars`;
}

export default function ScreenCaptureDemo() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [listening, setListening] = useState(false);
  const [previewBase64, setPreviewBase64] = useState('');
  const listeningRef = useRef(false);

  useEffect(() => {
    return () => {
      if (listeningRef.current) {
        try {
          ScreenCaptureUtil.stopListener().catch(() => {});
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  const setResult = (method: MethodName, text: string): void => {
    setResults(prev => ({...prev, [method]: text}));
    setErrors(prev => ({...prev, [method]: ''}));
  };

  const setError = (method: MethodName, text: string): void => {
    setErrors(prev => ({...prev, [method]: text}));
    setResults(prev => ({...prev, [method]: ''}));
  };

  const handleStartListener = (): void => {
    try {
      ScreenCaptureUtil.startListener(data => {
        if (data && data.code === '200') {
          setResult('startListener', `screenshot event ${formatCapture(data)}`);
          if (data.base64) {
            setPreviewBase64(data.base64);
          }
        } else {
          setError('startListener', `screenshot event ${formatCapture(data)}`);
        }
      }, 'abc,test');
      listeningRef.current = true;
      setListening(true);
      setResult('startListener', 'success - listening for screenshot events');
    } catch (e) {
      setError('startListener', String(e));
    }
  };

  const handleStopListener = async (): Promise<void> => {
    try {
      const res = await ScreenCaptureUtil.stopListener();
      listeningRef.current = false;
      setListening(false);
      setResult('stopListener', `success: ${String(res)}`);
    } catch (e) {
      setError('stopListener', String(e));
    }
  };

  const handleScreenCapture = (): void => {
    try {
      ScreenCaptureUtil.screenCapture(
        data => {
          if (!data) {
            setError('screenCapture', 'empty result');
            return;
          }
          if (data.code !== '200') {
            setError('screenCapture', formatCapture(data));
            return;
          }
          setResult('screenCapture', formatCapture(data));
          if (data.base64) {
            setPreviewBase64(data.base64);
          }
        },
        undefined,
        {extension: 'png', quality: 100, scale: 0},
      );
    } catch (e) {
      setError('screenCapture', String(e));
    }
  };

  const handleClearCache = (): void => {
    try {
      ScreenCaptureUtil.clearCache(data => {
        if (!data) {
          setError('clearCache', 'empty result');
          return;
        }
        if (data.code !== '200') {
          setError('clearCache', `code=${data.code}`);
          return;
        }
        setResult('clearCache', `code=${data.code} (cache cleared)`);
      });
    } catch (e) {
      setError('clearCache', String(e));
    }
  };

  const renderOutcome = (method: MethodName) => (
    <View>
      {results[method] ? (
        <Text testID={`result-${method}`}>{`Result: ${results[method]}`}</Text>
      ) : null}
      {errors[method] ? (
        <Text testID={`error-${method}`}>{`Error: ${errors[method]}`}</Text>
      ) : null}
    </View>
  );

  return (
    <Tester>
      <TestSuite name="react-native-lewin-screen-capture">
        <TestCase itShould="监听状态">
          <Text testID="app-title">{`screenshot listener: ${listening ? 'ON' : 'OFF'}`}</Text>
        </TestCase>
        <TestCase itShould="开始监听系统截屏事件：startListener">
          <TouchableOpacity testID="test-startListener-btn" onPress={handleStartListener}>
            <Text>Run startListener</Text>
          </TouchableOpacity>
          {renderOutcome('startListener')}
        </TestCase>
        <TestCase itShould="停止监听：stopListener">
          <TouchableOpacity testID="test-stopListener-btn" onPress={() => void handleStopListener()}>
            <Text>Run stopListener</Text>
          </TouchableOpacity>
          {renderOutcome('stopListener')}
        </TestCase>
        <TestCase itShould="主动截取当前屏幕：screenCapture">
          <TouchableOpacity testID="test-screenCapture-btn" onPress={handleScreenCapture}>
            <Text>Run screenCapture</Text>
          </TouchableOpacity>
          {renderOutcome('screenCapture')}
        </TestCase>
        <TestCase itShould="清除截屏缓存：clearCache">
          <TouchableOpacity testID="test-clearCache-btn" onPress={handleClearCache}>
            <Text>Run clearCache</Text>
          </TouchableOpacity>
          {renderOutcome('clearCache')}
        </TestCase>
        {previewBase64 ? (
          <TestCase itShould="截屏预览">
            <Image
              testID="capture-preview"
              style={{width: 240, height: 360}}
              resizeMode="contain"
              source={{uri: `data:image/png;base64,${previewBase64}`}}
            />
          </TestCase>
        ) : null}
      </TestSuite>
    </Tester>
  );
}
