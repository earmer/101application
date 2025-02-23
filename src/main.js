import { createApp } from 'vue'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'
import './style.css'

const i18n = createI18n({
    locale: 'en',
    messages: {
        en,
        zh,
    }
})

createApp(App).use(i18n).mount('#app')

