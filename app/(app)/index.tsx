import { useAuth } from '../../context/auth';
import Home from './home';

export default function Index() {
  const { session } = useAuth();

  if (!session) return null;

  return <Home />;
}