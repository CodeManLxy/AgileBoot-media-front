<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { toMedia } from "./utils/media";
// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import { useUserStoreHook } from "@/store/modules/user";
import { useGroup } from "./utils/api";
import { useRoute } from "vue-router";
/** !!!重要!!! 组件name最好和菜单表中的router_name一致, copy的时候记得更改这个名字*/
defineOptions({
  name: "SystemCosMedia"
});
const input = ref("");
const { query } = useRoute();

const noticeTypeList =
  useUserStoreHook().dictionaryList["sysNotice.noticeType"];
const tableRef = ref();

const searchFormRef = ref();

const {
  searchParam,
  getMediaList,
  pageLoading,
  defaultSort,
  pagination,
  doSearch
} = toMedia();
</script>

<template>
  <div class="dark:text-white">
    <el-input v-model="input" />
    <div v-if="query.text" class="mt-4">
      此页面携带的参数值为：{{ query.text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
./utils/api.jsx
