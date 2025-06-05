// 페이지 로드 시 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
  // 알림 버튼 클릭 시 알림창 토글
  const notificationButton = document.getElementById('notificationButton');
  const notificationPanel = document.getElementById('notificationPanel');
  
  if (notificationButton && notificationPanel) {
    // 알림 버튼 클릭 시 알림창 토글
    notificationButton.addEventListener('click', function(e) {
      // 알림 패널 자체 클릭 시 이벤트가 부모로 전파되지 않도록 방지
      if (e.target !== notificationPanel && !notificationPanel.contains(e.target)) {
        notificationPanel.classList.toggle('active');
        e.stopPropagation();
      }
    });

    // 다른 영역 클릭 시 알림창 닫기
    document.addEventListener('click', function(e) {
      if (notificationPanel.classList.contains('active') && 
          e.target !== notificationPanel && 
          !notificationPanel.contains(e.target)) {
        notificationPanel.classList.remove('active');
      }
    });
    
    // 알림창 내부 클릭 시 이벤트 전파 방지 (알림창 닫힘 방지)
    notificationPanel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // 모든 메뉴 아이템에 이벤트 리스너 추가 - 서브메뉴 표시/숨김 처리
  const menuItems = document.querySelectorAll('.menu-item-with-submenu');

  menuItems.forEach(item => {
    // 마우스 올렸을 때
    item.addEventListener('mouseenter', function() {
      const submenu = this.querySelector('.submenu');
      if (submenu) {
        submenu.style.display = 'block';
        
        // 서브메뉴의 실제 높이 계산 + 추가 여백
        const submenuHeight = submenu.scrollHeight + 13; 
        
        // 바로 다음 메뉴 아이템의 마진만 조정
        const nextItem = this.nextElementSibling;
        if (nextItem) {
          nextItem.style.marginTop = submenuHeight + 'px';
        }
      }
    });
    
    // 마우스 떠났을 때
    item.addEventListener('mouseleave', function() {
      const submenu = this.querySelector('.submenu');
      if (submenu) {
        submenu.style.display = 'none';
      }
      
      // 바로 다음 메뉴 아이템의 마진만 제거
      const nextItem = this.nextElementSibling;
      if (nextItem) {
        nextItem.style.marginTop = '';
      }
    });
  });

  // 채팅 오버레이 기능
  const chatButton = document.getElementById('chatButton');
  const chatOverlay = document.getElementById('chatOverlay');
  
  if (chatButton && chatOverlay) {
    const chatClose = document.querySelector('.chat-close');
    const chatHeader = document.querySelector('.chat-header');
    const chatInput = document.getElementById('chatInput');
    const chatSendButton = document.querySelector('.chat-send-button');
    const chatMessages = document.getElementById('chatMessages');
    const chatNotificationDot = document.querySelector('.chat-notification-dot');

    // 채팅 버튼 클릭 시 오버레이 표시
    chatButton.addEventListener('click', () => {
      chatOverlay.classList.toggle('active');
      // 알림 점 제거
      if (chatNotificationDot) {
        chatNotificationDot.style.display = 'none';
      }
    });

    // 닫기 버튼
    if (chatClose) {
      chatClose.addEventListener('click', () => {
        chatOverlay.classList.remove('active');
      });
    }

    // 드래그 기능
    if (chatHeader) {
      let isDragging = false;
      let offsetX, offsetY;

      chatHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatOverlay.getBoundingClientRect().left;
        offsetY = e.clientY - chatOverlay.getBoundingClientRect().top;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // x와 y 값의 최소/최대 범위 제한
        if (x < 0) x = 0;  // x 값이 0보다 작으면 0으로 고정
        if (y < 0) y = 0;  // y 값이 0보다 작으면 0으로 고정

        // 예를 들어 최대 500px로 제한
        const maxX = window.innerWidth - chatOverlay.offsetWidth;
        const maxY = window.innerHeight - chatOverlay.offsetHeight;

        if (x > maxX) x = maxX;  // x 값이 최대 너비를 초과하지 않도록 제한
        if (y > maxY) y = maxY;  // y 값이 최대 높이를 초과하지 않도록 제한

        chatOverlay.style.left = `${x}px`;
        chatOverlay.style.top = `${y}px`;
        chatOverlay.style.right = 'auto';
        chatOverlay.style.bottom = 'auto';
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    // 메시지 전송 기능
    if (chatInput && chatSendButton && chatMessages) {
      function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // 사용자 메시지 추가
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'chat-message user-message';
        userMessageElement.style.marginLeft = 'auto';
        userMessageElement.style.backgroundColor = 'var(--teal)';
        userMessageElement.style.color = 'white';
        userMessageElement.style.padding = '8px 12px';
        userMessageElement.style.borderRadius = '10px';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = '지금';
        
        userMessageElement.appendChild(messageContent);
        userMessageElement.appendChild(messageTime);
        
        chatMessages.appendChild(userMessageElement);
        
        // 입력 필드 초기화
        chatInput.value = '';
        
        // 스크롤을 가장 아래로
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      chatSendButton.addEventListener('click', sendMessage);

      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    }
  }

  // 초기 페이지 로드 (예: 홈 페이지)
  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page') || 'home';
  loadPage(page);
  
  // 모든 내부 링크에 이벤트 리스너 추가
  document.addEventListener('click', function(e) {
    // data-page 속성이 있는 링크 요소 찾기
    if(e.target.hasAttribute('data-page') || e.target.closest('[data-page]')) {
      e.preventDefault();
      const pageLink = e.target.getAttribute('data-page') || 
                       e.target.closest('[data-page]').getAttribute('data-page');
      loadPage(pageLink);
    }
  });
  
  // 저장된 테마 로드
  loadSavedTheme();
});

// jQuery 코드 제거 - 중복 이벤트 처리 방지

// 페이지 로드 함수
function loadPage(pageName) {
  // 페이지 이름에 .html 확장자 추가
  const url = pageName + '.html';
  
  // 동적 콘텐츠 영역에 페이지 로드 (콜백 함수 추가)
  $('#dynamicContent').load(url, function() {
    // 페이지 로드 완료 이벤트 트리거 (테마 관련 기능을 위해 추가)
    $(document).trigger('pageLoaded', [pageName]);
  });
  
  // URL 히스토리 업데이트 (선택 사항)
  history.pushState({page: pageName}, pageName, '?page=' + pageName);
}

// 채팅 메시지 전송 함수
function sendChatMessage() {
  const message = $('#chatInput').val().trim();
  if (message !== '') {
    // 사용자 메시지 추가
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    $('#chatMessages').append(`
      <div class="chat-message user-message">
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
      </div>
    `);
    
    // 메시지 입력 필드 초기화
    $('#chatInput').val('');
    
    // 스크롤을 최하단으로 이동
    $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
    
    setTimeout(function() {
      $('#chatMessages').append(`
        <div class="chat-message system-message">
          <div class="message-content">메시지를 받았습니다. 조금만 기다려주세요.</div>
          <div class="message-time">${timeString}</div>
        </div>
      `);
      $('#chatMessages').scrollTop($('#chatMessages')[0].scrollHeight);
    }, 1000);
  }
}

// 저장된 테마 로드 함수 
function loadSavedTheme() {
  // theme.js의 기능을 활용
  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  applyTheme(savedTheme);
}

// 테마 변경 시 즉시 적용할 함수 (환경설정 페이지에서 사용)
function changeTheme(themeName) {
  // theme.js의 applyTheme를 호출
  applyTheme(themeName);
}