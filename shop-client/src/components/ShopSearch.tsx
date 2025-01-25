import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Checkbox, 
    FormControlLabel, 
    Button, 
    Grid, 
    Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ShopSearchProps {
    onSearch: (searchParams: {
        name?: string;
        inVacations?: boolean;
        startDate?: Date;
        endDate?: Date;
    }) => void;
}

const ShopSearch: React.FC<ShopSearchProps> = ({ onSearch }) => {
    const [name, setName] = useState<string>('');
    const [inVacations, setInVacations] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleSearch = () => {
        const searchParams: {
            name?: string;
            inVacations?: boolean;
            startDate?: Date;
            endDate?: Date;
        } = {};

        if (name) searchParams.name = name;
        if (inVacations) searchParams.inVacations = inVacations;
        if (startDate) searchParams.startDate = startDate;
        if (endDate) searchParams.endDate = endDate;

        onSearch(searchParams);
    };

    const handleReset = () => {
        setName('');
        setInVacations(false);
        setStartDate(null);
        setEndDate(null);
        onSearch({});
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                width: '100%', 
                maxWidth: 600, 
                margin: 'auto' 
            }}>
                <TextField
                    fullWidth
                    label="Rechercher des boutiques"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={inVacations}
                            onChange={(e) => setInVacations(e.target.checked)}
                        />
                    }
                    label="En congés"
                />

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <DatePicker
                            label="Date de début"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            label="Date de fin"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => <TextField fullWidth {...params} />}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: 2 
                }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSearch}
                    >
                        Rechercher
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleReset}
                    >
                        Réinitialiser
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default ShopSearch;