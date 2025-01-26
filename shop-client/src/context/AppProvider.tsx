import { createContext, useContext, useState } from 'react';
import Locale from '../types/locale';
import i18n from '../utils/i18n';

interface AppContextInterface {
    loading: boolean;
    setLoading: (load: boolean) => void;
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const AppContext = createContext<AppContextInterface>({
    loading: false,
    setLoading: () => {
        // empty function
    },
    locale: Locale.FR,
    setLocale: () => {
        // empty function
    },
});

type Props = {
    children: JSX.Element;
};

export function AppProvider({ children }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [locale, setLocaleState] = useState<Locale>(Locale.FR);

    // Fonction pour changer la langue et synchroniser avec i18next
    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        i18n.changeLanguage(newLocale.toLowerCase()); // Met à jour la langue dans i18next
    };

    return (
        <AppContext.Provider
            value={{
                loading,
                setLoading,
                locale,
                setLocale, // Utilise la fonction modifiée
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
