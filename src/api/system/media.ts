import { http } from "@/utils/http";

export interface mediaQuery extends BasePageQuery {
  group_id: number;
}

export type mediaRequest = {
  id?: number;
  imgUrl?: string;
  groupId: number;
};

type mediaVO = {
  id?: number;
  imgUrl?: string;
  groupId: number;
};

export const mediaList = (params?: mediaQuery) => {
  return http.request<ResponseData<PageDTO<mediaVO>>>(
    "get",
    "/cos_system/img/list",
    {
      params
    }
  );
};
