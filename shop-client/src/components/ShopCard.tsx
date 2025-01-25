import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Shop } from '../types';
import { pluralize } from '../utils';
import { SxProps, Theme } from '@mui/material/styles';

type Props = {
    shop: Shop;
    sx?: SxProps<Theme>;
};

const ShopCard = ({ shop, sx }: Props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/shop/${shop.id}`);
    };

    return (
        <Card 
            sx={{ 
                minWidth: 275, 
                cursor: 'pointer',
                ...sx,
                display: 'flex', 
                flexDirection: 'column',
            }} 
            onClick={handleClick}
        >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" color="text.primary" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {shop.name}
                </Typography>
                <Typography variant="body2">
                    {shop.nbProducts} {pluralize('produit', shop.nbProducts)}
                </Typography>
                <Typography variant="body2">
                    {shop.nbDistinctCategories} {pluralize('catégorie', shop.nbDistinctCategories)}
                </Typography>
                <Typography sx={{ my: 1.5 }} color="text.secondary">
                    Créée le : {moment(shop.createdAt).format('DD/MM/YYYY')}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    En congé : {shop.inVacations ? 'oui' : 'non'}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ShopCard;
