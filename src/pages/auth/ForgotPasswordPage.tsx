import { useNavigate } from 'react-router';
import { ForgotPasswordPage as ForgotPasswordComponent } from '../../app/components/ForgotPasswordPage';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  return <ForgotPasswordComponent onBack={() => navigate('/login')} />;
}
