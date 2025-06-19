import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        {/* Cột 1: Thông tin logo */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            <span className="text-blue-600">PHONGTRO</span>
            <span className="text-orange-500">TOT</span>
            <span className="text-gray-500">.COM</span>
          </h2>
          <p className="text-sm">
            Kênh thông tin phòng trọ, căn hộ, nhà thuê uy tín số 1 Việt Nam.
            Tìm phòng dễ dàng – đăng tin hiệu quả.
          </p>
        </div>

        {/* Cột 2: Liên kết chính */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Liên kết</h3>
          <ul className="space-y-1">
            <li><a href="/about" className="hover:text-orange-500 transition">Giới thiệu</a></li>
            <li><a href="/terms" className="hover:text-orange-500 transition">Điều khoản sử dụng</a></li>
            <li><a href="/privacy" className="hover:text-orange-500 transition">Chính sách bảo mật</a></li>
            <li><a href="/contact" className="hover:text-orange-500 transition">Liên hệ</a></li>
          </ul>
        </div>

        {/* Cột 3: Bản quyền và năm */}
        <div className="flex flex-col justify-between">
          <div className="md:text-right">
            <p className="font-medium text-gray-700">Hỗ trợ khách hàng</p>
            <p>Hotline: <a href="tel:19001234" className="text-orange-600 font-semibold">1900 1234</a></p>
            <p>Email: support@phongtrotot.com</p>
          </div>
          <p className="mt-6 md:mt-0 md:text-right text-gray-400 text-xs">
            © {new Date().getFullYear()} PhongTroTot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
