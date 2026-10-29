import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',workers:1,use:{baseURL:'http://localhost:3000',launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']},headless:true},projects:[{name:'escritorio',use:{viewport:{width:1440,height:1000}}},{name:'movil',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}]});
