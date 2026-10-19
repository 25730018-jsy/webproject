// 12톤 매핑 정보
const toneMap = {
  봄: ["봄 라이트", "봄 트루", "봄 브라이트"],
  여름: ["여름 라이트", "여름 트루", "여름 소프트"],
  가을: ["가을 소프트", "가을 트루", "가을 딥"],
  겨울: ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// 글로벌 상태
let currentTab = "home";
let selectedSeason = "봄";
let selectedTone = "봄 라이트";

// 실행 초기화
window.addEventListener("DOMContentLoaded", () => {
  initEvents();
  renderSubtones(selectedSeason);
  switchTab("home");
});

// 이벤트 핸들러 초기화
function initEvents() {
  // 탭 네비게이션
  document.getElementById("btnNavHome")?.addEventListener("click", () => switchTab("home"));
  document.getElementById("btnNavList")?.addEventListener("click", () => switchTab("list"));
  document.getElementById("btnNavPouch")?.addEventListener("click", () => switchTab("pouch"));

  document.getElementById("bNavHome")?.addEventListener("click", () => switchTab("home"));
  document.getElementById("bNavList")?.addEventListener("click", () => switchTab("list"));
  document.getElementById("bNavPouch")?.addEventListener("click", () => switchTab("pouch"));

  // 계절 선택 버튼 (봄 / 여름 / 가을 / 겨울)
  const seasonBtns = document.querySelectorAll("#seasonGroup .season-btn");
  seasonBtns.forEach((btn) => {
    btn.onclick = (e) => {
      seasonBtns.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");

      selectedSeason = e.currentTarget.getAttribute("data-season");
      renderSubtones(selectedSeason);
    };
  });
}

// 계절별 세부 3톤 버튼 생성 및 클릭 처리
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const tones = toneMap[season] || [];
  selectedTone = tones[0] || null;

  subtoneGroup.innerHTML = tones
    .map(
      (tone, idx) => `
    <button type="button" class="subtone-btn ${idx === 0 ? "active" : ""}" data-tone="${tone}">
      <span>${tone}</span>
    </button>
  `
    )
    .join("");

  // 세부 톤 버튼 클릭 이벤트
  const subtoneBtns = subtoneGroup.querySelectorAll(".subtone-btn");
  subtoneBtns.forEach((btn) => {
    btn.onclick = (e) => {
      subtoneBtns.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      selectedTone = e.currentTarget.getAttribute("data-tone");
    };
  });
}

// 탭 전환 (홈 화면 외에는 단순 탭 상태 표시만 유지)
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

  const pcSection = document.getElementById("personalColorSection");
  const resultSection = document.getElementById("resultSection");

  if (currentTab === "home") {
    // 홈 탭: 퍼스널컬러 선택 화면만 표시
    if (pcSection) pcSection.classList.remove("hidden");
    if (resultSection) resultSection.classList.add("hidden");
  } else {
    // 조합 목록 / 마이 파우치 탭: 홈 콘텐츠 숨기기 (추후 구현용)
    if (pcSection) pcSection.classList.add("hidden");
    if (resultSection) resultSection.classList.add("hidden");
  }
}
