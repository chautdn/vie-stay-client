import React, { memo } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

const ProvinceBtn = ({ name, image, districtCode }) => {
  const navigate = useNavigate();

  const handleDistrictClick = () => {
    // ✅ SỬA: Navigate với district filter thay vì province
    const searchParams = {
      district: districtCode, // ✅ Sử dụng district thay vì province
      isAvailable: true
    };

    console.log('Navigating with district:', districtCode);

    navigate({
      pathname: '/search',
      search: createSearchParams(searchParams).toString(),
    });
  };

  return (
    <div 
      className="shadow-md rounded-b-md cursor-pointer text-blue-600 hover:text-orange-600 transition-all hover:shadow-lg transform hover:scale-105"
      onClick={handleDistrictClick}
    >
      <img
        src={image}
        alt={name}
        className="w-[190px] h-[110px] object-cover rounded-t-md"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1560448204-e1a3b8d2b5c0?w=400'
        }}
      />
      <div className="font-medium p-2 text-center">{name}</div>
    </div>
  );
};

export default memo(ProvinceBtn);
