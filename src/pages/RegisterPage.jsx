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

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setServerError('');
    try {
      await registerUser(email, password);
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
          Create your account
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
            autoComplete="new-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />
          <TextField
            label="Confirm password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Link to="/login" style={{ fontSize: 14 }}>
            Already have an account? Sign in
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
