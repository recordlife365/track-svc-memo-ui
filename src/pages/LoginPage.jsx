import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setServerError('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Sign in to LifeMemo
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
            })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
          </Button>
        </Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Link to="/forgot-password" style={{ fontSize: 14 }}>
            Forgot password?
          </Link>
          <Link to="/register" style={{ fontSize: 14 }}>
            Create account
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
