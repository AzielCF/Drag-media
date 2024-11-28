import { ref } from 'vue';
import { AxiosResponse } from 'axios';
export interface AxiosCall<T> {
    call: Promise<AxiosResponse<T>>;
    controller?: AbortController;
    transformResponse: (response: T, mediaType: string) => T
  }

const useFetchAndLoad = () => {
  const loading = ref(false);
  let controller: AbortController | undefined;

  const callEndpoint = async (axiosCall: AxiosCall<any>): Promise<AxiosResponse<any>> => {

    if (axiosCall.controller) controller = axiosCall.controller;
    loading.value = true;
    let result = {} as AxiosResponse<any>;
    try {
      result = await axiosCall.call;   
    } catch (err: any) {
      loading.value = false;
      throw err;
    }
    loading.value = false;

    return result;
  };

  const cancelEndpoint = () => {
    loading.value = false;
    controller && controller.abort();
  };

  return { loading, callEndpoint, cancelEndpoint };
};

export default useFetchAndLoad;
