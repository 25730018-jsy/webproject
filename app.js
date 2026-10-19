// 12톤 메인 매핑 정보
const toneMap = {
  봄: ["봄 라이트", "봄 트루", "봄 브라이트"],
  여름: ["여름 라이트", "여름 트루", "여름 소프트"],
  가을: ["가을 소프트", "가을 트루", "가을 딥"],
  겨울: ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// Palette 메이크업 조합 데이터 (12톤 예시)
const mockProducts = [
  { id: 1, title: "봄 라이트 피치 블러링 세트", tone: "봄 라이트", price: 38000, lip: "피치 코랄 틴트", blusher: "라이트 피치", shadow: "봄 파스텔 팔레트", popular: 1, date: "2024-03-01", desc: "화사하고 맑은 봄 라이트 전용 조합." },
  { id: 2, title: "봄 트루 비비드 코랄 세트", tone: "봄 트루", price: 41000, lip: "트루 코랄 립", blusher: "워머 핑크", shadow: "코랄 4색 팔레트", popular: 4, date: "2024-03-02", desc: "따뜻한 코랄 톤이 돋보이는 대표 봄 세트." },
  { id: 3, title: "봄 브라이트 클리어 핑크 세트", tone: "봄 브라이트", price: 39000, lip: "비비드 핑키 코랄", blusher: "선명한 코랄", shadow: "밝은 펄 팔레트", popular: 2, date: "2024-03-03", desc: "선명하고 톡톡 튀는 봄 브라이트 스타일." },
  
  { id: 4, title: "여름 라이트 쿨 모브 세트", tone: "여름 라이트", price: 37000, lip: "페일 핑크", blusher: "라벤더 라이트", shadow: "파스텔 쿨 팔레트", popular: 5, date: "2024-03-04", desc: "여름 라이트 특유의 청순한 라이트 쿨 세트." },
  { id: 5, title: "여름 트루 클래식 쿨 세트", tone: "여름 트루", price: 43000, lip: "트루 쿨 핑크", blusher: "베리 핑크", shadow: "여름 쿨 음영 팔레트", popular: 3, date: "2024-03-05", desc: "정석 여름 쿨톤의 단정하고 맑은 분위기." },
  { id: 6, title: "여름 소프트 더스티 모브 세트", tone: "여름 소프트", price: 42000, lip: "모브 틴트", blusher: "더스티 로즈", shadow: "뮤트 팔레트", popular: 6, date: "2024-03-06", desc: "여름 뮤트/소프트용 차분한 음영 조합." },

  { id: 7, title: "가을 소프트 샌드 베이지 세트", tone: "가을 소프트", price: 40000, lip: "누디 베이지", blusher: "소프트 칠리", shadow: "스무스 베이지 팔레트", popular: 8, date: "2024-03-07", desc: "부드럽고 부드러운 가을 소프트 음영." },
  { id: 8, title: "가을 트루 오렌지 브라운 세트", tone: "가을 트루", price: 44000, lip: "칠리 레드", blusher: "테라코타", shadow: "웜 브라운 팔레트", popular: 7, date: "2024-03-08", desc: "가을 워머 톤의 풍성한 오렌지 브라운." },
  { id: 9, title: "가을 딥 브릭 음영 세트", tone: "가을 딥", price: 45000, lip: "딥 브릭 틴트", blusher: "딥 로즈", shadow: "글리터 브라운 팔레트", popular: 9, date: "2024-03-09", desc: "깊이감 있는 분위기를 연출하는 가을 딥." },

  { id: 10, title: "겨울 브라이트 마젠타 팝 세트", tone: "겨울 브라이트", price: 46000, lip: "마젠타 핑크", blusher: "쿨 핑크", shadow: "하이 콘트라스트 팔레트", popular: 10, date: "2024-03-10", desc: "선명한 대비감이 매력적인 겨울 브라이트." },
  { id: 11, title: "겨울 트루 체리 레드 세트", tone: "겨울 트루", price: 42000, lip: "체리 레드 립", blusher: "플럼 핑크", shadow: "스모키 쿨 팔레트", popular: 11, date: "2024-03-11", desc: "겨울 쿨톤 정석의 선명한 체리 레드." },
  { id: 12, title: "겨울 딥 다크 플럼 세트", tone: "겨울 딥", price: 48000, lip: "딥 플럼 버건디", blusher: "다크 버건디", shadow: "딥 스모키 팔레트", popular: 12, date: "2024-03-12", desc: "강렬하고 치명적인 분위기의 겨울 딥 세트." }
];

// 글로벌 상태 변수
let currentTab = "home";
let selectedSeason = "봄"; // 기본 계절
let selectedTone = "봄 라이트"; // 기본 세부 톤
let currentSort = "popular";
let pouchList = JSON.parse(localStorage.getItem("palettePouch")) || [];

// 초기화
window.addEventListener("DOMContentLoaded", () => {
  initEvents();
  renderSubtones(selectedSeason);
  switchTab("home");
});

// 이벤트 바인딩
function initEvents() {
  // 상단 네비게이션
  document.getElementById("btnNavHome")?.addEventListener("click", () => switchTab("home"));
  document.getElementById("btnNavList")?.addEventListener("click", () => switchTab("list"));
  document.getElementById("btnNavPouch")?.addEventListener("click", () => switchTab("pouch"));

  // 하단 네비게이션
  document.getElementById("bNavHome")?.addEventListener("click", () => switchTab("home"));
  document.getElementById("bNavList")?.addEventListener("click", () => switchTab("list"));
  document.getElementById("bNavPouch")?.addEventListener("click", () => switchTab("pouch"));

  // 계절 버튼 클릭 이벤트
  document.querySelectorAll("#seasonGroup .season-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("#seasonGroup .season-btn").forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      selectedSeason = e.currentTarget.getAttribute("data-season");
      renderSubtones(selectedSeason); // 계절 클릭 시 서브 톤 목록 재생성
    });
  });

  // 정렬 옵션
  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    currentSort = e.target.value;
    render();
  });

  // 초기화 버튼
  document.getElementById("btnResetFilter")?.addEventListener("click", resetFilters);

  // 모달 닫기
  document.getElementById("btnCloseModal")?.addEventListener("click", closeModal);
}

