import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Fade,
} from '@mui/material';


export const PricingTable = ({ plans = [], onSelect }) => {
  return (
    <Fade in={ true }>
      <Box
        display={{ xxs: 'flex', md: 'block' }}
        justifyContent="center"
      >
        <Stack
          direction={{ xxs: 'column', md: 'row' }}
          spacing={{ xxs: 4, md: 5 }}
          alignItems="stretch"
          justifyContent="center"
          py={ 4 }
        >
          {plans.map((plan) => {
            const isHighlighted = plan.highlight;
            return (
              <Box
                key={ plan.id }
                sx={{
                  flex: 1,
                  minWidth: 260,
                  maxWidth: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  position: 'relative',
                }}
              >
                {isHighlighted && plan.highlightText !== false && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: -20,
                      zIndex: 2,
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: '16px 16px 2px 2px',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: 0.5,
                        boxShadow: 2,
                        userSelect: 'none',
                      }}
                    >
                      {plan.highlightText || 'Recommended'}
                    </Box>
                  </Box>
                )}
                <Card
                  sx={{
                    flex: 1,
                    minWidth: 260,
                    maxWidth: 340,
                    border: isHighlighted ? 3 : 1,
                    borderColor: isHighlighted ? 'primary.main' : 'divider',
                    boxShadow: isHighlighted ? 6 : 2,
                    borderRadius: 2,
                    transition: 'box-shadow 0.3s, border-color 0.3s',
                  }}
                >
                  <CardHeader
                    title={ (
                      <Typography variant="h5" color={ isHighlighted ? 'primary' : 'text.primary' } sx={{ fontWeight: 600 }}>
                        {plan.title}
                      </Typography>
                    ) }
                    subheader={
                      plan.subtitle && (
                        <Typography variant="subtitle1" color="text.secondary">
                          {plan.subtitle}
                        </Typography>
                      )
                    }
                    sx={{ pb: 0, textAlign: 'center' }}
                  />
                  <CardContent sx={{ textAlign: 'center', pt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h3" color={ isHighlighted ? 'primary' : 'text.primary' } sx={{ fontWeight: 700 }}>
                        {plan.price}
                        <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 1, fontWeight: 400 }}>
                          {plan.priceSuffix}
                        </Typography>
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={ 1 }>
                      {plan.features.map(feature => (
                        <Typography key={ feature } variant="body1" color="text.secondary">
                          {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                  {!plan.hideCta && (
                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                      <Button
                        variant={ isHighlighted ? 'contained' : 'outlined' }
                        color="primary"
                        size="large"
                        sx={{ minWidth: 120 }}
                        onClick={ () => onSelect && onSelect(plan) }
                      >
                        {plan.cta || 'Choose'}
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Fade>
  );
};
