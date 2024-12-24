import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import type { FieldTemplate, FieldTemplateCategory } from '../../../types/models';
import { loadFieldTemplates, saveFieldTemplates, loadTemplateCategories } from '../../../services/storage';

export const useTemplates = () => {
  const dispatch = useDispatch();
  const templates = useSelector((state: RootState) => state.templates.items);
  const categories = useSelector((state: RootState) => state.templates.categories);

  const addTemplate = (template: FieldTemplate) => {
    dispatch({ type: 'templates/addTemplate', payload: template });
  };

  const updateTemplate = (template: FieldTemplate) => {
    dispatch({ type: 'templates/updateTemplate', payload: template });
  };

  const deleteTemplate = (id: string) => {
    dispatch({ type: 'templates/deleteTemplate', payload: id });
  };

  return {
    templates,
    categories,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
}; 