// Palette 메이크업 조합 데이터
const mockProducts = [
  {
    id: 1,
    title: "A브랜드 여름뮤트 모브 음영 세트",
    tone: "여름뮤트",
    mood: "#음영메이크업",
    price: 42000,
    lip: "XX 모브 틴트",
    blusher: "YY 더스티 섀도우",
    shadow: "ZZ 뮤트 4색 팔레트",
    popular: 3,
    date: "2024-03-01",
    detailImg: "여름뮤트",
    desc: "쿨톤 여름뮤트 착붙 조합! 차분하고 감성적인 모브 음영 메이크업 연출 가능."
  },
  {
    id: 2,
    title: "B브랜드 봄라이트 피치 속광 세트",
    tone: "봄라이트",
    mood: "#맑은속광",
    price: 38000,
    lip: "AA 글로우 립",
    blusher: "BB 피치 파우더",
    shadow: "CC 코랄 팔레트",
    popular: 1,
    date: "2024-03-05",
    detailImg: "봄라이트",
    desc: "봄라이트 전용 화사한 피치 톤 조합으로 투명하고 맑은 속광 메이크업을 완벽 완성합니다."
  },
  {
    id: 3,
    title: "C브랜드 가을딥 글로우 음영 세트",
    tone: "가을딥",
    mood: "#글로우",
    price: 45000,
    lip: "DD 브릭 틴트",
    blusher: "EE 딥 로즈",
    shadow: "FF 글리터 팔레트",
    popular: 2,
    date: "2024-03-02",
    detailImg: "가을딥",
    desc: "가을딥 톤을 위한 딥한 브릭 컬러와 화려한 글로우 포인트가 살아있는 세트입니다."
  }
];

// 상태 관리
let currentTab = "home"; // home, list, pouch
let selectedTone = "all";
let selectedMood = null;
let searchQuery = "";
let currentSort = "popular";
let pouchList = JSON.parse(localStorage.getItem("palettePouch")) || [];

// DOM 요소
document.addEventListener("DOMContentLoaded", () => {
  initEvents();
  render();
});

// 이벤트 리스너 등록
function initEvents() {
  // 상단 네비게이션 탭 버튼
  document.getElementById("btnNavHome").addEventListener("click", () => switchTab("home"));
  document.getElementById("btnNavList").addEventListener("click", () => switchTab("list"));
  document.getElementById("btnNavPouch").addEventListener("click", () => switchTab("pouch"));

  // 하단 고정 네비게이션 탭 버튼
  document.getElementById("bNavHome").addEventListener("click", () => switchTab("home"));
  document.getElementById("bNavList").addEventListener("click", () => switchTab("list"));
  document.getElementById("bNavPouch").addEventListener("click", () => switchTab("pouch"));

  // 검색
  document.getElementById("btnSearch").addEventListener("click", handleSearch);
  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // 톤 필터
  const toneBtns = document.querySelectorAll("#toneFilterGroup .tag-btn");
  toneBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      toneBtns.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedTone = e.target.getAttribute("data-filter-val");
      render();
    });
  });

  // 무드 필터 (토글 방식)
  const moodBtns = document.querySelectorAll("#moodFilterGroup .tag-btn");
  moodBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const val = e.target.getAttribute("data-filter-val");
      if (selectedMood === val) {
        selectedMood = null;
        e.target.classList.remove("active");
      } else {
        moodBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        selectedMood = val;
      }
      render();
    });
  });

  // 정렬
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    currentSort = e.target.value;
    render();
  });

  // 필터 초기화
  document.getElementById("btnResetFilter").addEventListener("click", resetFilters);

  // 모달 닫기
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("detailModal").addEventListener("click", (e) => {
    if (e.target.id === "detailModal") closeModal();
  });
}

