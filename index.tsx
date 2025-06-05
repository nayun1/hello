import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

// 타입 정의
interface MenuItem {
  icon: string;
  text: string;
  page?: string;
  submenu?: { text: string; page: string }[];
}

interface ChatMessage {
  type: 'system' | 'user';
  content: string;
  time: string;
}

interface Notification {
  icon: string;
  message: string;
  time: string;
  isNew: boolean;
}

const App: React.FC = () => {
  // 상태 관리
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: 'system', content: '안녕하세요! 무엇을 도와드릴까요?', time: '지금' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [showChatNotification, setShowChatNotification] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [chatPosition, setChatPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Refs
  const chatOverlayRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // 메뉴 아이템 정의
  const menuItems: MenuItem[] = [
    {
      icon: 'list',
      text: '게시판',
      submenu: [
        { text: '공지사항', page: 'notice' },
        { text: '자유 게시판', page: 'board' }
      ]
    },
    {
      icon: 'file',
      text: '문서',
      submenu: [
        { text: '문서관리', page: 'document_management' },
        { text: '문서함', page: 'docbox' },
        { text: '새 문서', page: 'new_document' }
      ]
    },
    {
      icon: 'calendar',
      text: '일정',
      submenu: [
        { text: '학사 일정', page: 'calendar' },
        { text: '개인 시간표', page: 'timetable' }
      ]
    },
    {
      icon: 'users',
      text: '학생 및 교직원',
      submenu: [
        { text: '학생', page: 'students' },
        { text: '교직원', page: 'staff' }
      ]
    }
  ];

  // 알림 데이터
  const notifications: Notification[] = [
    { icon: 'file', message: '회의록 결재가 승인되었습니다.', time: '방금 전', isNew: true },
    { icon: 'users', message: '이지원님이 문서를 공유했습니다.', time: '10분 전', isNew: true },
    { icon: 'calendar', message: '내일 13:00 팀 회의가 예정되어 있습니다.', time: '1시간 전', isNew: false },
    { icon: 'file', message: '2024년 1분기 사업계획서 기한이 이틀 남았습니다.', time: '3시간 전', isNew: false }
  ];

  // 페이지 변경 핸들러
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.history.pushState({ page }, page, `?page=${page}`);
  };

  // 알림 핸들러
  const handleNotificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  // 채팅 핸들러
  const handleChatClick = () => {
    setIsChatOpen(!isChatOpen);
    setShowChatNotification(false);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  const handleChatSend = () => {
    if (chatInput.trim()) {
      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setChatMessages([...chatMessages, {
        type: 'user',
        content: chatInput,
        time: timeString
      }]);
      
      setChatInput('');
      
      // 자동 응답 시뮬레이션
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          type: 'system',
          content: '메시지를 받았습니다. 조금만 기다려주세요.',
          time: timeString
        }]);
      }, 1000);
    }
  };

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (chatOverlayRef.current) {
      setIsDragging(true);
      const rect = chatOverlayRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && chatOverlayRef.current) {
      let x = e.clientX - offset.x;
      let y = e.clientY - offset.y;

      const maxX = window.innerWidth - chatOverlayRef.current.offsetWidth;
      const maxY = window.innerHeight - chatOverlayRef.current.offsetHeight;

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      setChatPosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 전역 이벤트 리스너
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const notificationPanel = document.getElementById('notificationPanel');
      
      if (isNotificationOpen && notificationPanel &&
          !notificationPanel.contains(target) &&
          target.closest('.bell-button') === null) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isNotificationOpen, isDragging, offset]);

  // 채팅 메시지 스크롤
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // URL 파라미터 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'home';
    setCurrentPage(page);
  }, []);

  // popstate 이벤트 처리
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.page) {
        setCurrentPage(e.state.page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 동적 컨텐츠 렌더링 (실제로는 각 페이지 컴포넌트를 임포트하여 사용)
  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <div style={{ padding: '20px', fontSize: '20px' }}>안녕하세요 반갑습니다</div>;
      default:
        return <div>Loading {currentPage}...</div>;
    }
  };

  return (
    <div style={{ display: 'flex', backgroundColor: 'rgb(239, 234, 230)', width: '100%', height: '100vh' }}>
      {/* 사이드바 */}
      <div className="sidebar">
        <div className="sidebar-header">
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange('home'); }} style={{ textDecoration: 'none' }}>
            <div className="logo-container">
              <div className="logo-box">
                <img src="/image/potato2.png" className="logo-image" alt="Logo" />
              </div>
              <div className="logo-title">Hot Potato</div>
            </div>
          </a>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">메인 메뉴</div>
          <div className="menu-container">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-item menu-item-with-submenu active">
                <div className={`icon icon-${item.icon}`}></div>
                <div className="menu-text">{item.text}</div>
                {item.submenu && (
                  <div className="submenu">
                    {item.submenu.map((subItem, subIndex) => (
                      <a
                        key={subIndex}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(subItem.page);
                        }}
                        style={{ textDecoration: 'none', color: 'white' }}
                      >
                        <div className="submenu-item" data-page={subItem.page}>
                          <div className="menu-text">{subItem.text}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">설정</div>
          <div className="menu-container">
            <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange('preferences'); }} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="menu-item" data-page="preferences">
                <div className="icon icon-settings"></div>
                <div className="menu-text">환경설정</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <div className="header">
          <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange('new_document'); }} style={{ textDecoration: 'none', color: 'white' }}>
            <div className="new-doc-button" data-page="new_document">
              <div className="new-doc-button-text">+ 새 문서</div>
            </div>
          </a>

          <div className="search-container">
            <div className="icon icon-search"></div>
            <input type="text" className="search-input" placeholder="문서 검색" />
          </div>

          <div className="header-actions">
            <div className="chat-button" id="chatButton" onClick={handleChatClick}>
              <div className="icon icon-chat"></div>
              {showChatNotification && <div className="chat-notification-dot"></div>}
            </div>

            <div className="bell-button" id="notificationButton" onClick={handleNotificationClick}>
              <div className="icon icon-bell"></div>
              <div className="notification-dot"></div>

              <div
                className={`notification-panel ${isNotificationOpen ? 'active' : ''}`}
                id="notificationPanel"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="notification-header">
                  <div className="notification-title">알림</div>
                  <div className="notification-count">{notifications.filter(n => n.isNew).length}</div>
                </div>
                <div className="notification-list">
                  {notifications.map((notification, index) => (
                    <div key={index} className={`notification-item ${notification.isNew ? 'notification-new' : ''}`}>
                      <div className="notification-icon">
                        <div className={`icon icon-${notification.icon}`}></div>
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="all-notifications">모든 알림 보기</div>
              </div>
            </div>

            <a href="#" onClick={(e) => { e.preventDefault(); handlePageChange('mypage'); }} style={{ textDecoration: 'none' }}>
              <div className="user-profile">
                <div className="avatar-container">
                  <div className="icon icon-user"></div>
                </div>
                <div className="user-name">나나</div>
              </div>
            </a>
          </div>
        </div>

        <div className="content" id="dynamicContent">
          {renderContent()}
        </div>
      </div>

      {/* 채팅 오버레이 */}
      {isChatOpen && (
        <div
          ref={chatOverlayRef}
          className="chat-overlay active"
          id="chatOverlay"
          style={chatPosition.x !== null ? {
            left: `${chatPosition.x}px`,
            top: `${chatPosition.y}px`,
            right: 'auto',
            bottom: 'auto'
          } : {}}
        >
          <div className="chat-header" onMouseDown={handleMouseDown}>
            <div className="chat-title">채팅</div>
            <div className="chat-actions">
              <div className="chat-close" onClick={handleChatClose}>×</div>
            </div>
          </div>
          <div className="chat-body">
            <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.type}-message`}
                  style={message.type === 'user' ? {
                    marginLeft: 'auto',
                    backgroundColor: 'var(--teal)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '10px'
                  } : {}}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              ))}
            </div>
            <div className="chat-input-area">
              <input
                type="text"
                className="chat-input"
                id="chatInput"
                placeholder="메시지 입력..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleChatSend();
                  }
                }}
              />
              <button className="chat-send-button" onClick={handleChatSend}>전송</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;