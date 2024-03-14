import { message } from "@/utils/message";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import editForm from "../update.vue";
import { ElMessageBox, Sort } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { CommonUtils } from "@/utils/common";
import { AddGroupRequest } from "../utils/grouptypes";
import { isString, isEmpty } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import {
  GroupQuery,
  getGroupList,
  addGroupApi,
  CosGroupRequest,
  updateGroupApi,
  deleteSystemNoticeApi
} from "@/api/system/group";
import { reactive, ref, onMounted, h, toRaw } from "vue";
import {
  useRouter,
  useRoute,
  type LocationQueryRaw,
  type RouteParamsRaw
} from "vue-router";

export function useGroup() {
  const route = useRoute();
  const router = useRouter();
  const getParameter = isEmpty(route.params) ? route.query : route.params;
  const defaultSort: Sort = {
    prop: "createTime",
    order: "descending"
  };
  const formRef = ref();
  const dataList = ref([]);
  const pageLoading = ref(true);
  const multipleSelection = ref([]);
  const pagination: PaginationProps = {
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  };
  const searchParam = reactive<GroupQuery>({
    group_name: undefined,
    page_num: "1",
    page_size: "20",
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order
  });

  const tableColumns: TableColumnList = [
    {
      type: "selection",
      align: "left"
    },
    {
      label: "序号",
      prop: "id",
      minWidth: 100
    },
    {
      label: "组名称",
      prop: "groupName",
      minWidth: 120
    },
    {
      label: "组描述",
      prop: "groupDescription",
      minWidth: 120
    },
    {
      label: "是否免费",
      prop: "isFree",
      minWidth: 120
    },
    {
      label: "价格",
      prop: "price",
      minWidth: 120
    },

    {
      label: "创建时间",
      minWidth: 180,
      prop: "createTime",
      sortable: "custom",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "更新时间",
      minWidth: 180,
      prop: "updateTime",
      sortable: "custom",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  function detail(
    parameter: LocationQueryRaw | RouteParamsRaw,
    model: "query" | "params"
  ) {
    Object.keys(parameter).forEach(param => {
      if (!isString(parameter[param])) {
        parameter[param] = parameter[param].toString();
      }
    });
    if (model === "params") {
      useMultiTagsStoreHook().handleTags("push", {
        path: `/system/cos/media:group_id`,
        name: "SystemCosMedia",
        params: parameter,
        meta: {
          title: {
            zh: `No.${parameter.id} - 详情信息`,
            en: `No.${parameter.id} - DetailInfo`
          }
        }
      });
    }
    router.push({ name: "SystemCosMedia", params: parameter });
  }
  const initToDetail = (model: "query" | "params") => {
    if (getParameter) detail(getParameter, model);
  };
  function openDialog(title = "新增", row?: AddGroupRequest) {
    addDialog({
      title: `${title}组`,
      props: {
        formInline: {
          id: row?.id ?? "",
          groupName: row?.groupName ?? "",
          groupDescription: row?.groupDescription ?? "",
          isFree: row?.isFree ?? "",
          price: row?.price ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formRuleRef = formRef.value.getFormRuleRef();

        const curData = options.props.formInline as AddGroupRequest;

        formRuleRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              handleAdd(curData, done);
            } else {
              curData.id = row.id;
              handleUpdate(curData, done);
            }
          }
        });
      }
    });
  }
  async function handleAdd(row, done) {
    await addGroupApi(row as CosGroupRequest).then(() => {
      message(`您新增了通知标题为${row.groupName}的这条数据`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      getGroupTable();
    });
  }
  async function handleUpdate(row, done) {
    await updateGroupApi(row as CosGroupRequest).then(() => {
      message(`您新增了通知标题为${row.groupName}的这条数据`, {
        type: "success"
      });
      // 关闭弹框
      done();
      // 刷新列表
      getGroupTable();
    });
  }
  async function getGroupTable(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchParam, sort);
    }
    CommonUtils.fillPaginationParams(searchParam, pagination);
    pageLoading.value = true;
    const { data } = await getGroupList(toRaw(searchParam)).finally(() => {
      pageLoading.value = false;
    });
    dataList.value = data.rows;
    pagination.total = data.total;
  }

  async function handleDelete(row) {
    await deleteSystemNoticeApi([row.noticeId]).then(() => {
      message(`您删除了通知标题为${row.name}的这条数据`, { type: "success" });
      // 刷新列表
      getGroupTable();
    });
  }

  async function handleBulkDelete(tableRef) {
    if (multipleSelection.value.length === 0) {
      message("请选择需要删除的数据", { type: "warning" });
      return;
    }

    ElMessageBox.confirm(
      `确认要<strong>删除</strong>编号为<strong style='color:var(--el-color-primary)'>[ ${multipleSelection.value} ]</strong>的通知吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        await deleteSystemNoticeApi(multipleSelection.value).then(() => {
          message(`您删除了通知编号为[ ${multipleSelection.value} ]的数据`, {
            type: "success"
          });
          // 刷新列表
          getGroupTable();
        });
      })
      .catch(() => {
        message("取消删除", {
          type: "info"
        });
        // 清空checkbox选择的数据
        tableRef.getTableRef().clearSelection();
      });
  }

  function doSearch() {
    // 点击搜索的时候 需要重置分页
    pagination.currentPage = 1;

    getGroupTable();
  }
  function resetForm(formEl, tableRef) {
    if (!formEl) return;
    // 清空查询参数
    formEl.resetFields();
    // 清空排序
    searchParam.orderColumn = undefined;
    searchParam.orderDirection = undefined;
    tableRef.getTableRef().clearSort();
    // 重置分页并查询
    doSearch();
  }

  onMounted(() => {
    getGroupTable();
  });
  return {
    searchParam,
    getGroupTable,
    doSearch,
    resetForm,
    openDialog,
    dataList,
    tableColumns,
    pageLoading,
    defaultSort,
    pagination,
    handleBulkDelete,
    multipleSelection,
    handleDelete,
    detail,
    initToDetail,
    getParameter,
    router
  };
}
