export const BASE_URL = "http://localhost:8080";

export const path = {
    HOME: '/*',
    HOME__PAGE: ':page',
    LOGIN: 'login',
    CHO_THUE_CAN_HO: 'cho-thue-can-ho', 
    CHO_THUE_MAT_BANG: 'cho-thue-mat-bang',
    NHA_CHO_THUE: 'nha-cho-thue',
    CHO_THUE_PHONG_TRO: 'cho-thue-phong-tro',
    DETAL_POST__TITLE__POSTID: 'chi-tiet/:title/:postId',
    SEARCH: 'tim-kiem',
    SYSTEM: '/he-thong/*',
    CREATE_POST: 'tao-moi-bai-dang'
}

export const text = {
    HOME_TITLE: 'CHO THUÊ PHÒNG TRỌ TẠI ĐÀ NẴNG - GIÁ RẺ, TIỆN NGHI',
    HOME_DESCRIPTION: 'Tìm kiếm phòng trọ, nhà trọ tại Đà Nẵng với giá cả hợp lý, vị trí thuận tiện và đầy đủ tiện nghi. Cập nhật tin đăng mới nhất mỗi ngày.',
    
    // Da Nang specific
    DANANG_DISTRICTS: {
        'hai-chau': 'Hải Châu',
        'thanh-khe': 'Thanh Khê', 
        'son-tra': 'Sơn Trà',
        'ngu-hanh-son': 'Ngũ Hành Sơn',
        'lien-chieu': 'Liên Chiểu',
        'cam-le': 'Cẩm Lệ',
        'hoa-vang': 'Hòa Vang',
        'hoang-sa': 'Hoàng Sa'
    },
    
    // Room types
    ROOM_TYPES: {
        single: 'Phòng trọ đơn',
        double: 'Phòng trọ đôi', 
        shared: 'Phòng chia sẻ',
        studio: 'Phòng studio',
        apartment: 'Căn hộ mini',
        dormitory: 'Ký túc xá'
    }
}

// ✅ SỬA: Location mapping to districts
export const location = [
    {
        id: 'nhs',
        name: 'Phòng trọ Ngũ Hành Sơn',
        image: 'https://vietnamdailytour.vn/wp-content/uploads/2022/08/ngu-hanh-son.2.jpg',
        districtCode: 'ngu-hanh-son' // ✅ THÊM: District code để filter
    },
    {
        id: 'lc',
        name: 'Phòng trọ Liên Chiểu',
        image: 'https://meeymap.com/tin-tuc/wp-content/uploads/2022/02/co-so-ha-tang-quan-lien-chieu.jpg',
        districtCode: 'lien-chieu'
    },
    {
        id: 'hc', 
        name: 'Phòng trọ Hải Châu',
        image: 'https://images2.thanhnien.vn/528068263637045248/2024/6/19/2-r-1718791886665772660374.jpg',
        districtCode: 'hai-chau' 
    },
    {
        id: 'cl',
        name: 'Phòng trọ Cẩm Lệ',
        image: 'https://hellodanang.vn/wp-content/uploads/2025/01/quan-cam-le-phat-trien-1735808204.jpeg',
        districtCode: 'cam-le' 
    },
]

