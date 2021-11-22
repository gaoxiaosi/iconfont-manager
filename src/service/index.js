const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const router = new Router();
const websockify = require('koa-websocket');
const app = websockify(new Koa());

const path = require('path');
const fs = require('fs');
const open = require('open');
const readConfig = require('../../lib/readConfig');
const writeConfig = require('../../lib/writeConfig');

const SOCKET_TYPE = require('./socket-type');
const port = 9527

const downloadScript = require('../../lib/downloadScript');

app.ws.use(async(ctx, next) => {
  const { projects } = await readConfig()
  ctx.websocket.send(JSON.stringify({
    type: SOCKET_TYPE['GET_ALL'],
    data: projects
  }));
  return next(ctx)
});

router.all('/websocket', async ctx => {
  // 接收客户端发来的消息
  ctx.websocket.on('message', msg => {
    const info = JSON.parse(msg)
    const { type, data: { project, projects, index, indexs } } = info
    switch (type) {
      case SOCKET_TYPE['UPDATE_ONE']:
        updateOne(project)
        break;
      case SOCKET_TYPE['UPDATE_BATCH']:
        updateBatch(projects)
        break;
      case SOCKET_TYPE['SAVE_ONE']:
        saveOne(project, index)
        break;
      case SOCKET_TYPE['SAVE_ALL']:
        saveAll(projects)
        break;
      case SOCKET_TYPE['DELETE_ONE']:
        deleteOne(index)
        break;
      case SOCKET_TYPE['DELETE_BATCH']:
        deleteBatch(indexs)
        break;
      case SOCKET_TYPE['ADD_ONE']:
        addOne(project)
        break;
      default:
        break;
    }
  })
  // 监听websocket断开连接
  ctx.websocket.on('close', () => {
    console.log('The client closed the websocket')
  })

  async function updateOne(project) {
    const { id, name, user, password, filePath} = project
    try{
      await downloadScript(id, name, user, password, filePath, false, true)
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '更新项目成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '更新项目失败!'
        }
      }))
    }
    
  }

  async function updateBatch(projects) {
    projects.sort((a, b) => a.user - b.user)
    try {
      while(projects.length) {
        const current = projects.shift();
        const isCloseBrowser = projects.length === 0
        const isRelogin = projects.length > 0 && projects[0].user !== current.user
        const { id, name, user, password, filePath} = current
        await downloadScript(id, name, user, password, filePath, isRelogin, isCloseBrowser)
      }
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '批量更新项目成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '批量更新项目失败!'
        }
      }))
    }
  }

  async function saveOne(project, index) {
    try {
      const { projects } = await readConfig();
      projects[index] = project;
      await writeConfig({ projects });
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '修改项目成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '修改项目失败!'
        }
      }))
    }
    
  }

  async function saveAll(projects) {
    try {
      await writeConfig({ projects });
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '全部保存成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '全部保存失败!'
        }
      }))
    }
    
  }

  async function deleteOne(index) {
    try {
      let { projects } = await readConfig();
      projects.splice(index, 1);
      await writeConfig({ projects });
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '删除项目成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '删除项目失败!'
        }
      }))
    }
  }

  async function deleteBatch(indexs) {
    try {
      // 先从大到小排序，从后往前删除
      indexs.sort((a, b) => b - a)
      let { projects } = await readConfig();
      for(let index of indexs) {
        projects.splice(index, 1);
      }
      await writeConfig({ projects });
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '批量删除项目成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '批量删除项目失败!'
        }
      }))
    }
    
  }

  async function addOne(project) {
    try {
      let { projects } = await readConfig();
      projects.push(project);
      await writeConfig({ projects });
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'success',
          tips: '新增项目成功!'
        }
      }))
    } catch (err) {
      console.log(err);
      ctx.websocket.send(JSON.stringify({
        type: SOCKET_TYPE['MESSAGE_TIP'],
        data: {
          status: 'fail',
          tips: '新增项目失败!'
        }
      }))
    }
  }
})

app.ws.use(router.routes()).use(router.allowedMethods())

app.use(serve(path.resolve(__dirname, '../client')))
  .use(ctx => {
    ctx.set("Content-Type", "text/html");
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../client/index.html'));
  })

app.listen(port, async() => {
  console.log(`Server listen port on ${port}`);
  await open(`http://localhost:${port}`);
  console.log(`若没有自动打开浏览器，请使用浏览器手动访问http://localhost:${port}`);
})
