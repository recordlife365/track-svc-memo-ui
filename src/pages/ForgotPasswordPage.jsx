import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
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

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setServerError('');
    try {
      await authApi.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message ?? 'Request failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="xs" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            If that email is registered, a reset token has been printed to the server log.
          </Alert>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Copy the token from the server log and use it on the reset password page.
          </Typography>
          <Link to="/reset-password">Go to reset password</Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={1} textAlign="center">
          Forgot password
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
          Enter your email and we will generate a reset token.
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send reset token'}
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
