import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography,
    Grid,
    Alert,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopService } from '../services';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { MinimalShop, ObjectPropertyString } from '../types';
import { useAppContext, useToastContext } from '../context';

interface ErrorResponse {
    timestamp: number;
    status: number;
    error: string;
    message: string;
    path: string;
}

const schema = (shop: MinimalShop) => ({
    name: shop.name ? '' : 'Ce champ est requis',
});

const ShopForm = () => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalShop>>();
    const [backendErrors, setBackendErrors] = useState<string | null>(null);
    const [shop, setShop] = useState<MinimalShop>({
        name: '',
        inVacations: false,
        openingHours: [],
    });

    const extractErrorMessage = (error: any): string => {
        const errorResponse = error.response?.data as ErrorResponse;
        return errorResponse?.message || 
               'Une erreur est survenue lors du traitement de la requête';
    };

    const getShop = (shopId: string) => {
        setLoading(true);
        ShopService.getShop(shopId)
            .then((res) => {
                setShop({
                    ...res.data,
                    id: id,
                });
            })
            .catch((error) => {
                const errorMessage = extractErrorMessage(error);
                setToast({ severity: 'error', message: errorMessage });
                navigate('/');
            })
            .finally(() => setLoading(false));
    };

    const createShop = () => {
        setLoading(true);
        setBackendErrors(null);
        ShopService.createShop(shop)
            .then(() => {
                navigate('/');
                setToast({ severity: 'success', message: 'La boutique a bien été créée' });
            })
            .catch((error) => {
                const errorMessage = extractErrorMessage(error);
                setBackendErrors(errorMessage);
                setToast({ severity: 'error', message: 'Échec de la création de la boutique' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editShop = () => {
        setLoading(true);
        setBackendErrors(null);
        ShopService.editShop(shop)
            .then(() => {
                navigate(`/shop/${id}`);
                setToast({ severity: 'success', message: 'La boutique a bien été modifiée' });
            })
            .catch((error) => {
                const errorMessage = extractErrorMessage(error);
                setBackendErrors(errorMessage);
                setToast({ severity: 'error', message: 'Échec de la modification de la boutique' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        !isAddMode && id && getShop(id);
    }, [isAddMode]);

    const handleChange = (index: number, key: string, value: number | string | undefined) => {
        const openingHours = shop.openingHours;
        const openingHour = {
            ...openingHours[index],
            [key]: value,
        };
        openingHours[index] = openingHour;
        setShop({ ...shop, openingHours });
    };

    const handleClickAddHours = () => {
        setShop({ ...shop, openingHours: [...shop.openingHours, { day: 1, openAt: '09:00:00', closeAt: '18:00:00' }] });
    };

    const handleClickClearHours = (index: number) => {
        setShop({ ...shop, openingHours: shop.openingHours.filter((o, i) => i !== index) });
    };

    const validate = () => {
        setErrors(schema(shop));
        return Object.values(schema(shop)).every((o) => o == '');
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (isAddMode) {
            createShop();
        } else {
            editShop();
        }
    };

    return (
        <>
            <Paper elevation={1} sx={{ padding: 4 }}>
                {backendErrors && (
                    <Alert 
                        severity="error" 
                        sx={{ mb: 3 }}
                        onClose={() => setBackendErrors(null)}
                    >
                        {backendErrors}
                    </Alert>
                )}

                <Typography variant="h2" sx={{ marginBottom: 3, textAlign: 'center' }}>
                    {isAddMode ? 'Ajouter une boutique' : 'Modifier la boutique'}
                </Typography>

                <Box sx={{ display: 'block', ml: 'auto', mr: 'auto', width: '100%', mb: 3 }}>
                    <Divider>Informations de la boutique</Divider>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoFocus
                                required
                                label="Nom"
                                value={shop.name}
                                onChange={(e) => setShop({ ...shop, name: e.target.value })}
                                fullWidth
                                error={!!errors?.name}
                                helperText={errors?.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                value="start"
                                control={
                                    <Switch
                                        checked={shop.inVacations}
                                        onChange={(e) => setShop({ ...shop, inVacations: e.target.checked })}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                }
                                label="En congé"
                            />
                        </Grid>
                    </Grid>

                    {/* OpeningHours */}
                    <Divider>Horaires d&apos;ouverture de la boutique</Divider>
                    <Box sx={{ mt: 1, mb: 3 }}>
                        <Fab size="small" color="primary" aria-label="add">
                            <AddIcon onClick={handleClickAddHours} />
                        </Fab>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 3 }}>
                        {shop.openingHours.map((openingHour, index) => (
                            <Paper elevation={2} key={index} sx={{ position: 'relative' }}>
                                <Box
                                    sx={{
                                        px: 2,
                                        pb: 1,
                                        pt: 7,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        gap: 2,
                                    }}
                                >
                                    <FormControl sx={{ marginBottom: 2 }}>
                                        <InputLabel id="demo-simple-select-label">Jour</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={openingHour.day}
                                            label="Jour"
                                            onChange={(e) => handleChange(index, 'day', e.target.value)}
                                            sx={{ minWidth: 125 }}
                                        >
                                            <MenuItem value={1}>Lundi</MenuItem>
                                            <MenuItem value={2}>Mardi</MenuItem>
                                            <MenuItem value={3}>Mercredi</MenuItem>
                                            <MenuItem value={4}>Jeudi</MenuItem>
                                            <MenuItem value={5}>Vendredi</MenuItem>
                                            <MenuItem value={6}>Samedi</MenuItem>
                                            <MenuItem value={7}>Dimanche</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            label="Ouvre à"
                                            ampm={false}
                                            value={`2014-08-18T${openingHour.openAt}`}
                                            onChange={(v: Dayjs | null) =>
                                                handleChange(index, 'openAt', v?.format('HH:mm:ss'))
                                            }
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            label="Ferme à"
                                            ampm={false}
                                            value={`2014-08-18T${openingHour.closeAt}`}
                                            onChange={(v: Dayjs | null) =>
                                                handleChange(index, 'closeAt', v?.format('HH:mm:ss'))
                                            }
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Box>

                                <Fab size="small" color="primary" sx={{ position: 'absolute', top: 5, right: 5 }}>
                                    <ClearIcon onClick={() => handleClickClearHours(index)} />
                                </Fab>
                            </Paper>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Valider
                    </Button>
                </Box>
            </Paper>
        </>
    );
};

export default ShopForm;