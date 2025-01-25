import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import SwitchLanguage from './SwitchLanguage';

type Props = {
    children: JSX.Element;
};

const navItems = [
    { label: 'Boutiques', path: '/' },
    { label: 'Produits', path: '/product' },
    { label: 'Catégories', path: '/category' },
];

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();

    return (
        <div>
            <AppBar component="nav">
                <Toolbar 
                    sx={{ 
                        flexDirection: { xs: 'column', sm: 'row' },
                        padding: { xs: 1, sm: 0 },
                        textAlign: { xs: 'center', sm: 'left' } 
                    }}
                >
                    <Typography 
                        variant="h6" 
                        onClick={() => navigate('/')} 
                        sx={{ 
                            cursor: 'pointer', 
                            width: { xs: '100%', sm: 'auto' },
                            mb: { xs: 1, sm: 0 } 
                        }}
                    >
                        Gestion de boutiques
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', sm: 'auto' },
                        gap: { xs: 1, sm: 0 }
                    }}>
                        {navItems.map((item) => (
                            <Button 
                                key={item.label} 
                                sx={{ 
                                    color: '#fff', 
                                    width: { xs: '100%', sm: 'auto' } 
                                }} 
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                    <Box>
                        <SwitchLanguage />
                    </Box>
                </Toolbar>
            </AppBar>

            <Loader />
            <Box sx={{ 
                mt: { xs: 10, sm: 8 }, 
                mx: { xs: 2, sm: '7%', md: '20%' } 
            }}>
                {children}
            </Box>
        </div>
    );
};

export default Layout;
