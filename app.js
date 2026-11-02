// 12톤 매핑 데이터
const toneMap = {
  "봄": ["봄 라이트", "봄 트루", "봄 브라이트"],
  "여름": ["여름 라이트", "여름 트루", "여름 소프트"],
  "가을": ["가을 소프트", "가을 트루", "가을 딥"],
  "겨울": ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// JSON에서 불러올 300개 전체 데이터 배열
let allProducts = [];

let currentSelectedTone = "봄 라이트";

document.addEventListener("DOMContentLoaded", () => {
  initLogo();
  initSeasonGroup();
  initSubtoneGroup();
  initNav();

  // 300개 json 데이터 로드
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      allProducts = data; // 300개 데이터 전역 변수에 저장
      console.log("300개 데이터 로드 완료:", allProducts);
      renderSubtones("봄");
    })
    .catch(error => console.error("데이터 로딩 에러:", error));
});

// 1. 브랜드 로고 클릭 이벤트 (홈으로 이동)
function initLogo() {
  const logoBtn = document.getElementById("logoBtn");
  if (logoBtn) {
    logoBtn.onclick = () => switchTab("home");
  }
}

// 2. 계절(봄/여름/가을/겨울) 클릭
function initSeasonGroup() {
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

// 3. 세부 톤 클릭 이벤트
function initSubtoneGroup() {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  subtoneGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".subtone-btn");
    if (!btn) return;

    subtoneGroup.querySelectorAll(".subtone-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentSelectedTone = btn.innerText.trim();
    updateStatusText();
  });
}

// 4. 세부 톤 동적 그려주기
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const tones = toneMap[season] || toneMap["봄"];
  currentSelectedTone = tones[0]; // 해당 계절의 첫 번째 톤을 기본 선택

  subtoneGroup.innerHTML = tones
    .map((tone, idx) => `<button type="button" class="subtone-btn ${idx === 0 ? "active" : ""}">${tone}</button>`)
    .join("");

  updateStatusText();
}

// 5. 선택 상태 문구 업데이트
function updateStatusText() {
  const statusText = document.getElementById("selectedStatusText");
  if (statusText) {
    statusText.innerText = `${currentSelectedTone} 톤 선택됨.`;
  }
}

// 6. 조합 목록 탭 추천 세트 출력 (300개 데이터 필터링 출력)
function renderRecommendation() {
  const titleEl = document.getElementById("currentSelectedToneTitle");
  const cardListEl = document.getElementById("cardList");

  if (titleEl) titleEl.innerText = currentSelectedTone;

  // 선택한 톤(tone)과 일치하는 화장품들 필터링
  const matchedItems = allProducts.filter(item => item.tone === currentSelectedTone);

  if (cardListEl) {
    if (matchedItems.length > 0) {
      cardListEl.innerHTML = matchedItems.map(item => `
        <div class="card" style="margin-bottom: 15px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
          <div class="card-title" style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${item.title}</div>
          <div class="card-items" style="margin-bottom: 8px;">
            <span class="item-badge" style="background: #f0f0f0; padding: 3px 6px; border-radius: 4px; font-size: 12px; margin-right: 4px;">립: ${item.lip}</span>
            <span class="item-badge" style="background: #f0f0f0; padding: 3px 6px; border-radius: 4px; font-size: 12px; margin-right: 4px;">블러셔: ${item.blusher}</span>
            <span class="item-badge" style="background: #f0f0f0; padding: 3px 6px; border-radius: 4px; font-size: 12px;">섀도우: ${item.shadow}</span>
          </div>
          <div class="card-price" style="font-weight: bold; color: #e91e63;">${item.price.toLocaleString()}원</div>
        </div>
      `).join("");
    } else {
      cardListEl.innerHTML = `<div class="card"><p style="font-size: 13px; color: #666;">해당 톤에 맞는 추천 제품 데이터를 찾는 중입니다...</p></div>`;
    }
  }
}

// 7. 상단/하단 네비게이션 클릭
function initNav() {
  const navs = [
    { id: "btnNavHome", tab: "home" },
    { id: "btnNavList", tab: "list" },
    { id: "btnNavPouch", tab: "pouch" },
    { id: "bNavHome", tab: "home" },
    { id: "bNavList", tab: "list" },
    { id: "bNavPouch", tab: "pouch" }
  ];

  navs.forEach(({ id, tab }) => {
    const el = document.getElementById(id);
    if (el) el.onclick = () => switchTab(tab);
  });
}

// 8. 탭 전환 처리
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
    renderRecommendation(); // 조합 목록 탭 클릭 시 현재 선택한 톤 상품 출력!
  } else {
    if (pcSection) pcSection.classList.add("hidden");
    if (resultSection) resultSection.classList.add("hidden");
    if (placeholderSection) placeholderSection.classList.remove("hidden");
  }
}
