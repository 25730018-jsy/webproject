// 12톤 매핑 정보
var toneMap = {
  "봄": ["봄 라이트", "봄 트루", "봄 브라이트"],
  "여름": ["여름 라이트", "여름 트루", "여름 소프트"],
  "가을": ["가을 소프트", "가을 트루", "가을 딥"],
  "겨울": ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// 페이지 로드 완료 시 초기화 및 이벤트 연결
document.addEventListener("DOMContentLoaded", function () {
  initEvents();
  renderSubtones("봄"); // 초기 실행 시 '봄' 세부 톤 표시
});

function initEvents() {
  // 계절 버튼 (봄, 여름, 가을, 겨울) 클릭 이벤트 등록
  var seasonBtns = document.querySelectorAll("#seasonGroup .season-btn");
  seasonBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      seasonBtns.forEach(function (b) { b.classList.remove("active"); });
      e.currentTarget.classList.add("active");

      var season = e.currentTarget.getAttribute("data-season") || e.currentTarget.innerText.trim();
      renderSubtones(season);
    });
  });

  // 상단/하단 탭 버튼 클릭 이벤트 등록
  bindTabEvent("btnNavHome", "home");
  bindTabEvent("btnNavList", "list");
  bindTabEvent("btnNavPouch", "pouch");
  bindTabEvent("bNavHome", "home");
  bindTabEvent("bNavList", "list");
  bindTabEvent("bNavPouch", "pouch");
}

// 탭 이벤트 바인딩 헬퍼
function bindTabEvent(id, tabName) {
  var el = document.getElementById(id);
  if (el) {
    el.addEventListener("click", function () {
      switchTab(tabName);
    });
  }
}

// 계절에 맞는 세부 3톤 버튼 동적 생성
function renderSubtones(season) {
  var subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  var tones = toneMap[season] || [];
  subtoneGroup.innerHTML = tones
    .map(function (tone, idx) {
      return '<button type="button" class="subtone-btn ' + (idx === 0 ? "active" : "") + '">' + tone + '</button>';
    })
    .join("");

  // 생성된 세부 톤 버튼들에 클릭 이벤트 연결
  var subtoneBtns = subtoneGroup.querySelectorAll(".subtone-btn");
  subtoneBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      subtoneBtns.forEach(function (b) { b.classList.remove("active"); });
      e.currentTarget.classList.add("active");
    });
  });
}

// 탭 전환 처리
function switchTab(tab) {
  var updateActive = function (id, targetTab) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle("active", tab === targetTab);
  };

  updateActive("btnNavHome", "home");
  updateActive("btnNavList", "list");
  updateActive("btnNavPouch", "pouch");
  updateActive("bNavHome", "home");
  updateActive("bNavList", "list");
  updateActive("bNavPouch", "pouch");

  var pcSection = document.getElementById("personalColorSection");
  var placeholderSection = document.getElementById("placeholderSection");

  if (tab === "home") {
    if (pcSection) pcSection.classList.remove("hidden");
    if (placeholderSection) placeholderSection.classList.add("hidden");
  } else {
    if (pcSection) pcSection.classList.add("hidden");
    if (placeholderSection) placeholderSection.classList.remove("hidden");
  }
}
