import { Button } from '@mui/material';


export const SquareIconButton = (props) => {
  const { sx, icon, endIcon, startIcon, ...remainingProps } = props;
  return (
    <Button
      sx={{
        m: 0,
        paddingX: 0,
        minWidth: 0,
        '& .MuiButton-endIcon': {
          m: 0,
          p: 0,
          paddingX: 1,
        },
        ...sx,
      }}
      variant="outlined"
      endIcon={ icon || endIcon || startIcon }
      { ...remainingProps }
    />
  );
};
