import 'dotenv/config';
import _ from 'lodash';
import Octokit from '@octokit/rest';
import crypto from 'crypto';
import { searchTask, addCommentToTask } from './asana';

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_PATOKEN}`
});

export const listHooks = async () => {
  const data = await octokit.repos.listHooks({
    owner: process.env.GITHUB_OWNER_NAME,
    repo: process.env.GITHUB_REPO_NAME
  });
  console.log(data);
};

export const createHook = async () => {
  const result = await octokit.repos.createHook({
    owner: process.env.GITHUB_OWNER_NAME,
    repo: process.env.GITHUB_REPO_NAME,
    config: {
      content_type: 'application/json',
      url: `${process.env.BASE_URL}/webhooks/github`,
      secret: process.env.GITHUB_WEBHOOK_SECRET
    },
    events: ['push', 'pull_request', 'deployment_status']
  });

  console.log(result);
};

const findTaskId = commitMessage => {
  const match = commitMessage.match(/\[(.+?)\]/);
  if (match) {
    return match[1];
  }

  return null;
};

export const handleHooks = req => {
  const body = JSON.parse(req.body);
  const type = req.headers['x-github-event'];
  // console.log('Github webhook - ', type);
  switch (type) {
    case 'push':
      _.each(body.commits, async commit => {
        const {
          message,
          url,
          committer: { name }
        } = commit;
        const taskId = findTaskId(message);
        if (taskId) {
          const response = await searchTask(taskId);
          _.each(response.data, ({ gid }) => {
            addCommentToTask({
              gid,
              htmlText: `<body>GitHub commit by <em>${name}</em><ul><li>${message}</li><li><a href='${url}'></a></li></ul></body>`
            });
          });
        }
      });
      break;
    case 'pull_request':
      console.log('handle PR');
      break;
    case 'deployment_status':
      console.log('handle deploy');
      break;
    default:
      console.log('unrecognized event');
  }
};

export const verifyGitHub = req => {
  if (!req.headers['user-agent'].includes('GitHub-Hookshot')) {
    return false;
  }
  // Compare their hmac signature to our hmac signature
  // (hmac = hash-based message authentication code)
  const theirSignature = req.headers['x-hub-signature'];
  const body = JSON.parse(req.body);
  const payload = JSON.stringify(body);
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  const ourSignature = `sha1=${crypto
    .createHmac('sha1', secret)
    .update(payload)
    .digest('hex')}`;

  return crypto.timingSafeEqual(Buffer.from(theirSignature), Buffer.from(ourSignature));
};
