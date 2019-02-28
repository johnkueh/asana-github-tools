import Asana from 'asana';

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

export const createTags = async () => {
  const res = await Promise.all([
    client.tags.create({
      workspace: process.env.ASANA_WORKSPACE_ID,
      name: 'Draft',
      color: 'light-warm-gray'
    }),

    client.tags.create({
      workspace: process.env.ASANA_WORKSPACE_ID,
      name: 'Review',
      color: 'light-orange'
    }),

    client.tags.create({
      workspace: process.env.ASANA_WORKSPACE_ID,
      name: 'Approved',
      color: 'light-green'
    }),

    client.tags.create({
      workspace: process.env.ASANA_WORKSPACE_ID,
      name: 'Staging',
      color: 'dark-pink'
    }),

    client.tags.create({
      workspace: process.env.ASANA_WORKSPACE_ID,
      name: 'Production',
      color: 'dark-purple'
    })
  ]);

  console.log(res);
};
