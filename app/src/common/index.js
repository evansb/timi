
import _										from 'lodash';
import $timi								from './timi';
import timiEventCard				from './timiEventCard';
import timiEventHeader			from './timiEventHeader';
import timiFullButton				from './timiFullButton';
import timiPersonCard				from './timiPersonCard';
import timiSlotCard					from './timiSlotCard';
import timiAvailabilityCard	from './timiAvailabilityCard';

let directives = {
	timiEventCard,
	timiEventHeader,
	timiFullButton,
	timiPersonCard,
	timiSlotCard,
	timiAvailabilityCard
};

let services = { $timi };

let controllers = {};

let configs = {};

export default _.assign(directives,
								_.assign(services,
									_.assign(configs, controllers)));
