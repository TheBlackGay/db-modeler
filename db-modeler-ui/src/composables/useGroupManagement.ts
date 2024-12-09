import { ref } from 'vue';
import { message } from 'ant-design-vue';
import type { TemplateGroup } from '../views/design/model/components/types';
import { useTemplateStore } from '../stores/template';

export function useGroupManagement() {
  const templateStore = useTemplateStore();
  const showGroupModal = ref(false);
  const editingGroup = ref<TemplateGroup | null>(null);

  const handleEditGroup = (group: TemplateGroup) => {
    editingGroup.value = group;
    showGroupModal.value = true;
  };

  const handleDeleteGroup = async (group: TemplateGroup) => {
    try {
      await templateStore.deleteGroup(group.id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleGroupSubmit = async (group: TemplateGroup) => {
    try {
      if (editingGroup.value) {
        await templateStore.updateGroup(group);
      } else {
        await templateStore.createGroup(group);
      }
      showGroupModal.value = false;
      editingGroup.value = null;
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  return {
    showGroupModal,
    editingGroup,
    handleEditGroup,
    handleDeleteGroup,
    handleGroupSubmit,
  };
}
