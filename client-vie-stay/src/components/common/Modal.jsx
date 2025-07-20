import React, { useState, useEffect, memo } from 'react'
import icons from '../../utils/icons'

const { GrLinkPrevious } = icons

const Modal = ({ setIsShowModal, content, name, handleSubmit, queries, arrMinMax, defaultText }) => {

    const [persent1, setPersent1] = useState(name === 'price' && arrMinMax?.priceArr
        ? arrMinMax?.priceArr[0]
        : name === 'area' && arrMinMax?.areaArr ? arrMinMax?.areaArr[0] : 0)
    const [persent2, setPersent2] = useState(name === 'price' && arrMinMax?.priceArr
        ? arrMinMax?.priceArr[1]
        : name === 'area' && arrMinMax?.areaArr ? arrMinMax?.areaArr[1] : 100)
    const [activedEl, setActivedEl] = useState('')

    useEffect(() => {
        const activedTrackEl = document.getElementById('track-active')
        if (activedTrackEl) {
            if (persent2 <= persent1) {
                activedTrackEl.style.left = `${persent2}%`
                activedTrackEl.style.right = `${100 - persent1}%`
            } else {
                activedTrackEl.style.left = `${persent1}%`
                activedTrackEl.style.right = `${100 - persent2}%`
            }
        }
    }, [persent1, persent2])

    const handleClickTrack = (e, value) => {
        const stackEl = document.getElementById('track')
        const stackRect = stackEl.getBoundingClientRect()
        let percent = value ? value : Math.round((e.clientX - stackRect.left) * 100 / stackRect.width, 0)
        if (Math.abs(percent - persent1) <= (Math.abs(percent - persent2))) {
            setPersent1(percent)
        } else {
            setPersent2(percent)
        }
    }


    const convert100toTarget = percent => {
        if (name === 'price') {
            // 0% = 0 triệu, 100% = 15 triệu
            const rawValue = (percent * 15) / 100
            // Làm tròn đến 0.5 triệu
            return Math.round(rawValue * 2) / 2

        } else if (name === 'area') {
            // 0% = 0 m², 100% = 90 m² - làm tròn theo bội số 5
            const rawValue = (percent * 90) / 100
            return Math.round(rawValue / 5) * 5
        }
        return 0
    }

    const convertto100 = targetValue => {
        if (name === 'price') {
            // Convert triệu to percent (max 15 triệu)
            return Math.round((targetValue / 15) * 100)
        } else if (name === 'area') {
            // Convert m² to percent (max 90 m²) - làm tròn theo bội số 5
            const roundedValue = Math.round(targetValue / 5) * 5
            return Math.round((roundedValue / 90) * 100)
        }
        return 0
    }

    // ✅ SỬA: Fix handleActive function
    const handleActive = (code, value) => {
        setActivedEl(code)
        
        // Find the selected range from content
        const selectedRange = content.find(item => item.code === code)
        if (selectedRange) {
            if (name === 'price') {
                // Convert VND to triệu for percentage calculation
                const minTrieu = selectedRange.min ? selectedRange.min / 1000000 : 0
                const maxTrieu = selectedRange.max ? selectedRange.max / 1000000 : 15
                
                setPersent1(convertto100(minTrieu))
                setPersent2(selectedRange.max === null ? 100 : convertto100(maxTrieu))
            } else if (name === 'area') {
                const minM2 = selectedRange.min || 0
                const maxM2 = selectedRange.max === null ? 90 : selectedRange.max
                
                setPersent1(convertto100(minM2))
                setPersent2(selectedRange.max === null ? 100 : convertto100(maxM2))
            }
        }
    }

    // ✅ SỬA: Fix handleBeforeSubmit function
    const handleBeforeSubmit = (e) => {
        let min = persent1 <= persent2 ? persent1 : persent2
        let max = persent1 <= persent2 ? persent2 : persent1
        let arrMinMax = [convert100toTarget(min), convert100toTarget(max)]
        
        // ✅ SỬA: Create proper display text and number values
        const unit = name === 'price' ? 'triệu' : 'm²'
        const minValue = convert100toTarget(min)
        const maxValue = convert100toTarget(max)
        
        let displayText = ''
        if (min === 0 && max === 100) {
            displayText = `Tất cả ${unit}`
        } else if (min === 0) {
            displayText = name === 'area' ? `Dưới ${maxValue} ${unit}` : `Dưới ${maxValue.toFixed(1)} ${unit}`
        } else if (max === 100) {
            displayText = name === 'area' ? `Trên ${minValue} ${unit}` : `Trên ${minValue.toFixed(1)} ${unit}`
        } else {
            displayText = name === 'area' ? `${minValue} - ${maxValue} ${unit}` : `${minValue.toFixed(1)} - ${maxValue.toFixed(1)} ${unit}`
        }
        
        handleSubmit(e, {
            [`${name}Number`]: arrMinMax,
            [name]: displayText
        }, {
            [`${name}Arr`]: [min, max]
        })
    }

    return (
        <div onClick={() => { setIsShowModal(false) }}
            className='fixed top-0 left-0 right-0 bottom-0 bg-overlay-70 z-20 flex justify-center items-center'
        >
            <div onClick={(e) => {
                e.stopPropagation()
                setIsShowModal(true)
            }}
                className='w-2/5 h-[500px] bg-white rounded-md relative'
            >
                <div className='h-[45px] px-4 flex items-center border-b border-gray-200'>
                    <span className='cursor-pointer' onClick={(e) => {
                        e.stopPropagation()
                        setIsShowModal(false)
                    }}>
                        <GrLinkPrevious size={24} />
                    </span>
                </div>
                
                {(name === 'category' || name === 'district' || name === 'feature') && <div className='p-4 flex flex-col'>
                    <span className='py-2 flex gap-2 items-center border-b border-gray-200'>
                        <input
                            type="radio"
                            name={name}
                            value={defaultText || ''}
                            id='default'
                            checked={!queries[name] || queries[name] === defaultText}
                            onChange={(e) => handleSubmit(e, { [name]: defaultText })}
                        />
                        <label htmlFor='default'>{defaultText}</label>
                    </span>
                    {content?.map(item => {
                        return (
                            <span key={item.code} className='py-2 flex gap-2 items-center border-b border-gray-200'>
                                <input
                                    type="radio"
                                    name={name}
                                    id={item.code}
                                    value={item.value}
                                    checked={queries[name] === item.value}
                                    onChange={(e) => handleSubmit(e, { [name]: item.value })}
                                />
                                <label htmlFor={item.code}>{item.value}</label>
                            </span>
                        )
                    })}
                </div>}
                
                {(name === 'price' || name === 'area') && <div className='p-12 py-20 '>
                    <div className='flex flex-col items-center justify-center relative'>
                        <div className='z-30 absolute top-[-48px] font-bold text-xl text-orange-600'>
                            {(persent1 === 100 && persent2 === 100)
                                ? `Trên ${convert100toTarget(persent1)} ${name === 'price' ? 'triệu' : 'm²'} +`
                                : name === 'area' 
                                    ? `Từ ${Math.min(convert100toTarget(persent1), convert100toTarget(persent2))} - ${Math.max(convert100toTarget(persent1), convert100toTarget(persent2))} m²`
                                    : `Từ ${Math.min(convert100toTarget(persent1), convert100toTarget(persent2)).toFixed(1)} - ${Math.max(convert100toTarget(persent1), convert100toTarget(persent2)).toFixed(1)} triệu`}
                        </div>
                        <div onClick={handleClickTrack} id='track' className='slider-track h-[5px] absolute top-0 bottom-0 w-full bg-gray-300 rounded-full'></div>
                        <div onClick={handleClickTrack} id='track-active' className='slider-track-active h-[5px] absolute top-0 bottom-0 bg-orange-600 rounded-full'></div>
                        <input
                            max='100'
                            min='0'
                            step='1'
                            type="range"
                            value={persent1}
                            className='w-full appearance-none pointer-events-none absolute top-0 bottom-0'
                            onChange={(e) => {
                                setPersent1(+e.target.value)
                                activedEl && setActivedEl('')
                            }}
                        />
                        <input
                            max='100'
                            min='0'
                            step='1'
                            type="range"
                            value={persent2}
                            className='w-full appearance-none pointer-events-none absolute top-0 bottom-0'
                            onChange={(e) => {
                                setPersent2(+e.target.value)
                                activedEl && setActivedEl('')
                            }}
                        />
                        <div className='absolute z-30 top-6 left-0 right-0 flex justify-between items-center'>
                            <span
                                className='cursor-pointer'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleClickTrack(e, 0)
                                }}
                            >
                                0
                            </span>
                            <span
                                className='mr-[-12px] cursor-pointer'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleClickTrack(e, 100)
                                }}
                            >
                                {name === 'price' ? '15 triệu +' : name === 'area' ? 'Trên 90 m²' : ''}
                            </span>
                        </div>
                    </div>
                    <div className='mt-24'>
                        <h4 className='font-medium mb-4'>Chọn nhanh:</h4>
                        <div className='flex gap-2 items-center flex-wrap w-full'>
                            {content?.map(item => {
                                return (
                                    <button
                                        key={item.code}
                                        onClick={() => handleActive(item.code, item.value)}
                                        className={`px-4 py-2 bg-gray-200 rounded-md cursor-pointer ${item.code === activedEl ? 'bg-blue-500 text-white' : ''}`}
                                    >
                                        {item.value}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>}
                
                {(name === 'price' || name === 'area') && <button
                    type='button'
                    className='w-full absolute bottom-0 bg-[#FFA500] py-2 font-medium rounded-bl-md rounded-br-md'
                    onClick={handleBeforeSubmit}
                >
                    ÁP DỤNG
                </button>}
            </div>
        </div>
    )
}

export default memo(Modal)