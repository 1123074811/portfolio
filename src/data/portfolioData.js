export const portfolioData = {
  personalInfo: {
    name: "VibeCoder",
    englishName: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=VibeCoder&backgroundColor=b6e3f4", // Creative robot avatar
    title: "AI 应用开发 & Vibe Coding 全栈程序员",
    titleEn: "AI Application Dev & Vibe Coding Fullstack Programmer",
    tagline: "用 AI 放大开发效率，把想法快速变成可运行作品。",
    taglineEn: "Amplify speed with AI, turn ideas into running software.",
    subTagline: "我关注 AI 应用开发、Web 全栈项目和效率工具构建，喜欢借助 AI 编程工具快速完成原型设计、功能开发与项目落地。",
    subTaglineEn: "I focus on AI application development, Web full-stack projects, and building productivity tools. I enjoy leveraging AI programming systems to quickly complete prototyping, feature development, and deployment.",
    resumeUrl: "/resume.html", // Links to printable elegant HTML resume
    email: "alexchen.dev@outlook.com",
    github: "https://github.com/vibe-coder",
    gitee: "https://gitee.com/vibe-coder",
    blog: "https://vibecoder.dev",
    targetRoles: [
      "AI 应用开发实习生",
      "全栈开发实习生",
      "后端开发实习生",
      "Web 前端开发实习生"
    ],
    targetRolesEn: [
      "AI Application Dev Intern",
      "Fullstack Dev Intern",
      "Backend Dev Intern",
      "Web Frontend Dev Intern"
    ]
  },
  
  aboutMe: {
    paragraphs: [
      "我是一名关注 AI 应用开发和全栈项目实践的学生开发者。相比只停留在想法阶段，我更喜欢把灵感快速做成可以运行、可以展示、可以继续迭代的项目。",
      "我正在通过 Vibe Coding 的方式探索更高效的开发流程：用 AI 辅助理解需求、生成方案、编写代码、排查问题，同时保持自己对产品逻辑、工程结构和最终体验的判断。"
    ],
    paragraphsEn: [
      "I am a student developer focusing on AI application development and fullstack project practices. Rather than letting ideas stay in my head, I prefer using AI tools to turn inspirations into running, viewable, and iteratively improving projects.",
      "I am exploring highly efficient development pipelines via Vibe Coding: using AI as a co-pilot to parse specifications, generate schemas, write code, and resolve issues, while keeping my own engineering judgment intact."
    ],
    cards: [
      {
        id: "ai",
        title: "AI 应用探索",
        titleEn: "AI App Exploration",
        description: "关注 AI Agent、检索增强生成 (RAG)、智能工作流。能独立对接各种大模型 API，进行 Prompt 调优与工程落地。",
        descriptionEn: "Focus on AI Agents, Retrieval-Augmented Generation (RAG), and smart pipelines. Capable of integrating various LLM APIs and prompt tuning.",
        icon: "Bot"
      },
      {
        id: "fullstack",
        title: "全栈项目落地",
        titleEn: "Fullstack Engineering",
        description: "具备 Vue、Tailwind CSS、Spring Boot、Node.js 及主流数据库（MySQL / MongoDB / Redis）的全栈项目搭建与部署经验。",
        descriptionEn: "Experienced in scaffold-to-deploy pipelines with Vue, Tailwind, Spring Boot, Node.js, and databases like MySQL, MongoDB, and Redis.",
        icon: "Layers"
      },
      {
        id: "vibecoding",
        title: "Vibe Coding 实践",
        titleEn: "Vibe Coding Flow",
        description: "深度使用 AI 编程工具辅助开发，从想法到部署可能只需几天，极大地缩短了产品原型孵化的闭环时间。",
        descriptionEn: "Deeply engage with AI IDEs to turn a product conceptualization into functional deployment in days, vastly shortening incubation loops.",
        icon: "Zap"
      },
      {
        id: "growth",
        title: "持续学习成长",
        titleEn: "Continuous Growth",
        description: "作为学生开发者，对新技术有极强的探索欲和自驱力。喜欢阅读源码和分享，致力于在 AIGC 时代重塑开发流程。",
        descriptionEn: "As a student, I possess exceptional self-drive to explore new techs. I enjoy code auditing and sharing, striving to reinvent workflows.",
        icon: "TrendingUp"
      }
    ]
  },

  categories: ["全部", "AI 应用", "Web 全栈", "效率工具", "创意实验"],
  categoriesEn: ["All", "AI Apps", "Fullstack", "Tools", "Labs"],

  projects: [
    {
      id: "vibegpt",
      title: "VibeGPT - AI 智能项目生成器",
      titleEn: "VibeGPT - Smart Project Gen",
      subtitle: "从一句话想法到完整软件架构与技术栈推荐的 AI 助手",
      subtitleEn: "Transform raw ideas into architecture, databases, and scaffolding",
      category: "AI 应用",
      categoryEn: "AI Apps",
      description: "一个面向开发者的智能工具，用户只需输入一段大白话想法（例如：我想做一个拼车小程序），AI 就会在几秒钟内将其拆解为软件架构图、数据库关系、推荐的技术栈及分阶段开发计划，并生成基础的后端代码模板。",
      descriptionEn: "A developer co-pilot: users input simple, plain-text ideas (e.g. 'I want to build a carpooling app'). In seconds, the AI parses it into architectural blocks, relational databases, recommended tech stacks, and modular development sprint tasks, together with clean boilerplate code.",
      coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop", // Futuristic colorful AI head
      media: [
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-devices-and-hud-indicators-41617-large.mp4",
          poster: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?q=80&w=800&auto=format&fit=crop"
        }
      ],
      techStack: ["Vue 3", "Tailwind CSS", "Node.js", "OpenAI API", "LangChain"],
      features: [
        "一句话灵感智能拆解，生成交互式敏捷看板与甘特图",
        "大模型调用链管理，通过 RAG 引用最新主流技术文档",
        "支持一键导出 Markdown 需求文档与 Git 任务清单"
      ],
      featuresEn: [
        "One-sentence parsing to build interactive Agile Kanbans and Gantt charts",
        "LLM pipeline management with RAG citing latest technical documentation",
        "One-click exports for Markdown requirements and Git task boards"
      ],
      highlights: [
        "通过 Stream 流式输出优化了大模型响应的视觉等待体验",
        "利用 Prompt Engineering 实现了高精度的 JSON 格式化输出保证",
        "深度结合 LocalStorage，支持本地历史记录保存与复看"
      ],
      highlightsEn: [
        "Leveraged dynamic server streaming to resolve visual latency in LLM completions",
        "Engineered reliable JSON-Schema parameters to lock down raw AI structures",
        "Designed local cache systems to back up and restore prompt histories easily"
      ],
      role: "独立完成产品需求定义、前端界面实现、Node.js 服务端搭建及 LLM Prompt 调优与测试。",
      roleEn: "Independently parsed requirements, coded Vue frontend, established Node.js proxy, and fine-tuned LLM Prompt parameters.",
      demoUrl: "https://vibegpt.demo.dev",
      sourceUrl: "https://github.com/vibe-coder/vibegpt",
      status: "持续迭代",
      statusEn: "Active",
      year: "2026",
      featured: true
    },
    {
      id: "devlab",
      title: "DevLab - 全栈智能研发看板",
      titleEn: "DevLab - Fullstack Smart Kanban",
      subtitle: "集成 AI 代码审查与缺陷预测的现代化看板协作平台",
      subtitleEn: "Modern collaborative Kanban with integrated AI Code Review",
      category: "Web 全栈",
      categoryEn: "Fullstack",
      description: "基于前后端分离架构实现的研发任务管理平台。除常规的拖轴卡片与敏捷看板外，最大亮点是集成了 AI Code Reviewer 插件，当开发者将任务状态拖拽至“待审查”时，AI 会自动扫描关联的 Git 提交并指出潜在的安全和性能隐患。",
      descriptionEn: "A high-performance Kanban platform. Along with normal cards and boards, its biggest highlight is the integrated AI Code Reviewer. When developers drag tasks to 'Reviewing', the AI automated agent audits the associated Git commits and detects potential bugs and performance risks.",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop", // Cyberpunk glowing workstation
      media: [
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-terminal-with-scrolling-green-code-and-data-48866-large.mp4",
          poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop"
        }
      ],
      techStack: ["Vue 3", "Tailwind CSS", "Spring Boot", "MySQL", "Redis", "JWT"],
      features: [
        "拖拽式响应画布，看板无缝切换（待办、开发中、待审查、已完成）",
        "集成基于 Redis Pub/Sub 的实时在线协同，多团队数据状态同步",
        "AI 辅助审查模块，一键生成性能改进报告和缺陷预测得分"
      ],
      featuresEn: [
        "Drag-and-drop responsive board layout with smooth card transitions",
        "Real-time team synchronization using Redis Pub/Sub backend hooks",
        "AI-enabled review module generating automated code quality reports"
      ],
      highlights: [
        "设计了防抖机制和乐观锁，解决了多人高频拖拽看板时的并发更新冲突",
        "结合 Spring Boot AOP 实现完备的操作日志切面与细粒度的角色权限控制",
        "前端通过 Tailwind 深度定制了丝滑的卡片过渡动画，首屏加载性能指标良好"
      ],
      highlightsEn: [
        "Designed bounce-prevention mechanisms and optimistic locks to avoid concurrent collisions",
        "Coded Spring AOP aspects to capture detailed user logs and RBAC security layers",
        "Engineered beautiful hardware-accelerated animations using Tailwind styling transitions"
      ],
      role: "负责数据库表设计、Spring Boot 后端 API 开发、前端敏捷看板实现及 JWT 安全认证机制集成。",
      roleEn: "Designed database architecture, developed Spring Boot APIs, engineered Vue UI boards, and integrated JWT authentication.",
      demoUrl: "https://devlab-kb.dev",
      sourceUrl: "https://github.com/vibe-coder/devlab",
      status: "已完成",
      statusEn: "Completed",
      year: "2026",
      featured: true
    },
    {
      id: "vibeclip",
      title: "VibeClip - 智能云端剪贴板",
      titleEn: "VibeClip - Smart Clipboard Hub",
      subtitle: "支持多端同步、文本历史分类与大模型智能润色的剪贴板管家",
      subtitleEn: "Multi-device cloud syncing, smart categorization, and LLM-assisted rewriting",
      category: "效率工具",
      categoryEn: "Tools",
      description: "一个专为现代研发工作流设计的剪贴板管理工具。它不仅能在后台静默运行并记录你的复制历史，还能通过云端安全同步到你的手机与其它电脑。最棒的是它整合了 DeepSeek API，支持选中内容一键进行 AI 代码解释、翻译、周报润色或格式化。",
      descriptionEn: "A clipboard workflow companion built for modern developers. It silently captures copy history, encrypting and syncing data securely across all your devices. Best of all, it has built-in DeepSeek API integrations for instant AI code explanation, smart text polishing, translation, and JSON formatting.",
      coverImage: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop",
      media: [
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-futuristic-tablet-and-hologram-42517-large.mp4",
          poster: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop"
        }
      ],
      techStack: ["Vue 3", "Electron", "Tailwind CSS", "Node.js", "SQLite", "DeepSeek API"],
      features: [
        "系统级热键唤醒，历史记录智能合并与正则全文检索",
        "AI 智能助理侧边栏，支持一键解释代码、翻译和摘要",
        "端到端加密云同步，支持多台 PC 与手机端实时同步剪贴历史"
      ],
      featuresEn: [
        "System-wide global hotkey summoning, with regex-enabled fuzzy search",
        "Integrated AI Assistant sidebar for code optimization and auto-documentation",
        "End-to-end encrypted cloud sync to synchronize clips securely across active devices"
      ],
      highlights: [
        "基于 Electron + SQLite 实现了百万级文本数据毫秒级本地读写",
        "采用最少特权原则进行系统集成，对剪贴板数据实行完全的本地隔离与加密",
        "通过 SSE 流式输出技术，在大模型润色时实现低延迟、丝滑的打字机加载效果"
      ],
      highlightsEn: [
        "Wired Electron with SQLite to achieve sub-millisecond local reads across 1M+ logs",
        "Adhered to Principle of Least Privilege, isolating and encrypting sensitive user entries",
        "Implemented Server-Sent Events (SSE) to render responsive, lag-free typewriter typing"
      ],
      role: "独立负责产品原型设计、Electron 桌面客户端壳体及主进程开发、SQLite 本地缓存设计以及 AI API 接口对接。",
      roleEn: "Independently designed product roadmap, coded Electron wrapper & main processes, established local DB layers, and tuned LLM completion pipelines.",
      demoUrl: "#",
      sourceUrl: "https://github.com/vibe-coder/vibeclip",
      status: "持续迭代",
      statusEn: "Active",
      year: "2026",
      featured: true
    },
    {
      id: "ragflowlite",
      title: "RAGFlow-Lite - 轻量级个人知识库",
      titleEn: "RAGFlow-Lite - Personal RAG Hub",
      subtitle: "基于 RAG 架构的多文档智能问答与语义搜索工作台",
      subtitleEn: "Document Retrieval-Augmented Generation dashboard and semantics engine",
      category: "AI 应用",
      categoryEn: "AI Apps",
      description: "一个面向学生和学者的本地轻量级知识库工具。用户可以上传 PDF、Markdown、DOCX 等多种格式的文档。系统会自动进行文本分块（Chunking）、生成向量嵌入（Embeddings）并存入本地向量数据库。此后，用户可以通过自然语言与本地文档进行高精度对话，每条回答都会严格附带原文引用出处。",
      descriptionEn: "A desktop-friendly knowledge-base tool for researchers and developers. Drag and drop PDFs, Markdowns, or Word files to automatically trigger smart text-chunking and vector storage (Chroma). Chat with your local database in natural language, with strict factual citations and source reference tracking.",
      coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop",
      media: [
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-hud-interface-of-a-holographic-brain-scanning-43034-large.mp4",
          poster: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop"
        }
      ],
      techStack: ["Vue 3", "FastAPI", "Python", "ChromaDB", "LangChain", "HuggingFace"],
      features: [
        "智能 PDF/Word 文档分块解析，自研重叠滑动窗口（Sliding Window）切片算法",
        "支持本地离线模型（如 Ollama）或在线 API（OpenAI / DeepSeek）的混合检索（Hybrid Search）",
        "可视化向量空间，能在大地图中直观查看文档块之间的关联和检索距离"
      ],
      featuresEn: [
        "Automated PDF/Word parsing with dynamic sliding-window slicing algorithms",
        "Hybrid search ranking supported by local LLMs (Ollama) or external web APIs (OpenAI)",
        "Interactive vector map displaying physical distances and relationships between chunks"
      ],
      highlights: [
        "自研 BM25 传统文本检索与 Dense Vector 向量检索的重排（Rerank）融合算法，多文档检索召回率提升 40%",
        "利用 FastAPI 异步非阻塞特性，配合 Redis 队列实现了高效的文档批量并发入库与多线程解析",
        "前端使用 Canvas 渲染海量向量文档块分布，提供炫酷且流畅的语义拓扑网络交互"
      ],
      highlightsEn: [
        "Engineered a hybrid ranking logic fusing BM25 keyword matching with Dense Vector vectors, boosting recall rate by 40%",
        "Leveraged FastAPI asynchronous workers and Redis queuing to run parallel vector embeddings pipeline",
        "Designed Canvas network renderers to visualize thousands of token clusters in real-time"
      ],
      role: "负责 Python FastAPI 后端架构搭建、LangChain 检索管道设计、BM25 + 向量召回重排融合算法实现、以及前端可视化检索界面开发。",
      roleEn: "Led FastAPI design, engineered LangChain document pipelines, coded BM25 + dense reranking, and built interactive HTML5 Canvas topology.",
      demoUrl: "https://raglite.demo.dev",
      sourceUrl: "#",
      status: "已完成",
      statusEn: "Completed",
      year: "2025",
      featured: true
    },
    {
      id: "omniprompt",
      title: "OmniPrompt - 提示词调试工作台",
      titleEn: "OmniPrompt - Prompt Sandbox",
      subtitle: "轻量级、支持版本控制与 Token 估算的提示词工程面板",
      subtitleEn: "Version-controlled template playground with token estimation",
      category: "效率工具",
      categoryEn: "Tools",
      description: "旨在解决大模型开发中 Prompt 版本混乱、测试不便的痛点。该工作台支持用户编写带变量的 Prompt 模板（如：你好，我是一名 {{role}}），输入测试参数后自动组装并调用多路大模型（ChatGPT/Claude/DeepSeek 等）对比效果，并实时估算 Token 消耗与费用成本。",
      descriptionEn: "Built to solve version-control and testing friction in Prompt engineering. Users can write modular, parameterized templates (e.g., 'Hello, I am a {{role}}'), fill variables, run parallel evaluations across OpenAI/Claude/DeepSeek, and view instantaneous token/cost estimates.",
      coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop", // Quantum energy field
      media: [
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34281-large.mp4",
          poster: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop"
        }
      ],
      techStack: ["Vue 3", "Tailwind CSS", "Vite", "Tiktoken-JS", "HuggingFace API"],
      features: [
        "Prompt 模板热重载，支持多模型输出同屏横向评测",
        "支持 Prompt 参数化（通过 {{variable}} 语法自动识别输入项）",
        "内置 Tiktoken 估算器，本地即时计算 Prompt 的 Token 数量"
      ],
      featuresEn: [
        "Hot reloading of templates with side-by-side multi-model comparison",
        "Parameterized syntax parsing with auto-detecting variable inputs",
        "Tiktoken compiler integrated into client to run cost assessments locally"
      ],
      highlights: [
        "采用纯前端架构，无需复杂后端，配置大模型 API Key 即可使用（支持本地加密存储 Key）",
        "通过 Web Workers 将 Token 估算和长文本处理卸载到后台线程，保证了 UI 界面的零卡顿",
        "提供完美的 JSON、CSV 导出方案，一键导出调试成功的提示词模板"
      ],
      highlightsEn: [
        "Engineered zero-backend serverless clients with encrypted browser-side API key caching",
        "Offloaded heavy Tiktoken calculations to background Web Workers to prevent UI lags",
        "Provided seamless table exporters to output structured prompt datasets to CSV or JSON"
      ],
      role: "独立完成，纯前端客户端应用开发，核心设计了前端 Prompt 语法解析器与 Tiktoken 结合。 ",
      roleEn: "Created entirely by myself. Engineered custom parser, Web Worker hooks, and responsive UI layout.",
      demoUrl: "https://omniprompt.dev",
      sourceUrl: "https://github.com/vibe-coder/omniprompt",
      status: "已完成",
      statusEn: "Completed",
      year: "2025",
      featured: true
    },
    {
      id: "vibepiano",
      title: "VibePiano - 灵感光感 AI 钢琴",
      titleEn: "VibePiano - AI Ambient Piano",
      subtitle: "基于摄像头人脸手势检测与 Canvas 交互的创意音乐实验",
      subtitleEn: "Webcam-based facial and gesture recognition music experiment",
      category: "创意实验",
      categoryEn: "Labs",
      description: "这是一场 Vibe Coding 的灵感实验。利用浏览器摄像头捕捉用户的人脸姿态与眨眼，在 Canvas 舞台上产生流光溢彩的视觉粒子，同时根据人脸偏移产生对应的环境和弦与音效。将视觉、音乐与深度学习相结合，为访客提供解压有趣的艺术交互。",
      descriptionEn: "A creative art sandbox born from a pure Vibe Coding spark. Uses deep-learning models in browser to capture webcam facial posture and blinks, generating streaming color particles on HTML5 Canvas while synthesizing background ambient chords in real-time.",
      coverImage: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop", // Synth keys and laser
      media: [
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-dj-mixer-controller-under-neon-flashing-lights-42861-large.mp4",
          poster: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop"
        },
        {
          type: "video",
          url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-neon-fluid-shapes-swirling-32520-large.mp4"
        }
      ],
      techStack: ["Vue 3", "Tailwind CSS", "HTML5 Canvas", "MediaPipe", "Tone.js"],
      features: [
        "人脸姿态特征实时解算（眨眼、转头、咧嘴等动作映射为音符触发）",
        "Tone.js 驱动的和声合成器，内置 4 种富有未来科技感的电子环境音色",
        "高帧率 Canvas 粒子喷射渲染，粒子运动受动作幅度与速度的影响"
      ],
      featuresEn: [
        "Webcam mesh capturing blinks and rotation to trigger responsive chords",
        "Tone.js polyphonic synthesizer containing 4 space-ambient space presets",
        "HTML5 particle physical system reacting to the velocity of gestures"
      ],
      highlights: [
        "利用 RequestAnimationFrame 精确控制高频渲染，手机端浏览器亦可稳定在 50+ FPS",
        "利用 Vue OnUnmounted 妥善回收摄像头媒体流与音频上下文（AudioContext），零内存泄露",
        "完美的 Vibe 编程写照，从最初的纯文字设想到具有视觉和声音反馈的原型仅用了 8 小时"
      ],
      highlightsEn: [
        "Wired requestAnimationFrame with canvas drawing to secure a smooth 50+ FPS on mobile",
        "Leveraged Vue hooks to clear media streams and AudioContext, preventing memory leaks",
        "Pure product of Vibe Coding: went from a raw prompt idea to functional demo in 8 hours"
      ],
      role: "负责 MediaPipe 特征检测配置、Tone.js 合成器音频调试、Canvas 粒子物理引擎模拟和整体界面交互开发。",
      roleEn: "Integrated MediaPipe mesh, designed Tone.js synthesizer patches, and coded physics particle engine on Canvas.",
      demoUrl: "https://vibepiano.play.dev",
      sourceUrl: "https://github.com/vibe-coder/vibepiano",
      status: "实验中",
      statusEn: "Lab",
      year: "2025",
      featured: false
    }
  ],

  skillGroups: [
    {
      title: "前端技术 (Frontend)",
      titleEn: "Frontend Stack",
      description: "构建现代 Web 界面与响应式用户交互",
      descriptionEn: "Building modern interactive UIs",
      skills: ["Vue 3 (Composition API)", "Tailwind CSS", "JavaScript (ES6+)", "TypeScript", "HTML5 / CSS3", "Vite", "Pinia", "Element Plus / Naive UI"]
    },
    {
      title: "后端与存储 (Backend & Database)",
      titleEn: "Backend & Storage",
      description: "提供稳定可靠的 API 服务与数据持久化",
      descriptionEn: "Delivering stable services & APIs",
      skills: ["Spring Boot", "Node.js (Express)", "MySQL", "MongoDB", "Redis", "RESTful API Design", "JWT / AOP Aspects", "Maven / npm / pnpm"]
    },
    {
      title: "AI 应用开发 (AI & LLMs)",
      titleEn: "AI Engineering",
      description: "探索智能应用、Agent 与 AI 工具结合",
      descriptionEn: "Fusing cognitive intelligence with software",
      skills: ["大模型 API 对接", "Prompt Engineering", "RAG (检索增强生成)", "LangChain / Flowise", "Token 成本与模型评测", "智能工作流配置"]
    },
    {
      title: "AI 开发效率与工程化",
      titleEn: "AI Productivity & Ops",
      description: "拥抱 AI 工具，提升极速交付与可靠部署能力",
      descriptionEn: "10x delivery & continuous deployments",
      skills: ["Cursor / Windsurf 协同开发", "Git 版本控制", "Vercel / Netlify 一键部署", "Nginx 配置", "Linux 常用指令 / Docker 基础"]
    }
  ],

  experiences: [
    {
      year: "2024 - PRES",
      type: "教育背景",
      typeEn: "Education",
      title: "软件工程专业 · 本科在读",
      titleEn: "Software Engineering - Bachelor Degree",
      description: "主要修读：数据结构、操作系统、计算机网络、数据库系统概论、软件工程。在校期间积极参与各项编程竞赛和开源社区探索，保持对前沿技术的超强敏感度。",
      descriptionEn: "Core courses: Data Structures, Operating Systems, Computer Networks, Database Systems, Software Engineering. Actively engaged in hackathons and open-source."
    },
    {
      year: "2025.06",
      type: "项目实践",
      typeEn: "Practice",
      title: "OmniPrompt 效率工具上线",
      titleEn: "OmniPrompt Release & Open Source",
      description: "独立开发并开源了提示词调试面板，在社交媒体上获得同行关注。该项目使我深刻理解了 Token 机制、前端缓存与无后端（Serverless）架构的实用场景。",
      descriptionEn: "Developed and open-sourced the Prompt Playground, receiving attention in dev communities. Understood Token mechanics, client-side caching, and serverless architectures."
    },
    {
      year: "2025.12",
      type: "创意探索",
      typeEn: "Milestone",
      title: "Vibe Coding 理念深度实践",
      titleEn: "Deepening Vibe Coding Workflow",
      description: "开始结合大模型（Claude 3.5 / GPT-4o）重构个人开发工作流。完成 AI 钢琴 (VibePiano) 等创意交互实验，大幅提升原型开发速度（5-10倍交付提升）。",
      descriptionEn: "Began reconstructing personal workflows with LLMs (Claude 3.5 / GPT-4). Completed interactive arts like VibePiano, securing 5x-10x speed gains in prototyping."
    },
    {
      year: "2026.02",
      type: "全栈融合",
      typeEn: "Fullstack",
      title: "DevLab 智能看板平台立项",
      titleEn: "DevLab Project Formulation",
      description: "作为全栈方向实践，将 Vue 与 Spring Boot / MySQL / Redis 进行高标准整合，融入 AI 静态审查功能，形成规范的全栈实战项目经验。",
      descriptionEn: "As a full-stack master practice, integrated Vue 3 with Spring Boot, MySQL, and Redis, appending AI static review features for complete product experience."
    }
  ],

  blogArticles: [
    {
      id: "art-1",
      title: "如何在 Vibe Coding 时代重塑个人开发效率工作流",
      titleEn: "Reinventing Developer Workflows in the Vibe Coding Era",
      excerpt: "探讨如何通过大语言模型 (LLMs) 进行高保真原型编写。讨论在代码生成、缺陷修复以及重构阶段，人机协同的黄金边界...",
      excerptEn: "Explore how to write high-fidelity prototypes using LLMs. Discuss the golden boundary of human-AI collaboration in generation, debugging, and refactoring...",
      date: "2026.03.15",
      readTime: "6 min read",
      category: "方法论",
      categoryEn: "Methodology",
      tags: ["Vibe Coding", "AI Copilot", "Productivity"]
    },
    {
      id: "art-2",
      title: "前端深度学习：在浏览器跑 MediaPipe 与 Canvas 动效优化",
      titleEn: "Browser Deep Learning: Running MediaPipe with Canvas Optimizations",
      excerpt: "复盘 VibePiano 项目。如何借助 Web Worker 异步计算人脸数据，并在 HTML5 Canvas 中使用 RAF 物理引擎完成 60FPS 粒子渲染...",
      excerptEn: "Post-mortem of VibePiano. How to use Web Workers for face mesh calculations and secure 60FPS particle simulations on Canvas via requestAnimationFrame...",
      date: "2026.01.20",
      readTime: "8 min read",
      category: "技术复盘",
      categoryEn: "Engineering",
      tags: ["Vue 3", "Canvas", "MediaPipe"]
    },
    {
      id: "art-3",
      title: "Spring Boot + Redis Pub/Sub 在多人看板协同中的乐观锁与防抖实践",
      titleEn: "Optimistic Locking & Debouncing in Spring Boot / Redis Collaborative Kanbans",
      excerpt: "详细剖析在高并发状态下，看板卡片被多端高频拖拽时的冲突避免方案。设计 Redis 切面监听器与 DB 层乐观锁协同原理...",
      excerptEn: "Deep-dive into conflict avoidance when Kanban cards are dragged with high frequency by multiple team members under high concurrency. Custom aspects with DB locks...",
      date: "2026.02.28",
      readTime: "10 min read",
      category: "全栈后端",
      categoryEn: "Fullstack",
      tags: ["Spring Boot", "Redis", "MySQL"]
    }
  ]
};
