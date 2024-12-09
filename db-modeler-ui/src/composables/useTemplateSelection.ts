import { ref, computed } from 'vue';
import type { Template, TemplateGroup, PreviewField } from '../views/design/model/components/types';
import { useTemplateStore } from '../stores/template';

export function useTemplateSelection() {
  const templateStore = useTemplateStore();
  const searchText = ref('');
  const selectedCategory = ref(['group']);
  const selectedTemplates = ref<string[]>([]);
  const selectedGroups = ref<string[]>([]);

  const isGroupMode = computed(() => selectedCategory.value.includes('group'));

  const filteredTemplates = computed(() => {
    const templates = templateStore.templates;
    if (!searchText.value) return templates;
    
    const search = searchText.value.toLowerCase();
    return templates.filter(template =>
      template.name.toLowerCase().includes(search) ||
      template.description?.toLowerCase().includes(search) ||
      template.template.name.toLowerCase().includes(search)
    );
  });

  const displayGroups = computed(() => {
    const groups = templateStore.groups;
    if (!searchText.value) return groups;
    
    const search = searchText.value.toLowerCase();
    return groups.filter(group =>
      group.name.toLowerCase().includes(search) ||
      group.description?.toLowerCase().includes(search)
    );
  });

  const selectedPreviewFields = computed(() => {
    const fields: PreviewField[] = [];
    
    selectedTemplates.value.forEach(templateId => {
      const template = templateStore.getTemplateById(templateId);
      if (template?.template) {
        fields.push(template.template);
      }
    });
    
    selectedGroups.value.forEach(groupId => {
      const group = templateStore.getGroupById(groupId);
      if (group?.templates) {
        group.templates.forEach(templateId => {
          const template = templateStore.getTemplateById(templateId);
          if (template?.template) {
            fields.push(template.template);
          }
        });
      }
    });
    
    return fields;
  });

  const handleCategoryChange = () => {
    selectedTemplates.value = [];
    selectedGroups.value = [];
    searchText.value = '';
  };

  const handleSearch = (value: string) => {
    searchText.value = value;
  };

  const handleTemplateSelect = (keys: string[]) => {
    selectedTemplates.value = keys;
  };

  const handleGroupSelect = (keys: string[]) => {
    selectedGroups.value = keys;
  };

  const handleRemoveField = (field: PreviewField) => {
    const templateId = templateStore.findTemplateIdByField(field);
    if (templateId) {
      selectedTemplates.value = selectedTemplates.value.filter(id => id !== templateId);
    }
  };

  return {
    searchText,
    selectedCategory,
    selectedTemplates,
    selectedGroups,
    isGroupMode,
    filteredTemplates,
    displayGroups,
    selectedPreviewFields,
    handleCategoryChange,
    handleSearch,
    handleTemplateSelect,
    handleGroupSelect,
    handleRemoveField,
  };
}
