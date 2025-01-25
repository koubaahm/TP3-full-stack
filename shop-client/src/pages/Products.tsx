import { Box, Fab, Grid, Pagination, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components';
import { useAppContext } from '../context';
import { ProductService } from '../services';
import { Product } from '../types';

const Products = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const getProducts = () => {
        setLoading(true);
        ProductService.getProducts(pageSelected, 9)
            .then((res) => {
                setProducts(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getProducts();
    }, [pageSelected]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, px: 2, py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Les Produits
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={() => navigate('/product/create')}
                    sx={{ px: 3 }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter un produit
                </Fab>
            </Box>

            {/* Products Grid */}
            <Grid
                container
                spacing={3}
                sx={{
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    width: '100%',
                }}
            >
                {products?.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <ProductCard product={product} displayShop={true} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {products?.length !== 0 ? (
                <Pagination
                    count={count}
                    page={page}
                    siblingCount={1}
                    onChange={handleChangePagination}
                    sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                />
            ) : (
                <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
                    Aucun produit correspondant
                </Typography>
            )}
        </Box>
    );
};

export default Products;
