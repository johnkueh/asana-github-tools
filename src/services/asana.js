import 'dotenv/config';
import Asana from 'asana';
import _ from 'lodash';

export const client = Asana.Client.create().useAccessToken(process.env.ASANA_PATOKEN);

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

const tagsTemplate = [
  { name: 'Draft', color: 'light-warm-gray' },
  { name: 'Review', color: 'light-orange' },
  { name: 'Approved', color: 'light-green' },
  { name: 'Staging', color: 'dark-pink' },
  { name: 'Production', color: 'dark-purple' }
];

export const createTags = async () => {
  const promises = [];
  _.each(tagsTemplate, ({ name, color }) => {
    promises.push(
      client.tags.create({
        workspace: process.env.ASANA_WORKSPACE_ID,
        name: 'Draft',
        color: 'light-warm-gray'
      })
    );
  });

  await Promise.all(promises);
  console.log('Created tags');
};

export const getHooks = async () => {
  return client.webhooks.getAll(process.env.ASANA_WORKSPACE_ID, {
    resource: process.env.ASANA_PROJECT_ID
  });
};

export const createHooks = async () => {
  client.webhooks.create(process.env.ASANA_PROJECT_ID, `${process.env.BASE_URL}/webhooks/asana`);
};

export const getTask = async gid => {
  return client.tasks.findById(gid);
};

export const getCurrentTaskId = async () => {
  const project = await client.projects.findById(process.env.ASANA_PROJECT_ID);
  const regex = /\[currentTaskId:(.+?)\]/;
  const taskId = project.notes.match(regex)[1] || 0;
  return parseInt(taskId, 10);
};

export const setNextTaskId = async number => {
  const project = await client.projects.findById(process.env.ASANA_PROJECT_ID);
  const regex = /\[currentTaskId:(.+?)\]/;
  const match = project.notes.match(regex)[1];

  let updatedNotes = `[currentTaskId: ${number}]`;

  if (match) {
    updatedNotes = project.notes.replace(`[currentTaskId: ${match}]`, `[currentTaskId: ${number}]`);
  }

  await client.projects.update(process.env.ASANA_PROJECT_ID, {
    notes: updatedNotes
  });
};

// Handling hooks
export const handleHooks = async req => {
  // console.log('--- Incoming Asana webhook ---');
  const body = JSON.parse(req.body);
  // const tags = await client.tags.findByWorkspace(process.env.ASANA_WORKSPACE_ID);
  // const draftTag = _.find(tags, { name: 'Draft' });
  // console.log(draftTag);
  let number = await getCurrentTaskId();

  _.each(body.events, (event, i) => {
    const { user, created_at: createdAt, action, resource = {}, parent = {} } = event;
    if (resource && parent) {
      const { gid, resource_type: resourceType } = resource;
      const { resource_type: parentResourceType } = parent;

      if (action === 'added' && resourceType === 'task' && parentResourceType === 'project') {
        number += 1;
        handleTaskCreated({
          gid,
          number
        });
        // client.tasks.addTag(gid, {
        //   tag: draftTag.gid
        // });
      }
    }
  });

  await setNextTaskId(number);
  // console.log('--- End Asana webhook ---');
};

export const handleTaskCreated = async ({ gid, number }) => {
  const task = await getTask(gid);
  const { name } = task;
  const updatedName = `[${process.env.ASANA_PROJECT_PREFIX}-${number}] ${name}`;
  await client.tasks.update(gid, {
    name: updatedName
  });

  // const draftTag = _.find(store.get('tags'), { name: 'Draft' });
  // client.tasks.addTag(gid, {
  //   tag: draftTag.gid
  // });
};
