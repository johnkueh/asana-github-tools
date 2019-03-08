import 'dotenv/config';
import Octokit from '@octokit/rest';
import crypto from 'crypto';

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
      content_type: 'application/json',
      url: `${process.env.BASE_URL}/webhooks/github`,
      secret: process.env.GITHUB_WEBHOOK_SECRET
    },
    events: ['push', 'pull_request', 'deployment_status']
  });

  console.log(result);
};

export const handleHooks = req => {
  const body = JSON.parse(req.body);
  console.log('github webhook', body);
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
