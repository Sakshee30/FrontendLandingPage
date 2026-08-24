import { useNavigate, useSearchParams } from 'react-router';
import { ResetPasswordPage as ResetPasswordComponent } from '../../app/components/ResetPasswordPage';

export default function ResetPasswordPage() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const token          = params.get('token') ?? '';

  return (
    <ResetPasswordComponent
      token={token}
      onBack={() => navigate('/login')}
      onSuccess={() => navigate('/login', { replace: true })}
    />
  );
}
