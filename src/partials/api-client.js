import axios from 'axios'
import { BACKEND_ENDPOINTS } from './backend-endpoints'

/**
 * Class representing high-level API client wrapper based on axios.
 */
class ApiClient {
  /**
   * Create an API client singleton.
   * @param {Object} options - Custom options for the axios instancing.
   */
  constructor(options = {}) {
    if (ApiClient.instance) {
      return ApiClient.instance
    }

    this.defaultHeaders = options.headers || {
      Accept: 'application/json',
      ContentType: 'application/json',
    }

    this.client = options.client ||
      axios.create({
        baseURL: process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : '',
        headers: this.defaultHeaders,
      })

    ApiClient.instance = this
  }

  /**
   * Replace curly-braces-wrapped request parameter names inside the url pattern
   * with the self-titled parameter values in params object.
   * @param {String} url - The string representing url pattern with
   * request parameter names wrapped by curly braces.
   * @param {Object} params - The object containing request parameter values.
   * @return {String} A string representing a valid url with
   * substituted request params.
   */
  static urlFormat(url, params) {
    for (const attr in params) {
      // eslint-disable-next-line no-prototype-builtins
      if (params.hasOwnProperty(attr)) {
        url = url.split('{' + attr + '}').join(params[attr])
      }
    }
    return url
  }
}

export default new Proxy(
    new ApiClient(),
    {
      get: function(target, name) {
        if (BACKEND_ENDPOINTS[name] !== undefined) {
          return ({ params = {}, data = {}, args = {} } = {}) => {
            return target.client({
              method: BACKEND_ENDPOINTS[name].method,
              url: ApiClient.urlFormat(BACKEND_ENDPOINTS[name].url, args),
              data: data,
              params: params,
            })
                .then((serverResponse) => serverResponse.data)
                .catch((err) => {
                  throw err
                })
          }
        } else {
          return target[name]
        }
      },
    },
)
