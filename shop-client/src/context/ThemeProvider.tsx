import { createTheme } from '@mui/material';
import { teal, amber, grey } from '@mui/material/colors';

const myTheme = createTheme({
    palette: {
        primary: {
            light: teal[200],
            main: teal[500],
            dark: teal[800],
            contrastText: '#ffffff',
        },
        secondary: {
            light: amber[100],
            main: amber[500],
            dark: amber[700],
            contrastText: '#212121',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: grey[900],
            secondary: grey[700],
            disabled: grey[400],
        },
        error: {
            main: '#FF5252',
        },
        warning: {
            main: '#FFC107',
        },
        info: {
            main: '#29B6F6',
        },
        success: {
            main: '#66BB6A',
        },
    },
    typography: {
        fontFamily: `'Poppins', 'Roboto', 'Arial', sans-serif`,
        fontSize: 14,
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: 1.2,
            color: grey[900],
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: grey[900],
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 500,
            lineHeight: 1.4,
            color: grey[800],
        },
        button: {
            fontWeight: 600,
            textTransform: 'uppercase',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(90deg, ${teal[500]} 0%, ${amber[500]} 100%)`,
                    color: '#fff',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50px',
                    padding: '10px 20px',
                    textTransform: 'none',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: teal[700],
                        boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                    },
                },
            },
        },
    },
});

export default myTheme;
