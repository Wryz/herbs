import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {HerbCatalogScreen} from './src/screens/HerbCatalogScreen';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <HerbCatalogScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
