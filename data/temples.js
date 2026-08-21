// 台灣進香地圖 — 廟宇節點資料(Temple)
// 資料模型:docs/CONCEPT.md「三、資料模型草案」
//
// 語言政策(D6,2026-08-18):中文為主;nameEn/addressEn 僅精選落地點提供
// landingType:"歷史登陸點" | "開基廟" | "祖廟" | "分香子廟" | null(一般廟宇)
// foundedYear:僅高信心時填寫,其餘 null(沿革待考者不填年代)
// lodging:香客大樓屬性(D5,2026-08-18 舊 pilgrim-data.js 降階併入)
// 座標:2026-08-21 依內政部 8203 登記座標複校,修正 9 處顯著偏差
//       (拱天宮1.4km/鹿耳門2.6km/佛光山6km/中台5.7km/紫南宮7.4km 等);
//       法鼓山(moi 無登記)與烘爐地南山福德宮(moi 點偏移)採 OSM 校正
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
    lat: 24.345341,
    lng: 120.623596,
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
    lat: 24.571329,
    lng: 120.709259,
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
    lat: 23.568041,
    lng: 120.304497,
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
    lat: 23.55662,
    lng: 120.3479,
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
    lat: 24.059317,
    lng: 120.431396,
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
    lat: 23.80134,
    lng: 120.460701,
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
    lat: 25.03751,
    lng: 121.5849,
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
    lat: 25.11764,
    lng: 121.463997,
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
    lat: 23.036819,
    lng: 120.125099,
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
    lat: 23.285839,
    lng: 120.143402,
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
    lat: 23.18425,
    lng: 120.262199,
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
    lat: 25.07353,
    lng: 121.515297,
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
    lat: 23.23377,
    lng: 120.180496,
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
    lat: 25.06275,
    lng: 121.533501,
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
    lat: 22.99674,
    lng: 120.202103,
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
    lat: 24.97986,
    lng: 121.586601,
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
    lat: 22.747271,
    lng: 120.446297,
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
    lat: 25.24095,
    lng: 121.614813,
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
    lat: 24.009319,
    lng: 120.944199,
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
    lat: 25.036779,
    lng: 121.499901,
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
    lat: 23.81646,
    lng: 120.722702,
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
    lat: 24.971837,
    lng: 121.49756,
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
  },
  {
    id: 25,
    nameZh: "澎湖天后宮",
    nameEn: "Penghu Tianhou Temple",
    mainDeity: "媽祖",
    addressZh: "澎湖縣馬公市正義街1號",
    phone: null,
    website: null,
    lat: 23.56469,
    lng: 119.564003,
    region: "Islands",
    foundedYear: null,
    history: "全台歷史最悠久的媽祖廟(相傳創建於明萬曆年間)",
    lodging: null,
    landingType: "開基廟",
    landingNote: "相傳1592年(明萬曆20年)前即已建廟,為全台最古媽祖廟(確切年代待考)"
  },
  {
    id: 26,
    nameZh: "開基武廟",
    nameEn: "Kaiji Wu Miao (Tainan)",
    mainDeity: "關聖帝君",
    addressZh: "台南市中西區新美街114號",
    phone: null,
    website: null,
    lat: 22.996389,
    lng: 120.200798,
    region: "South",
    foundedYear: null,
    history: "相傳明永曆年間建,台灣最早關帝廟之一,俗稱小關帝廟",
    lodging: null,
    landingType: "開基廟",
    landingNote: "相傳1669年(明永曆23年)建,與祀典武廟並為台南關帝信仰雙璧(年代待考)"
  },
  {
    id: 27,
    nameZh: "台灣首廟天壇",
    nameEn: "Tainan Tiantan Temple",
    mainDeity: "玉皇大帝",
    addressZh: "台南市中西區忠義路二段84巷16號",
    phone: null,
    website: null,
    lat: 22.99375,
    lng: 120.204102,
    region: "South",
    foundedYear: 1855,
    history: "俗稱天公廟,咸豐5年建於相傳明鄭祭天舊址",
    lodging: null,
    landingType: "開基廟",
    landingNote: "台灣主祀玉皇大帝的代表性古廟(1855;相傳廟址為明鄭祭天之處)"
  },
  {
    id: 28,
    nameZh: "開基玉皇宮",
    nameEn: "Kaiji Yuhuang Temple",
    mainDeity: "玉皇大帝",
    addressZh: "台南市北區佑民街111號",
    phone: null,
    website: null,
    lat: 22.999929,
    lng: 120.206902,
    region: "South",
    foundedYear: null,
    history: "俗稱天公廟,相傳明鄭時期創建,與首廟天壇並為台南天公信仰雙璧",
    lodging: null,
    landingType: "開基廟",
    landingNote: "相傳明鄭時期建(一說1669年),台南最老天公廟之一(年代待考)"
  },
  {
    id: 29,
    nameZh: "鹿港龍山寺",
    mainDeity: "觀音菩薩",
    addressZh: "彰化縣鹿港鎮金門巷81號",
    phone: null,
    website: null,
    lat: 24.050449,
    lng: 120.43545,
    region: "Central",
    foundedYear: 1786,
    history: "台灣現存最完整清代建築格局的寺廟之一(國定古蹟);乾隆51年遷建今址,創建年代更早",
    lodging: null,
    landingType: null,
    landingNote: null
  },
  {
    id: 30,
    nameZh: "鳳山龍山寺",
    mainDeity: "觀音菩薩",
    addressZh: "高雄市鳳山區中山路7號",
    phone: null,
    website: null,
    lat: 22.620661,
    lng: 120.362099,
    region: "South",
    foundedYear: null,
    history: "南台灣古老觀音寺(國定古蹟),相傳清康熙年間建",
    lodging: null,
    landingType: null,
    landingNote: null
  },
  {
    id: 31,
    nameZh: "新莊地藏庵",
    mainDeity: "地藏菩薩",
    addressZh: "新北市新莊區中正路84號",
    phone: null,
    website: null,
    lat: 25.03717,
    lng: 121.457001,
    region: "North",
    foundedYear: null,
    history: "北台灣重要地藏信仰中心,相傳乾隆22年(1757)建",
    lodging: null,
    landingType: null,
    landingNote: null
  }
];
