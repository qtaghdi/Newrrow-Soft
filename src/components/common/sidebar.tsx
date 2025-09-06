import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { SIDEBAR_ITEMS } from '@/constants/navigation';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (path: string) => {
    setOpenMenus(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/54/da/71/54da71b5-8fd1-8194-e646-6a6a4c37e91d/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/256x256bb.jpg" 
              alt="뉴로우 로고" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-gray-800">뉴로우 소프트</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.path}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group text-gray-700 hover:bg-[#f5f5f5] hover:text-gray-900"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {openMenus.includes(item.path) ? (
                      <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {openMenus.includes(item.path) && item.submenu && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive 
                                  ? 'bg-[#f5f5f5] text-gray-900' 
                                  : 'text-gray-600 hover:bg-[#f5f5f5] hover:text-gray-900'
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                      isActive 
                        ? 'bg-[#f5f5f5] text-gray-900' 
                        : 'text-gray-700 hover:bg-[#f5f5f5] hover:text-gray-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">그</span>
          </div>
          <div>
            <p className="font-medium">그램드마스터</p>
            <p className="text-xs text-gray-500">gramdemaster@madist.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;