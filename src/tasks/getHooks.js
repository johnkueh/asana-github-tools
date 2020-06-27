import _ from 'lodash';
import { getHooks } from '../services/asana';

getHooks()
  .then(res => {
    _.each(res.data, ({ gid, active, target }) => {
      console.log('--- Hooks ---');
      console.log('gid    : ', gid);
      console.log('active : ', active);
      console.log('target : ', target);
      console.log('---');
    });
  })
  .catch(({ message, stack, ...rest }) => {
    console.error('--- Getting hooks errors ---');
    console.error('message         : ', message);
    console.error('stack           : ', stack);
    console.error('additional info : ', JSON.stringify(rest));
    console.error('---');
  });
});
