// 12톤 매핑 정보
const toneMap = {
  "봄": ["봄 라이트", "봄 트루", "봄 브라이트"],
  "여름": ["여름 라이트", "여름 트루", "여름 소프트"],
  "가을": ["가을 소프트", "가을 트루", "가을 딥"],
  "겨울": ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// DOM 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", () => {
  initSeasonEvents();
  initSubtoneEvents();
  initNavEvents();
  renderSubtones("봄"); // 초기 실행
});

// 1. 계절 버튼 클릭 이벤트 (이벤트 위임 방식 적용)
function initSeasonEvents() {
  const seasonGroup = document.getElementById("seasonGroup");
  if (!seasonGroup) return;

  seasonGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".season-btn");
    if (!btn) return;

    // 활성화 상태 변경
    seasonGroup.querySelectorAll(".season-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 계절 이름 추출 후 세부 톤 렌더링
    const season = btn.getAttribute("data-season") || btn.innerText.trim();
    renderSubtones(season);
  });
}

// 2. 세부 톤 버튼 클릭 이벤트 (이벤트 위임 방식 적용)
function initSubtoneEvents() {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  subtoneGroup.addEventListener("click", (e) => {
    const btn = e.target.closest(".subtone-btn");
    if (!btn) return;

    subtoneGroup.querySelectorAll(".subtone-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
}

// 3. 세부 톤 버튼 동적 생성
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const tones = toneMap[season] || toneMap["봄"];
  
  subtoneGroup.innerHTML = tones
    .map((tone, idx) => `<button type="button" class="subtone-btn ${idx === 0 ? "active" : ""}">${tone}</button>`)
    .join("");
}

// 4. 상단 및 하단 탭 버튼 클릭 이벤트
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

// 5. 탭 전환 처리
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
  const placeholderSection = document.getElementById("placeholderSection");

  if (tab === "home") {
    if (pcSection) pcSection.classList.remove("hidden");
    if (placeholderSection) placeholderSection.classList.add("hidden");
  } else {
    if (pcSection) pcSection.classList.add("hidden");
    if (placeholderSection) placeholderSection.classList.remove("hidden");
  }
}
