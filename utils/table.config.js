// 表格的默认配置
const tableDefaultOption = {
  colAligns: ['center', 'center', 'center', 'center', 'center', 'center'],
  style: {
    border: ['10'],
    head : ['cyan', 'bold']
  }
};

// 列表头（有顺序） && 列表项（有顺序）
const tableHeads = ['ID', '图标库名', '手机账号', '保存路径', '在线链接', '更新时间'];
const tableKeys = ['id', 'name', 'user', 'filePath', 'fontClass', 'updateTime'];

module.exports = {
  tableDefaultOption,
  tableHeads,
  tableKeys
}
