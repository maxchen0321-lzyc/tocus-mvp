import type { Topic } from "./notion-types";

// Mock data derived from the Notion MVP structure.
// Replace this with API data once backend integration is ready.
export const mockTopics: Topic[] = [
  {
    id: "policy-001",
    title: "都會區是否應全面推行共享單車免費前 30 分鐘？",
    context:
      "多個城市考慮補貼共享單車，降低通勤成本，但也擔心交通管理與維護成本上升。",
    publishedAt: "2026-01-02T08:30:00+08:00",
    category: "公共政策",
    articles: [
      {
        id: "policy-001-pro",
        stance: "pro",
        title: "共享單車補貼能擴大低碳通勤",
        author: "城市交通研究室",
        publishedAt: "2026-01-02T10:00:00+08:00",
        content: [
          { type: "heading", text: "導言：低碳通勤的必要性" },
          {
            type: "paragraph",
            text: "都會區交通排放量持續攀升，短程移動若能轉向自行車，有助於減少碳排與噪音。"
          },
          { type: "heading", text: "論點一：免費前 30 分鐘降低嘗試門檻" },
          {
            type: "paragraph",
            text: "多數人願意嘗試共享單車，但成本與安全疑慮仍是阻力。免費政策能降低嘗試門檻並建立習慣。"
          },
          {
            type: "paragraph",
            text: "一旦形成日常通勤使用，整體交通量可獲得長期改善。"
          },
          { type: "heading", text: "論點二：接駁大眾運輸的最後一哩" },
          {
            type: "paragraph",
            text: "在捷運與公車站周邊，短距離接駁是提升公共運輸使用率的關鍵。"
          },
          { type: "heading", text: "論點三：補貼有機會帶動城市更新" },
          {
            type: "paragraph",
            text: "共享單車需求增加，迫使城市改善自行車道與停車設施，進一步提升街道安全與步行友善。"
          },
          { type: "heading", text: "反駁：維護成本可能擴大財政負擔" },
          {
            type: "paragraph",
            text: "反對者認為補貼會增加財政負擔，但可透過差異化補貼與使用者教育降低浪費。"
          },
          { type: "heading", text: "結論：以低碳收益回收公共投資" },
          {
            type: "paragraph",
            text: "短期補貼可換得長期交通與健康效益，需搭配管理機制才能發揮最大效益。"
          }
        ]
      },
      {
        id: "policy-001-con",
        stance: "con",
        title: "免費補貼可能導致浪費與失序",
        author: "市政監督聯盟",
        publishedAt: "2026-01-02T12:30:00+08:00",
        content: [
          { type: "heading", text: "導言：補貼政策未必等於好政策" },
          {
            type: "paragraph",
            text: "共享單車的普及不代表要全面免費，補貼政策必須衡量管理成本。"
          },
          { type: "heading", text: "論點一：免費易造成短期濫用" },
          {
            type: "paragraph",
            text: "免費使用容易讓車輛被隨意丟棄或過度占用，造成管理與維護成本提升。"
          },
          { type: "heading", text: "論點二：行政成本被忽略" },
          {
            type: "paragraph",
            text: "補貼政策需要額外的稽核與配套，若執行不足，反而會降低服務品質。"
          },
          { type: "heading", text: "論點三：市場機制能自然篩選" },
          {
            type: "paragraph",
            text: "合理收費能讓真正有需求者使用，也能確保業者有資金維護。"
          },
          { type: "heading", text: "反駁：低收入族群交通權益" },
          {
            type: "paragraph",
            text: "應提供針對性補貼給低收入或通勤族群，而不是全面免費。"
          },
          { type: "heading", text: "結論：精準補貼優於全面免費" },
          {
            type: "paragraph",
            text: "應以差異化補貼與管理機制取代全面免費，才能兼顧效率與公平。"
          }
        ]
      }
    ]
  },
  {
    id: "society-002",
    title: "校園是否應全面禁止手機進教室？",
    context:
      "部分學校實施手機集中管理，支持者認為可提升專注，反對者認為應培養自律而非全面禁止。",
    publishedAt: "2026-01-05T09:15:00+08:00",
    category: "社會/價值辯論",
    articles: [
      {
        id: "society-002-pro",
        stance: "pro",
        title: "禁用手機能提升專注與學習品質",
        author: "教育現場觀察",
        publishedAt: "2026-01-05T11:00:00+08:00",
        content: [
          { type: "heading", text: "導言：注意力是學習的核心資源" },
          {
            type: "paragraph",
            text: "手機通知與社群資訊容易分散注意力，對學習成效造成直接影響。"
          },
          { type: "heading", text: "論點一：避免課堂干擾" },
          {
            type: "paragraph",
            text: "手機震動與訊息提醒不僅影響當事人，也會干擾全班的學習節奏。"
          },
          { type: "heading", text: "論點二：建立一致規範" },
          {
            type: "paragraph",
            text: "一致性的規範能減少學生間的比較與不公平，教師也能更專注於教學。"
          },
          { type: "heading", text: "論點三：有效時間管理" },
          {
            type: "paragraph",
            text: "手機集中管理可以在下課時段集中使用，讓學生學習分段管理時間。"
          },
          { type: "heading", text: "反駁：自律與數位素養的重要性" },
          {
            type: "paragraph",
            text: "禁令需搭配數位素養教育，否則只是表面管理。"
          },
          { type: "heading", text: "結論：規範先行，教育同步" },
          {
            type: "paragraph",
            text: "在教室禁止手機可提升專注，但要搭配數位素養教育才能長期有效。"
          }
        ]
      },
      {
        id: "society-002-con",
        stance: "con",
        title: "全面禁止反而阻礙自律養成",
        author: "青少年發展研究會",
        publishedAt: "2026-01-05T13:00:00+08:00",
        content: [
          { type: "heading", text: "導言：管理不等於能力培養" },
          {
            type: "paragraph",
            text: "完全禁用手機短期有效，但長期可能阻礙自律能力與數位素養的養成。"
          },
          { type: "heading", text: "論點一：現代學習需要數位工具" },
          {
            type: "paragraph",
            text: "手機是資訊查詢與學習輔助工具，適度使用能促進學習效率。"
          },
          { type: "heading", text: "論點二：自律是教育的核心" },
          {
            type: "paragraph",
            text: "應在校內建立合理規範與引導，培養學生自主管理使用的能力。"
          },
          { type: "heading", text: "論點三：禁令執行難度高" },
          {
            type: "paragraph",
            text: "嚴格禁令容易造成師生衝突，執行成本高且易產生對立。"
          },
          { type: "heading", text: "反駁：注意力下降的現實" },
          {
            type: "paragraph",
            text: "應透過課堂設計與互動，提升吸引力，而非單純禁止。"
          },
          { type: "heading", text: "結論：以引導取代全面禁止" },
          {
            type: "paragraph",
            text: "更理想的作法是建立使用規範與教育引導，讓學生學會負責任使用。"
          }
        ]
      }
    ]
  },
  {
    id: "tech-003",
    title: "政府是否應強制大型平台公開演算法推薦原則？",
    context:
      "社群平台對資訊流動影響巨大，要求公開演算法透明度能否兼顧商業機密與公共利益？",
    publishedAt: "2026-01-09T14:20:00+08:00",
    category: "科技/網路治理",
    articles: [
      {
        id: "tech-003-pro",
        stance: "pro",
        title: "演算法透明化是公共治理必需",
        author: "數位治理研究中心",
        publishedAt: "2026-01-09T16:00:00+08:00",
        content: [
          { type: "heading", text: "導言：資訊流動已成公共議題" },
          {
            type: "paragraph",
            text: "平台演算法影響新聞與社會討論，透明化有助於公共監督。"
          },
          { type: "heading", text: "論點一：降低資訊操控風險" },
          {
            type: "paragraph",
            text: "透明原則能讓外界檢視是否存在偏誤，避免特定利益操控資訊。"
          },
          { type: "heading", text: "論點二：建立信任機制" },
          {
            type: "paragraph",
            text: "清楚公開推薦原則可以提升使用者信任與平台公信力。"
          },
          { type: "heading", text: "論點三：推動產業自律" },
          {
            type: "paragraph",
            text: "透明化可促使平台制定自律規範，形成可衡量的責任機制。"
          },
          { type: "heading", text: "反駁：商業機密與濫用風險" },
          {
            type: "paragraph",
            text: "應採用原則性公開而非細節公開，以兼顧商業競爭與安全。"
          },
          { type: "heading", text: "結論：原則性透明是可行折衷" },
          {
            type: "paragraph",
            text: "公開推薦原則可在公共利益與商業機密之間取得平衡。"
          }
        ]
      },
      {
        id: "tech-003-con",
        stance: "con",
        title: "強制公開恐削弱平台競爭力",
        author: "科技產業協會",
        publishedAt: "2026-01-09T18:10:00+08:00",
        content: [
          { type: "heading", text: "導言：透明化也有成本" },
          {
            type: "paragraph",
            text: "演算法是平台核心資產，強制公開可能削弱競爭力與創新能力。"
          },
          { type: "heading", text: "論點一：商業機密被迫揭露" },
          {
            type: "paragraph",
            text: "公開細節將使競爭者得以複製，削弱研發誘因。"
          },
          { type: "heading", text: "論點二：透明不等於公平" },
          {
            type: "paragraph",
            text: "即使公開原則，使用者仍難理解複雜演算法，效果有限。"
          },
          { type: "heading", text: "論點三：治理應以結果為導向" },
          {
            type: "paragraph",
            text: "與其公開原則，不如要求平台提供結果監測與外部稽核。"
          },
          { type: "heading", text: "反駁：公共利益的重要性" },
          {
            type: "paragraph",
            text: "透明化可採取第三方審核機制，降低商業機密外洩疑慮。"
          },
          { type: "heading", text: "結論：改用審核機制更實際" },
          {
            type: "paragraph",
            text: "平台可被監督，但不需全面公開核心演算法。"
          }
        ]
      }
    ]
  },
  {
    id: "policy-004",
    title: "是否應開放高齡駕照改採自願繳回？",
    context:
      "高齡駕駛事故引發關注，自願繳回制度能否兼顧安全與交通權益？",
    publishedAt: "2026-01-12T09:40:00+08:00",
    category: "公共政策",
    articles: [
      {
        id: "policy-004-pro",
        stance: "pro",
        title: "自願繳回能兼顧尊嚴與安全",
        author: "銀髮交通倡議",
        publishedAt: "2026-01-12T11:30:00+08:00",
        content: [
          { type: "heading", text: "導言：安全與尊嚴的雙重需求" },
          {
            type: "paragraph",
            text: "高齡駕駛的風險需要被正視，但政策也應尊重長者自主性。"
          },
          { type: "heading", text: "論點一：自願繳回避免污名化" },
          {
            type: "paragraph",
            text: "強制收回容易造成污名，自願制度較易被接受。"
          },
          { type: "heading", text: "論點二：搭配替代交通方案" },
          {
            type: "paragraph",
            text: "若能提供交通補貼或接駁服務，長者更願意繳回駕照。"
          },
          { type: "heading", text: "論點三：建立安全評估機制" },
          {
            type: "paragraph",
            text: "透過健康與駕駛能力評估，可引導高風險族群自願退出。"
          },
          { type: "heading", text: "反駁：是否足以降低事故？" },
          {
            type: "paragraph",
            text: "自願繳回需搭配獎勵與宣導，否則成效有限。"
          },
          { type: "heading", text: "結論：以支持性政策促進安全" },
          {
            type: "paragraph",
            text: "尊重自主與提供支持，才能讓政策真正落地。"
          }
        ]
      },
      {
        id: "policy-004-con",
        stance: "con",
        title: "自願繳回難以解決根本風險",
        author: "交通安全觀察",
        publishedAt: "2026-01-12T13:10:00+08:00",
        content: [
          { type: "heading", text: "導言：自願制度的限制" },
          {
            type: "paragraph",
            text: "若風險族群未自願退出，事故問題仍難以改善。"
          },
          { type: "heading", text: "論點一：高風險族群未必自覺" },
          {
            type: "paragraph",
            text: "部分高齡駕駛不易察覺自身能力下降，自願制度效果有限。"
          },
          { type: "heading", text: "論點二：執行成本高" },
          {
            type: "paragraph",
            text: "需要大量宣導與激勵，才能提升自願繳回比例。"
          },
          { type: "heading", text: "論點三：應以強制評估取代" },
          {
            type: "paragraph",
            text: "強制評估與定期測驗或許更有效降低事故。"
          },
          { type: "heading", text: "反駁：尊嚴與權益的考量" },
          {
            type: "paragraph",
            text: "可透過透明標準與補助方案減少衝擊。"
          },
          { type: "heading", text: "結論：需要更明確的安全機制" },
          {
            type: "paragraph",
            text: "自願繳回不足以單獨解決問題，需搭配更強制的安全管理。"
          }
        ]
      }
    ]
  },
  {
    id: "society-005",
    title: "企業是否應公開性別薪資差距？",
    context:
      "性別薪資差距揭露能否提升公平，或會增加企業負擔與誤解風險？",
    publishedAt: "2026-01-15T10:00:00+08:00",
    category: "社會/價值辯論",
    articles: [
      {
        id: "society-005-pro",
        stance: "pro",
        title: "公開差距是縮小不平等的第一步",
        author: "公平職場倡議",
        publishedAt: "2026-01-15T11:45:00+08:00",
        content: [
          { type: "heading", text: "導言：透明度促進公平" },
          {
            type: "paragraph",
            text: "薪資透明能揭露問題，促使企業改善制度。"
          },
          { type: "heading", text: "論點一：促進企業自我改善" },
          {
            type: "paragraph",
            text: "公開資料能讓企業檢視內部結構，調整偏差。"
          },
          { type: "heading", text: "論點二：社會監督力量" },
          {
            type: "paragraph",
            text: "揭露差距能引發社會討論，形成推動改革的壓力。"
          },
          { type: "heading", text: "論點三：提升人才競爭力" },
          {
            type: "paragraph",
            text: "公平薪資制度能吸引多元人才，提升企業形象。"
          },
          { type: "heading", text: "反駁：產業差異如何解釋" },
          {
            type: "paragraph",
            text: "公開時應搭配解釋背景，避免誤解。"
          },
          { type: "heading", text: "結論：以透明推動改革" },
          {
            type: "paragraph",
            text: "公開薪資差距是改善公平的必要一步。"
          }
        ]
      },
      {
        id: "society-005-con",
        stance: "con",
        title: "公開差距可能誤導與增加負擔",
        author: "企業治理觀察",
        publishedAt: "2026-01-15T13:30:00+08:00",
        content: [
          { type: "heading", text: "導言：數據需要脈絡" },
          {
            type: "paragraph",
            text: "薪資差距可能源於職位分布，直接公開容易被誤解。"
          },
          { type: "heading", text: "論點一：不同職位薪資差距正常" },
          {
            type: "paragraph",
            text: "若高薪職位集中於某性別，差距不代表歧視。"
          },
          { type: "heading", text: "論點二：行政負擔提升" },
          {
            type: "paragraph",
            text: "企業需要額外資源整理與解釋數據，增加成本。"
          },
          { type: "heading", text: "論點三：可能引發誤判" },
          {
            type: "paragraph",
            text: "簡化的數據可能被媒體誤讀，造成不必要的公關風險。"
          },
          { type: "heading", text: "反駁：透明仍有必要" },
          {
            type: "paragraph",
            text: "可透過標準化報告減少誤讀，而非完全不揭露。"
          },
          { type: "heading", text: "結論：應先完善解釋機制" },
          {
            type: "paragraph",
            text: "在充分脈絡化前，直接公開可能帶來負面效果。"
          }
        ]
      }
    ]
  },
  {
    id: "tech-006",
    title: "AI 模型訓練是否應強制取得資料授權？",
    context:
      "AI 訓練資料涉及版權爭議，要求授權能否保障創作者權益？",
    publishedAt: "2026-01-20T15:10:00+08:00",
    category: "科技/網路治理",
    articles: [
      {
        id: "tech-006-pro",
        stance: "pro",
        title: "授權是保護創作者的底線",
        author: "創作者權益組織",
        publishedAt: "2026-01-20T17:00:00+08:00",
        content: [
          { type: "heading", text: "導言：AI 也應尊重原創" },
          {
            type: "paragraph",
            text: "若 AI 訓練資料未經授權，創作者權益將被忽略。"
          },
          { type: "heading", text: "論點一：授權制度保障公平" },
          {
            type: "paragraph",
            text: "透過授權，創作者可獲合理補償，維持創作動能。"
          },
          { type: "heading", text: "論點二：避免法律爭議" },
          {
            type: "paragraph",
            text: "授權能降低侵權訴訟風險，讓產業更穩定發展。"
          },
          { type: "heading", text: "論點三：建立信任生態" },
          {
            type: "paragraph",
            text: "透明的授權流程能建立 AI 產業與內容產業的信任。"
          },
          { type: "heading", text: "反駁：授權成本過高" },
          {
            type: "paragraph",
            text: "可採用集體授權或政府協助降低成本。"
          },
          { type: "heading", text: "結論：授權是長期共生的基礎" },
          {
            type: "paragraph",
            text: "AI 產業若要持續發展，必須尊重內容來源。"
          }
        ]
      },
      {
        id: "tech-006-con",
        stance: "con",
        title: "過度授權將拖慢 AI 發展",
        author: "AI 產業發展觀察",
        publishedAt: "2026-01-20T19:00:00+08:00",
        content: [
          { type: "heading", text: "導言：創新速度與規範平衡" },
          {
            type: "paragraph",
            text: "過度授權要求可能拖慢 AI 技術創新，降低國際競爭力。"
          },
          { type: "heading", text: "論點一：訓練資料龐大難以逐一授權" },
          {
            type: "paragraph",
            text: "AI 訓練需要大量資料，逐一授權成本高且執行困難。"
          },
          { type: "heading", text: "論點二：合理使用原則存在" },
          {
            type: "paragraph",
            text: "在研究與創新情境下，合理使用可提供彈性空間。"
          },
          { type: "heading", text: "論點三：規範過度恐影響競爭力" },
          {
            type: "paragraph",
            text: "若規範過嚴，產業可能轉向海外，影響本地發展。"
          },
          { type: "heading", text: "反駁：創作者權益仍需保障" },
          {
            type: "paragraph",
            text: "可透過授權框架與補償基金平衡雙方需求。"
          },
          { type: "heading", text: "結論：以彈性規範促進創新" },
          {
            type: "paragraph",
            text: "應在保護創作者與推動技術發展之間取得彈性平衡。"
          }
        ]
      }
    ]
  }
];
