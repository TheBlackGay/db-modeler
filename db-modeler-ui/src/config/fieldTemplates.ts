interface FieldTemplate {
  id: string
  name: string
  description: string
  category: string
  template: {
    name: string
    displayName: string
    dataType: string
    length?: number
    precision?: number
    nullable: boolean
    primaryKey: boolean
    autoIncrement: boolean
    defaultValue?: string
    comment?: string
  }
}

export const fieldTemplates: FieldTemplate[] = [
  // 主键模板
  {
    id: 'pk_id',
    name: '自增主键 (ID)',
    description: '常用的自增主键字段',
    category: 'primary_key',
    template: {
      name: 'id',
      displayName: 'ID',
      dataType: 'int',
      length: 11,
      nullable: false,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    }
  },
  {
    id: 'pk_uuid',
    name: 'UUID主键',
    description: '使用UUID作为主键',
    category: 'primary_key',
    template: {
      name: 'id',
      displayName: 'ID',
      dataType: 'varchar',
      length: 36,
      nullable: false,
      primaryKey: true,
      autoIncrement: false,
      defaultValue: 'UUID()',
      comment: 'UUID主键'
    }
  },
  
  // 基础字段模板
  {
    id: 'basic_name',
    name: '名称字段',
    description: '通用的名称字段',
    category: 'basic',
    template: {
      name: 'name',
      displayName: '名称',
      dataType: 'varchar',
      length: 100,
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      comment: '名称'
    }
  },
  {
    id: 'basic_code',
    name: '编码字段',
    description: '通用的编码字段',
    category: 'basic',
    template: {
      name: 'code',
      displayName: '编码',
      dataType: 'varchar',
      length: 50,
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      comment: '编码'
    }
  },
  {
    id: 'basic_description',
    name: '描述字段',
    description: '通用的描述字段',
    category: 'basic',
    template: {
      name: 'description',
      displayName: '描述',
      dataType: 'text',
      nullable: true,
      primaryKey: false,
      autoIncrement: false,
      comment: '描述'
    }
  },
  
  // 状态字段模板
  {
    id: 'status_enabled',
    name: '启用状态',
    description: '表示记录是否启用',
    category: 'status',
    template: {
      name: 'enabled',
      displayName: '是否启用',
      dataType: 'boolean',
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: 'true',
      comment: '是否启用：0-禁用，1-启用'
    }
  },
  {
    id: 'status_deleted',
    name: '删除标记',
    description: '软删除标记字段',
    category: 'status',
    template: {
      name: 'deleted',
      displayName: '是否删除',
      dataType: 'boolean',
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: 'false',
      comment: '是否删除：0-未删除，1-已删除'
    }
  },
  
  // 时间字段模板
  {
    id: 'time_created',
    name: '创建时间',
    description: '记录创建时间',
    category: 'time',
    template: {
      name: 'created_at',
      displayName: '创建时间',
      dataType: 'datetime',
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: 'CURRENT_TIMESTAMP',
      comment: '创建时间'
    }
  },
  {
    id: 'time_updated',
    name: '更新时间',
    description: '记录更新时间',
    category: 'time',
    template: {
      name: 'updated_at',
      displayName: '更新时间',
      dataType: 'datetime',
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      comment: '更新时间'
    }
  },
  
  // 审计字段模板
  {
    id: 'audit_creator',
    name: '创建人',
    description: '记录创建人ID',
    category: 'audit',
    template: {
      name: 'creator_id',
      displayName: '创建人ID',
      dataType: 'bigint',
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      comment: '创建人ID'
    }
  },
  {
    id: 'audit_updater',
    name: '更新人',
    description: '记录更新人ID',
    category: 'audit',
    template: {
      name: 'updater_id',
      displayName: '更新人ID',
      dataType: 'bigint',
      nullable: false,
      primaryKey: false,
      autoIncrement: false,
      comment: '更新人ID'
    }
  }
]

// 获取所有字段模板分类
export const getTemplateCategories = () => {
  const categories = new Set(fieldTemplates.map(t => t.category))
  return Array.from(categories).map(category => {
    let label = ''
    switch (category) {
      case 'primary_key':
        label = '主键字段'
        break
      case 'basic':
        label = '基础字段'
        break
      case 'status':
        label = '状态字段'
        break
      case 'time':
        label = '时间字段'
        break
      case 'audit':
        label = '审计字段'
        break
      default:
        label = category
    }
    return { value: category, label }
  })
}

