import _ from 'lodash';
import { getHooks } from '../services/asana';

getHooks().then(res => {
  _.each(res.data, ({ gid, active, target }) => {
    console.log('--- Hooks ---');
    console.log('gid    : ', gid);
    console.log('active : ', active);
    console.log('target : ', target);
    console.log('---');
  });
});
