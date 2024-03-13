<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/grouptypes";

/** TODO 有其他方式  来换掉这个props 父子组件传值吗？ */
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    groupName: "",
    groupDescription: "",
    isFree: "",
    price: 0
  })
});

const groupData = ref(props.formInline);

const formRuleRef = ref();

function getFormRuleRef() {
  return formRuleRef.value;
}

defineExpose({ getFormRuleRef });
</script>

<template>
  <el-form
    ref="formRuleRef"
    :model="groupData"
    :rules="formRules"
    label-width="82px"
  >
    <el-form-item label="组名称" prop="groupName">
      <el-input
        v-model="groupData.groupName"
        clearable
        placeholder="请输入组名称"
      />
    </el-form-item>

    <el-form-item label="组描述" prop="groupDescription">
      <el-input
        v-model="groupData.groupDescription"
        clearable
        placeholder="请输入组描述"
      />
    </el-form-item>
    <el-form-item label="是否免费" prop="isFree">
      <el-input
        v-model="groupData.isFree"
        clearable
        placeholder="请输入是否免费"
      />
    </el-form-item>

    <el-form-item label="请输入价格" prop="price">
      <el-input v-model="groupData.price" clearable placeholder="请输入价格" />
    </el-form-item>
  </el-form>
</template>
