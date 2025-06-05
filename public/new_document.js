// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM 로드 완료");
  
  // 요소 확인 및 이벤트 연결
  initializeFilters();
});

function initializeFilters() {
  // 검색 기능
  const searchInput = document.querySelector('.new-search-input');
  if (!searchInput) {
    console.error("검색 입력 필드(.new-search-input)를 찾을 수 없습니다");
    return;
  }
  
  // 카테고리 필터
  const categorySelect = document.querySelector('.new-filter-select');
  if (!categorySelect) {
    console.error("카테고리 선택 필드(.new-filter-select)를 찾을 수 없습니다");
    return;
  }
  
  // 초기화 버튼
  const resetBtn = document.querySelector('.new-reset-button');
  if (!resetBtn) {
    console.error("초기화 버튼(.new-reset-button)을 찾을 수 없습니다");
    return;
  }
  
  // 템플릿 카드들
  const templateCards = document.querySelectorAll('.new-template-card');
  if (templateCards.length === 0) {
    console.error("템플릿 카드(.new-template-card)를 찾을 수 없습니다");
    return;
  }
  
  console.log("모든 필수 요소를 찾았습니다.");
  
  // 검색 이벤트
  searchInput.addEventListener('input', function() {
    filterTemplates(searchInput.value, categorySelect.value);
  });
  
  // 카테고리 변경 이벤트
  categorySelect.addEventListener('change', function() {
    filterTemplates(searchInput.value, categorySelect.value);
  });
  
  // 필터 초기화 이벤트
  resetBtn.addEventListener('click', function() {
    searchInput.value = '';
    categorySelect.value = '전체';
    filterTemplates('', '전체');
  });
  
  console.log("모든 이벤트 리스너가 연결되었습니다");
}

// 필터링 함수
function filterTemplates(searchTerm, category) {
  searchTerm = searchTerm.toLowerCase();
  console.log(`필터링: 검색어="${searchTerm}", 카테고리="${category}"`);
  
  const templateCards = document.querySelectorAll('.new-template-card');
  templateCards.forEach(card => {
    const title = card.querySelector('.new-card-title').textContent.toLowerCase();
    const description = card.querySelector('.new-card-description').textContent.toLowerCase();
    const cardCategories = (card.dataset.category || '').split(',');
    
    const matchesSearch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
    const matchesCategory = category === '전체' || cardCategories.includes(category);
    
    if (matchesSearch && matchesCategory) {
      card.style.display = '';
      console.log(`카드 표시: "${title}"`);
    } else {
      card.style.display = 'none';
      console.log(`카드 숨김: "${title}"`);
    }
  });
}

// 탭 클릭 이벤트 처리
document.querySelectorAll('.new-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.new-tab').forEach(t => t.classList.remove('new-active'));
    tab.classList.add('new-active');
  });
});