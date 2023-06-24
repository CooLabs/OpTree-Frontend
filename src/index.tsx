import './index.css';
import './style.less';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css'
import  Providers from  '@/components/providers'
const root = ReactDOMClient.createRoot(document.getElementById('root') as HTMLElement);
window.Buffer = window.Buffer || require('buffer').Buffer;

root.render(
  <Providers>
    <App />
    <div id="dialog"></div>
  </Providers>
);
