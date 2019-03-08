import 'dotenv/config';
import _ from 'lodash';
import Octokit from '@octokit/rest';
import crypto from 'crypto';
import {
  getTask,
  searchTask,
  addCommentToTask,
  getCustomField,
  getCustomFieldOption,
  client
} from './asana';

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
      handleCommit(body);
      break;
    case 'pull_request':
      handlePullRequest(body);
      break;
    case 'deployment_status':
      console.log('handle deploy');
      break;
    default:
      console.log('unrecognized event');
  }
};

export const handleCommit = async ({ commits }) => {
  _.each(commits, async commit => {
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
          htmlText: `<body><strong>GitHub Commit</strong> by <em>${name}</em><ul><li>${message}</li><li><a href='${url}'></a></li></ul></body>`
        });
      });
    }
  });
};

export const handlePullRequest = async ({
  action,
  number,
  pull_request: {
    title,
    user: { login },
    html_url: url
  }
}) => {
  const taskId = findTaskId(title);
  if (taskId) {
    const response = await searchTask(taskId);
    _.each(response.data, task => {
      const { gid } = task;
      switch (action) {
        case 'opened':
          addCommentToTask({
            gid,
            htmlText: `<body><strong>GitHub PR #${number}</strong> opened by <em>${login}</em><ul><li>${title}</li><li><a href='${url}'></a></li></ul></body>`
          });
          setStage({
            stage: 'Review',
            task
          });
          break;
        case 'edited':
          break;
        default:
      }
    });
  }
};

const setStage = async ({ stage, task: searchedTask }) => {
  const { gid, custom_fields: customFields } = await getTask(searchedTask.gid);
  const customField = await getCustomField(customFields);
  const customFieldOption = getCustomFieldOption({
    name: stage,
    field: customField
  });

  client.tasks.update(gid, {
    custom_fields: {
      [customField.gid]: customFieldOption.gid
    }
  });
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
