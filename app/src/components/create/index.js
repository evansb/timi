import _                      from 'lodash';
import CreateConfig           from './config';
import CreateController       from './controller';
import CreateDirective        from './directive';

export default _.assign({ CreateConfig, CreateController }, CreateDirective);
