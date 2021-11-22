// 不想为这个文件单独打包，先这样写，与服务端类型相同
const SOCKET_TYPE = {
  'GET_ALL': 'GET_ALL',
  'SAVE_ONE': 'SAVE_ONE',
  'SAVE_ALL': 'SAVE_ALL',
  'UPDATE_ONE': 'UPDATE_ONE',
  'UPDATE_BATCH': 'UPDATE_BATCH',
  'DELETE_ONE': 'DELETE_ONE',
  'DELETE_BATCH': 'DELETE_BATCH',
  'ADD_ONE': 'ADD_ONE',
  'MESSAGE_TIP': 'MESSAGE_TIP'
}
const port = 9527
let ws = null

if (typeof WebSocket !== undefined) {
  init()
} else {
  // alert('您的浏览器不支持websocket，请更换浏览器！')
}

function init() {
  ws = new WebSocket(`ws://localhost:${port}/websocket`);
  ws.onopen = function (evt) {
    console.log("Connection open ...");
  }

  ws.onmessage = function (evt) {
    const msg = JSON.parse(evt.data);
    switch (msg.type) {
      case SOCKET_TYPE['MESSAGE_TIP']:
        showMessageTip(msg.data)
        break;
      case SOCKET_TYPE['GET_ALL']:
        const projects = msg.data;
        createTable(projects)
        break;
      default:
        break;
    }
  }

  ws.onclose = function (evt) {
    console.log("Connection closed.");
  }

  // ESC键关闭弹窗
  document.onkeydown = function(e){
    if (e.keyCode == 27) {
      var mods = document.querySelectorAll('.modal > [type=checkbox]');
      [].forEach.call(mods, function(mod){ mod.checked = false; });
    }
  }
}

// 将html字符串转成DocumentFragment，IE不支持
function parseStringToDOM(htmlstring) {
  const tpl = document.createElement('template');
  tpl.innerHTML = htmlstring;
  return tpl.content;
}

// 获取当前行的project data，主要用于行内按钮、checkbox的点击
function clickBtnGetProjectData(container) {
  const index = Number(container.dataset.index);
  const id = container.querySelector('.id-input').value;
  const name = container.querySelector('.name-input').value;
  const user = container.querySelector('.user-input').value;
  const password = container.querySelector('.password-input').value;
  const filePath = container.querySelector('.path-input').value;
  return {
    project: {
      id,
      name,
      user,
      password,
      filePath
    },
    index
  }
}

// socket连接成功后，服务端会发送所有的project data过来，然后渲染成列表的形式
function createTable(projects) {
  const container = document.querySelector('.project-container');
  let context = ''
  projects.map(({id, name, user, password, filePath}, index) => {
    context +=`
    <div class="project-box project-box-content" data-index="${index}">
      <div class="box-left">
        <label>
          <input type="checkbox" onchange="checkboxChange(event)">
          <span class="checkable"></span>
        </label>
      </div>
      <div class="box-center flex">
        <label style="width: 10%;"><input class="id-input" type="text" placeholder="项目ID" value="${id}" /></label>
        <label style="width: 20%;"><input class="name-input" type="text" placeholder="项目名称" value="${name}" /></label>
        <label style="width: 15%;"><input class="user-input" type="text" placeholder="所属用户" value="${user}" /></label>
        <label style="width: 15%;"><input class="password-input" type="password" placeholder="密码" value="${password}" /></label>
        <label style="width: 40%;"><input class="path-input" type="text" placeholder="保存路径" value="${filePath}" /></label>
      </div>
      <div class="box-right">
        <button class="success update-one-btn" onClick="updateOneBtnClick(event)">更新</button>
        <button class="warning" onClick="saveOneBtnClick(event)">保存</button>
        <button class="error" onClick="deleteOneBtnClick(event)">删除</button>
      </div>
    </div>
    `
  })
  container.appendChild(parseStringToDOM(context))
}

