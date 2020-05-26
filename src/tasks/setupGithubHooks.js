import { createHook } from '../services/github';

createHook().catch(({ message, stack, ...rest }) => {
  console.error('--- Creating github hook errors ---');
  console.error('message         : ', message);
  console.error('stack           : ', stack);
  console.error('additional info : ', JSON.stringify(rest));
  console.error('---');
});
