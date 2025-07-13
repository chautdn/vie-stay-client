export const packageStyles = {
  "vip-special": {
    id: "vip-special",
    name: "Tin VIP Nổi Bật",
    priority: 1,
    containerClass:
      "border-4 border-red-500 bg-red-50 shadow-lg relative overflow-hidden",
    titleClass: "text-red-600 font-bold text-xl uppercase",
    priceClass: "text-red-500 font-bold text-xl",
    badgeClass:
      "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse",
    badgeText: "VIP ĐẶC BIỆT",
    showCallButton: true,
    showBadge: true,
    highlightEffect: true,
    animation: "animate-pulse",
    borderGlow: "shadow-red-500/50",
    textColor: "text-red-600",
    size: "scale-105",
  },
  "vip-1": {
    id: "vip-1",
    name: "Tin VIP 1",
    priority: 2,
    containerClass: "border-3 border-pink-500 bg-pink-50 shadow-md",
    titleClass: "text-pink-600 font-bold text-lg uppercase",
    priceClass: "text-pink-500 font-bold text-lg",
    badgeClass:
      "bg-pink-500 text-white px-2 py-1 rounded-full text-sm font-bold",
    badgeText: "VIP 1",
    showCallButton: true,
    showBadge: true,
    highlightEffect: false,
    textColor: "text-pink-600",
    size: "scale-102",
  },
  "vip-2": {
    id: "vip-2",
    name: "Tin VIP 2",
    priority: 3,
    containerClass: "border-2 border-orange-500 bg-orange-50",
    titleClass: "text-orange-600 font-bold text-lg uppercase",
    priceClass: "text-orange-500 font-bold text-lg",
    badgeClass:
      "bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-bold",
    badgeText: "VIP 2",
    showCallButton: false,
    showBadge: true,
    highlightEffect: false,
    textColor: "text-orange-600",
    size: "scale-101",
  },
  "vip-3": {
    id: "vip-3",
    name: "Tin VIP 3",
    priority: 4,
    containerClass: "border-2 border-blue-500 bg-blue-50",
    titleClass: "text-blue-600 font-bold text-lg uppercase",
    priceClass: "text-blue-500 font-bold text-lg",
    badgeClass:
      "bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-bold",
    badgeText: "VIP 3",
    showCallButton: false,
    showBadge: true,
    highlightEffect: false,
    textColor: "text-blue-600",
    size: "scale-100",
  },
  normal: {
    id: "normal",
    name: "Tin thường",
    priority: 5,
    containerClass: "border border-gray-300 bg-white",
    titleClass: "text-gray-800 font-medium text-base",
    priceClass: "text-green-500 font-bold text-base",
    badgeClass: "",
    badgeText: "",
    showCallButton: false,
    showBadge: false,
    highlightEffect: false,
    textColor: "text-gray-800",
    size: "scale-100",
  },
};

export const getPackageStyle = (packageType) => {
  const packageStyles = {
    VIP_NOI_BAT: {
      priority: 1,
      colorClass: "border-4 border-red-500 bg-red-50 shadow-lg",
      titleClass: "text-red-600 font-bold text-xl uppercase",
      priceClass: "text-red-500 font-bold text-xl",
      badgeClass:
        "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse",
      badgeText: "VIP ĐẶC BIỆT",
      showCallButton: true,
      showBadge: true,
      highlightEffect: true,
      animation: "animate-pulse",
    },
    VIP_1: {
      priority: 2,
      colorClass: "border-3 border-pink-500 bg-pink-50 shadow-md",
      titleClass: "text-pink-600 font-bold text-lg uppercase",
      priceClass: "text-pink-500 font-bold text-lg",
      badgeClass:
        "bg-pink-500 text-white px-2 py-1 rounded-full text-sm font-bold",
      badgeText: "VIP 1",
      showCallButton: true,
      showBadge: true,
      highlightEffect: false,
      animation: "",
    },
    VIP_2: {
      priority: 3,
      colorClass: "border-2 border-orange-500 bg-orange-50",
      titleClass: "text-orange-600 font-bold text-lg uppercase",
      priceClass: "text-orange-500 font-bold text-lg",
      badgeClass:
        "bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-bold",
      badgeText: "VIP 2",
      showCallButton: false,
      showBadge: true,
      highlightEffect: false,
      animation: "",
    },
    VIP_3: {
      priority: 4,
      colorClass: "border-2 border-blue-500 bg-blue-50",
      titleClass: "text-blue-600 font-bold text-lg uppercase",
      priceClass: "text-blue-500 font-bold text-lg",
      badgeClass:
        "bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-bold",
      badgeText: "VIP 3",
      showCallButton: false,
      showBadge: true,
      highlightEffect: false,
      animation: "",
    },
    THUONG: {
      priority: 5,
      colorClass: "border border-gray-300 bg-white",
      titleClass: "text-gray-800 font-medium text-base",
      priceClass: "text-green-500 font-bold text-base",
      badgeClass: "",
      badgeText: "",
      showCallButton: false,
      showBadge: false,
      highlightEffect: false,
      animation: "",
    },
  };

  return packageStyles[packageType] || packageStyles["THUONG"];
};

export const sortByPackagePriority = (items) => {
  return [...items].sort((a, b) => {
    const aPackage = a.featuredType || "THUONG";
    const bPackage = b.featuredType || "THUONG";

    const aPriority = getPackageStyle(aPackage).priority;
    const bPriority = getPackageStyle(bPackage).priority;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    // Nếu cùng priority, sắp xếp theo ngày tạo
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};
