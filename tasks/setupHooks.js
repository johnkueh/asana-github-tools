import _ from 'lodash';
import { createHooks, getHooks } from '../services/asana';

console.log('Creating Asana hooks');
createHooks().then(async () => {
  const res = await getHooks();
  _.each(res.data, ({ gid, active, target }) => {
    console.log('--- Hooks ---');
    console.log('gid    : ', gid);
    console.log('active : ', active);
    console.log('target : ', target);
    console.log('---');
  });
  console.log('Asana hooks successfully created');
});
