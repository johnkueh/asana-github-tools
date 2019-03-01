import 'dotenv/config';
import Asana from 'asana';
import _ from 'lodash';
import store from 'data-store';

const Store = new store({ path: 'tags.json' });

const client = Asana.Client.create().useAccessToken(process.env.ASANA_PATOKEN);

export const getMe = async () => {
  const user = await client.users.me();
  console.log(user);
};

export const getWorkspace = async () => {
  const workspace = await client.workspaces.findById(process.env.ASANA_WORKSPACE_ID);
  console.log(workspace);
};

export const getTags = async () => {
  const tags = await client.tags.findByWorkspace(process.env.ASANA_WORKSPACE_ID);
  console.log(tags.data.length);
};

export const getTag = async () => {
  const tag = await client.tags.findById('1111933750584387');
  console.log(tag);
};

const tags = [
  { name: 'Draft', color: 'light-warm-gray' },
  { name: 'Review', color: 'light-orange' },
  { name: 'Approved', color: 'light-green' },
  { name: 'Staging', color: 'dark-pink' },
  { name: 'Production', color: 'dark-purple' }
];

export const createTags = async () => {
  const promises = [];
  _.each(tags, ({ name, color }) => {
    promises.push(
      client.tags.create({
        workspace: process.env.ASANA_WORKSPACE_ID,
        name: 'Draft',
        color: 'light-warm-gray'
      })
    );
  });

  const createdTags = await Promise.all(promises);
  Store.set({
    tags: createdTags
  });
  console.log('Created and stored tags');
};
