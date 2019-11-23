import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios"

import storage from "lib/storage"
import {
  API_BASE_URL,
  API_REQUEST_TIMEOUT,
  GROUNDBE_AUTH_TOKEN
} from "constants/variables"

import Auth from "lib/auth"
import { LooseObject } from "lib/help"

class Client {
  private axios: AxiosInstance

  constructor() {
    Auth.verify()

    this.axios = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        googletoken: storage.get(GROUNDBE_AUTH_TOKEN)
      }
    })
  }

  get<T>(path: string, payload = null as any) {
    return this.axios
      .get<T>(path, payload)
      .then((response: AxiosResponse) => response)
  }

  post(path: string, payload: any, config?: LooseObject) {
    if (config) {
      this.axios = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_REQUEST_TIMEOUT,
        headers: {
          "Content-Type": config.headers["Content-Type"],
          googletoken: storage.get(GROUNDBE_AUTH_TOKEN)
        }
      })
    }

    return this.axios
      .post(path, payload)
      .then((response: AxiosResponse) => response)
  }

  put(path: string, payload: any) {
    return this.axios.put(path, payload).then((result: AxiosResponse) => result)
  }

  delete(path: string, payload = null as any) {
    return this.axios
      .delete(path, payload)
      .then((result: AxiosResponse) => result)
  }
}

const client = new Client()

export default client
