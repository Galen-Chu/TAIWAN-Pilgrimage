// 台灣進香地圖 — 廟宇節點資料(Temple)
// 資料模型:docs/CONCEPT.md「三、資料模型草案」
//
// 語言政策(D6,2026-08-18):中文為主;nameEn/addressEn 僅精選落地點提供
// landingType:"歷史登陸點" | "開基廟" | "祖廟" | "分香子廟" | null(一般廟宇)
// foundedYear:僅高信心時填寫,其餘 null(沿革待考者不填年代)
// lodging:香客大樓屬性(D5,2026-08-18 舊 pilgrim-data.js 降階併入)
// 注意:phone/website 沿用舊資料(廟方與香客大樓電話未嚴格區分),待後續策展校正
// 驗證:node tools/validate-data.js

const temples = [
  {
    id: 1,
    nameZh: "大甲鎮瀾宮",
    mainDeity: "媽祖",
    addressZh: "台中市大甲區順天路158號",
    phone: "+886-4-2676-2582",
    website: "http://www.dajiamazu.org.tw",
    lat: 24.3486,
    lng: 120.6218,
    region: "Central",
    foundedYear: 1732,
    history: "大甲媽祖遶境進香起點",
    lodging: {
      nameZh: "鎮瀾宮香客大樓",
      noteZh: "可容納數百人住宿"
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 2,
    nameZh: "白沙屯拱天宮",
    mainDeity: "媽祖",
    addressZh: "苗栗縣通霄鎮白東里8鄰26號",
    phone: "+886-37-792-050",
    website: "https://www.baishatun.com.tw",
    lat: 24.5736,
    lng: 120.6953,
    region: "Central",
    foundedYear: 1863,
    history: "白沙屯媽祖徒步進香重要據點",
    lodging: {
      nameZh: "拱天宮香客大樓",
      noteZh: "白沙屯媽祖進香重要據點"
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 3,
    nameZh: "北港朝天宮",
    nameEn: "Beigang Chaotian Temple",
    mainDeity: "媽祖",
    addressZh: "雲林縣北港鎮中山路178號",
    addressEn: "No. 178, Zhongshan Rd., Beigang Township, Yunlin County",
    phone: "+886-5-783-2055",
    website: "https://www.matsu.org.tw",
    lat: 23.5708,
    lng: 120.3028,
    region: "South",
    foundedYear: 1694,
    history: "歷史悠久的媽祖廟",
    lodging: {
      nameZh: "朝天宮香客大樓",
      noteZh: "設備完善"
    },
    landingType: "祖廟",
    landingNote: "台灣媽祖信仰重鎮,各地媽祖廟多自此分香(分香祖廟)"
  },
  {
    id: 4,
    nameZh: "新港奉天宮",
    nameEn: "Xingang Fengtian Temple",
    mainDeity: "媽祖",
    addressZh: "嘉義縣新港鄉新民路53號",
    addressEn: "No. 53, Xinmin Rd., Xingang Township, Chiayi County",
    phone: "+886-5-374-2035",
    website: "http://www.hingkongmazu.org",
    lat: 23.5525,
    lng: 120.3461,
    region: "South",
    foundedYear: 1811,
    history: "嘉義地區重要媽祖信仰中心",
    lodging: {
      nameZh: "奉天宮香客大樓",
      noteZh: null
    },
    landingType: "祖廟",
    landingNote: "奉祀「開台媽祖」,與北港朝天宮同出笨港天后宮源流(各有論述)"
  },
  {
    id: 5,
    nameZh: "鹿港天后宮",
    mainDeity: "媽祖",
    addressZh: "彰化縣鹿港鎮中山路430號",
    phone: "+886-4-777-9899",
    website: "http://www.lugangmazu.org",
    lat: 24.0569,
    lng: 120.4347,
    region: "Central",
    foundedYear: null,
    history: "鹿港媽祖廟,古蹟建築(創建年代有多種說法,待考)",
    lodging: {
      nameZh: "鹿港天后宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 6,
    nameZh: "西螺福興宮",
    mainDeity: "媽祖",
    addressZh: "雲林縣西螺鎮建興路226號",
    phone: "+886-5-586-2691",
    website: "https://www.facebook.com/XiluoFuxingTemple/",
    lat: 23.7986,
    lng: 120.4661,
    region: "South",
    foundedYear: null,
    history: "西螺大橋旁的媽祖廟",
    lodging: {
      nameZh: "福興宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 7,
    nameZh: "松山奉天宮",
    mainDeity: "媽祖",
    addressZh: "台北市信義區福德街221巷12號",
    phone: "+886-2-2727-3838",
    website: "http://www.fengtian.org",
    lat: 25.0428,
    lng: 121.5783,
    region: "North",
    foundedYear: null,
    history: "台北市區媽祖廟,交通便利",
    lodging: {
      nameZh: "奉天宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 8,
    nameZh: "關渡宮",
    mainDeity: "媽祖",
    addressZh: "台北市北投區知行路360號",
    phone: "+886-2-2858-1281",
    website: "http://www.guandu.org",
    lat: 25.1175,
    lng: 121.4658,
    region: "North",
    foundedYear: 1712,
    history: "北台灣古老媽祖廟,淡水河畔",
    lodging: {
      nameZh: "關渡宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 9,
    nameZh: "台南大天后宮",
    nameEn: "Great Queen of Heaven Temple",
    mainDeity: "媽祖",
    addressZh: "台南市中西區永福路二段227巷18號",
    addressEn: "No. 18, Ln. 227, Sec. 2, Yongfu Rd., West Central Dist., Tainan City",
    phone: "+886-6-221-1178",
    website: "http://www.twtainan.net",
    lat: 22.9961,
    lng: 120.2019,
    region: "South",
    foundedYear: 1684,
    history: "台灣最早官建媽祖廟",
    lodging: {
      nameZh: "大天后宮香客大樓",
      noteZh: null
    },
    landingType: "開基廟",
    landingNote: "台灣最早官建媽祖廟(1684,由明寧靖王府改建)"
  },
  {
    id: 10,
    nameZh: "鹿耳門天后宮",
    nameEn: "Luerhmen Mazu Temple",
    mainDeity: "媽祖",
    addressZh: "台南市安南區媽祖宮一街136號",
    addressEn: "No. 136, Mazugong 1st St., Annan Dist., Tainan City",
    phone: "+886-6-284-1386",
    website: "http://www.luerhmen.org.tw",
    lat: 23.0572,
    lng: 120.1383,
    region: "South",
    foundedYear: null,
    history: "相傳鄭成功登陸地點的媽祖廟",
    lodging: {
      nameZh: "鹿耳門天后宮香客大樓",
      noteZh: null
    },
    landingType: "歷史登陸點",
    landingNote: "相傳1661年鄭成功艦隊隨軍媽祖於鹿耳門登陸(與土城正統聖母廟有源流之爭)"
  },
  {
    id: 11,
    nameZh: "南鯤鯓代天府",
    mainDeity: "五府千歲",
    addressZh: "台南市北門區鯤江里976號",
    phone: "+886-6-786-3711",
    website: "http://www.nankunshen.org.tw",
    lat: 23.2889,
    lng: 120.1397,
    region: "South",
    foundedYear: null,
    history: "台灣王爺信仰總廟",
    lodging: {
      nameZh: "南鯤鯓代天府香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 12,
    nameZh: "麻豆代天府",
    mainDeity: "五府千歲",
    addressZh: "台南市麻豆區關帝廟60號",
    phone: "+886-6-572-2133",
    website: "https://www.facebook.com/madou.temple/",
    lat: 23.1856,
    lng: 120.2603,
    region: "South",
    foundedYear: null,
    history: "麻豆地區王爺廟",
    lodging: {
      nameZh: "麻豆代天府香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 13,
    nameZh: "大龍峒保安宮",
    mainDeity: "保生大帝",
    addressZh: "台北市大同區哈密街61號",
    phone: "+886-2-2595-1676",
    website: "http://www.baoan.org.tw",
    lat: 25.0703,
    lng: 121.5158,
    region: "North",
    foundedYear: 1755,
    history: "台北國定古蹟,保生大帝廟",
    lodging: {
      nameZh: "保安宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 14,
    nameZh: "學甲慈濟宮",
    mainDeity: "保生大帝",
    addressZh: "台南市學甲區濟生路115號",
    phone: "+886-6-783-3111",
    website: "http://www.sjciji.org.tw",
    lat: 23.2314,
    lng: 120.1867,
    region: "South",
    foundedYear: null,
    history: "學甲保生大帝祖廟",
    lodging: {
      nameZh: "慈濟宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 15,
    nameZh: "行天宮",
    mainDeity: "關聖帝君",
    addressZh: "台北市中山區民權東路二段109號",
    phone: "+886-2-2502-7924",
    website: "http://www.ht.org.tw",
    lat: 25.0639,
    lng: 121.5336,
    region: "North",
    foundedYear: null,
    history: "台北知名關帝廟,收驚服務",
    lodging: {
      nameZh: "行天宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 16,
    nameZh: "台南武廟",
    mainDeity: "關聖帝君",
    addressZh: "台南市中西區永福路二段229號",
    phone: "+886-6-220-2390",
    website: "https://www.facebook.com/TainanWumiao/",
    lat: 22.9958,
    lng: 120.2017,
    region: "South",
    foundedYear: null,
    history: "台灣首座官建關帝廟",
    lodging: {
      nameZh: "武廟香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 17,
    nameZh: "指南宮",
    mainDeity: "呂洞賓",
    addressZh: "台北市文山區萬壽路115號",
    phone: "+886-2-2939-9922",
    website: "http://www.zhinan.org.tw",
    lat: 24.9875,
    lng: 121.5906,
    region: "North",
    foundedYear: 1891,
    history: "木柵指南宮,呂洞賓祖廟",
    lodging: {
      nameZh: "指南宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 18,
    nameZh: "佛光山",
    mainDeity: "佛教",
    addressZh: "高雄市大樹區興田路153號",
    phone: "+886-7-656-1921",
    website: "http://www.fgs.org.tw",
    lat: 22.7467,
    lng: 120.3872,
    region: "South",
    foundedYear: 1967,
    history: "台灣最大佛教道場之一",
    lodging: {
      nameZh: "佛光山朝山會館",
      noteZh: "可容納千人住宿"
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 19,
    nameZh: "法鼓山",
    mainDeity: "佛教",
    addressZh: "新北市金山區法鼓路555號",
    phone: "+886-2-2498-7171",
    website: "http://www.ddm.org.tw",
    lat: 25.2114,
    lng: 121.6378,
    region: "North",
    foundedYear: null,
    history: "法鼓山總本山",
    lodging: {
      nameZh: "法鼓山禪修中心",
      noteZh: "禪修住宿"
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 20,
    nameZh: "中台禪寺",
    mainDeity: "佛教",
    addressZh: "南投縣埔里鎮中台路2號",
    phone: "+886-49-293-0215",
    website: "http://www.ctworld.org",
    lat: 23.9658,
    lng: 120.9736,
    region: "Central",
    foundedYear: null,
    history: "世界最大佛教寺廟之一",
    lodging: {
      nameZh: "中台禪寺香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 21,
    nameZh: "艋舺龍山寺",
    mainDeity: "觀音菩薩",
    addressZh: "台北市萬華區廣州街211號",
    phone: "+886-2-2302-5162",
    website: "http://www.lungshan.org.tw",
    lat: 25.0364,
    lng: 121.4997,
    region: "North",
    foundedYear: 1738,
    history: "台北國定古蹟,觀音信仰中心",
    lodging: {
      nameZh: "龍山寺香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 22,
    nameZh: "竹山紫南宮",
    mainDeity: "土地公",
    addressZh: "南投縣竹山鎮大公街40號",
    phone: "+886-49-262-0285",
    website: "http://www.luck.com.tw",
    lat: 23.7611,
    lng: 120.6822,
    region: "Central",
    foundedYear: null,
    history: "借金發財聞名的土地公廟",
    lodging: {
      nameZh: "紫南宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  },
  {
    id: 23,
    nameZh: "烘爐地南山福德宮",
    mainDeity: "土地公",
    addressZh: "新北市中和區興南路二段399巷57弄20號",
    phone: "+886-2-2942-7399",
    website: "https://www.facebook.com/HongludiTemple/",
    lat: 24.9972,
    lng: 121.5014,
    region: "North",
    foundedYear: null,
    history: "北部最大土地公廟",
    lodging: null,
    landingType: null,
    landingNote: null
  },
  {
    id: 24,
    nameZh: "知本天后宮",
    mainDeity: "媽祖",
    addressZh: "台東縣台東市知本路三段152巷8號",
    phone: "+886-89-512-593",
    website: "https://www.facebook.com/ZhibenMazuTemple/",
    lat: 22.7086,
    lng: 121.1028,
    region: "East",
    foundedYear: null,
    history: "台東地區媽祖信仰中心",
    lodging: {
      nameZh: "知本天后宮香客大樓",
      noteZh: null
    },
    landingType: null,
    landingNote: null
  }
];
