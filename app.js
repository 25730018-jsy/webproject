// 12톤 매핑 정보
const toneMap = {
  봄: ["봄 라이트", "봄 트루", "봄 브라이트"],
  여름: ["여름 라이트", "여름 트루", "여름 소프트"],
  가을: ["가을 소프트", "가을 트루", "가을 딥"],
  겨울: ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

let currentTab = "home";
let selectedSeason = "봄";
let selectedSubtone = "봄 라이트";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  bindNavEvents();
  bindSeasonEvents();
  renderSubtones("봄");
  switchTab("home");
}

// 탭 버튼 클릭 연결
function bindNavEvents() {
  const navIds = [
    { home: "btnNavHome", list: "btnNavList", pouch: "btnNavPouch" },
    { home: "bNavHome", list: "bNavList", pouch: "bNavPouch" }
  ];

  navIds.forEach((group) => {
    document.getElementById(group.home)?.addEventListener("click", () => switchTab("home"));
    document.getElementById(group.list)?.addEventListener("click", () => switchTab("list"));
    document.getElementById(group.pouch)?.addEventListener("click", () => switchTab("pouch"));
  });
}

// 계절 버튼 클릭 이벤트 연동 (봄, 여름, 가을, 겨울)
function bindSeasonEvents() {
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

// 선택된 계절의 세부 3톤 버튼 동적 출력
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const subTones = toneMap[season] || [];
  selectedSubtone = subTones[0] || "";

  subtoneGroup.innerHTML = subTones
    .map(
      (tone, idx) => `
      <button type="button" class="subtone-btn ${idx === 0 ? "active" : ""}" data-tone="${tone}">
        ${tone}
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
      selectedSubtone = e.currentTarget.getAttribute("data-tone");
    };
  });
}

// 탭 스위칭 logic
function switchTab(tab) {
  currentTab = tab;

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

  if (currentTab === "home") {
    if (pcSection) pcSection.classList.remove("hidden");
    if (placeholderSection) placeholderSection.classList.add("hidden");
  } else {
    if (pcSection) pcSection.classList.add("hidden");
    if (placeholderSection) placeholderSection.classList.remove("hidden");
  }
}