// 接收服务端返回的消息提醒：用于各种操作是否成功或失败
// status: success fail
function showMessageTip(data) {
  const { status, tips } = data
  const container = document.querySelector('#app .message-container');
  let idSign = 'box-' + new Date().getTime()
  const box = `<div id="${idSign}" class="message-box ${status}">${ status === 'success' ? '✔' : 'x'}&nbsp;&nbsp;&nbsp;${tips}</div>`
  const dom = parseStringToDOM(box);
  container.appendChild(dom);
  setTimeout(() => {
    container.querySelector('#' + idSign).style.opacity = 0
  }, 2500)
  setTimeout(() => {
    container.removeChild(container.querySelector('#' + idSign))
  }, 3500)
}

// 行内“更新”按钮点击，触发更新一个图标库的操作
function updateOneBtnClick(ev) {
  const { project } = clickBtnGetProjectData(ev.target.parentNode.parentNode);
  updateOne(project)
}

// 更新一个
function updateOne(project) {
  let data = JSON.stringify({
    type: SOCKET_TYPE['UPDATE_ONE'],
    data: {
      project
    }
  })
  ws.send(data)
}

// 批量更新
function updateBatch() {
  const { projects } = getSelectedCheckbox()
  let data = JSON.stringify({
    type: SOCKET_TYPE['UPDATE_BATCH'],
    data: {
      projects
    }
  })
  ws.send(data)
}

// 行内“保存”按钮点击，触发保存一个图标库的操作
function saveOneBtnClick(ev) {
  const { project, index } = clickBtnGetProjectData(ev.target.parentNode.parentNode);
  saveOne(project, index)
}

// 保存一个
function saveOne(project, index) {
  let data = JSON.stringify({
    type: SOCKET_TYPE['SAVE_ONE'],
    data: {
      project,
      index
    }
  })
  ws.send(data)
}

// 保存所有
function saveAll() {
  const nodes = document.querySelectorAll('.project-box');
  let projects = []
  // 排除第一项，表头
  for(let i = 1; i < nodes.length; i++) {
    let { project } = clickBtnGetProjectData(nodes[i])
    projects.push(project);
  }
  let data = JSON.stringify({
    type: SOCKET_TYPE['SAVE_ALL'],
    data: {
      projects
    }
  })
  ws.send(data)
}

// 行内“删除”按钮点击，触发删除一个图标库的操作
function deleteOneBtnClick(ev) {
  let node = ev.target.parentNode.parentNode;
  const { project, index } = clickBtnGetProjectData(node);
  deleteOne(project, index)
  const tempNode = node
  // 之后的data-index全部减1
  while(node.nextElementSibling) {
    node.nextElementSibling.dataset.index = Number(node.nextElementSibling.dataset.index) - 1
    node = node.nextElementSibling
  }
  node.parentNode.removeChild(tempNode)
}

// 删除一个
function deleteOne(project, index) {
  let data = JSON.stringify({
    type: SOCKET_TYPE['DELETE_ONE'],
    data: {
      project,
      index
    }
  })
  ws.send(data)
}

// 批量删除
function deleteBatch() {
  const { indexs } = getSelectedCheckbox()
  let data = JSON.stringify({
    type: SOCKET_TYPE['DELETE_BATCH'],
    data: {
      indexs
    }
  })
  ws.send(data)
  // 从后往前批量删除dom，删除之后，所有的data-index需要重新编号
  indexs.sort((a, b) => b - a)
  let container = document.querySelector('.project-container');
  let projectBoxs = document.querySelectorAll('.project-box-content');
  for(let index of indexs) {
    container.removeChild(projectBoxs[index])
  }
  projectBoxs = document.querySelectorAll('.project-box-content');
  for(let i = 0; i < projectBoxs.length; i++) {
    projectBoxs[i].dataset.index = i
  }
}

