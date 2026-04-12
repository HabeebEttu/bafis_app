import React, { useState } from "react";
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress,
    Chip,
    Container,
    Divider,
    Stack,
    CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VerifiedIcon from "@mui/icons-material/Verified";
import InventoryIcon from "@mui/icons-material/Inventory2";
import HistoryIcon from "@mui/icons-material/History";
import PageHeader from "../../utils/PageHeader";
import { eggCollectionService } from "../../../../services/eggCollectionService";


export default function EggCollectionForm() {
    const [formData, setFormData] = useState({
        batchNumber: "B-2023-OCT-01",
        collectionDateTime: "2023-11-24T08:30",
        totalEggs: 4000,
        gradeA: 3920,
        gradeB: 70,
        damaged: 10,
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.totalEggs || formData.totalEggs < 0)
            newErrors.totalEggs = "Total eggs must be greater than 0";
        if (
            formData.gradeA + formData.gradeB + formData.damaged !==
            Number(formData.totalEggs)
        ) {
            newErrors.gradeBreakdown =
                "Grade breakdown must equal total eggs collected";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true)
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            console.log("Form submitted:", formData);
            try {
                await eggCollectionService.submitEggCollection(formData)
            } catch (error) {
                console.log(error)
                throw error
            }
            setLoading(false)
        } else {
            setErrors(newErrors);
        }
    };

    const handleCancel = () => {
        setFormData({
            batchNumber: "B-2023-OCT-01",
            collectionDateTime: "2023-11-24T08:30",
            totalEggs: 4000,
            gradeA: 3920,
            gradeB: 70,
            damaged: 10,
            notes: "",
        });
        setLoading(false)
        setErrors({});
    };

    const yieldRate = formData.totalEggs
        ? ((
            (formData.gradeA / formData.totalEggs) *
            100
        ).toFixed(1))
        : 0;

    const totalInput = formData.gradeA + formData.gradeB + formData.damaged;
    const isBalanced = Number(formData.totalEggs) === totalInput;

    return (

        <Box sx={{ backgroundColor: 'background.primary', py: 4 }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <InventoryIcon sx={{ fontSize: "1.2rem" }} />
                        Inventory Management
                    </Typography>
                    {/* <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: "2.5rem", md: "3.5rem" },
                                mb: 1,
                                color: "text.primary",
                            }}
                        >
                            Record New Collection
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", fontSize: "1.1rem" }}
                        >
                            Capture daily egg production data for flock tracking and quality
                            assurance.
                        </Typography> */}
                    <PageHeader title={'Record New Collection'} subtitle={'Capture daily egg production data for flock tracking and quality assurance.'} />
                </Box>

                {/* Form Card */}
                <Card sx={{ mb: 4, overflow: "visible" }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Section 1: Logistics & Timing */}
                        <Box sx={{ p: 4 }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "grey.500",
                                    display: "block",
                                    mb: 3,
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Logistics & Timing
                            </Typography>
                            <Stack spacing={3}>
                                <Box sx={{ display: { xs: "block", sm: "grid" }, gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                                    <FormControl fullWidth>
                                        {/* <InputLabel id="batch-select-label">
                                            Batch Number
                                        </InputLabel> */}
                                        <Box
                                            sx={{
                                                display:'flex',alignItems:'start',gap:1,flexDirection:'column'
                                            }}
                                        >
                                            <Typography textTransform={'uppercase'} color="text.primary" textAlign={'left'} fontWeight={700} variant="overline">
                                                Batch Number
                                            </Typography>
                                        <Select
                                            labelId="batch-select-label"
                                            name="batchNumber"
                                            value={formData.batchNumber}
                                            onChange={handleChange}
                                            // label="Batch Number"
                                        >
                                            <MenuItem value="B-2023-OCT-01">
                                                B-2023-OCT-01 (Laying Phase)
                                            </MenuItem>
                                            <MenuItem value="B-2023-SEP-15">
                                                B-2023-SEP-15 (Peak Phase)
                                            </MenuItem>
                                            <MenuItem value="B-2023-AUG-22">
                                                B-2023-AUG-22 (Early Phase)
                                            </MenuItem>
                                            </Select>
                                        </Box>
                                    </FormControl>
                                    <Box
                                        sx={{
                                            display: 'flex', alignItems: 'start', gap: 1, flexDirection: 'column'
                                        }}
                                    >
                                        <Typography textTransform={'uppercase'} color="text.primary" textAlign={'left'} fontWeight={700} variant="overline">
                                            Collection / Date & Time
                                        </Typography>
                                    <TextField
                                        fullWidth
                                        type="datetime-local"
                                        name="collectionDateTime"
                                        value={formData.collectionDateTime}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        />
                                        </Box>
                                </Box>
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Section 2: Production Metrics */}
                        <Box sx={{ p: 4, backgroundColor: "grey.50" }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "grey.500",
                                    display: "block",
                                    mb: 3,
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Production Metrics
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 1.5 }}
                                >
                                    <Typography
                                        variant="overline"
                                        sx={{ color: "text.primary" }}
                                    >
                                        Total Eggs Collected
                                    </Typography>
                                    {isBalanced && formData.totalEggs > 0 && (
                                        <Chip
                                            icon={<CheckCircleIcon />}
                                            label="Target Met"
                                            color="success"
                                            variant="filled"
                                            size="small"
                                        />
                                    )}
                                </Stack>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="totalEggs"
                                    value={formData.totalEggs}
                                    onChange={handleChange}
                                    placeholder="0"
                                    inputProps={{ min: 0 }}
                                    error={!!errors.totalEggs}
                                    helperText={errors.totalEggs}
                                    sx={{
                                        "& .MuiOutlinedInput-input": {
                                            fontSize: "2rem",
                                            fontWeight: 700,
                                        },
                                    }}
                                />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Grade Breakdown */}
                            <Box sx={{ display: { xs: "block", sm: "grid" }, gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: "text.primary",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#10B981",
                                                }}
                                            />
                                            Grade A Quantity
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            name="gradeA"
                                            value={formData.gradeA}
                                            onChange={handleChange}
                                            placeholder="0"
                                            inputProps={{ min: 0 }}
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Stack>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography
                                            variant="overline"
                                            sx={{
                                                color: "text.primary",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    backgroundColor: "#F59E0B",
                                                }}
                                            />
                                            Grade B Quantity
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            name="gradeB"
                                            value={formData.gradeB}
                                            onChange={handleChange}
                                            placeholder="0"
                                            inputProps={{ min: 0 }}
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Damaged Eggs */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "text.primary",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            backgroundColor: "#EF4444",
                                        }}
                                    />
                                    Cracked/Damaged Quantity
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="damaged"
                                    value={formData.damaged}
                                    onChange={handleChange}
                                    placeholder="0"
                                    inputProps={{ min: 0 }}
                                    sx={{ mt: 1 }}
                                />
                            </Box>

                            {errors.gradeBreakdown && (
                                <Box
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        backgroundColor: "#FEE2E2",
                                        border: "1px solid #FCA5A5",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: "#991B1B" }}>
                                        {errors.gradeBreakdown}
                                    </Typography>
                                </Box>
                            )}

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2.5,
                                    backgroundColor: "primary.light",
                                    backgroundImage:
                                        "linear-gradient(135deg, #4A9D5C 0%, #2D7A3E 100%)",
                                    color: "white",
                                    borderColor: "primary.main",
                                }}
                            >
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 1.5 }}
                                >
                                    <Typography variant="overline" sx={{ opacity: 0.9 }}>
                                        Yield Rate
                                    </Typography>
                                    <Typography
                                        variant="h2"
                                        sx={{
                                            fontSize: "1.75rem",
                                            fontWeight: 700,
                                            letterSpacing: "-0.02em",
                                        }}
                                    >
                                        {yieldRate}%
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={yieldRate}
                                    sx={{
                                        height: 6,
                                        borderRadius: 4,
                                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: "#FFFFFF",
                                        },
                                    }}
                                />
                            </Paper>
                        </Box>

                        <Divider />

                        {/* Section 3: Notes */}
                        <Box sx={{ p: 4 }}>
                            <Typography
                                variant="overline"
                                sx={{
                                    color: "grey.500",
                                    display: "block",
                                    mb: 3,
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Additional Observations
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Mention any unusual shell texture, flock behavior, or temperature deviations..."
                            />
                        </Box>

                        <Divider />

                        {/* Section 4: Actions */}
                        <Box
                            sx={{
                                p: 4,
                                display: "flex",
                                flexDirection: { xs: "column-reverse", sm: "row" },
                                gap: 2,
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{
                                    width: { xs: "100%", sm: "auto" },
                                    px: 4,
                                }}
                            >
                                {loading?<CircularProgress size={15}/>:"Submit Entry"}
                            </Button>
                        </Box>
                    </Box>
                </Card>

                {/* Guidance Footer */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 2 }}>
                    <Card
                        sx={{
                            p: 2.5,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <VerifiedIcon
                            sx={{
                                fontSize: "2rem",
                                color: "primary.main",
                                mb: 1,
                            }}
                        />
                        <Typography
                            variant="overline"
                            sx={{ color: "text.primary", mb: 1 }}
                        >
                            Quality Check
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Ensure Grade A eggs are cleaned and candled before storage.
                        </Typography>
                    </Card>
                    <Card
                        sx={{
                            p: 2.5,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <InventoryIcon
                            sx={{
                                fontSize: "2rem",
                                color: "secondary.main",
                                mb: 1,
                            }}
                        />
                        <Typography
                            variant="overline"
                            sx={{ color: "text.primary", mb: 1 }}
                        >
                            Storage Temp
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Maintain cooler at 7.2°C for optimal shelf life.
                        </Typography>
                    </Card>
                    <Card
                        sx={{
                            p: 2.5,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <HistoryIcon
                            sx={{
                                fontSize: "2rem",
                                color: "primary.main",
                                mb: 1,
                            }}
                        />
                        <Typography
                            variant="overline"
                            sx={{ color: "text.primary", mb: 1 }}
                        >
                            Previous Avg
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                            Typical collection for Unit Alpha: 4,050 eggs.
                        </Typography>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}