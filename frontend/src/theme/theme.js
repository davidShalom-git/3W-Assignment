import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1877f2',
      dark: '#0f5fcf',
    },
    secondary: {
      main: '#f5a623',
      dark: '#d9880c',
    },
    error: {
      main: '#e0245e',
    },
    background: {
      default: '#f4f2ee',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1e21',
      secondary: '#65676b',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: ['Poppins', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'].join(
      ','
    ),
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          fontWeight: 600,
          transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms ease',
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        containedPrimary: {
          boxShadow: '0 4px 14px rgba(24, 119, 242, 0.28)',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(24, 119, 242, 0.36)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'transform 150ms ease, background-color 150ms ease',
          '&:active': {
            transform: 'scale(0.92)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
        elevation1: {
          boxShadow: '0 1px 2px rgba(28, 30, 33, 0.06), 0 2px 8px rgba(28, 30, 33, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

export default theme;