// 新增一个
function addOne(project) {
  let data = JSON.stringify({
    type: SOCKET_TYPE['ADD_ONE'],
    data: {
      project
    }
  })
  ws.send(data)
}

// 模态窗，确认新增的按钮
function confirmAdd() {
  let modalNode = document.querySelector('.modal');
  const id = modalNode.querySelector('.id-input').value;
  const name = modalNode.querySelector('.name-input').value;
  const user = modalNode.querySelector('.user-input').value;
  const password = modalNode.querySelector('.password-input').value;
  const filePath = modalNode.querySelector('.path-input').value;
  addOne({
    id,
    name,
    user,
    password,
    filePath
  })
  closeAllModal()
  modalNode.querySelector('.id-input').value = '';
  modalNode.querySelector('.name-input').value = '';
  modalNode.querySelector('.user-input').value = '';
  modalNode.querySelector('.password-input').value = '';
  modalNode.querySelector('.path-input').value = '';
  const container = document.querySelector('.project-container');
  const index = container.querySelectorAll('.project-box').length || 1;
  let context = `
  <div class="project-box project-box-content" data-index="${index - 1}">
    <div class="box-left">
      <label>
        <input type="checkbox" onchange="checkboxChange(event)">
        <span class="checkable"></span>
      </label>
    </div>
    <div class="box-center flex">
      <label style="width: 10%;"><input class="id-input" type="text" placeholder="项目ID" value="${id}" /></label>
      <label style="width: 20%;"><input class="name-input" type="text" placeholder="项目名称" value="${name}" /></label>
      <label style="width: 15%;"><input class="user-input" type="text" placeholder="所属用户" value="${user}" /></label>
      <label style="width: 15%;"><input class="password-input" type="password" placeholder="密码" value="${password}" /></label>
      <label style="width: 40%;"><input class="path-input" type="text" placeholder="保存路径" value="${filePath}" /></label>
    </div>
    <div class="box-right">
      <button class="success" onClick="updateOneBtnClick(event)">更新</button>
      <button class="warning" onClick="saveOneBtnClick(event)">保存</button>
      <button class="error" onClick="deleteOneBtnClick(event)">删除</button>
    </div>
  </div>
  `
  container.appendChild(parseStringToDOM(context))
}

// 关闭模态窗
function closeAllModal () {
  var mods = document.querySelectorAll('.modal > [type=checkbox]');
  [].forEach.call(mods, function(mod){ mod.checked = false; });
}

// 全选checkbox被点击时
function allSelectCheckboxChange(ev) {
  ev.stopPropagation();
  let allSelectCheckbox = document.querySelector('.project-box-header .box-left input[type=checkbox]');
  let allCheckbox = document.querySelectorAll('.project-box-content .box-left input[type=checkbox]');
  const status = allSelectCheckbox.checked;
  // 如果点击全选
  for(let i = 0; i < allCheckbox.length; i++) {
    allCheckbox[i].checked = status
  }
}

// 普通checkbox被点击时
function checkboxChange(ev) {
  ev.stopPropagation();
  let allSelectCheckbox = document.querySelector('.project-box .box-left input[type=checkbox]');
  let allCheckbox = document.querySelectorAll('.project-box-content .box-left input[type=checkbox]');
  let status = true
  for(let i = 0; i < allCheckbox.length; i++) {
    if(!allCheckbox[i].checked) {
      status = false;
      break
    }
  }
  allSelectCheckbox.checked = status;
}

// 获取选中的checkbox（不包括全选）
function getSelectedCheckbox() {
  let allCheckbox = document.querySelectorAll('.project-box-content .box-left input[type=checkbox]');
  let projects = [], indexs = []
  for(let i = 0; i < allCheckbox.length; i++) {
    if (allCheckbox[i].checked) {
      let { project, index } = clickBtnGetProjectData(allCheckbox[i].parentNode.parentNode.parentNode);
      projects.push(project)
      indexs.push(index)
    }
  }
  return {
    projects,
    indexs
  }
}