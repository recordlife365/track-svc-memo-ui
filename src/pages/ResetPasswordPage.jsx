import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { authApi } from '../api/auth';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { token: searchParams.get('token') ?? '' },
  });

  const onSubmit = async ({ token, newPassword }) => {
    setServerError('');
    try {
      await authApi.resetPassword(token.trim(), newPassword);
      navigate('/login', { replace: true, state: { passwordReset: true } });
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Reset failed. The token may be invalid or expired.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={1} textAlign="center">
          Reset password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
          Paste the token from the server log and choose a new password.
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Reset token"
            fullWidth
            margin="normal"
            autoFocus
            error={Boolean(errors.token)}
            helperText={errors.token?.message}
            {...register('token', { required: 'Reset token is required' })}
          />
          <TextField
            label="New password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />
          <TextField
            label="Confirm new password"
            type="password"
            fullWidth
            margin="normal"
            autoComplete="new-password"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('newPassword') || 'Passwords do not match',
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
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Reset password'}
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Link to="/login" style={{ fontSize: 14 }}>
            Back to sign in
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
