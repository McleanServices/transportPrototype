import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: 'https://app.powerbi.com/view?r=eyJrIjoiYmQwM2ZhNTUtMTg2Yy00NGQ1LWEwNjMtNjYzZDljNjNlZjhjIiwidCI6IjQ1MjEzMzVhLTUwODMtNGIzNS05ZTRiLTkwNzMwMzZjMTdiZCIsImMiOjh9',
        }}
        style={styles.webview}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={`
          document.querySelectorAll('a').forEach(a => {
            a.removeAttribute('href');
            a.style.pointerEvents = 'none';
            a.style.display = 'none'; // Hide the link
          });
          true; // Required for injectedJavaScript to work properly
        `}
        onShouldStartLoadWithRequest={(request) => {
          // Prevent navigation to any URL
          return request.url === 'https://app.powerbi.com/view?r=eyJrIjoiYmQwM2ZhNTUtMTg2Yy00NGQ1LWEwNjMtNjYzZDljNjNlZjhjIiwidCI6IjQ1MjEzMzVhLTUwODMtNGIzNS05ZTRiLTkwNzMwMzZjMTdiZCIsImMiOjh9';
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
