import _                          from 'lodash';
import controllers                from './controller';
import directives                 from './directive';
import $notification              from './service';

export default _.assign({ $notification }, controllers, directives);
