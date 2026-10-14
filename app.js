// 1. 샘플 메이크업 세트 데이터 (JSON 구조)
const mockData = [
  {
    id: 1,
    title: "A브랜드 여름뮤트 모브 음영 세트",
    seasonCategory: "여름 쿨",
    detailTone: "여름뮤트",
    styleMood: "음영메이크업",
    price: 42000,
    priceFormatted: "42,000원",
    lip: "XX 모브 틴트 (02 쿨로즈)",
    blusher: "YY 더스티 파우더 (01 로지)",
    shadow: "ZZ 뮤트 4색 팔레트",
    tags: "#여름뮤트 #음영메이크업 #차분한로즈"
  },
  {
    id: 2,
    title: "B브랜드 봄라이트 피치 속광 세트",
    seasonCategory: "봄 웜",
    detailTone: "봄라이트",
    styleMood: "맑은속광",
    price: 38000,
    priceFormatted: "38,000원",
    lip: "AA 글로우 립 (01 코랄)",
    blusher: "BB 피치 블러셔 (03 피치)",
    shadow: "CC 맑은 섀도우 (02 봄햇살)",
    tags: "#봄라이트 #맑은속광 #데일릴룩"
  },
  {
    id: 3,
    title: "C브랜드 가을딥 글로우 음영 세트",
    seasonCategory: "가을 웜",
    detailTone: "가을딥",
    styleMood: "글로우",
    price: 45000,
    priceFormatted: "45,000원",
    lip: "DD 딥벨벳 립 (05 가을브라운)",
    blusher: "EE 웜로즈 블러셔",
    shadow: "FF 딥브라운 8색 팔레트",
    tags: "#가을딥 #글로우 #음영메이크업"
  }
];

// LocalStorage 저장용 파우치 ID 목록
let savedPouchIds = JSON.parse(localStorage.getItem('savedPouchIds')) || [];

// 현재 선택된 필터 상태
let currentTab = 'list'; // 'list' 또는 'pouch'
let selectedTone = 'all';
let selectedMood = 'all';
let searchKeyword = '';
let currentSelectedCardId = null;

