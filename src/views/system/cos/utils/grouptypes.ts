interface AddGroupRequest {
  id?: number;
  groupName?: string;
  /** 公告标题 */
  groupDescription: string;
  /** 角色编号 */
  isFree: string;
  /** 备注 */
  price: number;
}

interface FormProps {
  formInline: AddGroupRequest;
}

export type { AddGroupRequest, FormProps };
