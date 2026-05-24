import { Button, Container, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" fontWeight={600} mb={2}>
        Welcome to LifeMemo
      </Typography>
      {user && (
        <Typography variant="body1" color="text.secondary" mb={4}>
          Signed in as {user.email}
        </Typography>
      )}
      <Button variant="outlined" color="error" onClick={handleLogout}>
        Sign out
      </Button>
    </Container>
  );
}
