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
    desc: "가을딥 톤을 위한 딥한 브릭 컬러와 화려한 글로우 포인트가 살아있는 세트입니다."
  }
];

// 글로벌 변수
let currentTab = "home";
let selectedTone = "all";
let selectedMood = null;
let searchQuery = "";
let currentSort = "popular";
let pouchList = JSON.parse(localStorage.getItem("palettePouch")) || [];

// 실행 초기화
window.addEventListener("DOMContentLoaded", () => {
  initEvents();
  render();
});

// 이벤트 등록
function initEvents() {
  // 상단 네비게이션
  const btnHome = document.getElementById("btnNavHome");
  const btnList = document.getElementById("btnNavList");
  const btnPouch = document.getElementById("btnNavPouch");

  if (btnHome) btnHome.onclick = () => switchTab("home");
  if (btnList) btnList.onclick = () => switchTab("list");
  if (btnPouch) btnPouch.onclick = () => switchTab("pouch");

  // 하단 네비게이션
  const bHome = document.getElementById("bNavHome");
  const bList = document.getElementById("bNavList");
  const bPouch = document.getElementById("bNavPouch");

  if (bHome) bHome.onclick = () => switchTab("home");
  if (bList) bList.onclick = () => switchTab("list");
  if (bPouch) bPouch.onclick = () => switchTab("pouch");

  // 검색
  const btnSearch = document.getElementById("btnSearch");
  const searchInput = document.getElementById("searchInput");
  if (btnSearch) btnSearch.onclick = handleSearch;
  if (searchInput) {
    searchInput.onkeyup = (e) => {
      if (e.key === "Enter") handleSearch();
    };
  }

  // 톤 필터
  document.querySelectorAll("#toneFilterGroup .tag-btn").forEach((btn) => {
    btn.onclick = (e) => {
      document.querySelectorAll("#toneFilterGroup .tag-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedTone = e.target.getAttribute("data-filter-val");
      render();
    };
  });

  // 무드 필터
  document.querySelectorAll("#moodFilterGroup .tag-btn").forEach((btn) => {
    btn.onclick = (e) => {
      const val = e.target.getAttribute("data-filter-val");
      if (selectedMood === val) {
        selectedMood = null;
        e.target.classList.remove("active");
      } else {
        document.querySelectorAll("#moodFilterGroup .tag-btn").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        selectedMood = val;
      }
      render();
    };
  });

  // 정렬
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.onchange = (e) => {
      currentSort = e.target.value;
      render();
    };
  }

  // 필터 초기화
  const btnReset = document.getElementById("btnResetFilter");
  if (btnReset) btnReset.onclick = resetFilters;

  // 모달 닫기
  const btnClose = document.getElementById("btnCloseModal");
  if (btnClose) btnClose.onclick = closeModal;
}

function switchTab(tab) {
  currentTab = tab;
  
  const navMap = {
    home: ["btnNavHome", "bNavHome"],
    list: ["btnNavList", "bNavList"],
    pouch: ["btnNavPouch", "bNavPouch"]
  };

  Object.keys(navMap).forEach((t) => {
    const isTarget = t === tab;
    navMap[t].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("active", isTarget);
    });
  });

  render();
}

function handleSearch() {
  const input = document.getElementById("searchInput");
  if (input) searchQuery = input.value.trim();
  render();
}

function resetFilters() {
  selectedTone = "all";
  selectedMood = null;
  searchQuery = "";
  
  const input = document.getElementById("searchInput");
  if (input) input.value = "";

  document.querySelectorAll("#toneFilterGroup .tag-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-filter-val") === "all");
  });
  document.querySelectorAll("#moodFilterGroup .tag-btn").forEach((b) => b.classList.remove("active"));

  render();
}

function getFilteredData() {
  let list = [...mockProducts];

  if (currentTab === "pouch") {
    list = list.filter((item) => pouchList.includes(item.id));
  }
  if (selectedTone !== "all") {
    list = list.filter((item) => item.tone === selectedTone);
  }
  if (selectedMood) {
    list = list.filter((item) => item.mood === selectedMood);
  }
  if (searchQuery) {
    list = list.filter(
      (item) =>
        item.title.includes(searchQuery) ||
        item.tone.includes(searchQuery) ||
        item.lip.includes(searchQuery)
    );
  }

  if (currentSort === "popular") list.sort((a, b) => a.popular - b.popular);
  else if (currentSort === "latest") list.sort((a, b) => new Date(b.date) - new Date(a.date));
  else if (currentSort === "priceLow") list.sort((a, b) => a.price - b.price);

  return list;
}

function render() {
  const cardListEl = document.getElementById("cardList");
  const emptyStateEl = document.getElementById("emptyState");
  const resultCountNum = document.getElementById("resultCountNum");

  if (!cardListEl) return;

  const data = getFilteredData();
  if (resultCountNum) resultCountNum.textContent = data.length;

  if (data.length === 0) {
    cardListEl.innerHTML = "";
    if (emptyStateEl) emptyStateEl.classList.remove("hidden");
    return;
  }

  if (emptyStateEl) emptyStateEl.classList.add("hidden");

  cardListEl.innerHTML = data
    .map(
      (item) => `
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
    `
    )
    .join("");
}

window.openModal = function (id) {
  const item = mockProducts.find((p) => p.id === id);
  if (!item) return;

  const isPouch = pouchList.includes(item.id);
  const modalBody = document.getElementById("modalBody");

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 15px;">
        <div style="width: 100%; height: 100px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 12px;">
          ${item.tone}
        </div>
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 6px;">${item.title}</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">${item.desc}</p>
        <p style="font-size: 15px; font-weight: bold; margin-bottom: 15px;">${item.price.toLocaleString()}원</p>
        <button type="button" id="btnTogglePouch" style="width: 100%; padding: 10px; background-color: ${isPouch ? "#555" : "#1a1a1a"}; color: #fff; border: none; font-weight: bold; cursor: pointer;">
          ${isPouch ? "마이 파우치에서 삭제" : "마이 파우치에 저장"}
        </button>
      </div>
    `;

    const btnPouch = document.getElementById("btnTogglePouch");
    if (btnPouch) {
      btnPouch.onclick = () => {
        togglePouch(item.id);
        closeModal();
      };
    }
  }

  const modal = document.getElementById("detailModal");
  if (modal) modal.classList.remove("hidden");
};

function closeModal() {
  const modal = document.getElementById("detailModal");
  if (modal) modal.classList.add("hidden");
}

function togglePouch(id) {
  if (pouchList.includes(id)) {
    pouchList = pouchList.filter((pId) => pId !== id);
  } else {
    pouchList.push(id);
  }
  localStorage.setItem("palettePouch", JSON.stringify(pouchList));
  render();
}
