import { L } from 'components';
import {
  Stack,
  Typography,
  Box,
  Fade,
} from '@mui/material';
import { useElementVisibility } from 'lib/hooks';


export const ImageSection = (props) => {
  const {
    heading,
    paragraphs,
    imageSrc,
    imageAlt,
    reverseOrder,
  } = props;

  const { ref, wasSeen } = useElementVisibility({ threshold: 0.5 });

  return (
    <Stack
      spacing={{ xxs: 4, md: 6 }}
      width="100%"
      direction={{ xxs: 'column', md: reverseOrder ? 'row-reverse' : 'row' }}
      textAlign={{ xxs: 'center', md: 'left' }}
      alignItems="center"
    >
      <Fade in={ true } >
        <Box flex={ 1 }>
          <Typography variant="h2" color="primary" mb={ 1 }>
            { heading }
          </Typography>
          { paragraphs.map(text => (
            <Typography key={ text } mb={ 2 }>
              {text}
            </Typography>
          ))}
        </Box>
      </Fade>
      <Fade
        ref={ ref }
        in={ wasSeen }
      >
        <Box 
          flex={{ xs: 0, md: 0.8 }}
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <L.img
            sx={{ 
              width: { xxs: '85%', sm: '70%', md:  '75%' },
              maxWidth: '400px',
              height: 'auto',
              transform: 'scale(1.5)',
              objectFit: 'cover',
            }}
            src={ imageSrc }
            alt={ imageAlt }
          />
        </Box>
      </Fade>
    </Stack>
  );
};
