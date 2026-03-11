import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BridgeApi } from './lib/api';
import { applyAnswer, bootstrapSession, initialState, type ShellState } from './lib/session';
import { QuestionScreen } from './screens/QuestionScreen';

export default function App() {
  const api = useMemo(() => new BridgeApi(), []);
  const [state, setState] = useState<ShellState>(initialState());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bootstrapSession(api)
      .then(setState)
      .catch((e) => setError(e?.message || 'Failed to start session'));
  }, [api]);

  async function onAnswer(answer: 'yes' | 'no') {
    try {
      setState((prev) => prev);
      const next = await applyAnswer(api, state, answer);
      setState(next);
    } catch (e: any) {
      setError(e?.message || 'Failed to continue session');
    }
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Error</Text>
        <Text style={styles.text}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (state.mode === 'launch') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>YES/NO</Text>
      </SafeAreaView>
    );
  }

  if (state.mode === 'question') {
    return (
      <SafeAreaView style={styles.container}>
        <QuestionScreen question={state.question} onYes={() => onAnswer('yes')} onNo={() => onAnswer('no')} />
        {state.live_summary ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>confidence: {state.live_summary.final_confidence.toFixed(2)}</Text>
            <Text style={styles.summaryText}>guard: {state.live_summary.guard_status}</Text>
            <Text style={styles.summaryText}>gate: {state.live_summary.gate_result}</Text>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }

  if (state.mode === 'artifact') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>ARTIFACT</Text>
        <Text style={styles.text}>{state.artifact}</Text>
        {state.live_summary ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>confidence: {state.live_summary.final_confidence.toFixed(2)}</Text>
            <Text style={styles.summaryText}>guard: {state.live_summary.guard_status}</Text>
            <Text style={styles.summaryText}>gate: {state.live_summary.gate_result}</Text>
          </View>
        ) : null}
        <View style={{ height: 16 }} />
        <QuestionScreen question="Accept this artifact?" onYes={() => onAnswer('yes')} onNo={() => onAnswer('no')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>SESSION COMPLETE (V1 PROTOTYPE)</Text>
      {state.summary ? (
        <>
          <Text style={styles.text}>confidence: {state.summary.final_confidence.toFixed(2)}</Text>
          <Text style={styles.text}>guard: {state.summary.guard_status}</Text>
          <Text style={styles.text}>gate: {state.summary.gate_result}</Text>
          <Text style={styles.text}>reason: {state.summary.primary_reason}</Text>
          <Text style={styles.text}>effect: {state.summary.expected_effect}</Text>
        </>
      ) : (
        <Text style={styles.text}>summary unavailable</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { color: '#fff', fontSize: 22, textAlign: 'center' },
  summaryBox: { borderColor: '#555', borderWidth: 1, padding: 10, marginTop: 12, width: '100%' },
  summaryText: { color: '#bbb', fontSize: 14, textAlign: 'left' },
});
