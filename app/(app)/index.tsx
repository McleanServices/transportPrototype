import { useAuth } from '../../context/auth';
import BusRotationFiche from './busRotationFiche';

export default function Index() {
  const { session } = useAuth();

  if (!session) return null;

  return <BusRotationFiche />;
}