// 台灣進香地圖 — 源流連結資料(Lineage)
// 資料模型:docs/CONCEPT.md「三、資料模型草案」
//
// 已策展系統:媽祖(10 筆)、觀音(安海龍山寺系 3 筆)、關聖帝君(5 筆,2026-08-31 首批:
//   開基武廟/祀典武廟/行天宮/礁溪協天廟/高雄文武聖殿)。
// 玉皇(3 筆,2026-08-31 首批:沙鹿玉皇殿/開基玉皇宮/彰化元清觀;新竹天公壇僅收廟宇節點,
//   香火源流待查)、地藏(1 筆,2026-08-31 首批:九華山地藏庵;新莊地藏庵厲祀起家無唐山
//   分香記載、鹿港地藏王廟「四川天竺尊巖」說法未獲文資普查採納,皆僅收廟宇節點)。
// 阿彌陀佛(2026-08-31 首批,宗派法脈,模型見 REQUIREMENTS D10):台中佛教蓮社(印光→
//   李炳南)、妙通寺(廣欽→傳聞)、台北善導寺(日治知恩院派);台南彌陀寺為明鄭古剎,
//   源流無文獻,僅收廟宇節點。
// 齋教(2026-08-31,deity 欄位作網絡標籤,見 REQUIREMENTS D11):先天派報恩堂→擇賢堂、
//   金幢派西華堂/慎德堂、龍華派德化堂/化善堂,源頭以福建區域節點呈現。
// 文武大眾爺(2026-08-31):蘆洲文武大眾爺廟 1912 年分靈自新莊地藏庵(跨系統邊,
//   註冊表已新增文武大眾爺系統);埔里靈巖山寺承印光宗風(待查)。
// 王爺系統(2026-08-31 v3.0 首批):富美宮王船→麻豆代天府、王船漂流→南鯤鯓代天府、
//   南鯤鯓→茄萣萬福宮(1795,區公所明載)、南鯤鯓→哈瑪星代天宮(1949,移民分靈);
//   東港東隆宮(溫府千歲)僅收廟宇節點(源流為先民攜香火,無祖廟記載)。
// 鸞堂系統(2026-08-31 v3.0):九份明聖宮、新店明聖宮分靈自礁溪協天廟(待查);
//   志心堂/德顯堂/明聖堂/聖天堂未立案、無可定位資訊,暫不收錄。
// 二輪補查(2026-08-31):礁溪協天廟→頭城關帝廟(分香+謁祖,蘭博出處);行天宮源流
//   二說(覺修宮/協天廟)以兩邊並存標存爭議;新竹天公壇承清末金闕殿系統(1909 合祀,
//   總督府檔案);鹿港地藏王廟改採泉州對渡移民敘事(張志相2015 考證,四川天竺尊巖
//   說時序不合)。
//
// 欄位說明:
//   deity:            神明系統(與 temples.mainDeity 對應,外部源頭亦標註系統名)
//   fromTempleId:     起點廟宇(本資料集內的 temple id)——與 fromExternalName 恰好擇一
//   fromExternalName: 起點為外部節點(中國祖廟、已消失古廟、歷史事件主體等)
//   toTempleId:       終點廟宇(必須存在於 temples)
//   relation:         "分香" | "謁祖進香" | "割火" | "遶境" | "承繼" | "法脈"
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
  },
  {
    id: 23,
    deity: "阿彌陀佛",
    fromExternalName: "蘇州靈巖山寺(印光大師道場,中國江蘇)",
    toTempleId: 39,
    relation: "法脈",
    year: 1950,
    status: "確定",
    note: "雪公李炳南1930年代通信皈依淨土宗十三祖印光大師(賜法名德明),1933年於蘇州報國寺面謁;1950年與諸居士創台中市佛教蓮社,社歌「接統靈巖十三葉,蓮花一瓣分臺中」。印光晚年駐錫靈巖山寺,靈巖為此法系象徵",
    source: "闞正宗《1949年之後台灣佛教的區域性格》(2002,台灣佛教數位博物館);《佛教圖書館館刊》48期;台中市佛教蓮社官網",
    evidenceUrl: "http://buddhistinformatics.dila.edu.tw/taiwanbuddhism/formosa/people/4-li-bingnan.html"
  },
  {
    id: 24,
    deity: "阿彌陀佛",
    fromExternalName: "承天禪寺(新北土城,廣欽老和尚道場)",
    toTempleId: 40,
    relation: "法脈",
    year: 1981,
    status: "確定",
    note: "廣欽老和尚(1892-1986)1927年於泉州承天寺披剃,1947年渡台,1955年起闢建土城承天禪寺並命名「清源山承天禪寺」遙念祖庭;1980年底囑弟子傳聞法師南下尋地,1981年於六龜興建妙通寺,1984年移錫於此並圓寂",
    source: "妙通寺官網《廣欽老和尚生平》;承天禪寺官網",
    evidenceUrl: "https://www.twmtt.org/article_detail/54"
  },
  {
    id: 25,
    deity: "阿彌陀佛",
    fromExternalName: "知恩院(日本淨土宗大本山,京都)",
    toTempleId: 42,
    relation: "法脈",
    year: 1929,
    status: "確定",
    note: "1929年日本淨土宗知恩院派僧人世良義成、田村智學創「淨土宗台北開教院」(善導寺前身),為日治時期淨土宗在台布教中心;1948年交李子寬居士,1954年核定今名",
    source: "台北善導寺官網沿革;維基百科善導寺條目",
    evidenceUrl: "https://www.shandaotemple.org.tw/sd2.htm"
  },
  {
    id: 26,
    deity: "齋教",
    fromExternalName: "福建(齋教諸派渡台源,中國)",
    toTempleId: 43,
    relation: "法脈",
    year: 1861,
    status: "確定",
    note: "先天派(萬全堂系)咸豐年間傳台:林金祖指派黃昌成自福建來台,1861年建報恩堂,為先天派在台祖堂",
    source: "內政部臺灣宗教文化地圖(臺南報恩堂);維基百科齋教條",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=98"
  },
  {
    id: 27,
    deity: "齋教",
    fromTempleId: 43,
    toTempleId: 44,
    relation: "分香",
    year: 1879,
    status: "確定",
    note: "光緒5年(1879)先天派齋友黃昌泰、葉昌貞、古昌端等創建擇賢堂,為報恩堂分堂;捐款者多為美濃六堆客家人",
    source: "內政部臺灣宗教文化地圖(臺南擇賢堂)",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=97"
  },
  {
    id: 28,
    deity: "齋教",
    fromExternalName: "福建(齋教諸派渡台源,中國)",
    toTempleId: 45,
    relation: "法脈",
    year: 1750,
    status: "確定",
    note: "金幢派翁永峰系;乾隆15年(1750)鍾、翁、吳、劉四位齋友自福建來台傳教,籌資二千銀元共建西華堂,全台唯一金幢派翁公支派齋堂",
    source: "內政部臺灣宗教文化地圖(臺南西華堂)",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=96"
  },
  {
    id: 29,
    deity: "齋教",
    fromExternalName: "福建(齋教諸派渡台源,中國)",
    toTempleId: 46,
    relation: "法脈",
    year: 1837,
    status: "確定",
    note: "龍華派漢陽堂系;道光17年(1837)謝普爵等五人發起創建德化堂,謝普爵與其師盧普濤同闡齋教",
    source: "文化部國家文化資產網(臺南德化堂沿革)",
    evidenceUrl: "https://nchdb.boch.gov.tw/assets/overview/monument/19851127000051"
  },
  {
    id: 30,
    deity: "齋教",
    fromExternalName: "福建(齋教諸派渡台源,中國)",
    toTempleId: 47,
    relation: "法脈",
    year: null,
    status: "待查",
    note: "一說乾隆30年(1765)龍華派齋友建於安平,為漢陽堂在台最早據點;僅見維基齋教條(引張崑振《台灣的老齋堂》)",
    source: "維基百科齋教條(引張崑振《台灣的老齋堂》,2003)",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E9%BD%8B%E6%95%99"
  },
  {
    id: 31,
    deity: "齋教",
    fromExternalName: "福建(齋教諸派渡台源,中國)",
    toTempleId: 48,
    relation: "法脈",
    year: null,
    status: "待查",
    note: "一說乾隆年間金幢派樹德堂弟子來台南佈教所建慎德堂,有全台最早齋堂之稱;僅見維基齋教條,年代無確證",
    source: "維基百科齋教條(引張崑振《台灣的老齋堂》,2003)",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E9%BD%8B%E6%95%99"
  },
  {
    id: 32,
    deity: "文武大眾爺",
    fromTempleId: 31,
    toTempleId: 49,
    relation: "分香",
    year: 1912,
    status: "確定",
    note: "民國元年(1912)自新莊地藏庵分靈文武大眾爺至蘆洲;維基另載1934年擴建時自新莊地藏庵、八里大眾廟迎香火(兩說並陳)。新莊地藏庵兼祀地藏與文武大眾爺,此邊屬大眾爺系統",
    source: "蘆洲區公所名勝古蹟頁;維基百科",
    evidenceUrl: "https://www.luzhou.ntpc.gov.tw/home.jsp?id=8b767bd17dc29316"
  },
  {
    id: 33,
    deity: "阿彌陀佛",
    fromExternalName: "蘇州靈巖山寺(印光大師道場,中國江蘇)",
    toTempleId: 50,
    relation: "法脈",
    year: 1984,
    status: "待查",
    note: "妙蓮法師1941年受戒後於蘇州靈巖山寺參學,1949年赴香港閉關,1984年於埔里創台灣靈巖山寺,「頗有大陸靈巖山寺印祖之遺風」;屬宗風承繼,非剃度或皈依之直接師承",
    source: "台灣佛教數位博物館《妙蓮法師》(資料源:靈巖山寺全球資訊網)",
    evidenceUrl: "https://dlbs.liberal.ntu.edu.tw/museum/formosa/people/1-miao-lian.html"
  },
  {
    id: 34,
    deity: "關聖帝君",
    fromTempleId: 32,
    toTempleId: 51,
    relation: "分香",
    year: null,
    status: "確定",
    note: "頭城關帝廟開基二帝君由礁溪協天廟分靈;老二帝及關平太子、周倉將軍三尊以蘇澳山區樟木雕製;大正6年(1917)設廟(分靈確切年代未載)",
    source: "蘭陽博物館電子報138期〈頭城寺廟分論-關帝廟〉(節錄自陳進傳等《人與神共構:頭城的寺廟信仰》)",
    evidenceUrl: "https://www.lym.gov.tw/ch/collection/epaper/epaper-detail/Page1760000891313/"
  },
  {
    id: 35,
    deity: "關聖帝君",
    fromTempleId: 51,
    toTempleId: 32,
    relation: "謁祖進香",
    year: null,
    status: "確定",
    note: "頭城關帝廟每年正月11日回礁溪協天廟祖廟謁祖過火",
    source: "蘭陽博物館電子報138期〈頭城寺廟分論-關帝廟〉(節錄自陳進傳等《人與神共構:頭城的寺廟信仰》)",
    evidenceUrl: "https://www.lym.gov.tw/ch/collection/epaper/epaper-detail/Page1760000891313/"
  },
  {
    id: 36,
    deity: "關聖帝君",
    fromTempleId: 32,
    toTempleId: 15,
    relation: "分香",
    year: 1943,
    status: "存爭議",
    note: "行天宮源流二說並存:行天宮系統自述1943年覺修宮分靈五恩主(見另一邊);媒體與協天廟側記載稱行天宮承協天廟香火(維基協天廟條「或說」,PeoPo報導)。行天宮官網沿革頁未載協天廟",
    source: "維基百科礁溪協天廟條;PeoPo公民新聞(2020)",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E7%A4%81%E6%BA%AA%E5%8D%94%E5%A4%A9%E5%BB%9F"
  },
  {
    id: 37,
    deity: "玉皇大帝",
    fromExternalName: "清末東門天公壇(新竹,1909年拆除)",
    toTempleId: 36,
    relation: "承繼",
    year: 1909,
    status: "確定",
    note: "明治42年(1909)新竹市區改正,東門天公壇奉令拆除,神體合祀於客雅庄金闕殿(今新竹天公壇前身);清末新竹原有兩座天公廟,今廟承金闕殿系統",
    source: "《臺灣總督府公文類纂》V01572/A018(溫國良編譯,臺灣文獻館2008),轉引自維基百科新竹天公壇條",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E6%96%B0%E7%AB%B9%E5%A4%A9%E5%85%AC%E5%A3%87"
  },
  {
    id: 38,
    deity: "地藏菩薩",
    fromExternalName: "泉州府城(漳泉渡台香火源,中國福建)",
    toTempleId: 38,
    relation: "分香",
    year: null,
    status: "待查",
    note: "乾隆49年(1784)鹿港與泉州蚶江對渡後,漢人入居請來地藏王菩薩(文資調查沿革);廟存咸豐甲寅石爐為泉州石獅鋪錦黃姓移民所贈;惟「分香自泉州某地藏道場」查無文獻,「四川天竺尊巖」說時序與學界考證不合",
    source: "文化部國家文化資產網(鹿港地藏王廟沿革,2022調查);張志相〈從地藏信仰源流看鹿港地藏王廟創建沿革與祀神〉(2015)",
    evidenceUrl: "https://nchdb.boch.gov.tw/assets/overview/monument/19851127000023"
  },
  {
    id: 39,
    deity: "關聖帝君",
    fromTempleId: 32,
    toTempleId: 52,
    relation: "分香",
    year: null,
    status: "待查",
    note: "九份明聖宮主祀協天大帝(關聖帝君),金尊分靈自礁溪協天廟,廟史逾七十六年;九份礦業山城的信仰中心",
    source: "維基百科九份明聖宮條;寺廟巡禮(老大的部落格)",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E4%B9%9D%E4%BB%BD%E6%98%8E%E8%81%96%E5%AE%AE"
  },
  {
    id: 40,
    deity: "關聖帝君",
    fromTempleId: 32,
    toTempleId: 53,
    relation: "分香",
    year: null,
    status: "待查",
    note: "戰後協天廟鸞生系統北傳之一:柯金生至台北青潭創建明聖宮(前身誘義堂,一說1946年);今主祀謝映登仙翁、併祀關聖帝君",
    source: "維基百科礁溪協天廟條;udn部落格(前身誘義堂1946之說)",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E7%A4%81%E6%BA%AA%E5%8D%94%E5%A4%A9%E5%BB%9F"
  },
  {
    id: 41,
    deity: "五府千歲",
    fromExternalName: "泉郡富美宮(中國福建泉州)",
    toTempleId: 12,
    relation: "分香",
    year: null,
    status: "待查",
    note: "廟方沿革稱明崇禎年間泉邑啟建王醮,晉江縣富美宮李、池、吳三尊千歲隨王船東巡,航靠蔴荳港,先民立地築茅奉祀;永曆16年(1662)改建磚造神殿(王船渡台為相傳性質)",
    source: "麻豆代天府官網沿革",
    evidenceUrl: "https://www.5god.com.tw/11.html"
  },
  {
    id: 42,
    deity: "五府千歲",
    fromExternalName: "五府千歲王船(相傳漂至南鯤鯓沙汕)",
    toTempleId: 11,
    relation: "分香",
    year: null,
    status: "待查",
    note: "相傳明末王船漂至南鯤鯓海邊沙汕,船上供奉李、池、吳、朱、范五府千歲;康熙初年建廟,嘉慶22年(1817)遷建槺榔山現址",
    source: "內政部臺灣宗教文化地圖;文化部國家文化資產網(國定古蹟沿革)",
    evidenceUrl: "https://taiwangods.moi.gov.tw/html/landscape/1_0011.aspx?i=73"
  },
  {
    id: 43,
    deity: "五府千歲",
    fromTempleId: 11,
    toTempleId: 55,
    relation: "分香",
    year: 1949,
    status: "待查",
    note: "民國38年(1949)旅居哈瑪星的北門郡移民募款建廟,奉祀自家鄉南鯤鯓代天府分靈之五府千歲(並祀蚵寮保安宮池府千歲等);現為高雄市市定古蹟",
    source: "維基百科哈瑪星代天宮條",
    evidenceUrl: "https://zh.wikipedia.org/wiki/%E5%93%88%E7%91%AA%E6%98%9F%E4%BB%A3%E5%A4%A9%E5%AE%AE"
  },
  {
    id: 44,
    deity: "五府千歲",
    fromTempleId: 11,
    toTempleId: 56,
    relation: "分香",
    year: 1795,
    status: "確定",
    note: "白砂崙萬福宮創建於乾隆60年(1795),區公所沿革明載「奉祀主神為五府千歲,源自南鯤鯓代天府」,並具列五王名諱",
    source: "高雄市茄萣區公所寺廟介紹(萬福宮)",
    evidenceUrl: "https://cieding.kcg.gov.tw/cp.aspx?n=D8098ECCC18BED49"
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
  },
  {
    name: "蘇州靈巖山寺(印光大師道場,中國江蘇)",
    lat: 31.26433,
    lng: 120.49714
  },
  {
    name: "承天禪寺(新北土城,廣欽老和尚道場)",
    lat: 24.95067,
    lng: 121.446297
  },
  {
    name: "知恩院(日本淨土宗大本山,京都)",
    lat: 35.005622,
    lng: 135.783539
  },
  {
    name: "福建(齋教諸派渡台源,中國)",
    lat: 26.077495,
    lng: 119.291822
  },
  {
    name: "清末東門天公壇(新竹,1909年拆除)",
    lat: 24.804211,
    lng: 120.970256
  },
  {
    name: "泉郡富美宮(中國福建泉州)",
    lat: 24.894586,
    lng: 118.582945
  },
  {
    name: "五府千歲王船(相傳漂至南鯤鯓沙汕)",
    lat: 23.28,
    lng: 120.1
  }
];
