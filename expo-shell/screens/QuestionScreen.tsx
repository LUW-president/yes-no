import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  question: string;
  onYes: () => void;
  onNo: () => void;
};

export function QuestionScreen({ question, onYes, onNo }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>YES/NO</Text>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.actions}>
        <Pressable onPress={onYes} style={styles.button}><Text style={styles.buttonText}>YES</Text></Pressable>
        <Pressable onPress={onNo} style={styles.button}><Text style={styles.buttonText}>NO</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 28, marginBottom: 24 },
  question: { color: '#fff', fontSize: 22, textAlign: 'center', marginBottom: 40 },
  actions: { flexDirection: 'row', gap: 16 },
  button: { borderColor: '#fff', borderWidth: 1, paddingVertical: 12, paddingHorizontal: 24 },
  buttonText: { color: '#fff', fontSize: 18 },
});
