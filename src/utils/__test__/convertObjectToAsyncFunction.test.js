import convertObjectToAsyncFunction from '../convertObjectToAsyncFunction';

describe('convertObjectToAsyncFunction', () => {
  it('converts an object to async function', async () => {
    const param1 = 'a';
    const param2 = { a: 'a', b: 'b' };
    const obj = {
      func: jest.fn((...receivedParams) => {
        expect(receivedParams).toEqual([param1, param2])
        return 'func'
      }),
      asyncFunc: jest.fn(async function(...receivedParams) {
        expect(receivedParams).toEqual([param1, param2])
        return 'async func'
      }),
      value: {
        key1: 'value1',
        key2: jest.fn(() => 'another func')
      }
    }

    const resultFunc = convertObjectToAsyncFunction(obj);
    const result = await resultFunc(param1, param2);

    expect(result.func).toEqual('func')
    expect(result.asyncFunc).toEqual('async func')
    expect(result.value).toEqual(obj.value)
  })
})