// 탭 전환
function switchTab(tab) {
  currentTab = tab;

  // 상단 및 하단 버튼 활성화 상태 변경
  const topBtns = { home: "btnNavHome", list: "btnNavList", pouch: "btnNavPouch" };
  const bottomBtns = { home: "bNavHome", list: "bNavList", pouch: "bNavPouch" };

  ["home", "list", "pouch"].forEach((t) => {
    document.getElementById(topBtns[t]).classList.toggle("active", t === tab);
    document.getElementById(bottomBtns[t]).classList.toggle("active", t === tab);
  });

  render();
}

// 검색 처리
function handleSearch() {
  searchQuery = document.getElementById("searchInput").value.trim();
  render();
}

// 필터 초기화
function resetFilters() {
  selectedTone = "all";
  selectedMood = null;
  searchQuery = "";
  document.getElementById("searchInput").value = "";

  // UI 리셋
  const toneBtns = document.querySelectorAll("#toneFilterGroup .tag-btn");
  toneBtns.forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-filter-val") === "all");
  });

  const moodBtns = document.querySelectorAll("#moodFilterGroup .tag-btn");
  moodBtns.forEach((b) => b.classList.remove("active"));

  render();
}

// 필터링 및 정렬 데이터 가져오기
function getFilteredData() {
  let list = [...mockProducts];

  // 마이파우치 탭일 때
  if (currentTab === "pouch") {
    list = list.filter((item) => pouchList.includes(item.id));
  }

  // 톤 필터
  if (selectedTone !== "all") {
    list = list.filter((item) => item.tone === selectedTone);
  }

  // 무드 필터
  if (selectedMood) {
    list = list.filter((item) => item.mood === selectedMood);
  }

  // 검색어 필터
  if (searchQuery) {
    list = list.filter(
      (item) =>
        item.title.includes(searchQuery) ||
        item.tone.includes(searchQuery) ||
        item.lip.includes(searchQuery) ||
        item.blusher.includes(searchQuery) ||
        item.shadow.includes(searchQuery)
    );
  }

  // 정렬
  if (currentSort === "popular") {
    list.sort((a, b) => a.popular - b.popular);
  } else if (currentSort === "latest") {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === "priceLow") {
    list.sort((a, b) => a.price - b.price);
  }

  return list;
}

// 화면 렌더링
function render() {
  const cardListEl = document.getElementById("cardList");
  const emptyStateEl = document.getElementById("emptyState");
  const resultCountNum = document.getElementById("resultCountNum");

  const data = getFilteredData();
  resultCountNum.textContent = data.length;

  if (data.length === 0) {
    cardListEl.innerHTML = "";
    emptyStateEl.classList.remove("hidden");
    return;
  }

  emptyStateEl.classList.add("hidden");

  cardListEl.innerHTML = data
    .map((item) => {
      const isPouch = pouchList.includes(item.id);
      return `
      <div class="card">
        <div class="card-img-placeholder">${item.tone}</div>
        <div class="card-info">
          <div>
            <h4 class="card-title">${item.title}</h4>
            <div class="card-items">
              <span class="item-badge">립: ${item.lip}</span>
              <span class="item-badge">블러셔: ${item.blusher}</span>
              <span class="item-badge">섀도우: ${item.shadow}</span>
            </div>
          </div>
          <div class="card-bottom">
            <span class="card-price">${item.price.toLocaleString()}원</span>
            <button type="button" class="btn-detail" onclick="openModal(${item.id})">상세보기</button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

// 상세보기 모달 열기
window.openModal = function (id) {
  const item = mockProducts.find((p) => p.id === id);
  if (!item) return;

  const isPouch = pouchList.includes(item.id);
  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 15px;">
      <div style="width: 100%; height: 120px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 12px;">
        ${item.tone}
      </div>
      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 6px;">${item.title}</h3>
      <p style="font-size: 12px; color: #666; margin-bottom: 10px;">${item.desc}</p>
      <div style="font-size: 13px; text-align: left; background: #f9f9f9; padding:
