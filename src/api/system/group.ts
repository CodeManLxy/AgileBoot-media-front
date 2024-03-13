import { http } from "@/utils/http";

export type CosGroupRequest = {
  groupId?: number;
  groupName?: string;
  groupDescription: string;
  isFree: number;
  price: string;
};

export interface GroupQuery extends BasePageQuery {
  group_name: string;
  page_num: string;
  page_size: string;
}

type GroupVO = {
  id: string;
  groupName: string;
  backgroundImg: string;
  tagList: Array<CosTagDTO>;
  groupDescription: string;
  isFree: number;
  price: string;
  createTime: Date;
  updateTime: Date;
};

type CosTagDTO = {
  id: string;
  tagName: string;
};

/** 获取组列表 */
export const getGroupList = (params?: GroupQuery) => {
  return http.request<ResponseData<PageDTO<GroupVO>>>(
    "get",
    "/cos_system/group/list",
    {
      params
    }
  );
};

/** 添加系统通知 */
export const addGroupApi = (data: CosGroupRequest) => {
  return http.request<ResponseData<void>>("post", "/cos_system/group/init", {
    data
  });
};

/** 修改系统通知 */
export const updateGroupApi = (data: CosGroupRequest) => {
  return http.request<ResponseData<void>>("post", `/cos_system/group/update`, {
    data
  });
};

/** 删除系统通知 */
export const deleteSystemNoticeApi = (data: Array<number>) => {
  return http.request<ResponseData<void>>("delete", "/system/notices", {
    params: {
      // 需要将数组转换为字符串  否则Axios会将参数变成 noticeIds[0]:1  noticeIds[1]:2 这种格式，后端接收参数不成功
      noticeIds: data.toString()
    }
  });
};
