import React from 'react';
import { Button, Chip, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';

export const CartItem = ({
    id,
    image_url,
    title,
    category,
    brand,
    price,
    quantity,
    stock,
    productId,
    description, 
    onRemove,
    onUpdate,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(552));
    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'LKR' });

    const handleAddQty = () => {
        if (quantity < stock) {
            onUpdate?.(id, { quantity: quantity + 1 });
        }
    };

    const handleRemoveQty = () => {
        if (quantity === 1) {
            onRemove?.(id);
        } else {
            onUpdate?.(id, { quantity: quantity - 1 });
        }
    };

    console.log("CartItem props:", {
        id,
        image_url,
        title,
        category,
        brand,
        price,
        quantity,
        stock,
        productId,
        description 
    });

    return (
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems='center' p={2} border='1px solid #eee' borderRadius='12px' bgcolor='white' sx={{ boxShadow:2 }} >
            {/* Product Image */}
            <Stack width={isMobile ? '100%' : '150px'} height={isMobile ? '150px' : '150px'} overflow='hidden'>
                <Link to={`/product-details/${productId}`} style={{ textDecoration: 'none' }}>
                    <img src={image_url || '/placeholder.jpg'} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </Link>
            </Stack>

            {/* Product Info */}
            <Stack spacing={1} flex={1} width='100%'>
                <Typography component={Link} to={`/product-details/${productId}`} variant='h6' fontWeight={600} sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                    {title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>{brand} | {category}</Typography>

                {/* Display Description */}
                <Typography variant='body2' color='text.secondary'>{description || 'No description available.'}</Typography>

                <Stack direction='row' alignItems='center' spacing={1}>
                    <Typography>Qty:</Typography>
                    <IconButton onClick={handleRemoveQty}>
                        <RemoveIcon fontSize='small' />
                    </IconButton>
                    <Typography>{quantity}</Typography>
                    <IconButton onClick={handleAddQty} disabled={quantity === stock}>
                        <AddIcon fontSize='small' />
                    </IconButton>
                </Stack>

                {stock - quantity <= 2 && (
                    <Chip label='Low stock' size='small' color='warning' variant='outlined' />
                )}
            </Stack>

            {/* Price and Remove Button */}
            <Stack alignItems={isMobile ? 'flex-start' : 'flex-end'} spacing={1}>
                <Typography variant='body2' fontWeight={600}>
                    {currencyFormat.format(price * quantity)}
                </Typography>
                <Button variant='outlined' color='error' size='small' onClick={() => onRemove?.(id)}>Remove</Button>
            </Stack>
        </Stack>
    );
};

export default CartItem;
