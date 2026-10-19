// 12톤 매핑 정보
const toneMap = {
  "봄": ["봄 라이트", "봄 트루", "봄 브라이트"],
  "여름": ["여름 라이트", "여름 트루", "여름 소프트"],
  "가을": ["가을 소프트", "가을 트루", "가을 딥"],
  "겨울": ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

let currentSeason = "봄";
let currentSubtone = "봄 라이트";

// 페이지 켜지면 '봄' 세부톤 목록 표시
window.onload = function () {
  renderSubtones("봄");
};

// 계절 선택 버튼 클릭 함수
function selectSeason(season, btnElement) {
  currentSeason = season;

  // 계절 버튼 활성화 상태 변경
  const seasonBtns = document.querySelectorAll("#seasonGroup .season-btn");
  seasonBtns.forEach((b) => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");

  // 해당 계절의 세부 톤 화면 출력
  renderSubtones(season);
}

// 세부 톤 생성 함수
function renderSubtones(season) {
  const subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  const subTones = toneMap[season] || [];
  currentSubtone = subTones[0] || "";

  subtoneGroup.innerHTML = subTones
    .map(
      (tone, idx) => `
      <button type="button" class="subtone-btn ${idx === 0 ? "active" : ""}" onclick="selectSubtone('${tone}', this)">
        ${tone}
      </button>
    `
    )
    .join("");
}

// 세부 톤 선택 클릭 함수
function selectSubtone(tone, btnElement) {
  currentSubtone = tone;

  const subtoneBtns = document.querySelectorAll("#subtoneGroup .subtone-btn");
  subtoneBtns.forEach((b) => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
}

// 탭 전환 함수
function switchTab(tab) {
  const btnHome = document.getElementById("btnNavHome");
  const btnList = document.getElementById("btnNavList");
  const btnPouch = document.getElementById("btnNavPouch");

  const bHome = document.getElementById("bNavHome");
  const bList = document.getElementById("bNavList");
  const bPouch = document.getElementById("bNavPouch");

  // 버튼 active 관리
  if (btnHome) btnHome.classList.toggle("active", tab === "home");
  if (btnList) btnList.classList.toggle("active", tab === "list");
  if (btnPouch) btnPouch.classList.toggle("active", tab === "pouch");

  if (bHome) bHome.classList.toggle("active", tab === "home");
  if (bList) bList.classList.toggle("active", tab === "list");
  if (bPouch) bPouch.classList.toggle("active", tab === "pouch");

  // 섹션 표시 숨김 관리
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
