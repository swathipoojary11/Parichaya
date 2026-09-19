export const PREDEFINED_ROADMAPS = [
  {
    roleId: "frontend_developer",
    title: "Frontend Developer",
    weeks: [
      { week: 1, focus: "Advanced JavaScript & DOM Mastery", tasks: ["Deep dive into Closures, Promises & Async/Await", "Event loop & Memory management", "Build a vanilla JS SPA router"] },
      { week: 2, focus: "React/Next.js Ecosystem", tasks: ["Server Components vs Client Components", "State management (Zustand/Redux)", "Performance optimization & React Compiler"] },
      { week: 3, focus: "Modern CSS & UI Systems", tasks: ["Tailwind CSS mastery", "CSS Grid & Subgrid", "Accessibility (a11y) & ARIA attributes"] },
      { week: 4, focus: "Testing & Deployment", tasks: ["Unit testing with Vitest/Jest", "E2E testing with Cypress/Playwright", "CI/CD pipelines with GitHub Actions"] }
    ]
  },
  {
    roleId: "backend_developer",
    title: "Backend Developer",
    weeks: [
      { week: 1, focus: "Core Server Concepts", tasks: ["REST vs GraphQL vs gRPC", "Node.js Event Loop & Streams", "Middleware architecture"] },
      { week: 2, focus: "Database Mastery", tasks: ["SQL vs NoSQL decisions", "Index optimization & query execution plans", "Database normalization & ACID properties"] },
      { week: 3, focus: "Caching & Performance", tasks: ["Redis caching strategies", "Message queues (RabbitMQ/Kafka)", "Rate limiting & Load balancing"] },
      { week: 4, focus: "Security & Deployment", tasks: ["OAuth 2.0 & JWT authentication", "Dockerizing backend services", "Kubernetes basics"] }
    ]
  },
  {
    roleId: "fullstack_developer",
    title: "Full Stack Developer",
    weeks: [
      { week: 1, focus: "API Design & Integration", tasks: ["Build a robust REST API", "Connect React frontend to Node.js backend", "Implement secure CORS & CSRF protection"] },
      { week: 2, focus: "Data Modeling", tasks: ["Design a relational database schema", "Implement complex SQL joins & transactions", "ORM integration (Prisma/TypeORM)"] },
      { week: 3, focus: "State & Authentication", tasks: ["Implement full JWT auth flow", "Global state management for user sessions", "Role-based access control (RBAC)"] },
      { week: 4, focus: "End-to-End Deployment", tasks: ["Deploy frontend to Vercel", "Deploy backend to AWS/Render", "Set up automated CI/CD for both"] }
    ]
  },
  {
    roleId: "data_scientist",
    title: "Data Scientist",
    weeks: [
      { week: 1, focus: "Data Manipulation", tasks: ["Advanced Pandas & NumPy", "Handling missing data & outliers", "Data visualization with Seaborn/Plotly"] },
      { week: 2, focus: "Statistical Foundations", tasks: ["Probability distributions", "Hypothesis testing & A/B testing", "Bayesian vs Frequentist approaches"] },
      { week: 3, focus: "Machine Learning Core", tasks: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Model evaluation metrics (ROC/AUC, F1)"] },
      { week: 4, focus: "Advanced ML & Deployment", tasks: ["Gradient Boosting (XGBoost/LightGBM)", "Hyperparameter tuning", "Deploying models as REST APIs (FastAPI)"] }
    ]
  },
  {
    roleId: "data_analyst",
    title: "Data Analyst",
    weeks: [
      { week: 1, focus: "SQL Mastery", tasks: ["Window functions & CTEs", "Complex joins & aggregations", "Query optimization"] },
      { week: 2, focus: "Excel & Spreadsheets", tasks: ["Advanced Pivot Tables", "VLOOKUP/XLOOKUP & INDEX-MATCH", "Power Query basics"] },
      { week: 3, focus: "BI Tools (Tableau/PowerBI)", tasks: ["Building interactive dashboards", "DAX functions (PowerBI)", "Connecting to live data sources"] },
      { week: 4, focus: "Python for Analysis", tasks: ["Pandas data cleaning", "Automating reports with Python", "Basic exploratory data analysis (EDA)"] }
    ]
  },
  {
    roleId: "devops_engineer",
    title: "DevOps Engineer",
    weeks: [
      { week: 1, focus: "Linux & Scripting", tasks: ["Advanced Bash scripting", "Linux system administration", "Network troubleshooting (TCP/IP, DNS)"] },
      { week: 2, focus: "Containers (Docker)", tasks: ["Writing optimal Dockerfiles", "Multi-stage builds", "Docker Compose for microservices"] },
      { week: 3, focus: "Orchestration (Kubernetes)", tasks: ["Pods, Deployments, and Services", "Ingress controllers", "Helm charts basics"] },
      { week: 4, focus: "CI/CD & Infrastructure as Code", tasks: ["Terraform for AWS/GCP provisioning", "GitHub Actions / GitLab CI pipelines", "Monitoring with Prometheus & Grafana"] }
    ]
  },
  {
    roleId: "cloud_architect",
    title: "Cloud Architect",
    weeks: [
      { week: 1, focus: "Core Cloud Infrastructure", tasks: ["VPC design & subnets", "IAM policies & roles", "Compute options (EC2, Lambda)"] },
      { week: 2, focus: "Storage & Databases", tasks: ["S3 lifecycle policies", "RDS vs DynamoDB architecture", "Data warehousing (Redshift/BigQuery)"] },
      { week: 3, focus: "High Availability", tasks: ["Auto-scaling groups", "Multi-region deployments", "Disaster recovery planning"] },
      { week: 4, focus: "Security & Optimization", tasks: ["WAF & Shield", "Cost optimization strategies", "Well-Architected Framework principles"] }
    ]
  },
  {
    roleId: "ui_ux_designer",
    title: "UI/UX Designer",
    weeks: [
      { week: 1, focus: "UX Research & Wireframing", tasks: ["Conducting user interviews", "Creating user personas", "Low-fidelity wireframing in Figma"] },
      { week: 2, focus: "Visual Design (UI)", tasks: ["Color theory & typography", "Grid systems & spacing", "High-fidelity mockups"] },
      { week: 3, focus: "Prototyping & Interaction", tasks: ["Interactive Figma prototypes", "Micro-interactions & animations", "Design system creation"] },
      { week: 4, focus: "Handoff & Usability Testing", tasks: ["Developer handoff preparation", "A/B testing designs", "Usability testing sessions"] }
    ]
  },
  {
    roleId: "product_manager",
    title: "Product Manager",
    weeks: [
      { week: 1, focus: "Product Strategy", tasks: ["Defining product vision & OKRs", "Market research & competitor analysis", "User story mapping"] },
      { week: 2, focus: "Agile & Execution", tasks: ["Sprint planning & backlog grooming", "Writing effective PRDs", "Prioritization frameworks (RICE, Kano)"] },
      { week: 3, focus: "Data & Metrics", tasks: ["Defining KPIs (CAC, LTV, Churn)", "Analyzing cohort data", "Running A/B tests"] },
      { week: 4, focus: "Stakeholder Management", tasks: ["Cross-functional communication", "Go-to-market (GTM) strategy", "Managing product roadmaps"] }
    ]
  },
  {
    roleId: "mobile_developer",
    title: "Mobile Developer (iOS/Android)",
    weeks: [
      { week: 1, focus: "Core Mobile UI", tasks: ["SwiftUI / Jetpack Compose basics", "Building responsive layouts", "Handling device orientation"] },
      { week: 2, focus: "State & Data Flow", tasks: ["MVVM Architecture", "Local storage (CoreData / Room)", "State management patterns"] },
      { week: 3, focus: "Networking & APIs", tasks: ["REST API consumption", "Handling asynchronous data", "Image caching strategies"] },
      { week: 4, focus: "App Store & Performance", tasks: ["Memory leak profiling", "Push notifications", "App Store / Play Store deployment"] }
    ]
  },
  {
    roleId: "ml_engineer",
    title: "Machine Learning Engineer",
    weeks: [
      { week: 1, focus: "Data Pipelines", tasks: ["Building ETL pipelines", "Feature engineering at scale", "Data validation frameworks"] },
      { week: 2, focus: "Model Training", tasks: ["PyTorch / TensorFlow fundamentals", "Distributed training basics", "Hyperparameter optimization"] },
      { week: 3, focus: "MLOps", tasks: ["Model registry (MLflow)", "Experiment tracking", "Continuous Training (CT) pipelines"] },
      { week: 4, focus: "Deployment & Serving", tasks: ["Serving models with Triton/TFServing", "ONNX model optimization", "Monitoring model drift"] }
    ]
  },
  {
    roleId: "cybersecurity_analyst",
    title: "Cybersecurity Analyst",
    weeks: [
      { week: 1, focus: "Network Security", tasks: ["Packet analysis with Wireshark", "Firewall configuration", "Intrusion Detection Systems (IDS)"] },
      { week: 2, focus: "Vulnerability Management", tasks: ["Running vulnerability scans (Nessus)", "CVSS scoring", "Patch management processes"] },
      { week: 3, focus: "Incident Response", tasks: ["Incident handling phases", "Log analysis (Splunk/ELK)", "Malware containment"] },
      { week: 4, focus: "Ethical Hacking (Basics)", tasks: ["OWASP Top 10", "Basic penetration testing", "Phishing simulation"] }
    ]
  },
  {
    roleId: "qa_engineer",
    title: "QA Engineer / SDET",
    weeks: [
      { week: 1, focus: "Test Planning", tasks: ["Writing test cases & plans", "Boundary value analysis", "Equivalence partitioning"] },
      { week: 2, focus: "API Testing", tasks: ["Postman automation", "Validating JSON schemas", "Auth testing in APIs"] },
      { week: 3, focus: "UI Automation", tasks: ["Selenium / Cypress fundamentals", "Page Object Model (POM)", "Handling dynamic elements"] },
      { week: 4, focus: "CI Integration", tasks: ["Integrating tests in GitHub Actions", "Generating test reports", "Performance testing basics (JMeter)"] }
    ]
  },
  {
    roleId: "database_administrator",
    title: "Database Administrator",
    weeks: [
      { week: 1, focus: "Architecture & Setup", tasks: ["RDBMS installation & configuration", "User roles & permissions", "Storage engine selection"] },
      { week: 2, focus: "Performance Tuning", tasks: ["Query execution plan analysis", "Index fragmentation & defragmentation", "Buffer pool optimization"] },
      { week: 3, focus: "High Availability", tasks: ["Setting up replication", "Clustering & partitioning", "Point-in-time recovery"] },
      { week: 4, focus: "Monitoring & Security", tasks: ["Database auditing", "Encryption at rest & in transit", "Automated backup strategies"] }
    ]
  },
  {
    roleId: "systems_administrator",
    title: "Systems Administrator",
    weeks: [
      { week: 1, focus: "OS Management", tasks: ["Active Directory / LDAP management", "Group Policy deployment", "Patching strategies"] },
      { week: 2, focus: "Networking & Services", tasks: ["DNS, DHCP, & VPN setup", "Web server admin (IIS/Apache)", "Email server management"] },
      { week: 3, focus: "Virtualization", tasks: ["VMware / Hyper-V management", "Virtual machine clustering", "Resource allocation"] },
      { week: 4, focus: "Scripting & Automation", tasks: ["PowerShell / Bash automation", "Automating user onboarding", "System backup & restore procedures"] }
    ]
  }
];

export function getRoadmapById(id) {
  return PREDEFINED_ROADMAPS.find(r => r.roleId === id) || PREDEFINED_ROADMAPS[0];
}
