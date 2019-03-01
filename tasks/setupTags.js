import _ from 'lodash';
import { createTags } from '../services/asana';

console.log('Creating Asana tags...');
createTags().then(() => {
  console.log('Asana tags successfully created');
});
