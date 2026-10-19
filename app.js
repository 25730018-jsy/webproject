// 12톤 매핑 데이터
const toneMap = {
  "봄": ["봄 라이트", "봄 트루", "봄 브라이트"],
  "여름": ["여름 라이트", "여름 트루", "여름 소프트"],
  "가을": ["가을 소프트", "가을 트루", "가을 딥"],
  "겨울": ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// 12톤별 추천 데이터베이스
const toneProducts = {
  "봄 라이트": { title: "봄 라이트 피치 속광 세트", lip: "AA 글로우 립", blusher: "BB 피치 파우더", shadow: "CC 코랄 팔레트", price: "38,000원" },
  "봄 트루": { title: "봄 트루 비비드 코랄 세트", lip: "트루 코랄 틴트", blusher: "웜 코랄 블러셔", shadow: "오렌지 섀도우 팔레트", price: "41,000원" },
  "봄 브라이트": { title: "봄 브라이트 클리어 핑크 세트", lip: "비비드 핑키 코랄", blusher: "선명한 핫핑크", shadow: "밝은 펄 팔레트", price: "39,000원" },
  "여름 라이트": { title: "여름 라이트 페일 쿨 세트", lip: "페일 모브 틴트", blusher: "라벤더 블러셔", shadow: "쿨 파스텔 팔레트", price: "37,000원" },
  "여름 트루": { title: "여름 트루 클래식 쿨 세트", lip: "체리 쿨 핑크", blusher: "베리 핑크", shadow: "여름 쿨 음영 팔레트", price: "43,000원" },
  "여름 소프트": { title: "여름 소프트 더스티 모브 세트", lip: "더스티 모브 립", blusher: "뮤트 로즈", shadow: "더스티 음영 팔레트", price: "42,000원" },
  "가을 소프트": { title: "가을 소프트 스무스 베이지 세트", lip: "누디 칠리 립", blusher: "소프트 피치", shadow: "베이지 브라운 팔레트", price: "40,000원" },
  "가을 트루": { title: "가을 트루 딥 워머 세트", lip: "트루 칠리 레드", blusher: "테라코타 샌드", shadow: "웜 브라운 팔레트", price: "44,000원" },
  "가을 딥": { title: "가을 딥 브릭 음영 세트", lip: "딥 브릭 레드", blusher: "딥 로즈", shadow: "글리터 다크 팔레트", price: "45,000원" },
  "겨울 브라이트": { title: "겨울 브라이트 마젠타 팝 세트", lip: "마젠타 비비드 립", blusher: "쿨 핫핑크", shadow: "하이 콘트라스트 팔레트", price: "46,000원" },
  "겨울 트루": { title: "겨울 트루 체리 버건디 세트", lip: "체리 버건디", blusher: "플럼 핑크", shadow: "스모키 쿨 팔레트", price: "42,000원" },
  "겨울 딥": { title: "겨울 딥 다크 버건디 세트", lip: "다크 버건디 립", blusher: "딥 버건디", shadow: "딥 스모키 팔레트", price: "48,000원" }
};

let currentSelectedTone = "봄 라이트"; // 현재 선택된 세부 톤 변수

document.addEventListener("DOMContentLoaded", () => {
  initLogoEvent();
  initSeasonEvents();
  initSubtoneEvents();
  initNavEvents();
  
  // 초기 실행 시 '봄' 계절과 첫 번째 세부 톤(봄 라이트) 표시
  renderSubtones("봄");
});

// 1. Palette 로고 클릭 시 홈 이동
function initLogoEvent() {
  const logoBtn = document.getElementById("logoBtn");
  if (logoBtn) {
    logoBtn.addEventListener("click", () => switchTab("home"));
  }
}

// 2. 사계절(봄/여름/가을/겨울) 클릭 이벤트
function initSeasonEvents() {
  const seasonGroup = document.getElementById("seasonGroup");
  if (!seasonGroup) return;

  seasonGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".season-btn");
    if (!btn) return;

    seasonGroup.querySelectorAll(".season-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const season = btn.getAttribute("data-season") || btn.innerText.trim();
    renderSubtones(season);
  });
}

