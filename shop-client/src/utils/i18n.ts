import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    header: {
                        title: 'Shop Management',
                    },
                    navigation: {
                        shops: 'Shops',
                        products: 'Products',
                        categories: 'Categories',
                    },
                },
            },
            fr: {
                translation: {
                    header: {
                        title: 'Gestion de boutiques',
                    },
                    navigation: {
                        shops: 'Boutiques',
                        products: 'Produits',
                        categories: 'Catégories',
                    },
                },
            },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['cookie'],
        },
        debug: true,
        lng: 'fr', // Default language
        saveMissing: false,
    });

export default i18n;
