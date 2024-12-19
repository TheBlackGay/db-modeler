import React, { useState, useEffect } from 'react';
import { FloatButton } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const FloatActions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  const currentProject = useSelector((state: RootState) => {
    if (!state?.projects?.items) return null;
    return state.projects.items.find(p => p?.id === id) || null;
  });

  useEffect(() => {
    const isValidPath = id && 
      location.pathname !== '/' && 
      !location.pathname.includes('/project/new');

    const isValidProject = currentProject && currentProject.id === id;
    
    setShouldRender(Boolean(isValidPath && isValidProject));
  }, [id, currentProject, location.pathname]);

  if (!shouldRender || !currentProject?.id) {
    return null;
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/project/${currentProject.id}/settings`);
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      style={{ position: 'fixed', right: 24, bottom: 24 }}
    >
      <FloatButton.Group
        open={open}
        trigger="click"
        onOpenChange={(newOpen) => setOpen(newOpen)}
        icon={<UserOutlined />}
      >
        <FloatButton
          icon={<SettingOutlined />}
          tooltip="系统设置"
          onClick={handleSettingsClick}
        />
      </FloatButton.Group>
    </div>
  );
};

export default FloatActions; 