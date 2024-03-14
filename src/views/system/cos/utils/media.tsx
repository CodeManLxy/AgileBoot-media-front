import { message } from "@/utils/message";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import editForm from "../update.vue";
import { ElMessageBox, Sort } from "element-plus";
import { type PaginationProps } from "@pureadmin/table";
import { CommonUtils } from "@/utils/common";
import { AddGroupRequest } from "../utils/grouptypes";
import { reactive, ref, onMounted, h, toRaw, watch } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { mediaList, mediaQuery } from "@/api/system/media";

export function toMedia() {
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
  const searchParam = reactive<mediaQuery>({
    group_id: 0,
    orderColumn: defaultSort.prop,
    orderDirection: defaultSort.order
  });
  const route = useRoute();
  const updateSearchParam = () => {
    const groupId = route.params.group_id;
    console.log(groupId);
    if (groupId !== undefined && groupId !== null) {
      const groupId = Array.isArray(route.params.group_id)
        ? route.params.group_id[0]
        : route.params.group_id;
      searchParam.group_id = Number.parseInt(groupId as string);
    }
  };

  async function getMediaList(sort: Sort = defaultSort) {
    if (sort != null) {
      CommonUtils.fillSortParams(searchParam, sort);
    }
    CommonUtils.fillPaginationParams(searchParam, pagination);
    pageLoading.value = true;
    const { data } = await mediaList(toRaw(searchParam)).finally(() => {
      pageLoading.value = false;
    });
    dataList.value = data.rows;
    pagination.total = data.total;
  }

  function doSearch() {
    // 点击搜索的时候 需要重置分页
    pagination.currentPage = 1;

    getMediaList();
  }

  onMounted(() => {
    updateSearchParam();
    getMediaList();
  });

  watch(() => route.params.group_id, updateSearchParam);

  return {
    searchParam,
    getMediaList,
    pageLoading,
    defaultSort,
    pagination,
    doSearch
  };
}
