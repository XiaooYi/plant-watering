const plants = [
  { name: "绿萝", category: "观叶植物", icon: "🍃" },
  { name: "多肉植物", category: "多肉植物", icon: "🌵" },
  { name: "仙人掌", category: "多肉植物", icon: "🌵" },
  { name: "吊兰", category: "观叶植物", icon: "🌱" },
  { name: "薄荷", category: "香草植物", icon: "🌿" },
  { name: "虎皮兰", category: "观叶植物", icon: "🪴" },
];

const defaultRecords = [
  {
    plant: "绿萝",
    datetime: "2024-03-05T09:30",
    note: "状态良好，叶片颜色鲜亮",
  },
  {
    plant: "吊兰",
    datetime: "2024-03-02T17:20",
    note: "生长良好，注意通风",
  },
  {
    plant: "薄荷",
    datetime: "2024-02-27T08:15",
    note: "新芽冒出，适量补水",
  },
  {
    plant: "多肉植物",
    datetime: "2024-02-24T10:00",
    note: "土壤稍干，避免积水",
  },
];

const storageKey = "plant-records";

const plantGrid = document.getElementById("plant-grid");
const plantSelect = document.getElementById("plant-select");
const recordForm = document.getElementById("record-form");
const recordDatetime = document.getElementById("record-datetime");
const recentRecords = document.getElementById("recent-records");
const history = document.getElementById("history");

const formatDate = (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const loadRecords = () => {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(defaultRecords));
    return [...defaultRecords];
  }
  try {
    return JSON.parse(saved);
  } catch {
    return [...defaultRecords];
  }
};

const saveRecords = (records) => {
  localStorage.setItem(storageKey, JSON.stringify(records));
};

const renderPlants = () => {
  plantGrid.innerHTML = "";
  plantSelect.innerHTML = "";
  plants.forEach((plant, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "plant-card";
    card.innerHTML = `
      <strong>${plant.icon} ${plant.name}</strong>
      <span>${plant.category}</span>
    `;
    if (index === 0) {
      card.classList.add("active");
    }
    card.addEventListener("click", () => {
      document
        .querySelectorAll(".plant-card")
        .forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
      plantSelect.value = plant.name;
    });
    plantGrid.appendChild(card);

    const option = document.createElement("option");
    option.value = plant.name;
    option.textContent = `${plant.name} · ${plant.category}`;
    plantSelect.appendChild(option);
  });
};

const renderRecent = (records) => {
  recentRecords.innerHTML = "";
  records.slice(0, 3).forEach((record) => {
    const card = document.createElement("div");
    card.className = "record-card";
    card.innerHTML = `
      <h3>${record.plant}</h3>
      <p>${formatDate(record.datetime)}</p>
      <p>${record.note}</p>
    `;
    recentRecords.appendChild(card);
  });
};

const renderHistory = (records) => {
  const table = document.createElement("table");
  table.className = "history-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>植物</th>
        <th>记录时间</th>
        <th>状态备注</th>
      </tr>
    </thead>
    <tbody>
      ${records
        .map(
          (record) => `
        <tr>
          <td>${record.plant}</td>
          <td>${formatDate(record.datetime)}</td>
          <td>${record.note}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;
  history.innerHTML = "";
  history.appendChild(table);
};

const render = () => {
  const records = loadRecords().sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );
  renderPlants();
  renderRecent(records);
  renderHistory(records);
};

recordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newRecord = {
    plant: plantSelect.value,
    datetime: recordDatetime.value,
    note: document.getElementById("record-note").value.trim(),
  };
  const records = loadRecords();
  records.unshift(newRecord);
  saveRecords(records);
  recordForm.reset();
  recordDatetime.value = new Date().toISOString().slice(0, 16);
  render();
});

recordDatetime.value = new Date().toISOString().slice(0, 16);
render();
