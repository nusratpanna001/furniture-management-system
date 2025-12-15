import { ORDER_STATUS } from '../../lib/constants';
import Badge from '../ui/Badge';

const statusColors = {
  [ORDER_STATUS.PENDING]: 'warning',
  [ORDER_STATUS.IN_PROGRESS]: 'info',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
};

function StatusPill({ status }) {
  const variant = statusColors[status] || 'secondary';

  return <Badge variant={variant}>{status}</Badge>;
}

export default StatusPill;
