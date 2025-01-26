import React, { useEffect, useState } from 'react';
import {
    Box,
    Fab,
    Grid,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { ShopService } from '../services';
import { Shop } from '../types';
import ShopSearch from '../components/ShopSearch';
import ShopCard from '../components/ShopCard';

const Home = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[]>([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setLoading(true);
        ShopService.searchShops()
            .then((fetchedShops: Shop[]) => {
                setShops(fetchedShops);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching shops:', error);
                setLoading(false);
            });
    }, []);

    const handleSearch = (searchParams: {
        name?: string;
        inVacations?: boolean;
        startDate?: Date;
        endDate?: Date;
    }) => {
        setLoading(true);

        const { name, inVacations, startDate, endDate } = searchParams;

        ShopService.searchShops(
            name,
            0,
            9,
            inVacations,
            startDate?.toISOString().split('T')[0],
            endDate?.toISOString().split('T')[0]
        )
            .then((fetchedShops: Shop[]) => {
                setShops(fetchedShops);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching shops:', error);
                setLoading(false);
            });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: 2, // Padding horizontal for responsiveness
                py: 4,
            }}
        >
            {/* Title */}
            <Typography
                variant={isMobile ? 'h4' : 'h2'}
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                }}
            >
                Les boutiques
            </Typography>

            {/* Add Button */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                }}
            >
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={() => navigate('/shop/create')}
                    sx={{
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
                        },
                    }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter une boutique
                </Fab>
            </Box>

            {/* Search Component */}
            <ShopSearch onSearch={handleSearch} />

            {/* Shops Grid */}
            <Grid
                container
                spacing={3}
                sx={{
                    width: '100%',
                    maxWidth: '1200px',
                }}
            >
                {shops.map((shop) => (
                    <Grid item key={shop.id} xs={12} sm={6} md={4}>
                        <ShopCard shop={shop} />
                    </Grid>
                ))}
            </Grid>

            {/* No Shops Message */}
            {shops.length === 0 && (
                <Typography
                    variant="h5"
                    sx={{
                        mt: 3,
                        color: theme.palette.text.secondary,
                        fontStyle: 'italic',
                    }}
                >
                    Aucune boutique correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Home;