// DOM 요소 
const DOM = {
  // 네비게이션
  btnNavList: document.getElementById('btnNavList'),
  btnNavPouch: document.getElementById('btnNavPouch'),
  
  // 검색 & 필터
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  toneChipList: document.getElementById('toneChipList'),
  moodChipList: document.getElementById('moodChipList'),
  sortSelect: document.getElementById('sortSelect'),
  resultCount: document.getElementById('resultCount'),
  
  // 메인 영역
  cardList: document.getElementById('cardList'),
  emptyState: document.getElementById('emptyState'),
  resetFilterBtn: document.getElementById('resetFilterBtn'),
  
  // 상세 모달
  detailModal: document.getElementById('detailModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalTone: document.getElementById('modalTone'),
  modalTitle: document.getElementById('modalTitle'),
  modalTags: document.getElementById('modalTags'),
  modalLip: document.getElementById('modalLip'),
  modalBlusher: document.getElementById('modalBlusher'),
  modalShadow: document.getElementById('modalShadow'),
  modalPrice: document.getElementById('modalPrice'),
  savePouchBtn: document.getElementById('savePouchBtn')
};

// -------------------------------------------------------------
// 화면 카드 목록 렌더링 함수
// -------------------------------------------------------------
function renderCardList() {
  let filteredData = mockData;

  // 1) 탭 필터링 (마이 파우치 탭인 경우 저장된 것만)
  if (currentTab === 'pouch') {
    filteredData = filteredData.filter(item => savedPouchIds.includes(item.id));
  }

  // 2) 톤 필터링 (봄라이트, 여름뮤트 등)
  if (selectedTone !== 'all') {
    filteredData = filteredData.filter(item => item.detailTone === selectedTone);
  }

  // 3) 무드 필터링
  if (selectedMood !== 'all') {
    filteredData = filteredData.filter(item => item.styleMood === selectedMood);
  }

  // 4) 검색어 필터링
  if (searchKeyword.trim() !== '') {
    filteredData = filteredData.filter(item => 
      item.title.includes(searchKeyword) || item.tags.includes(searchKeyword)
    );
  }

  // 결과 건수 업데이트
  DOM.resultCount.textContent = filteredData.length;

  // 결과가 0건이면 결과 없음 영역 표시
  if (filteredData.length === 0) {
    DOM.cardList.classList.add('is-hidden');
    DOM.emptyState.classList.remove('is-hidden');
    return;
  }

  DOM.emptyState.classList.add('is-hidden');
  DOM.cardList.classList.remove('is-hidden');

  // 카드 HTML 생성
  DOM.cardList.innerHTML = filteredData.map(item => {
    const isSaved = savedPouchIds.includes(item.id);
    return `
      <article class="combo-card" data-id="${item.id}">
        <div class="card-thumb">
          <span class="tone-badge">${item.detailTone}</span>
        </div>
        <div class="card-info">
          <h2 class="card-title">${item.title}</h2>
          <div class="combo-badges">
            <span class="badge">립: ${item.lip.split(' ')[0]}</span>
            <span class="badge">블러셔: ${item.blusher.split(' ')[0]}</span>
            <span class="badge">섀도우: ${item.shadow.split(' ')[0]}</span>
          </div>
          <div class="card-bottom">
            <span class="card-price">${item.priceFormatted}</span>
            <button type="button" class="btn-detail" data-id="${item.id}">
              ${isSaved ? '♥ 저장됨' : '상세보기'}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// -------------------------------------------------------------
// 이벤트 리스너 설정 (버튼 클릭 동작들)
// -------------------------------------------------------------

// ① 상단 네비게이션 탭 버튼 클릭 (조합 목록 / 마이 파우치)
DOM.btnNavList.addEventListener('click', () => {
  currentTab = 'list';
  DOM.btnNavList.classList.add('active');
  DOM.btnNavPouch.classList.remove('active');
  renderCardList();
});

DOM.btnNavPouch.addEventListener('click', () => {
  currentTab = 'pouch';
  DOM.btnNavPouch.classList.add('active');
  DOM.btnNavList.classList.remove('active');
  renderCardList();
});

// ② 세부 톤 필터 버튼 클릭 (봄라이트, 여름뮤트 등)
DOM.toneChipList.addEventListener('click', (e) => {
  if (e.target.classList.contains('chip')) {
    // 모든 톤 칩 버튼 활성화 해제 후 클릭한 것만 활성화
    const toneChips = DOM.toneChipList.querySelectorAll('.chip');
    toneChips.forEach(chip => chip.classList.remove('active'));
    e.target.classList.add('active');

    selectedTone = e.target.getAttribute('data-tone');
    renderCardList();
  }
});

// ③ 무드 필터 버튼 클릭
DOM.moodChipList.addEventListener('click', (e) => {
  if (e.target.classList.contains('chip')) {
    const moodChips = DOM.moodChipList.querySelectorAll('.chip');
    
    if (e.target.classList.contains('active')) {
      e.target.classList.remove('active');
      selectedMood = 'all';
    } else {
      moodChips.forEach(chip => chip.classList.remove('active'));
      e.target.classList.add('active');
      selectedMood = e.target.getAttribute('data-mood');
    }
    renderCardList();
  }
});

// ④ 검색 기능
DOM.searchBtn.addEventListener('click', () => {
  searchKeyword = DOM.searchInput.value;
  renderCardList();
});

DOM.searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchKeyword = DOM.searchInput.value;
    renderCardList();
  }
});

// ⑤ 필터 초기화 버튼 클릭 (결과 없음 상태에서)
DOM.resetFilterBtn.addEventListener('click', () => {
  selectedTone = 'all';
  selectedMood = 'all';
  searchKeyword = '';
  DOM.searchInput.value = '';

  // 칩 버튼 활성화 상태 리셋
  const toneChips = DOM.toneChipList.querySelectorAll('.chip');
  toneChips.forEach(chip => chip.classList.remove('active'));
  DOM.toneChipList.querySelector('[data-tone="all"]').classList.add('active');

  const moodChips = DOM.moodChipList.querySelectorAll('.chip');
  moodChips.forEach(chip => chip.classList.remove('active'));

  renderCardList();
});

// ⑥ 카드 상세보기 모달 열기
DOM.cardList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-detail')) {
    const cardId = Number(e.target.getAttribute('data-id'));
    const itemData = mockData.find(item => item.id === cardId);

    if (itemData) {
      currentSelectedCardId = itemData.id;
      DOM.modalTone.textContent = itemData.detailTone;
      DOM.modalTitle.textContent = itemData.title;
      DOM.modalTags.textContent = itemData.tags;
      DOM.modalLip.textContent = itemData.lip;
      DOM.modalBlusher.textContent = itemData.blusher;
      DOM.modalShadow.textContent = itemData.shadow;
      DOM.modalPrice.textContent = itemData.priceFormatted;

      // 파우치 저장 상태에 따라 버튼 텍스트 변경
      if (savedPouchIds.includes(itemData.id)) {
        DOM.savePouchBtn.textContent = '♥ 나만의 파우치에서 삭제';
      } else {
        DOM.savePouchBtn.textContent = '♥ 나만의 파우치에 저장';
      }

      DOM.detailModal.classList.remove('is-hidden');
    }
  }
});

// ⑦ 모달 닫기
DOM.modalCloseBtn.addEventListener('click', () => {
  DOM.detailModal.classList.add('is-hidden');
});

// ⑧ 나만의 파우치 저장/삭제 토글 버튼
DOM.savePouchBtn.addEventListener('click', () => {
  if (!currentSelectedCardId) return;

  if (savedPouchIds.includes(currentSelectedCardId)) {
    // 이미 저장되어 있으면 삭제
    savedPouchIds = savedPouchIds.filter(id => id !== currentSelectedCardId);
    alert('나만의 파우치에서 삭제되었습니다.');
  } else {
    // 저장 안 되어 있으면 추가
    savedPouchIds.push(currentSelectedCardId);
    alert('나만의 파우치에 저장되었습니다!');
  }

  // LocalStorage 저장
  localStorage.setItem('savedPouchIds', JSON.stringify(savedPouchIds));
  
  DOM.detailModal.classList.add('is-hidden');
  renderCardList(); // 화면 업데이트
});

// 처음 화면 진입 시 카드 목록 표시
renderCardList();