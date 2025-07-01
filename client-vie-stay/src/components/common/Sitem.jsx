import React, { memo } from 'react'
import moment from 'moment'
import 'moment/locale/vi';


const Sitem = ({ title, price, image, createdAt }) => {


    const fomatTime = () => {
        moment.locale('vi')  // Sử dụng ngôn ngữ tiếng Việt
        return moment(createdAt).fromNow()  // Hiển thị thời gian từ bây giờ
    }
    return (
        <div className='w-full flex items-center gap-2 py-2 border-b border-gray-300'>
            <img
                src={image[0]}
                alt="anh"
                className='w-[80px] h-[80px] object-cover flex-none rounded-md'
            />
            <div className='w-full flex-auto flex flex-col justify-between gap-3'>
                <h4 className='text-blue-600 text-[14px] text-start'>{`${title?.slice(0, 45)}...`}</h4>
                <div className=' flex items-center justify-between w-full'>
                    <span className='text-sm font-medium text-green-500'>{price}</span>
                    <span className='text-sm text-gray-300'>{fomatTime()}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(Sitem)