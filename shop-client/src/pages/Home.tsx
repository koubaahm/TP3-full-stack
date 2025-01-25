import React, { useEffect, useState } from 'react';
import {
    Box,
    Fab,
    Grid,
    Typography,
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Typography variant="h2" sx={{ textAlign: 'center' }}>Les boutiques</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Fab variant="extended" color="primary" aria-label="add" onClick={() => navigate('/shop/create')}>
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter une boutique
                </Fab>
            </Box>

            <ShopSearch onSearch={handleSearch} />

            <Grid container spacing={3}>
                {shops.map((shop) => (
                    <Grid item key={shop.id} xs={12} sm={6} md={4}>
                        <ShopCard shop={shop} />
                    </Grid>
                ))}
            </Grid>

            {shops.length === 0 && (
                <Typography variant="h5" sx={{ mt: 3 }}>
                    Aucune boutique correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Home;