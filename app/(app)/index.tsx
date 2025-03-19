import { useAuth } from '../../context/auth';
import BusRotationFiche from './view/busRotationFiche';

export default function Index() {
  const { session } = useAuth();

  if (!session) return null;

  return <BusRotationFiche />;
}