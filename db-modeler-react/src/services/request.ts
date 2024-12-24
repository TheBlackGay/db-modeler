import axios, { AxiosRequestConfig } from 'axios';
import type { RequestOptions, ResponseData, UrlParam, HeaderParam, FormDataParam } from '../types/models';

const convertParamsToRecord = (params: UrlParam[]): Record<string, string> => {
  return params.reduce((acc, param) => ({
    ...acc,
    [param.key]: param.value,
  }), {});
};

const convertHeadersToRecord = (headers: HeaderParam[]): Record<string, string> => {
  return headers.reduce((acc, header) => ({
    ...acc,
    [header.key]: header.value,
  }), {});
};

const createFormData = (params: Array<Omit<FormDataParam, 'file'> & { file?: File }>): FormData => {
  const formData = new FormData();
  params.forEach(param => {
    if (param.type === 'file' && param.file) {
      formData.append(param.key, param.file);
    } else {
      formData.append(param.key, param.value);
    }
  });
  return formData;
};

export const sendRequest = async (options: RequestOptions): Promise<ResponseData> => {
  const startTime = Date.now();
  
  try {
    const config: AxiosRequestConfig = {
      method: options.method,
      url: options.url,
      params: convertParamsToRecord(options.params),
      headers: {
        ...options.headers,
      },
    };

    if (options.bodyType === 'raw') {
      config.headers = {
        ...config.headers,
        'Content-Type': options.rawType === 'json' 
          ? 'application/json'
          : options.rawType === 'xml'
            ? 'application/xml'
            : 'text/plain',
      };
      config.data = options.rawContent;
    } else if (options.bodyType === 'form-data') {
      const formData = createFormData(options.formDataParams);
      config.data = formData;
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    } else if (options.bodyType === 'x-www-form-urlencoded') {
      config.headers = {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      config.data = new URLSearchParams(convertParamsToRecord(options.urlEncodedParams));
    }

    const response = await axios(config);
    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      contentType: response.headers['content-type'] || '',
      data: response.data,
      rawData: typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2),
      responseTime: duration,
      duration,
      size: JSON.stringify(response.data).length,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers as Record<string, string>,
        contentType: error.response.headers['content-type'] || '',
        data: error.response.data,
        rawData: typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data, null, 2),
        responseTime: duration,
        duration,
        size: JSON.stringify(error.response.data).length,
      };
    }
    throw error;
  }
}; 