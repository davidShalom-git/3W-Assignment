import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function AuthLayout({ title, children }) {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="xs" sx={{ pt: { xs: 6, sm: 10 }, pb: 8 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          sx={{ textAlign: 'center', letterSpacing: '-0.02em' }}
        >
          Social
        </Typography>
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}>
          Share what's on your mind
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid #e4e6eb',
            boxShadow: '0 2px 6px rgba(28,30,33,0.04), 0 10px 30px rgba(28,30,33,0.07)',
            animation: 'authCardIn 320ms ease-out',
            '@keyframes authCardIn': {
              from: { opacity: 0, transform: 'translateY(8px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography variant="h6" fontWeight={600} sx={{ textAlign: 'center', mb: 3 }}>
            {title}
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
