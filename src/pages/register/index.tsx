import React, {ReactNode, useState} from 'react';

import Link from 'next/link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useRouter } from 'next/router';
import CustomTextField from 'src/@core/components/mui/text-field'; // Adjust the import path as necessary
import Icon from 'src/@core/components/icon'; // Adjust the import path as necessary
import BlankLayout from 'src/@core/layouts/BlankLayout'; // Adjust the import path as necessary
import { useSettings } from 'src/@core/hooks/useSettings'; // Adjust the import path as necessary
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'; // Adjust the import path as necessary

const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}));

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}));

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const theme = useTheme();
  const { settings } = useSettings();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      // Handle success (e.g., redirect to login)
      router.push('/login');
    } catch (err) {
      // Ensure err is of type Error to access .message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${settings.skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      )}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <CustomTextField
                autoFocus
                fullWidth
                sx={{ mb: 4 }}
                label='Username'
                placeholder='johndoe'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Email'
                sx={{ mb: 4 }}
                placeholder='user@email.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CustomTextField
                fullWidth
                label='Password'
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox />}
                label='I agree to privacy policy & terms'
                sx={{ mb: 4, mt: 1.5 }}
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                Sign up
              </Button>
              {error && <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>}
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Sign in instead
                </Typography>
              </Box>
              <Divider sx={{ my: 4 }}>or</Divider>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton sx={{ color: '#497ce2' }}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton sx={{ color: '#1da1f2' }}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton sx={{ color: theme.palette.mode === 'light' ? '#272727' : 'grey.300' }}>
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton sx={{ color: '#db4437' }}>
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  );
};

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>;

export default Register;
