import _ from 'lodash';
import { setupCustomFields } from '../services/asana';

console.log('Creating Asana custom fields...');
setupCustomFields().catch(({ message, stack, ...rest }) => {
  console.error('--- Creating Asana custom fields errors ---');
  console.error('message         : ', message);
  console.error('stack           : ', stack);
  console.error('additional info : ', JSON.stringify(rest));
  console.error('---');
});
