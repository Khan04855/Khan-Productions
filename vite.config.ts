import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
const basePath = process.env.VITE_BASE_PATH?.replace(/\/+$/, '');
export default defineConfig({base:basePath ? `${basePath}/` : '/',plugins:[react()],server:{host:'127.0.0.1',port:8080,proxy:{'/api':'http://127.0.0.1:3001','/uploads':'http://127.0.0.1:3001'}},preview:{proxy:{'/api':'http://127.0.0.1:3001','/uploads':'http://127.0.0.1:3001'}},resolve:{alias:{'@':path.resolve(process.cwd(),'src')}}});
