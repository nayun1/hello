
// 페이지 로드 시 저장된 테마 적용
document.addEventListener('DOMContentLoaded', function() {
  const savedTheme = localStorage.getItem('selectedTheme') || 'default';
  applyTheme(savedTheme);
  
});

/**
 * 테마 적용 함수
 * @param {string} theme - 적용할 테마 이름
 */
function applyTheme(theme) {
  // 모든 테마 클래스 제거
  document.body.classList.remove('theme-default', 'theme-purple', 'theme-green', 'theme-brown', 'theme-gray');
  
  // 선택한 테마가 기본 테마가 아닌 경우에만 클래스 추가
  if (theme !== 'default') {
    document.body.classList.add(`theme-${theme}`);
  }


  // localStorage에 테마 저장
  localStorage.setItem('selectedTheme', theme);
}



// 테마 변경 함수 - 환경설정 페이지에서 사용
function changeTheme(theme) {
  applyTheme(theme);
}