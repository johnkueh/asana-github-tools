import 'dotenv/config';
import Octokit from '@octokit/rest';

const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_PATOKEN}`
});

export const listHooks = async () => {
  const data = await octokit.repos.listHooks({
    owner: 'yoongfook',
    repo: 'featureready'
  });
  console.log(data);
};

export const createHook = async () => {
  const result = await octokit.repos.createHook({
    owner: 'yoongfook',
    repo: 'featureready',
    config: {
      url: `${process.env.BASE_URL}/webhooks/github`,
      secret: process.env.GITHUB_WEBHOOK_SECRET
    },
    events: ['push', 'pull_request', 'deployment_status']
  });

  console.log(result);
};

export const handleHooks = data => {
  console.log('github webhook', data);
};
