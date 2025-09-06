export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: '홈', path: '', icon: <Home size={20} /> }, // '' = 루트('/')
  {
    label: '지식',
    path: 'knowledge',
    icon: <BookOpen size={20} />,
    hasSubmenu: true,
    submenu: [
      { label: 'CSR 질문', path: 'knowledge/csr' }
    ]
  },
  { label: '할일', path: 'study', icon: <Calendar size={20} /> },
  {
    label: '프로그램',
    path: 'program',
    icon: <Code2 size={20} />,
    hasSubmenu: true,
    submenu: [
      { label: '훈련', path: 'program/training' },
      { label: '과제', path: 'program/assignment' }
    ]
  },
  { label: '성찰', path: 'growth', icon: <TrendingUp size={20} /> },
  {
    label: '그룹',
    path: 'group',
    icon: <Users size={20} />,
    hasSubmenu: true,
    submenu: [
      { label: '내 그룹', path: 'group/my' },
      { label: '그룹 참여하기', path: 'group/join' }
    ]
  },
  {
    label: '마이페이지',
    path: 'my',
    icon: <User size={20} />,
    hasSubmenu: true,
    submenu: [
      { label: '상범절 대시보드', path: 'my/dashboard' }
    ]
  },
];