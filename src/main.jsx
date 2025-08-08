
import React from 'react'
import ReactDOM from 'react-dom/client'
 import {  ChakraProvider , createSystem   } from '@chakra-ui/react';
import App from './App'
import { defaultConfig  , defineConfig} from '@chakra-ui/react';

const DRLSystem = createSystem({
  ...defaultConfig,
});

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        'mycolor' : '#ffa500',
      },
    },
  },
})

const system = createSystem(defaultConfig, config)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={system} >
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)

