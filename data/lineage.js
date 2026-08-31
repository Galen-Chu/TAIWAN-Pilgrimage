// 台灣進香地圖 — 源流連結資料(Lineage)
// 資料模型:docs/CONCEPT.md「三、資料模型草案」
//
// 已策展系統:媽祖(10 筆)、觀音(安海龍山寺系 3 筆)、關聖帝君(5 筆,2026-08-31 首批:
//   開基武廟/祀典武廟/行天宮/礁溪協天廟/高雄文武聖殿)。
// 玉皇(3 筆,2026-08-31 首批:沙鹿玉皇殿/開基玉皇宮/彰化元清觀;新竹天公壇僅收廟宇節點,
//   香火源流待查)、地藏(1 筆,2026-08-31 首批:九華山地藏庵;新莊地藏庵厲祀起家無唐山
//   分香記載、鹿港地藏王廟「四川天竺尊巖」說法未獲文資普查採納,皆僅收廟宇節點)。
// 阿彌陀佛:民間分香源流不適用(佛教宗派脈絡),待另行策展。
//
// 欄位說明:
//   deity:            神明系統(與 temples.mainDeity 對應,外部源頭亦標註系統名)
//   fromTempleId:     起點廟宇(本資料集內的 temple id)——與 fromExternalName 恰好擇一
//   fromExternalName: 起點為外部節點(中國祖廟、已消失古廟、歷史事件主體等)
//   toTempleId:       終點廟宇(必須存在於 temples)
//   relation:         "分香" | "謁祖進香" | "割火" | "遶境" | "承繼"
//   year:             事實年份(數字)或不詳(null)
//   status:           "確定" | "存爭議" | "待查"
//   source:           出處(策展原則:每筆源流都應可查證;「待補」者表示待填具體文獻)
//   evidenceUrl:      可查證連結(廟方官網/政府文化資產網;可缺)
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
    note: "明萬曆年間澎湖已有天妃宮(俗稱媽祖宮);萬曆32年(1604)沈有容諭退荷軍碑為最早可靠史料,經考據為全台第一座媽祖廟",
    source: "內政部臺灣宗教文化地圖(澎湖天后宮,國定古蹟);澎湖縣政府文化局《2010澎湖縣文化資產手冊》",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=22"
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
    source: "北港朝天宮沿革",
    evidenceUrl: "https://www.matsu.org.tw"
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
    source: "台南大天后宮官網沿革(康熙年間);官網另刊蔣維錟〈臺南大天后宮淵源新考〉修正施琅改建說",
    evidenceUrl: "https://www.gtainanmazu.org.tw/?act=menuinfo&ml_id=20211026006"
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
    source: "鹿耳門天后宮沿革",
    evidenceUrl: "http://www.luerhmen.org.tw"
  },
  {
    id: 5,
    deity: "媽祖",
    fromExternalName: "笨港天后宮(清康熙年間建,今已不存)",
    toTempleId: 4,
    relation: "承繼",
    year: 1811,
    status: "存爭議",
    note: "嘉慶年間笨港天后宮因水患遷建;奉天宮沿革稱嘉慶16年(1811)王得祿倡建落成,文化資產登錄資料採嘉慶23年(1818)現址再建說。北港朝天宮與新港奉天宮各自主張承繼笨港香火",
    source: "新港奉天宮官網歷史沿革;文化部文化資產網(新港奉天宮,縣定古蹟)",
    evidenceUrl: "https://www.hsinkangmazu.org.tw/?act=menuinfo&ml_id=20231221002"
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
    source: "大甲鎮瀾宮沿革與歷年媒體報導(1987 湄洲直航謁祖)",
    evidenceUrl: "http://www.dajiamazu.org.tw"
  },
  {
    id: 7,
    deity: "媽祖",
    fromTempleId: 2,
    toTempleId: 3,
    relation: "謁祖進香",
    year: null,
    status: "確定",
    note: "白沙屯媽祖徒步進香每年往返北港朝天宮,路線與日程由媽祖旨意決定",
    source: "白沙屯拱天宮沿革;文化部文化資產「白沙屯媽祖進香」(國家重要民俗,2010 登錄)",
    evidenceUrl: "https://nchdb.boch.gov.tw/assets/overview/folklore/20100618000007"
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
    source: "大甲鎮瀾宮沿革(1988 年前進香北港)",
    evidenceUrl: "http://www.dajiamazu.org.tw"
  },
  {
    id: 9,
    deity: "媽祖",
    fromTempleId: 1,
    toTempleId: 4,
    relation: "遶境",
    year: 1988,
    status: "確定",
    note: "大甲媽祖遶境進香(九天八夜)自1988年起以新港奉天宮為目的地",
    source: "大甲鎮瀾宮沿革;文化部文化資產「大甲媽祖遶境進香」(國家重要民俗,2008 登錄)",
    evidenceUrl: "https://nchdb.boch.gov.tw/assets/overview/folklore/20080704000002"
  },
  {
    id: 10,
    deity: "媽祖",
    fromExternalName: "湄洲媽祖祖廟(中國福建莆田)",
    toTempleId: 5,
    relation: "分香",
    year: null,
    status: "待查",
    note: "鹿港天后宮(舊祖宮)沿革稱創建於明末,康熙22年(1683)施琅征台所奉湄洲開基媽祖留鎮鹿港,自稱台灣唯一奉祀湄洲祖廟開基媽祖神尊的廟宇;源流說法多種,待考",
    source: "鹿港天后宮官網歷史沿革",
    evidenceUrl: "https://www.lugangmazu.org/history/"
  },
  {
    id: 11,
    deity: "觀音菩薩",
    fromExternalName: "安海龍山寺(中國福建晉江)",
    toTempleId: 21,
    relation: "分香",
    year: 1738,
    status: "確定",
    note: "泉州晉江移民自安海龍山寺迎請觀音佛祖來艋舺建寺(廟史沿革記載)",
    source: "艋舺龍山寺沿革",
    evidenceUrl: "http://www.lungshan.org.tw"
  },
  {
    id: 12,
    deity: "觀音菩薩",
    fromExternalName: "安海龍山寺(中國福建晉江)",
    toTempleId: 29,
    relation: "分香",
    year: null,
    status: "確定",
    note: "台灣諸龍山寺多溯源自安海龍山寺;鹿港龍山寺前身一說1653年肇善禪師創建於鹿仔港舊河道邊,乾隆51年(1786)泉州人陳邦光倡議遷建現址",
    source: "內政部臺灣宗教文化地圖(鹿港龍山寺,國定古蹟);文化部文化資產網",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=10"
  },
  {
    id: 13,
    deity: "觀音菩薩",
    fromExternalName: "安海龍山寺(中國福建晉江)",
    toTempleId: 30,
    relation: "分香",
    year: null,
    status: "待查",
    note: "相傳泉州移民攜安海龍山寺觀音香火渡台,掛於古井石榴樹顯靈而建寺;官網自述創建年代缺乏正式考證(康熙末年/乾隆初年二說,寺方自認康熙年間)",
    source: "鳳山龍山寺官網歷史沿革;文化部文化資產網(國定古蹟)",
    evidenceUrl: "https://www.longshansi.org.tw/?act=menuinfo&ml_id=20211207002"
  },
  {
    id: 14,
    deity: "關聖帝君",
    fromExternalName: "泉州塗門關帝廟(今通淮關岳廟,中國福建)",
    toTempleId: 26,
    relation: "分香",
    year: null,
    status: "待查",
    note: "相傳明鄭時期鄭成功部將自泉州塗門關帝廟奉請二關聖帝君神像來台,明永曆23年(1669)於承天府西定坊建廟,廟前港口因而得名關帝港",
    source: "內政部臺灣宗教文化地圖(開基武廟)",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=241"
  },
  {
    id: 15,
    deity: "關聖帝君",
    fromExternalName: "荊州關羽祠(中國湖北)",
    toTempleId: 16,
    relation: "分香",
    year: null,
    status: "存爭議",
    note: "祀典武廟前身為明永曆19年(1665)寧靖王府一元子園關帝廳;廟方稱鎮殿『開基二關帝』為寧靖王自荊州關羽祠奉請渡台,另有源於福建東山關帝廟之說",
    source: "祀典武廟官網武廟歷史/祭祀神祇頁(荊州說);中國《福建日報》等文獻採東山分靈說",
    evidenceUrl: "https://www.twsdwumiao.org.tw/?act=menuinfo&ml_id=20210514003"
  },
  {
    id: 16,
    deity: "關聖帝君",
    fromExternalName: "東山關帝廟(中國福建漳州)",
    toTempleId: 32,
    relation: "分香",
    year: 1781,
    status: "確定",
    note: "開基『老二帝』相傳清乾隆46年(1781)林應獅等自福建銅山(東山)關帝廟分靈,經廈門渡海於滬尾登岸,越草嶺古道入噶瑪蘭;嘉慶9年(1804)建廟。1991年起組團赴東山祖廟謁祖",
    source: "礁溪協天廟官網緣起沿革;國家文化記憶庫(宜蘭縣政府文化局)",
    evidenceUrl: "https://www.sttemple.org/index/index-04-1.htm"
  },
  {
    id: 17,
    deity: "關聖帝君",
    fromExternalName: "澎湖紅毛城武聖廟(紅木埕武聖廟)",
    toTempleId: 33,
    relation: "分香",
    year: 1921,
    status: "確定",
    note: "民國10年(1921)關聖帝君聖誕,高雄信眾決議奉請澎湖紅毛城武聖廟神尊來台值年輪祀,後立武聖殿,1956年文武合祀成今貌;紅毛城武聖廟本身相傳為明鄭銅山水寨官兵自銅山(東山)分靈",
    source: "高雄文武聖殿官網;高雄市立歷史博物館「高雄小故事」",
    evidenceUrl: "https://www.kwwt.org.tw/"
  },
  {
    id: 18,
    deity: "關聖帝君",
    fromExternalName: "覺修宮(台北市)",
    toTempleId: 15,
    relation: "分香",
    year: 1943,
    status: "待查",
    note: "1943年空真子師父等於台北永樂町設「行天堂」,敬奉相傳由覺修宮分靈而來的五恩主(以關聖帝君為首),為行天宮淵源之始;行天宮官網沿革頁未明載覺修宮分靈一事",
    source: "維基百科行天宮條目(引行天宮出版品《行天之道》);行天宮官網沿革頁",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E8%A1%8C%E5%A4%A9%E5%AE%AE"
  },
  {
    id: 19,
    deity: "玉皇大帝",
    fromExternalName: "同安縣祖廟(廟名未載,中國福建泉州)",
    toTempleId: 34,
    relation: "分香",
    year: 1803,
    status: "確定",
    note: "嘉慶8年(1803)先民何聲良自泉州府同安縣祖廟恭請玉皇上帝香火來台,嘉慶10年(1805)大肚中堡五十三庄共建玉皇殿",
    source: "沙鹿玉皇殿官網沿革;臺中市沙鹿區公所寺廟沿革",
    evidenceUrl: "https://www.yuhuang.tw/about/history.html"
  },
  {
    id: 20,
    deity: "玉皇大帝",
    fromExternalName: "泉州府城(漳泉渡台香火源,中國福建)",
    toTempleId: 28,
    relation: "分香",
    year: null,
    status: "待查",
    note: "官網沿革(引《臺灣地名辭書》卷廿一)稱明末漳泉人士恭請玉皇上帝香火與玉皇四太子神像渡台,肇於荷據、建於明鄭,安奉尖山頂;建廟年代另有一說1670年",
    source: "開基玉皇宮官網沿革(引《臺灣地名辭書》)",
    evidenceUrl: "https://jadeemperor.armsdatasolution.com/history"
  },
  {
    id: 21,
    deity: "玉皇大帝",
    fromExternalName: "泉州府城(漳泉渡台香火源,中國福建)",
    toTempleId: 35,
    relation: "分香",
    year: 1763,
    status: "待查",
    note: "乾隆28年(1763)溫陵(泉州晉江)移民集資共建元清觀,前身為神明會;建廟史實依國定古蹟登錄沿革,香火渡台細節未載",
    source: "文化部國家文化資產網(彰化元清觀沿革)",
    evidenceUrl: "https://nchdb.boch.gov.tw/assets/overview/monument/19850819000063"
  },
  {
    id: 22,
    deity: "地藏菩薩",
    fromExternalName: "九華山(地藏菩薩道場,中國安徽)",
    toTempleId: 37,
    relation: "分香",
    year: null,
    status: "待查",
    note: "康熙55年(1716)北路營守備游崇功募建邑厲壇(《諸羅縣志》);金身相傳明末自安徽九華山輾轉隨鄭成功護持來台(嘉義市記憶庫載,據傳性質);1946年起「過爐」民俗",
    source: "九華山地藏庵官網沿革(引《諸羅縣志》);嘉義市記憶庫",
    evidenceUrl: "https://cydza1717.org.tw/about"
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
  },
  {
    name: "安海龍山寺(中國福建晉江)",
    lat: 24.72,
    lng: 118.445
  },
  {
    name: "泉州塗門關帝廟(今通淮關岳廟,中國福建)",
    lat: 24.904831,
    lng: 118.588388
  },
  {
    name: "荊州關羽祠(中國湖北)",
    lat: 30.350253,
    lng: 112.178178
  },
  {
    name: "東山關帝廟(中國福建漳州)",
    lat: 23.737172,
    lng: 117.531821
  },
  {
    name: "澎湖紅毛城武聖廟(紅木埕武聖廟)",
    lat: 23.573158,
    lng: 119.575211
  },
  {
    name: "覺修宮(台北市)",
    lat: 25.076178,
    lng: 121.513649
  },
  {
    name: "同安縣祖廟(廟名未載,中國福建泉州)",
    lat: 24.726117,
    lng: 118.146788
  },
  {
    name: "泉州府城(漳泉渡台香火源,中國福建)",
    lat: 24.910571,
    lng: 118.545742
  },
  {
    name: "九華山(地藏菩薩道場,中國安徽)",
    lat: 30.463426,
    lng: 117.818174
  }
];
