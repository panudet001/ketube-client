import { ofetch } from "ofetch";
import type { FetchOptions } from "ofetch";
import { environment } from "~/services/environments";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";

const fetch = ofetch.create({
  baseURL: environment.urlApiApp,
  onRequest({ options }) {
    const accessToken = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
    if (accessToken.value) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken.value}`,
        Accept: "application/json",
      };
    }
  },
  onResponse(_) {},
  onResponseError(_) {},
});

const get = async (url: string, fetchOptions?: FetchOptions) => {
  const options = {
    ...fetchOptions,
    method: "GET",
  };
  return await fetch.raw(url, options);
};

const post = async (url: string, fetchOptions?: FetchOptions) => {
  const options = {
    ...fetchOptions,
    method: "POST",
  };
  return await fetch.raw(url, options);
};

const put = async (url: string, fetchOptions?: FetchOptions) => {
  const options = {
    ...fetchOptions,
    method: "PUT",
  };
  return await fetch.raw(url, options);
};

const del = async (url: string, fetchOptions?: FetchOptions) => {
  const options = {
    ...fetchOptions,
    method: "DELETE",
  };
  return await fetch.raw(url, options);
};

export default {
  get,
  post,
  put,
  del,
};