// 根据分类获取模板
export const getTemplatesByCategory = (category: string) => {
  return fieldTemplates.filter(t => t.category === category)
}

// 根据ID获取模板
export const getTemplateById = (id: string) => {
  return fieldTemplates.find(t => t.id === id)
}

export interface TemplateGroup {
  id: string;
  name: string;
  description: string;
  templates: string[];
  isCustom?: boolean;
  tags?: string[];
  order?: number;
  createdAt?: number;
  updatedAt?: number;
  importedAt?: number;
}

// 系统预定义的字段组
const systemFieldGroups: TemplateGroup[] = [
  {
    id: 'basic_audit',
    name: '基础审计字段组',
    description: '包含创建时间、更新时间、创建人、更新人等基础审计字段',
    templates: ['created_at', 'updated_at', 'created_by', 'updated_by'],
  },
  {
    id: 'status_tracking',
    name: '状态管理字段组',
    description: '包含状态、备注、版本号等状态跟踪字段',
    templates: ['status', 'remarks', 'version'],
  },
  // ... 其他系统预定义组
];

// 用户自定义分组存储键
const USER_GROUPS_KEY = 'user-template-groups';

// 从本地存储加载用户自定义分组
export const loadUserGroups = (): TemplateGroup[] => {
  try {
    const stored = localStorage.getItem(USER_GROUPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load user template groups:', e);
    return [];
  }
};

// 保存用户自定义分组到本地存储
export const saveUserGroups = (groups: TemplateGroup[]) => {
  try {
    localStorage.setItem(USER_GROUPS_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error('Failed to save user template groups:', e);
  }
};

// 获取所有字段组（系统 + 用户自定义）
export const getCommonFieldGroups = (): TemplateGroup[] => {
  const userGroups = loadUserGroups();
  return [...systemFieldGroups, ...userGroups].sort((a, b) => {
    // 自定义组排在系统组后面，按更新时间倒序
    if (a.isCustom && !b.isCustom) return 1;
    if (!a.isCustom && b.isCustom) return -1;
    if (a.isCustom && b.isCustom) {
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    }
    return 0;
  });
};

// 创建新的用户自定义分组
export const createUserGroup = (
  name: string,
  description: string,
  templates: string[] = []
): TemplateGroup => {
  const newGroup: TemplateGroup = {
    id: `user_group_${Date.now()}`,
    name,
    description,
    templates,
    isCustom: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  const userGroups = loadUserGroups();
  userGroups.push(newGroup);
  saveUserGroups(userGroups);
  
  return newGroup;
};

// 更新用户自定义分组
export const updateUserGroup = (
  groupId: string,
  updates: Partial<TemplateGroup>
): TemplateGroup | null => {
  const userGroups = loadUserGroups();
  const index = userGroups.findIndex(g => g.id === groupId);
  
  if (index === -1) return null;
  
  const updatedGroup = {
    ...userGroups[index],
    ...updates,
    updatedAt: Date.now(),
  };
  
  userGroups[index] = updatedGroup;
  saveUserGroups(userGroups);
  
  return updatedGroup;
};

// 删除用户自定义分组
export const deleteUserGroup = (groupId: string): boolean => {
  const userGroups = loadUserGroups();
  const index = userGroups.findIndex(g => g.id === groupId);
  
  if (index === -1) return false;
  
  userGroups.splice(index, 1);
  saveUserGroups(userGroups);
  
  return true;
};

// 导入/导出相关函数
export const exportGroups = (groupIds?: string[]): string => {
  try {
    const userGroups = loadUserGroups();
    const groupsToExport = groupIds
      ? userGroups.filter(g => groupIds.includes(g.id))
      : userGroups;
    
    const exportData = {
      version: '1.0',
      exportTime: Date.now(),
      groups: groupsToExport,
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (e) {
    console.error('Failed to export groups:', e);
    throw new Error('导出分组失败');
  }
};

export const importGroups = (jsonData: string): TemplateGroup[] => {
  try {
    const importData = JSON.parse(jsonData);
    
    // 验证导入数据的格式
    if (!importData.version || !importData.groups || !Array.isArray(importData.groups)) {
      throw new Error('无效的导入数据格式');
    }
    
    // 验证每个分组的必要字段
    const validGroups = importData.groups.filter((group: any) => {
      return (
        group.name &&
        group.description &&
        Array.isArray(group.templates)
      );
    });
    
    if (validGroups.length === 0) {
      throw new Error('没有找到有效的分组数据');
    }
    
    // 为导入的分组生成新的ID并添加导入标记
    const importedGroups = validGroups.map((group: TemplateGroup) => ({
      ...group,
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true,
      importedAt: Date.now(),
    }));
    
    // 合并到现有分组
    const existingGroups = loadUserGroups();
    const mergedGroups = [...existingGroups, ...importedGroups];
    saveUserGroups(mergedGroups);
    
    return importedGroups;
  } catch (e) {
    console.error('Failed to import groups:', e);
    throw new Error(e instanceof Error ? e.message : '导入分组失败');
  }
};

// 复制分组
export const duplicateGroup = (groupId: string): TemplateGroup | null => {
  try {
    const userGroups = loadUserGroups();
    const groupToCopy = userGroups.find(g => g.id === groupId);
    
    if (!groupToCopy) {
      throw new Error('未找到要复制的分组');
    }
    
    const newGroup: TemplateGroup = {
      ...groupToCopy,
      id: `duplicate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${groupToCopy.name} - 副本`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    userGroups.push(newGroup);
    saveUserGroups(userGroups);
    
    return newGroup;
  } catch (e) {
    console.error('Failed to duplicate group:', e);
    return null;
  }
};

// 批量删除分组
export const deleteUserGroups = (groupIds: string[]): boolean => {
  try {
    const userGroups = loadUserGroups();
    const updatedGroups = userGroups.filter(g => !groupIds.includes(g.id));
    saveUserGroups(updatedGroups);
    return true;
  } catch (e) {
    console.error('Failed to delete groups:', e);
    return false;
  }
};

// 批量更新分组
export const batchUpdateGroups = (
  groupIds: string[],
  updates: Partial<TemplateGroup>
): boolean => {
  try {
    const userGroups = loadUserGroups();
    const updatedGroups = userGroups.map(group => {
      if (groupIds.includes(group.id)) {
        return {
          ...group,
          ...updates,
          updatedAt: Date.now(),
        };
      }
      return group;
    });
    
    saveUserGroups(updatedGroups);
    return true;
  } catch (e) {
    console.error('Failed to batch update groups:', e);
    return false;
  }
};

// 更新分组排序
export const updateGroupOrder = (groupIds: string[]): boolean => {
  try {
    const userGroups = loadUserGroups()
    const orderedGroups = groupIds.map((id, index) => {
      const group = userGroups.find(g => g.id === id)
      if (group) {
        return {
          ...group,
          order: index,
          updatedAt: Date.now()
        }
      }
      return null
    }).filter((g): g is TemplateGroup => g !== null)
    
    // 合并未在排序列表中的分组
    const unorderedGroups = userGroups.filter(g => !groupIds.includes(g.id))
    const mergedGroups = [...orderedGroups, ...unorderedGroups]
    
    saveUserGroups(mergedGroups)
    return true
  } catch (e) {
    console.error('Failed to update group order:', e)
    return false
  }
}

// 添加分组标签
export const addGroupTags = (groupId: string, tags: string[]): boolean => {
  try {
    const userGroups = loadUserGroups()
    const groupIndex = userGroups.findIndex(g => g.id === groupId)
    
    if (groupIndex === -1) return false
    
    const group = userGroups[groupIndex]
    const existingTags = group.tags || []
    const uniqueTags = Array.from(new Set([...existingTags, ...tags]))
    
    userGroups[groupIndex] = {
      ...group,
      tags: uniqueTags,
      updatedAt: Date.now()
    }
    
    saveUserGroups(userGroups)
    return true
  } catch (e) {
    console.error('Failed to add group tags:', e)
    return false
  }
}

// 删除分组标签
export const removeGroupTag = (groupId: string, tag: string): boolean => {
  try {
    const userGroups = loadUserGroups()
    const groupIndex = userGroups.findIndex(g => g.id === groupId)
    
    if (groupIndex === -1) return false
    
    const group = userGroups[groupIndex]
    const tags = group.tags || []
    
    userGroups[groupIndex] = {
      ...group,
      tags: tags.filter(t => t !== tag),
      updatedAt: Date.now()
    }
    
    saveUserGroups(userGroups)
    return true
  } catch (e) {
    console.error('Failed to remove group tag:', e)
    return false
  }
}

// 获取所有标签
export const getAllTags = (): string[] => {
  try {
    const userGroups = loadUserGroups()
    const allTags = userGroups.reduce((tags: string[], group) => {
      if (group.tags) {
        tags.push(...group.tags)
      }
      return tags
    }, [])
    
    return Array.from(new Set(allTags)).sort()
  } catch (e) {
    console.error('Failed to get all tags:', e)
    return []
  }
}

// 按标签筛选分组
export const filterGroupsByTags = (tags: string[]): TemplateGroup[] => {
  try {
    const userGroups = loadUserGroups()
    if (tags.length === 0) return userGroups
    
    return userGroups.filter(group => {
      const groupTags = group.tags || []
      return tags.some(tag => groupTags.includes(tag))
    })
  } catch (e) {
    console.error('Failed to filter groups by tags:', e)
    return []
  }
}

// 分组统计信息
export interface GroupStats {
  totalGroups: number;
  customGroups: number;
  systemGroups: number;
  totalTemplates: number;
  averageTemplatesPerGroup: number;
  mostUsedTemplates: Array<{
    templateId: string;
    count: number;
    name: string;
  }>;
  recentlyUsedGroups: Array<{
    groupId: string;
    name: string;
    lastUsed: number;
  }>;
  popularTags: Array<{
    tag: string;
    count: number;
  }>;
  templateDistribution: Array<{
    group: string;
    count: number;
  }>;
}

// 获取分组统计信息
export function getGroupStats(): GroupStats {
  const groups = getCommonFieldGroups();
  const userGroups = loadUserGroups();
  
  // 基础统计
  const stats: GroupStats = {
    totalGroups: groups.length,
    customGroups: userGroups.length,
    systemGroups: systemFieldGroups.length,
    totalTemplates: groups.reduce((sum, group) => sum + group.templates.length, 0),
    averageTemplatesPerGroup: 0,
    mostUsedTemplates: [],
    recentlyUsedGroups: [],
    popularTags: [],
    templateDistribution: []
  };
  
  // 计算平均每组模板数
  stats.averageTemplatesPerGroup = stats.totalTemplates / stats.totalGroups;
  
  // 获取最常用模板
  const templateUsage = new Map<string, number>();
  groups.forEach(group => {
    group.templates.forEach(templateId => {
      const count = templateUsage.get(templateId) || 0;
      templateUsage.set(templateId, count + 1);
    });
  });
  
  stats.mostUsedTemplates = Array.from(templateUsage.entries())
    .map(([templateId, count]) => ({
      templateId,
      count,
      name: fieldTemplates.find(t => t.id === templateId)?.name || templateId
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // 最近使用的分组
  const recentUsage = JSON.parse(localStorage.getItem('recentGroupUsage') || '[]');
  stats.recentlyUsedGroups = recentUsage
    .map((groupId: string) => {
      const group = groups.find(g => g.id === groupId);
      return group ? {
        groupId,
        name: group.name,
        lastUsed: group.updatedAt || Date.now()
      } : null;
    })
    .filter(Boolean)
    .slice(0, 5);
  
  // 统计标签使用情况
  const tagCount = new Map<string, number>();
  groups.forEach(group => {
    if (group.tags) {
      group.tags.forEach(tag => {
        const count = tagCount.get(tag) || 0;
        tagCount.set(tag, count + 1);
      });
    }
  });
  
  stats.popularTags = Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // 模板分布统计
  stats.templateDistribution = groups
    .map(group => ({
      group: group.name,
      count: group.templates.length
    }))
    .sort((a, b) => b.count - a.count);
  
  return stats;
}

// 记录分组使用历史
export function recordGroupUsage(groupId: string) {
  const recentUsage: string[] = JSON.parse(localStorage.getItem('recentGroupUsage') || '[]');
  const updatedUsage = [
    groupId,
    ...recentUsage.filter(id => id !== groupId)
  ].slice(0, 10);
  
  localStorage.setItem('recentGroupUsage', JSON.stringify(updatedUsage));
  
  const groups = loadUserGroups();
  const groupIndex = groups.findIndex(g => g.id === groupId);
  if (groupIndex !== -1) {
    groups[groupIndex].updatedAt = Date.now();
    saveUserGroups(groups);
  }
}
