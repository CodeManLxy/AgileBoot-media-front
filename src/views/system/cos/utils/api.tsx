import { message } from "@/utils/message";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import editForm from "../update.vue";
import { ElMessageBox, Sort } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { CommonUtils } from "@/utils/common";
import { AddGroupRequest } from "../utils/grouptypes";
import {
  GroupQuery,
  getGroupList,
  addGroupApi,
  CosGroupRequest,
  updateGroupApi
} from "@/api/system/group";
import { reactive, ref, onMounted, h, toRaw } from "vue";

export function useGroup() {
  const defaultSort: Sort = {
    prop: "createTime",
    order: "descending"
  };
  const formRef = ref();
  const dataList = ref([]);
  const pageLoading = ref(true);
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
    }
  ];
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
    pagination
  };
}
