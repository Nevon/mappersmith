import MethodDescriptor from 'src/method-descriptor'
import Request from 'src/request'
import BasicAuthMiddleware from 'src/middlewares/basic-auth'

describe('Middleware / BasicAuth', () => {
  let methodDescriptor, request, authData, middleware

  beforeEach(() => {
    methodDescriptor = new MethodDescriptor({ method: 'get' })
    request = new Request(methodDescriptor)
    authData = { username: 'bob', password: 'bob' }
    middleware = BasicAuthMiddleware(authData)()
  })

  it('exposes name', () => {
    expect(BasicAuthMiddleware(authData).name).toEqual('BasicAuthMiddleware')
  })

  it('configures the auth data', () => {
    const newRequest = middleware.request(request)
    expect(newRequest.auth()).toEqual(authData)
  })

  it('changing the request params does not mutate the configuration', () => {
    const newRequest = middleware.request(request)
    newRequest.requestParams.auth.password = 'foo'
    expect(authData.password).toEqual('bob')
  })

  describe('when the auth property is explicitly defined', () => {
    it('keeps the original auth data', () => {
      const authData2 = { username: 'bob', password: 'bill' }
      request = new Request(methodDescriptor, { auth: authData2 })
      const newRequest = middleware.request(request)
      expect(newRequest.auth()).toEqual(authData2)
    })
  })
})
