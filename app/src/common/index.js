
import _								from 'lodash';
import $timi						from './timi';
import timiEventCard		from './timiEventCard';
import timiEventHeader	from './timiEventHeader';
import timiFullButton		from './timiFullButton';
import timiPersonCard		from './timiPersonCard';
import timiSlotCard			from './timiSlotCard';

let directives = {
	timiEventCard,
	timiEventHeader,
	timiFullButton,
	timiPersonCard,
	timiSlotCard
};

let services = { $timi };

let controllers = {};

export default _.assign(directives, _.assign(services, controllers));
