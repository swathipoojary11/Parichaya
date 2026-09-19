// Parichaya AURA — Role Engine (14 Comprehensive Roles)
// Each role specifies required skills, preferred skills, DSA expectations, interview topics, and verified courses.

export const ROLES = [
  {
    id: 'full-stack',
    name: 'Full Stack Developer',
    icon: '⚡',
    summary: 'Builds end-to-end web applications combining modern frontend frameworks, scalable backends, databases, and containerized deployments.',
    requiredSkills: ['JavaScript/TypeScript', 'React / Next.js', 'Node.js / Express', 'PostgreSQL / SQL', 'REST & GraphQL APIs', 'Git', 'Docker basics'],
    preferredSkills: ['Redis caching', 'Tailwind CSS', 'CI/CD Pipelines', 'AWS / Cloudflare', 'Jest / Testing'],
    dsaExpectations: 'Hashing, Arrays, Two Pointers, Linked Lists, Trees, Sliding Window',
    interviewTopics: ['State management & SSR vs CSR', 'Relational database indexing & normalization', 'API security & JWT auth', 'Distributed caching strategies'],
    courses: [
      { name: 'Full Stack Open (Deep-dive Modern Web)', provider: 'University of Helsinki', url: 'https://fullstackopen.com/en/', difficulty: 'Intermediate', time: '60 hrs' },
      { name: 'Next.js App Router Masterclass', provider: 'Next.js Official', url: 'https://nextjs.org/learn', difficulty: 'Beginner to Intermediate', time: '12 hrs' },
      { name: 'PostgreSQL Database Performance Tuning', provider: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com', difficulty: 'Intermediate', time: '15 hrs' }
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    icon: '🎨',
    summary: 'Crafts accessible, performant, and responsive client-side experiences with high visual polish, component architecture, and state synchronization.',
    requiredSkills: ['HTML5 & Semantic Web', 'Modern CSS & Tailwind', 'JavaScript (ES6+)', 'React.js', 'TypeScript', 'Responsive Web Design', 'Browser DevTools'],
    preferredSkills: ['Next.js App Router', 'Web Performance & Core Web Vitals', 'Framer Motion', 'State Management (Zustand/Redux)', 'Web Accessibility (a11y)'],
    dsaExpectations: 'Strings, Arrays, Two Pointers, Tree Traversal (DOM), Sliding Window',
    interviewTopics: ['Browser event loop & rendering pipeline', 'CSS Grid vs Flexbox & reflow/repaint', 'Component memoization & re-render triggers', 'Bundle optimization & code splitting'],
    courses: [
      { name: 'Frontend Developer Roadmap & Projects', provider: 'roadmap.sh', url: 'https://roadmap.sh/frontend', difficulty: 'Beginner to Advanced', time: '40 hrs' },
      { name: 'JavaScript.info Complete Guide', provider: 'Open Source', url: 'https://javascript.info', difficulty: 'All Levels', time: '35 hrs' },
      { name: 'Web Performance Optimization', provider: 'web.dev by Google', url: 'https://web.dev/learn/performance', difficulty: 'Intermediate', time: '18 hrs' }
    ]
  },
  {
    id: 'backend',
    name: 'Backend Developer',
    icon: '⚙️',
    summary: 'Architects robust server-side services, data pipelines, database engines, and microservices with high concurrency and reliability.',
    requiredSkills: ['Python / Go / Java / Node.js', 'Relational Databases (Postgres/MySQL)', 'RESTful API Architecture', 'Authentication (OAuth/JWT)', 'Docker', 'Linux / Bash'],
    preferredSkills: ['Message Queues (Kafka/RabbitMQ)', 'Redis Caching', 'Microservices', 'GraphQL', 'Kubernetes'],
    dsaExpectations: 'Hash Maps, Graphs, Trees, Heaps, Stacks, Queue, Concurrency',
    interviewTopics: ['Database indexing & query execution plans (EXPLAIN)', 'ACID transactions & isolation levels', 'Rate limiting algorithms', 'CAP Theorem & distributed data consistency'],
    courses: [
      { name: 'Backend Developer Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/backend', difficulty: 'Intermediate', time: '50 hrs' },
      { name: 'System Design Primer', provider: 'GitHub (Donne Martin)', url: 'https://github.com/donnemartin/system-design-primer', difficulty: 'Advanced', time: '40 hrs' },
      { name: 'Building Scalable APIs with Node & PostgreSQL', provider: 'Coursera / IBM', url: 'https://www.coursera.org', difficulty: 'Intermediate', time: '20 hrs' }
    ]
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: '💻',
    summary: 'Solves complex business and technological challenges with rigorous computer science fundamentals, modular architectures, and clean code principles.',
    requiredSkills: ['OOP & Clean Code Principles', 'Data Structures & Algorithms', 'Python / Java / C++ / TypeScript', 'Git & CI/CD Workflows', 'Unit & Integration Testing', 'Databases'],
    preferredSkills: ['System Design', 'Design Patterns (GoF)', 'Containerization', 'Cloud Services (AWS/GCP)'],
    dsaExpectations: 'Comprehensive: Dynamic Programming, Graphs, Trees, Heaps, Binary Search, Bit Manipulation',
    interviewTopics: ['Design patterns in practice (Factory, Strategy, Observer)', 'Time and space complexity trade-offs', 'Memory management & garbage collection', 'Concurrency & multithreading'],
    courses: [
      { name: 'Algorithms Specialization', provider: 'Stanford University / Coursera', url: 'https://www.coursera.org/specializations/algorithms', difficulty: 'Advanced', time: '80 hrs' },
      { name: 'Tech Interview Handbook & Grind 75', provider: 'Yangshun Tay', url: 'https://www.techinterviewhandbook.org/grind75', difficulty: 'Intermediate to Advanced', time: '45 hrs' },
      { name: 'Refactoring and Design Patterns', provider: 'Refactoring.Guru', url: 'https://refactoring.guru', difficulty: 'Intermediate', time: '15 hrs' }
    ]
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: '📊',
    summary: 'Transforms raw corporate data into actionable business intelligence through rigorous querying, data wrangling, and interactive dashboards.',
    requiredSkills: ['Advanced SQL (Aggregations, Window Functions, CTEs)', 'Excel / Google Sheets (VLOOKUP, Pivot)', 'Data Visualization (Power BI / Tableau)', 'Python (Pandas, NumPy)', 'Descriptive Statistics'],
    preferredSkills: ['A/B Testing Methodologies', 'Exploratory Data Analysis (EDA)', 'Storytelling with Data', 'Business Metrics (CAC, LTV, Churn)'],
    dsaExpectations: 'SQL queries, Array manipulations, Matrix operations, Sorting, Filtering',
    interviewTopics: ['Window functions (ROW_NUMBER vs RANK vs DENSE_RANK)', 'Detecting and imputing missing data outliers', 'Formulating hypotheses for A/B tests', 'Communicating quantitative findings to executive stakeholders'],
    courses: [
      { name: 'Google Data Analytics Professional Certificate', provider: 'Google / Coursera', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', difficulty: 'Beginner to Intermediate', time: '120 hrs' },
      { name: 'SQL for Data Science', provider: 'UC Davis / Coursera', url: 'https://www.coursera.org/learn/sql-for-data-science', difficulty: 'Beginner', time: '20 hrs' },
      { name: 'Data Visualization with Tableau Specialization', provider: 'UC Davis', url: 'https://www.coursera.org', difficulty: 'Intermediate', time: '30 hrs' }
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: '🔬',
    summary: 'Develops predictive statistical models, machine learning algorithms, and experimental frameworks to uncover hidden patterns and drive automation.',
    requiredSkills: ['Python (NumPy, Pandas, Scikit-Learn)', 'Mathematical Statistics & Probability', 'Machine Learning Algorithms (Regression, Trees, Clustering)', 'SQL Data Extraction', 'Model Evaluation (Precision, Recall, ROC-AUC)'],
    preferredSkills: ['Deep Learning (PyTorch / TensorFlow)', 'Feature Engineering', 'MLOps (MLflow, BentoML)', 'Time Series Forecasting'],
    dsaExpectations: 'Linear Algebra, Matrix Transformations, Dynamic Programming, Graphs',
    interviewTopics: ['Bias-Variance tradeoff & regularization (L1 vs L2)', 'Handling severely imbalanced classification datasets', 'Gradient descent variants and hyperparameter tuning', 'Interpreting model feature importance (SHAP / LIME)'],
    courses: [
      { name: 'Machine Learning Specialization', provider: 'DeepLearning.AI & Andrew Ng', url: 'https://www.coursera.org/specializations/machine-learning-introduction', difficulty: 'Intermediate', time: '65 hrs' },
      { name: 'Applied Data Science with Python', provider: 'University of Michigan', url: 'https://www.coursera.org/specializations/data-science-python', difficulty: 'Intermediate', time: '50 hrs' }
    ]
  },
  {
    id: 'data-engineer',
    name: 'Data Engineer',
    icon: '🏗️',
    summary: 'Builds scalable data lakehouses, ETL/ELT pipelines, and distributed processing infrastructure to power enterprise analytics and machine learning.',
    requiredSkills: ['Python / Scala / Java', 'Distributed Computing (Apache Spark / PySpark)', 'Data Warehousing (Snowflake / BigQuery / Redshift)', 'Advanced SQL & Data Modeling', 'Workflow Orchestration (Airflow / Prefect)', 'Docker'],
    preferredSkills: ['Streaming (Apache Kafka / Flink)', 'dbt (Data Build Tool)', 'Delta Lake / Apache Iceberg', 'Cloud Storage (AWS S3)'],
    dsaExpectations: 'Hash Maps, Partitioning, Sorting, Graph DAGs, Trees, Queues',
    interviewTopics: ['Batch vs Stream processing tradeoffs', 'Data partitioning, shuffling, and skew in Spark', 'Star schema vs Snowflake schema design', 'Idempotency in data pipelines and backfills'],
    courses: [
      { name: 'Data Engineering on Google Cloud', provider: 'Google Cloud / Coursera', url: 'https://www.coursera.org', difficulty: 'Intermediate to Advanced', time: '50 hrs' },
      { name: 'Data Engineering Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/data-engineer', difficulty: 'Intermediate', time: '45 hrs' }
    ]
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    icon: '🤖',
    summary: 'Productionizes artificial intelligence models, LLMs, transformer architectures, and on-device inference engines at scale.',
    requiredSkills: ['Python (PyTorch / TensorFlow)', 'Transformers & HuggingFace', 'Local LLM Inference (Ollama, vLLM, ONNX)', 'Vector Databases & Embeddings', 'RAG (Retrieval-Augmented Generation)', 'REST/FastAPI Model Serving'],
    preferredSkills: ['Quantization (GGUF, AWQ)', 'Model Fine-tuning (LoRA / QLoRA)', 'Agentic Workflows & Tool Calling', 'Prompt Engineering & Safety Guardrails'],
    dsaExpectations: 'Vector Search, Graph Search, Matrix Math, Tries, Dynamic Programming',
    interviewTopics: ['Attention mechanisms in Transformer architectures', 'Optimizing LLM token throughput and memory latency', 'Mitigating hallucinations with verification pipelines', 'Vector indexing algorithms (HNSW vs IVF)'],
    courses: [
      { name: 'Deep Learning Specialization', provider: 'DeepLearning.AI', url: 'https://www.coursera.org/specializations/deep-learning', difficulty: 'Intermediate to Advanced', time: '80 hrs' },
      { name: 'Hugging Face NLP Course', provider: 'Hugging Face', url: 'https://huggingface.co/learn/nlp-course', difficulty: 'Intermediate', time: '30 hrs' },
      { name: 'Generative AI & LLMs in Production', provider: 'DeepLearning.AI', url: 'https://www.deeplearning.ai', difficulty: 'Advanced', time: '25 hrs' }
    ]
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    icon: '🚀',
    summary: 'Automates deployment pipelines, provisions infrastructure as code, monitors reliability, and streamlines developer productivity.',
    requiredSkills: ['Linux System Administration & Bash', 'CI/CD Pipelines (GitHub Actions / GitLab CI)', 'Docker Containerization', 'Kubernetes (K8s)', 'Infrastructure as Code (Terraform)', 'Git'],
    preferredSkills: ['Observability (Prometheus, Grafana, Datadog)', 'Helm Charts', 'Service Meshes (Istio)', 'Cloud Architecture (AWS/GCP/Azure)'],
    dsaExpectations: 'Graph traversal (Dependency graphs), Tree navigation, Strings, System Queues',
    interviewTopics: ['Canary vs Blue-Green vs Rolling deployments', 'Container networking and persistent storage in Kubernetes', 'Zero-downtime database migration strategies', 'Incident management and Post-Mortem RCAs'],
    courses: [
      { name: 'DevOps Roadmap', provider: 'roadmap.sh', url: 'https://roadmap.sh/devops', difficulty: 'Beginner to Advanced', time: '50 hrs' },
      { name: 'Certified Kubernetes Administrator (CKA) Prep', provider: 'Linux Foundation', url: 'https://training.linuxfoundation.org', difficulty: 'Advanced', time: '40 hrs' }
    ]
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    icon: '☁️',
    summary: 'Designs resilient, cost-effective, and secure cloud environments across enterprise workloads using managed cloud services.',
    requiredSkills: ['Cloud Provider Architecture (AWS / Azure / GCP)', 'Networking (VPC, Subnets, Route Tables, VPN)', 'Cloud Security (IAM, Roles, KMS, Secrets)', 'Storage (S3, Blob, Block storage)', 'Serverless (Lambda / Cloud Functions)', 'Terraform'],
    preferredSkills: ['Cost Optimization & FinOps', 'Multi-region disaster recovery', 'Cloud Monitoring (CloudWatch)', 'API Gateway management'],
    dsaExpectations: 'Network graph routing, Tree structures, Hash tables',
    interviewTopics: ['Designing multi-region fault tolerance with Route53 / DNS failover', 'Least privilege IAM security architecture', 'Object storage consistency and lifecycle policies', 'VPC peering vs Transit Gateways'],
    courses: [
      { name: 'AWS Cloud Practitioner & Solutions Architect', provider: 'AWS Training', url: 'https://aws.amazon.com/training/', difficulty: 'Intermediate', time: '40 hrs' },
      { name: 'Microsoft Azure Fundamentals (AZ-900)', provider: 'Microsoft Learn', url: 'https://learn.microsoft.com', difficulty: 'Beginner', time: '20 hrs' }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst/Engineer',
    icon: '🛡️',
    summary: 'Defends digital assets through threat detection, vulnerability auditing, penetration testing, and security compliance enforcement.',
    requiredSkills: ['Network Security & Protocols (TCP/IP, TLS/SSL, DNS)', 'Vulnerability Assessment & OWASP Top 10', 'Linux / Windows Security Hardening', 'SIEM & Log Analysis', 'Identity & Access Management (IAM)', 'Cryptography Fundamentals'],
    preferredSkills: ['Penetration Testing (Burp Suite, Metasploit)', 'Incident Response & Threat Hunting', 'Security Compliance (SOC2, ISO 27001)', 'Secure Code Review'],
    dsaExpectations: 'Bit manipulation, String matching, Hash functions, Trees',
    interviewTopics: ['Explaining and mitigating SQL Injection, XSS, and CSRF', 'Zero Trust architecture principles', 'Symmetric vs Asymmetric encryption and TLS handshakes', 'Conducting root-cause triage during a security incident'],
    courses: [
      { name: 'Google Cybersecurity Certificate', provider: 'Google / Coursera', url: 'https://www.coursera.org/professional-certificates/google-cybersecurity', difficulty: 'Beginner to Intermediate', time: '100 hrs' },
      { name: 'OWASP Top 10 Web Application Security', provider: 'OWASP Foundation', url: 'https://owasp.org/www-project-top-ten/', difficulty: 'Intermediate', time: '15 hrs' }
    ]
  },
  {
    id: 'qa-engineer',
    name: 'QA Engineer / SDET',
    icon: '🧪',
    summary: 'Guarantees software reliability through automated testing frameworks, end-to-end regression suites, and continuous quality checks.',
    requiredSkills: ['Automated Testing (Playwright / Cypress / Selenium)', 'API Testing (Postman / REST Assured)', 'JavaScript / Python / Java for Testing', 'Test Case Design & Bug Lifecycle Management', 'CI/CD Test Integration', 'Git'],
    preferredSkills: ['Performance & Load Testing (k6 / JMeter)', 'BDD Frameworks (Cucumber)', 'Mobile App Testing (Appium)', 'Security Testing basics'],
    dsaExpectations: 'Arrays, Strings, Hash Maps, Stacks, Recursion',
    interviewTopics: ['Test automation pyramid (Unit vs Integration vs E2E)', 'Flaky test root cause mitigation', 'Designing test plans for high-concurrency microservices', 'Writing robust locators resilient to UI DOM refactoring'],
    courses: [
      { name: 'Test Automation University', provider: 'Applitools', url: 'https://testautomationu.applitools.com', difficulty: 'All Levels', time: '30 hrs' },
      { name: 'Playwright Modern End-to-End Testing', provider: 'Playwright.dev', url: 'https://playwright.dev', difficulty: 'Intermediate', time: '12 hrs' }
    ]
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    icon: '📱',
    summary: 'Builds fluid, responsive, and resource-efficient mobile applications for iOS and Android devices.',
    requiredSkills: ['React Native / Flutter / Swift / Kotlin', 'Mobile Lifecycle & State Management', 'REST API Integration & Offline Caching (SQLite)', 'Mobile UI Guidelines (Material Design & iOS HIG)', 'Git'],
    preferredSkills: ['App Store & Play Store Deployment Pipelines', 'Push Notifications (FCM/APNs)', 'Native Modules bridging', 'Mobile Performance & Memory profiling'],
    dsaExpectations: 'Arrays, Strings, Linked Lists, Tree Navigation, Hash Tables',
    interviewTopics: ['Mobile app lifecycle and memory management under low-RAM conditions', 'Offline-first sync and conflict resolution', 'Bridging native platform APIs to cross-platform JS/Dart', 'Optimizing battery and network payload efficiency'],
    courses: [
      { name: 'React Native — The Practical Guide', provider: 'Coursera / Meta', url: 'https://www.coursera.org/professional-certificates/meta-react-native', difficulty: 'Intermediate', time: '40 hrs' },
      { name: 'Android Basics with Compose', provider: 'Google Developers', url: 'https://developer.android.com/courses/android-basics-compose/course', difficulty: 'Beginner to Intermediate', time: '45 hrs' }
    ]
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    icon: '✨',
    summary: 'Designs intuitive user journeys, wireframes, high-fidelity prototypes, and comprehensive design systems centered on human-computer interaction.',
    requiredSkills: ['Figma Mastery (Auto-layout, Components, Variables)', 'Design Systems Architecture', 'Wireframing & Interactive Prototyping', 'User Research & Usability Testing', 'Typography, Color Theory & Spacing Systems', 'Information Architecture'],
    preferredSkills: ['Design Tokens & Tailwind Translation', 'Micro-interactions & Motion Design', 'Accessibility Standards (WCAG 2.1 AA)', 'Heuristic Evaluation'],
    dsaExpectations: 'Information Hierarchy, Flowcharts, Decision Trees, State Machines',
    interviewTopics: ['Walkthrough of an end-to-end design case study', 'Resolving friction between design vision and engineering constraints', 'Conducting usability testing and translating feedback into iterations', 'Building and maintaining scalable multi-brand design systems'],
    courses: [
      { name: 'Google UX Design Professional Certificate', provider: 'Google / Coursera', url: 'https://www.coursera.org/professional-certificates/google-ux-design', difficulty: 'Beginner to Intermediate', time: '110 hrs' },
      { name: 'Design Systems for Figma', provider: 'Figma Community / Learn Design', url: 'https://help.figma.com', difficulty: 'Intermediate', time: '20 hrs' }
    ]
  }
];

export function getRoleById(roleId) {
  return ROLES.find(r => r.id === roleId) || ROLES[0];
}

export function getRoleByName(roleName) {
  if (!roleName) return ROLES[0];
  const lower = roleName.toLowerCase();
  return ROLES.find(r => r.name.toLowerCase().includes(lower) || lower.includes(r.name.toLowerCase())) || ROLES[0];
}