// 선택된 계절의 세부 3톤 버튼 생성 및 이벤트 바인딩
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const tones = toneMap[season] || [];
  // 서브 톤 첫 번째 항목을 자동 선택
  selectedTone = tones[0] || null;

  subtoneGroup.innerHTML = tones
    .map(
      (tone, index) => `
    <button type="button" class="subtone-btn ${index === 0 ? "active" : ""}" data-tone="${tone}">
      ${tone}
    </button>
  `
    )
    .join("");

  // 세부 톤 버튼 이벤트 등록
  subtoneGroup.querySelectorAll(".subtone-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      subtoneGroup.querySelectorAll(".subtone-btn").forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      selectedTone = e.currentTarget.getAttribute("data-tone");
      render();
    });
  });

  render();
}

// 탭 전환 logic
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
      document.getElementById(id)?.classList.toggle("active", isTarget);
    });
  });

  // 홈 탭이 아닐 시 12톤 선택 영역 숨기기
  const pcSection = document.getElementById("personalColorSection");
  if (pcSection) {
    if (currentTab === "home") pcSection.classList.remove("hidden");
    else pcSection.classList.add("hidden");
  }

  render();
}

function resetFilters() {
  selectedSeason = "봄";
  selectedTone = "봄 라이트";

  document.querySelectorAll("#seasonGroup .season-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-season") === "봄");
  });

  renderSubtones("봄");
}

function getFilteredData() {
  let list = [...mockProducts];

  // 탭별 필터링
  if (currentTab === "pouch") {
    list = list.filter((item) => pouchList.includes(item.id));
  } else if (currentTab === "home") {
    if (selectedTone) {
      list = list.filter((item) => item.tone === selectedTone);
    }
  }

  // 정렬
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
        <div style="width: 100%; height: 100px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 12px; border-radius: 4px;">
          ${item.tone}
        </div>
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 6px;">${item.title}</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 10px;">${item.desc}</p>
        <p style="font-size: 15px; font-weight: bold; margin-bottom: 15px;">${item.price.toLocaleString()}원</p>
        <button type="button" id="btnTogglePouch" style="width: 100%; padding: 10px; background-color: ${isPouch ? "#555" : "#1a1a1a"}; color: #fff; border: none; font-weight: bold; cursor: pointer; border-radius: 4px;">
          ${isPouch ? "마이 파우치에서 삭제" : "마이 파우치에 저장"}
        </button>
      </div>
    `;

    document.getElementById("btnTogglePouch")?.addEventListener("click", () => {
      togglePouch(item.id);
      closeModal();
    });
  }

  document.getElementById("detailModal")?.classList.remove("hidden");
};

function closeModal() {
  document.getElementById("detailModal")?.classList.add("hidden");
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
