const { joinPath, findData, extend, getNowTime } = require("../utils/common");

describe('Common module tool function', () => {
  it('function joinPath', () => {
    expect(joinPath('a', 'b')).toBe('a/b');
    expect(joinPath('a', '/b')).toBe('a/b');
    expect(joinPath('a', 'b/c')).toBe('a/b/c');
    expect(joinPath('a', 'b/c', 'd')).toBe('a/b/c/d');
  })

  it('function extend', () => {
    expect(extend({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
    expect(extend({}, { a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
    expect(extend({ a: 1, b: 2 }, { b: 3, c: 4 }, { d: 5 })).toEqual({ a: 1, b: 3, c: 4, d: 5 });
  })

  it('function findData', () => {
    const list = [{ id: 1, name: 'name1'}, { id: 2, name: 'name2' }, { id: 3, name: 'name3'}];
    expect(findData(list, 'id', 1)).toEqual({ id: 1, name: 'name1', _index: 0 });
    expect(() => findData(list, 'id', 4)).toThrowError('4不存在');
    expect(findData(list, 'id', [1, 2])).toEqual([{ id: 1, name: 'name1', _index: 0 }, { id: 2, name: 'name2', _index: 1 }]);
    expect(() => findData(list, 'id', [1, 2, 4])).toThrowError('4不存在');
    expect(() => findData(list, 'id', [4, 5])).toThrowError('4,5不存在');
    expect(() => findData(list, 'id', [1, 4, 2, 5])).toThrowError('4,5不存在');
  });

  it('function getNowTime', () => {
    const reg = /^2\d{3}-[0-1]\d-[0-3]\d [0-2]\d:[0-5]\d$/
    expect(reg.test(getNowTime())).toBe(true);
  })
})
