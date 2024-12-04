import { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, View, Image, ScrollView } from 'react-native';

export default function Home() {
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime()); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimestamp(new Date().getTime());
    }, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  const getImageUrl = (uri: string): string => {
    return `${uri}?t=${timestamp}`; 
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Saída de dados' }} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl('http://18.117.231.88:8000/static/curva_IV_irradiancia.png') }}
            style={styles.image}
          />
          <Image
            source={{ uri: getImageUrl('http://18.117.231.88:8000/static/curva_IV_temperatura.png') }}
            style={styles.image}
          />
          <Image
            source={{ uri: getImageUrl('http://18.117.231.88:8000/static/curva_PV_irradiancia.png') }}
            style={styles.image}
          />
          <Image
            source={{ uri: getImageUrl('http://18.117.231.88:8000/static/curva_PV_temperatura.png') }}
            style={styles.image}
          />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  imageContainer: {
    flexDirection: 'column',  
    alignItems: 'center',     
  },
  image: {
    width: '100%',            
    height: 200,               
    marginVertical: 10,        
    resizeMode: 'contain',     
  },
});
