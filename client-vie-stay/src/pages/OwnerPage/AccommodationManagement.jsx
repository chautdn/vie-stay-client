import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

// Import 2 components từ accommodationComponent folder
import ListAccommodations from '../../components/ownerPageComponents/accommodationComponent/ListAccommodations';
import CreateAccommodation from '../../components/ownerPageComponents/accommodationComponent/CreateAccommodation';

const AccommodationManagement = () => {
  const { id } = useParams();
  const location = useLocation();

  // Xác định view dựa trên URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/create')) return 'create';
    if (path.includes('/edit/') && id) return 'edit';
    return 'list';
  };

  const currentView = getCurrentView();

  // Render component tương ứng
  if (currentView === 'create' || currentView === 'edit') {
    return <CreateAccommodation />;
  }

  return <ListAccommodations />;
};

export default AccommodationManagement;