// 3. 세부 톤 버튼 클릭 이벤트 (실시간 문구 업데이트)
function initSubtoneEvents() {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  subtoneGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".subtone-btn");
    if (!btn) return;

    subtoneGroup.querySelectorAll(".subtone-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 클릭한 버튼의 톤 이름으로 업데이트
    currentSelectedTone = btn.innerText.trim();
    updateSelectedStatus();
  });
}

// 4. 세부 톤 버튼 동적 생성
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const tones = toneMap[season] || toneMap["봄"];
  currentSelectedTone = tones[0]; // 계절 선택 시 첫 번째 세부 톤 자동 선택

  subtoneGroup.innerHTML = tones
    .map((tone, idx) => `<button type="button" class="subtone-btn ${idx === 0 ? "active" : ""}">${tone}</button>`)
    .join("");

  updateSelectedStatus();
}

// 5. 선택 상태 문구 실시간 표시
function updateSelectedStatus() {
  const statusText = document.getElementById("selectedStatusText");
  if (statusText) {
    statusText.innerText = `${currentSelectedTone} 톤 선택됨.`;
  }
}

// 6. 조합 목록 탭 추천 카드로 표시
function renderRecommendation() {
  const titleEl = document.getElementById("currentSelectedToneTitle");
  const cardListEl = document.getElementById("cardList");

  if (titleEl) titleEl.innerText = currentSelectedTone;

  const item = toneProducts[currentSelectedTone];

  if (cardListEl) {
    if (item) {
      cardListEl.innerHTML = `
        <div class="card">
          <div class="card-title">${item.title}</div>
          <div class="card-items">
            <span class="item-badge">립: ${item.lip}</span>
            <span class="item-badge">블러셔: ${item.blusher}</span>
            <span class="item-badge">섀도우: ${item.shadow}</span>
          </div>
          <div class="card-price">${item.price}</div>
        </div>
      `;
    } else {
      cardListEl.innerHTML = `<div class="card"><p style="font-size: 13px; color: #666;">해당 톤에 연결된 추천 조합이 없습니다.</p></div>`;
    }
  }
}

// 7. 상단 및 하단 탭 버튼 클릭
function initNavEvents() {
  const navTargets = [
    { id: "btnNavHome", tab: "home" },
    { id: "btnNavList", tab: "list" },
    { id: "btnNavPouch", tab: "pouch" },
    { id: "bNavHome", tab: "home" },
    { id: "bNavList", tab: "list" },
    { id: "bNavPouch", tab: "pouch" }
  ];

  navTargets.forEach(({ id, tab }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("click", () => switchTab(tab));
    }
  });
}

// 8. 탭 스위칭 및 화면 제어
function switchTab(tab) {
  const updateActive = (id, targetTab) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("active", tab === targetTab);
  };

  updateActive("btnNavHome", "home");
  updateActive("btnNavList", "list");
  updateActive("btnNavPouch", "pouch");
  updateActive("bNavHome", "home");
  updateActive("bNavList", "list");
  updateActive("bNavPouch", "pouch");

  const pcSection = document.getElementById("personalColorSection");
  const resultSection = document.getElementById("resultSection");
  const placeholderSection = document.getElementById("placeholderSection");

  if (tab === "home") {
    if (pcSection) pcSection.classList.remove("hidden");
    if (resultSection) resultSection.classList.add("hidden");
    if (placeholderSection) placeholderSection.classList.add("hidden");
  } else if (tab === "list") {
    if (pcSection) pcSection.classList.add("hidden");
    if (resultSection) resultSection.classList.remove("hidden");
    if (placeholderSection) placeholderSection.classList.add("hidden");
    renderRecommendation(); // 조합 목록 탭 진입 시 선택된 톤에 맞춘 결과 카드 출력
  } else {
    if (pcSection) pcSection.classList.add("hidden");
    if (resultSection) resultSection.classList.add("hidden");
    if (placeholderSection) placeholderSection.classList.remove("hidden");
  }
}
