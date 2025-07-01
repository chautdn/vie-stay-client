import React from 'react'
import ProvinceBtn from './ProvinceBtn'
import { location } from '../../utils/Constant'

const Province = () => {
    return (
        <div className='flex items-center gap-5 justify-center py-5 flex-wrap'>
            {location.map(item => {
                return (
                    <ProvinceBtn
                        key={item.id}
                        image={item.image}
                        name={item.name}
                        districtCode={item.districtCode} // ✅ THÊM: Truyền districtCode
                    />
                )
            })}
        </div>
    )
}

export default Province
