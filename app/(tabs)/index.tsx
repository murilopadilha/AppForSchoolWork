import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const [currentValue, setCurrentValue] = useState<string>('');
  const [voltageValue, setVoltageValue] = useState<string>('');
  const [resistanceValue, setResistanceValue] = useState<string>('');
  const [temperatureValue, setTemperatureValue] = useState<string>('');
  const [temperatureCoefficient, setTemperatureCoefficient] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const handlePostRequest = async () => {
    if (!currentValue || !voltageValue || !resistanceValue || !temperatureValue || !temperatureCoefficient) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const numericCurrent = parseFloat(currentValue.replace(',', '.'));
      const numericVoltage = parseFloat(voltageValue.replace(',', '.'));
      const numericResistance = parseFloat(resistanceValue.replace(',', '.'));
      const numericTemperature = parseFloat(temperatureValue.replace(',', '.'));
      const numericCoefficient = parseFloat(temperatureCoefficient.replace(',', '.'));

      const response = await fetch('http://18.117.231.88:8000/generate-graphs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          I_SC: numericCurrent,
          V_dc: numericVoltage,
          R_sh: numericResistance,
          T: numericTemperature,
          J_0: numericCoefficient,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        Alert.alert('Sucesso', `Dados enviados com sucesso!`);

        setCurrentValue('');
        setVoltageValue('');
        setResistanceValue('');
        setTemperatureValue('');
        setTemperatureCoefficient('');
        router.push('/two');
      } else {
        setIsLoading(false);
        Alert.alert('Erro', `Erro na API: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      Alert.alert('Erro', `Falha na conexão: ${errorMessage}`);
    }
  };

  const handleAnimation = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20} 
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.mainTitle}>Simulação de Célula Fotovoltaica</Text>

          <Text style={styles.title}>Insira os valores:</Text>

          <TextInput
            style={styles.input}
            placeholder="Corrente de Curto Circuito (I_SC)"
            keyboardType="numeric"
            value={currentValue}
            onChangeText={setCurrentValue}
            returnKeyType="done"
          />
          <TextInput
            style={styles.input}
            placeholder="% Tensão de Circuito Aberto (V)"
            keyboardType="numeric"
            value={voltageValue}
            onChangeText={setVoltageValue}
            returnKeyType="done"
          />
          <TextInput
            style={styles.input}
            placeholder="Resistência de Shunt (R_sh)"
            keyboardType="numeric"
            value={resistanceValue}
            onChangeText={setResistanceValue}
            returnKeyType="done"
          />
          <TextInput
            style={styles.input}
            placeholder="Temperatura da célula (T em °C)"
            keyboardType="numeric"
            value={temperatureValue}
            onChangeText={setTemperatureValue}
            returnKeyType="done"
          />
          <TextInput
            style={styles.input}
            placeholder="Coeficiente de Temperatura (J_0)"
            keyboardType="numeric"
            value={temperatureCoefficient}
            onChangeText={setTemperatureCoefficient}
            returnKeyType="done"
          />

          {isLoading ? (
            <ActivityIndicator size="large" color="#092955" />
          ) : (
            <Animated.View
              style={[
                styles.button,
                {
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.buttonInner}
                activeOpacity={0.8}
                onPress={() => {
                  handleAnimation();
                  handlePostRequest();
                }}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#092955',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    backgroundColor: '#092955',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
