import type { Language } from "lib/redux/settingsSlice";

export interface Translation {
  nav: {
    builder: string;
    parser: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    createResume: string;
    noSignUpRequired: string;
    alreadyHaveResume: string;
    resumeParser: string;
  };
  steps: {
    title: string;
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    step3Title: string;
    step3Text: string;
  };
  features: {
    freeTitle: string;
    freeText: string;
    usBestPracticesTitle: string;
    usBestPracticesText: string;
    privacyTitle: string;
    privacyText: string;
    openSourceTitle: string;
    openSourceText: string;
    githubRepo: string;
  };
  qa: {
    title: string;
  };
  resumeImport: {
    importTitle: string;
    dontHaveResume: string;
    createFromScratch: string;
    priorSessionData: string;
    continueWhereLeft: string;
    overrideWithNew: string;
  };
  resumeParser: {
    playgroundTitle: string;
    playgroundDesc1: string;
    playgroundDesc2: string;
    resumeExample: string;
    addYourResume: string;
    parserDesc: string;
    parsingResults: string;
  };
  resumeForm: {
    settingsTitle: string;
    language: string;
    english: string;
    chinese: string;
    themeColor: string;
    fontFamily: string;
    fontSize: string;
    documentSize: string;
    profile: {
      name: string;
      namePlaceholder: string;
      objective: string;
      objectivePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      website: string;
      websitePlaceholder: string;
      location: string;
      locationPlaceholder: string;
    };
    work: {
      addButton: string;
      company: string;
      companyPlaceholder: string;
      jobTitle: string;
      jobTitlePlaceholder: string;
      date: string;
      datePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      deleteTooltip: string;
    };
    education: {
      addButton: string;
      school: string;
      schoolPlaceholder: string;
      degree: string;
      degreePlaceholder: string;
      gpa: string;
      gpaPlaceholder: string;
      date: string;
      datePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      deleteTooltip: string;
    };
    project: {
      addButton: string;
      project: string;
      projectPlaceholder: string;
      date: string;
      datePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      deleteTooltip: string;
    };
    skills: {
      description: string;
      descriptionPlaceholder: string;
    };
    custom: {
      description: string;
      descriptionPlaceholder: string;
    };
  };
  dropzone: {
    browseOrDrop: string;
    privacyNote: string;
    browseFile: string;
    onlyPdfSupported: string;
    importAndContinue: string;
    bestWithSingleColumn: string;
  };
}

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    nav: {
      builder: "Builder",
      parser: "Parser",
    },
    hero: {
      titleLine1: "Create a professional",
      titleLine2: "resume easily",
      subtitle: "With this free, open-source, and powerful resume builder",
      createResume: "Create Resume",
      noSignUpRequired: "No sign up required",
      alreadyHaveResume: "Already have a resume? Test its ATS readability with the",
      resumeParser: "resume parser",
    },
    steps: {
      title: "3 Simple Steps",
      step1Title: "Add a resume pdf",
      step1Text: "or create from scratch",
      step2Title: "Preview design",
      step2Text: "and make edits",
      step3Title: "Download new resume",
      step3Text: "and apply with confidence",
    },
    features: {
      freeTitle: "Free Forever",
      freeText: "OpenResume is created with the belief that everyone should have free and easy access to a modern professional resume design",
      usBestPracticesTitle: "U.S. Best Practices",
      usBestPracticesText: "OpenResume has built-in best practices for the U.S. job market and works well with top ATS platforms such as Greenhouse and Lever",
      privacyTitle: "Privacy Focus",
      privacyText: "OpenResume stores data locally in your browser so only you have access to your data and with complete control",
      openSourceTitle: "Open-Source",
      openSourceText: "OpenResume is an open-source project, and its source code can be viewed by anyone on its",
      githubRepo: "GitHub repository",
    },
    qa: {
      title: "Questions & Answers",
    },
    resumeImport: {
      importTitle: "Import data from an existing resume",
      dontHaveResume: "Don't have a resume yet?",
      createFromScratch: "Create from scratch",
      priorSessionData: "You have data saved in browser from prior session",
      continueWhereLeft: "Continue where I left off",
      overrideWithNew: "Override data with a new resume",
    },
    resumeParser: {
      playgroundTitle: "Resume Parser Playground",
      playgroundDesc1: "This playground showcases the OpenResume resume parser and its ability to parse information from a resume PDF. Click around the PDF examples below to observe different parsing results.",
      playgroundDesc2: "You can also",
      addYourResume: "add your resume below",
      parserDesc: "to access how well your resume would be parsed by similar Application Tracking Systems (ATS) used in job applications. The more information it can parse out, the better it indicates the resume is well formatted and easy to read. It is beneficial to have the name and email accurately parsed at the very least.",
      parsingResults: "Resume Parsing Results",
      resumeExample: "Resume Example",
    },
    resumeForm: {
      settingsTitle: "Resume Setting",
      language: "Language",
      english: "English",
      chinese: "中文",
      themeColor: "Theme Color",
      fontFamily: "Font Family",
      fontSize: "Font Size (pt)",
      documentSize: "Document Size",
      profile: {
        name: "Name",
        namePlaceholder: "Sal Khan",
        objective: "Objective",
        objectivePlaceholder: "Entrepreneur and educator obsessed with making education free for anyone",
        email: "Email",
        emailPlaceholder: "hello@khanacademy.org",
        phone: "Phone",
        phonePlaceholder: "(123)456-7890",
        website: "Website",
        websitePlaceholder: "linkedin.com/in/khanacademy",
        location: "Location",
        locationPlaceholder: "NYC, NY",
      },
      work: {
        addButton: "Add Job",
        company: "Company",
        companyPlaceholder: "Khan Academy",
        jobTitle: "Job Title",
        jobTitlePlaceholder: "Software Engineer",
        date: "Date",
        datePlaceholder: "Jun 2022 - Present",
        description: "Description",
        descriptionPlaceholder: "Bullet points",
        deleteTooltip: "Delete job",
      },
      education: {
        addButton: "Add School",
        school: "School",
        schoolPlaceholder: "MIT",
        degree: "Degree",
        degreePlaceholder: "Bachelor of Science",
        gpa: "GPA",
        gpaPlaceholder: "3.9",
        date: "Date",
        datePlaceholder: "Jun 2018",
        description: "Description",
        descriptionPlaceholder: "Bullet points",
        deleteTooltip: "Delete school",
      },
      project: {
        addButton: "Add Project",
        project: "Project",
        projectPlaceholder: "OpenResume",
        date: "Date",
        datePlaceholder: "Jan 2023 - Present",
        description: "Description",
        descriptionPlaceholder: "Bullet points",
        deleteTooltip: "Delete project",
      },
      skills: {
        description: "Description",
        descriptionPlaceholder: "Bullet points",
      },
      custom: {
        description: "Description",
        descriptionPlaceholder: "Bullet points",
      },
    },
    dropzone: {
      browseOrDrop: "Browse a pdf file or drop it here",
      privacyNote: "File data is used locally and never leaves your browser",
      browseFile: "Browse file",
      onlyPdfSupported: "Only pdf file is supported",
      importAndContinue: "Import and Continue",
      bestWithSingleColumn: "Note: Import works best on single column resume",
    },
  },
  zh: {
    nav: {
      builder: "编辑器",
      parser: "解析器",
    },
    hero: {
      titleLine1: "轻松创建",
      titleLine2: "专业简历",
      subtitle: "使用这款免费、开源、功能强大的简历生成器",
      createResume: "创建简历",
      noSignUpRequired: "无需注册",
      alreadyHaveResume: "已有简历？测试其ATS可读性使用",
      resumeParser: "简历解析器",
    },
    steps: {
      title: "简单三步",
      step1Title: "上传简历PDF",
      step1Text: "或从零创建",
      step2Title: "预览设计",
      step2Text: "并进行编辑",
      step3Title: "下载新简历",
      step3Text: "自信地投递",
    },
    features: {
      freeTitle: "永久免费",
      freeText: "OpenResume 的创建理念是让每个人都能免费、轻松地获得现代专业的简历设计",
      usBestPracticesTitle: "美国求职最佳实践",
      usBestPracticesText: "OpenResume 内置了美国求职市场的最佳实践，与 Greenhouse、Lever 等顶级 ATS 平台完美兼容",
      privacyTitle: "注重隐私",
      privacyText: "OpenResume 将数据存储在浏览器本地，只有您可以访问和完全控制您的数据",
      openSourceTitle: "开源免费",
      openSourceText: "OpenResume 是一个开源项目，任何人都可以在",
      githubRepo: "GitHub 仓库",
    },
    qa: {
      title: "常见问题",
    },
    resumeImport: {
      importTitle: "从现有简历导入数据",
      dontHaveResume: "还没有简历？",
      createFromScratch: "从零创建",
      priorSessionData: "您之前的会话数据已保存在浏览器中",
      continueWhereLeft: "继续上次编辑",
      overrideWithNew: "使用新简历覆盖数据",
    },
    resumeParser: {
      playgroundTitle: "简历解析器演示",
      playgroundDesc1: "此演示展示了 OpenResume 简历解析器从简历 PDF 中解析信息的能力。点击下方的简历示例查看不同的解析结果。",
      playgroundDesc2: "您还可以",
      addYourResume: "在下方添加您的简历",
      parserDesc: "来评估您的简历在求职申请中被类似的申请跟踪系统（ATS）解析的效果。能解析出的信息越多，说明简历格式越好、越易读。至少确保姓名和邮箱能够被准确解析。",
      parsingResults: "简历解析结果",
      resumeExample: "简历示例",
    },
    resumeForm: {
      settingsTitle: "简历设置",
      language: "语言",
      english: "English",
      chinese: "中文",
      themeColor: "主题色",
      fontFamily: "字体",
      fontSize: "字体大小 (pt)",
      documentSize: "纸张大小",
      profile: {
        name: "姓名",
        namePlaceholder: "张三",
        objective: "个人简介",
        objectivePlaceholder: "热衷于技术创新和团队协作的全栈开发工程师",
        email: "邮箱",
        emailPlaceholder: "hello@example.com",
        phone: "电话",
        phonePlaceholder: "138-0013-8000",
        website: "网址",
        websitePlaceholder: "linkedin.com/in/zhangsan",
        location: "所在地",
        locationPlaceholder: "北京市",
      },
      work: {
        addButton: "添加工作经历",
        company: "公司",
        companyPlaceholder: "字节跳动",
        jobTitle: "职位",
        jobTitlePlaceholder: "高级前端工程师",
        date: "日期",
        datePlaceholder: "2022年6月 - 至今",
        description: "描述",
        descriptionPlaceholder: "项目要点",
        deleteTooltip: "删除工作经历",
      },
      education: {
        addButton: "添加教育经历",
        school: "学校",
        schoolPlaceholder: "清华大学",
        degree: "学位",
        degreePlaceholder: "计算机科学学士",
        gpa: "GPA",
        gpaPlaceholder: "3.9",
        date: "日期",
        datePlaceholder: "2018年6月",
        description: "描述",
        descriptionPlaceholder: "项目要点",
        deleteTooltip: "删除教育经历",
      },
      project: {
        addButton: "添加项目经历",
        project: "项目",
        projectPlaceholder: "开源项目",
        date: "日期",
        datePlaceholder: "2023年1月 - 至今",
        description: "描述",
        descriptionPlaceholder: "项目要点",
        deleteTooltip: "删除项目经历",
      },
      skills: {
        description: "描述",
        descriptionPlaceholder: "项目要点",
      },
      custom: {
        description: "描述",
        descriptionPlaceholder: "项目要点",
      },
    },
    dropzone: {
      browseOrDrop: "浏览PDF文件或拖放到此处",
      privacyNote: "文件数据仅在本地使用，不会离开您的浏览器",
      browseFile: "选择文件",
      onlyPdfSupported: "仅支持PDF文件",
      importAndContinue: "导入并继续",
      bestWithSingleColumn: "注意：导入功能在单栏简历上效果最佳",
    },
  },
};
