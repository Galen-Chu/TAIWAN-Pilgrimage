// 台灣進香地圖 — 源流連結資料(Lineage)
// 資料模型:docs/CONCEPT.md「三、資料模型草案」
//
// 首批(D3,2026-08-18):媽祖系統。後續:關聖帝君、玉皇、觀音、地藏、阿彌陀佛。
//
// 欄位說明:
//   deity:           神明系統(與 temples.mainDeity 對應,外部源頭亦標註系統名)
//   fromTempleId:    起點廟宇(本資料集內的 temple id)——與 fromExternalName 恰好擇一
//   fromExternalName: 起點為外部節點(中國祖廟、已消失古廟、歷史事件主體等)
//   toTempleId:      終點廟宇(必須存在於 temples)
//   relation:        "分香" | "謁祖進香" | "割火" | "遶境" | "承繼"
//   year:            事實年份(數字)或不詳(null)
//   status:          "確定" | "存爭議" | "待查"
//   source:          出處(策展原則:每筆源流都應可查證;「待補」者表示待填具體文獻)
//
// 驗證:node tools/validate-data.js

const lineages = [
  {
    id: 1,
    deity: "媽祖",
    fromExternalName: "湄洲媽祖祖廟(中國福建莆田)",
    toTempleId: 25,
    relation: "分香",
    year: null,
    status: "待查",
    note: "相傳明萬曆年間媽祖香火傳入澎湖,為媽祖信仰登陸台灣之始",
    source: "澎湖天后宮沿革、相關文獻(待補具體出處)"
  },
  {
    id: 2,
    deity: "媽祖",
    fromExternalName: "湄洲媽祖祖廟(中國福建莆田)",
    toTempleId: 3,
    relation: "分香",
    year: 1694,
    status: "確定",
    note: "康熙33年樹璧和尚自湄洲朝天閣恭請媽祖神像至笨港建廟",
    source: "北港朝天宮沿革(待補具體出處)"
  },
  {
    id: 3,
    deity: "媽祖",
    fromExternalName: "湄洲媽祖祖廟(中國福建莆田)",
    toTempleId: 9,
    relation: "分香",
    year: 1684,
    status: "存爭議",
    note: "1684年官建為確定史實;媽祖神像源流採施琅自湄洲奉迎說(依廟方沿革),學界另有考證",
    source: "台南大天后宮沿革(待補具體出處)"
  },
  {
    id: 4,
    deity: "媽祖",
    fromExternalName: "鄭成功艦隊隨軍媽祖(相傳自湄洲分香)",
    toTempleId: 10,
    relation: "分香",
    year: 1661,
    status: "存爭議",
    note: "相傳1661年鄭成功艦隊媽祖於鹿耳門登陸;鹿耳門天后宮與土城正統聖母廟均主張承繼此源流",
    source: "鹿耳門天后宮沿革(待補具體出處)"
  },
  {
    id: 5,
    deity: "媽祖",
    fromExternalName: "笨港天后宮(清康熙年間建,今已不存)",
    toTempleId: 4,
    relation: "承繼",
    year: 1811,
    status: "存爭議",
    note: "嘉慶16年王得祿倡議遷建;北港朝天宮與新港奉天宮各自主張承繼笨港天后宮香火",
    source: "兩宮沿革、學術研究(待補具體出處)"
  },
  {
    id: 6,
    deity: "媽祖",
    fromTempleId: 3,
    toTempleId: 1,
    relation: "分香",
    year: null,
    status: "存爭議",
    note: "鎮瀾宮源流有「北港分香說」與1987年湄洲直航謁祖後的「湄洲直分香說」之爭",
    source: "相關研究與媒體報導(待補具體出處)"
  },
  {
    id: 7,
    deity: "媽祖",
    fromTempleId: 2,
    toTempleId: 3,
    relation: "謁祖進香",
    year: null,
    status: "確定",
    note: "白沙屯媽祖徒步進香每年往返北港朝天宮,已登錄國家重要民俗",
    source: "白沙屯拱天宮沿革、文化部文化資產公告(待補具體出處)"
  },
  {
    id: 8,
    deity: "媽祖",
    fromTempleId: 1,
    toTempleId: 3,
    relation: "謁祖進香",
    year: null,
    status: "確定",
    note: "1988年以前大甲媽祖進香目的地為北港朝天宮(「媽祖回娘家」);1988年起改往新港奉天宮",
    source: "大甲鎮瀾宮沿革(待補具體出處)"
  },
  {
    id: 9,
    deity: "媽祖",
    fromTempleId: 1,
    toTempleId: 4,
    relation: "遶境",
    year: 1988,
    status: "確定",
    note: "大甲媽祖遶境進香(九天八夜)自1988年起以新港奉天宮為目的地,已登錄國家重要民俗",
    source: "大甲鎮瀾宮沿革、文化部文化資產公告(待補具體出處)"
  },
  {
    id: 10,
    deity: "媽祖",
    fromExternalName: "湄洲媽祖祖廟(中國福建莆田)",
    toTempleId: 5,
    relation: "分香",
    year: null,
    status: "待查",
    note: "鹿港天后宮(舊祖宮)源流說法多種,待考",
    source: "待補"
  }
];

// 外部源頭節點座標(近似值,僅供地圖繪製源流連線用,非精確歷史位置)
const externalNodes = [
  {
    name: "湄洲媽祖祖廟(中國福建莆田)",
    lat: 25.048,
    lng: 119.098
  },
  {
    name: "笨港天后宮(清康熙年間建,今已不存)",
    lat: 23.576,
    lng: 120.303
  },
  {
    name: "鄭成功艦隊隨軍媽祖(相傳自湄洲分香)",
    lat: 23.05,
    lng: 120.13
  }
];
