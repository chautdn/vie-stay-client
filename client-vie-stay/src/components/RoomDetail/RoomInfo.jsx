import React from 'react';
import { MapPin, DollarSign, Maximize, Clock, Hash } from "lucide-react";
import { formatCurrencyVND } from "../../utils/FormatPricePrint";

const RoomInfo = ({ room, formatRoomType, formatAddress }) => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-xl font-bold text-red-600 flex flex-col gap-2'>
        <span>{room?.name || "Phòng trọ"}</span>
        {!room?.isAvailable && (
          <span className='w-fit text-xs p-2 px-4 inline-block bg-red-600 text-white font-semibold'>
            Đã cho thuê
          </span>
        )}
      </h2>
      
      <div className='flex items-center gap-2'>
        <span>Chuyên mục:</span>
        <span className='text-blue-600 underline font-medium hover:text-orange-600 cursor-pointer'>
          {formatRoomType(room?.type)}
        </span>
      </div>
      
      <div className='flex items-center gap-2'>
        <MapPin color='#2563eb' size={16} />
        <span>{formatAddress()}</span>
      </div>
      
      <div className='flex items-center justify-between'>
        <span className='flex items-center gap-1'>
          <DollarSign size={16} />
          <span className='font-semibold text-lg text-green-600'>
            {formatCurrencyVND(room?.baseRent || 0)}
          </span>
        </span>
        <span className='flex items-center gap-1'>
          <Maximize size={16} />
          <span>{room?.size || 0} m²</span>
        </span>
        <span className='flex items-center gap-1'>
          <Clock size={16} />
          <span>{new Date(room?.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
        </span>
        <span className='flex items-center gap-1'>
          <Hash size={16} />
          <span>#{room?._id?.slice(-6) || "000000"}</span>
        </span>
      </div>
    </div>
  );
};

export default RoomInfo;