// 12톤 매핑 정보
var toneMap = {
  "봄": ["봄 라이트", "봄 트루", "봄 브라이트"],
  "여름": ["여름 라이트", "여름 트루", "여름 소프트"],
  "가을": ["가을 소프트", "가을 트루", "가을 딥"],
  "겨울": ["겨울 브라이트", "겨울 트루", "겨울 딥"]
};

// 페이지 로드 시 및 안전장치
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function initApp() {
  bindSeasonEvents();
  bindNavEvents();
  renderSubtones("봄"); // 초기 실행 시 '봄' 세부 톤 출력
}

// 계절 버튼 (봄, 여름, 가을, 겨울) 클릭 이벤트
function bindSeasonEvents() {
  var seasonBtns = document.querySelectorAll(".season-btn, [data-season]");
  
  seasonBtns.forEach(function (btn) {
    btn.onclick = function (e) {
      seasonBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");

      // 버튼의 data-season 값 또는 내부 텍스트("봄", "여름" 등) 추출
      var seasonText = btn.getAttribute("data-season") || btn.innerText.trim();
      renderSubtones(seasonText);
    };
  });
}

// 계절에 해당하는 세부 3톤 버튼 동적 생성
function renderSubtones(season) {
  var subtoneGroup = document.getElementById("subtoneGroup");
  if (!subtoneGroup) return;

  var tones = toneMap[season] || toneMap["봄"];
  var html = "";

  for (var i = 0; i < tones.length; i++) {
    var activeClass = (i === 0) ? "active" : "";
    html += '<button type="button" class="subtone-btn ' + activeClass + '">' + tones[i] + '</button>';
  }

  subtoneGroup.innerHTML = html;

  // 생성된 세부 톤 버튼 클릭 이벤트
  var subtoneBtns = subtoneGroup.querySelectorAll(".subtone-btn");
  subtoneBtns.forEach(function (btn) {
    btn.onclick = function () {
      subtoneBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
    };
  });
}

// 상단/하단 탭 전환 이벤트
function bindNavEvents() {
  var tabPairs = [
    { id: "btnNavHome", tab: "home" },
    { id: "btnNavList", tab: "list" },
    { id: "btnNavPouch", tab: "pouch" },
    { id: "bNavHome", tab: "home" },
    { id: "bNavList", tab: "list" },
    { id: "bNavPouch", tab: "pouch" }
  ];

  tabPairs.forEach(function (item) {
    var el = document.getElementById(item.id);
    if (el) {
      el.onclick = function () {
        switchTab(item.tab);
      };
    }
  });
}

// 탭 스위칭 logic
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
