// PARICHAYA AURA — Soft Skills & Communication Challenge Pool
// Exactly 15+ Varied Unique Questions Across 5 Specialized Communication Domains

export const SOFT_SKILL_QUESTIONS = [
  // ================= 1. WORKPLACE SCENARIOS (3 Questions) =================
  {
    id: 'ss-1',
    category: 'Workplace Scenarios',
    type: 'scenario',
    prompt: 'You discover a critical latency degradation in a pull request scheduled for deployment in 2 hours. The product manager is eager to launch. How do you communicate this?',
    options: [
      { text: 'Authorize the deployment sequence immediately to meet the scheduled release window, assuming the latency issue will naturally resolve itself through caching layers.', score: 0, feedback: 'Neglects quality standards and increases production risk.' },
      { text: 'Draft an urgent, wide-reaching communication channel message insisting that the release must be immediately halted without providing any diagnostic technical context.', score: 30, feedback: 'Causes panic and lacks constructive alternatives.' },
      { text: 'Alert the lead and PM with root-cause data, quantify the user impact, and propose a 30-minute patch or controlled feature-flag rollback.', score: 100, feedback: 'Exemplary ownership, data-driven reasoning, and proactive mitigation.' },
      { text: 'Silently implement a continuous integration revert script to remove their commits from the main branch without communicating to the original author.', score: 20, feedback: 'Damages psychological safety and team collaboration.' }
    ]
  },
  {
    id: 'ss-2',
    category: 'Workplace Scenarios',
    type: 'scenario',
    prompt: 'A senior engineer strongly rejects your architectural proposal during a design review meeting. What is the most constructive response?',
    options: [
      { text: 'Ask clarifying questions to understand their specific performance and maintenance concerns, and offer to benchmark both approaches.', score: 100, feedback: 'Builds consensus through objective benchmarks and professional curiosity.' },
      { text: 'Defend your original proposal adamantly, explaining that the architectural patterns you utilized are based on the latest industry standards they might be unfamiliar with.', score: 10, feedback: 'Antagonistic and dismisses institutional experience.' },
      { text: 'Immediately acknowledge their vast experience and abandon your proposed architecture without seeking to understand the specific engineering tradeoffs involved.', score: 40, feedback: 'Fails to advocate for sound engineering principles.' },
      { text: 'Circumvent the direct feedback by formally escalating the disagreement to the engineering director immediately following the conclusion of the review meeting.', score: 10, feedback: 'Circumvents direct constructive feedback.' }
    ]
  },
  {
    id: 'ss-3',
    category: 'Workplace Scenarios',
    type: 'scenario',
    prompt: 'A cross-functional stakeholder asks for a feature that is out of scope for the current sprint and would jeopardize the core delivery deadline. How do you reply?',
    options: [
      { text: 'Firmly decline the request by pointing them to the established sprint manifesto and emphasizing that the development team does not accept scope creep.', score: 25, feedback: 'Brusque and damages cross-functional alignment.' },
      { text: 'Acknowledge the value of the feature, explain the sprint capacity trade-offs, and offer to prioritize it for backlog grooming in the next sprint.', score: 100, feedback: 'Empathetic, clear boundary setting, and forward-looking prioritization.' },
      { text: 'Commit to integrating the requested feature into the current iteration by significantly extending developer working hours to ensure the core deadline is also met.', score: 15, feedback: 'Unsustainable and risks severe quality regression.' },
      { text: 'Provide verbal assurance that the functionality will be incorporated into the application without formally updating the project management tracking systems.', score: 0, feedback: 'Destroys sprint predictability and team trust.' }
    ]
  },

  // ================= 2. PROFESSIONAL EMAIL REPAIR (3 Questions) =================
  {
    id: 'ss-4',
    category: 'Professional Email Repair',
    type: 'email_repair',
    prompt: 'Review this draft to an enterprise client regarding a database migration downtime: "Hey guys, our servers will be down tonight for DB stuff. Sorry for the trouble."',
    options: [
      { text: 'Dear Partners, please be advised of scheduled maintenance tonight from 02:00 to 03:30 UTC for database performance indexing. No data impact is expected.', score: 100, feedback: 'Clear, authoritative, respectful, and provides exact maintenance windows.' },
      { text: 'Valued Clients, we kindly request that you avoid utilizing the platform components tonight due to an unexpectedly sluggish database performance infrastructure.', score: 20, feedback: 'Unprofessional tone and creates unjustified anxiety.' },
      { text: 'Attention: The server environments may experience unforeseen operational disruptions late tonight. We will deploy our engineering team to rectify any issues promptly.', score: 30, feedback: 'Vague and lacks confidence.' },
      { text: 'URGENT NOTIFICATION: ALL PRIMARY SYSTEM INFRASTRUCTURE WILL BE TEMPORARILY SUSPENDED TONIGHT TO ACCOMMODATE CRITICAL SECURITY AND DATABASE PATCHES.', score: 25, feedback: 'Overly alarmist and lacks composure.' }
    ]
  },
  {
    id: 'ss-5',
    category: 'Professional Email Repair',
    type: 'email_repair',
    prompt: 'Improve this email follow-up after an interview: "Did you guys pick someone yet? When will I know?"',
    options: [
      { text: 'Thank you again for the engaging conversation regarding the Full-Stack role. I remain very enthusiastic about the team\'s mission and would welcome any updates on the interview timeline.', score: 100, feedback: 'Courteous, reaffirms enthusiasm, and respects the hiring process.' },
      { text: 'I am writing to formally request an update regarding whether a candidate has been selected for the position or if my application has been respectfully declined.', score: 45, feedback: 'Too blunt.' },
      { text: 'Please ensure to reply at your earliest possible convenience to provide a definitive status update on the hiring committee\'s final selection decision.', score: 10, feedback: 'Demanding and discourteous.' },
      { text: 'Given the extended duration since our last correspondence, I can only logically presume that this silence indicates my rejection from the candidate pool.', score: 0, feedback: 'Passive-aggressive and burns bridges.' }
    ]
  },
  {
    id: 'ss-6',
    category: 'Professional Email Repair',
    type: 'email_repair',
    prompt: 'Improve this bug status email to an executive: "The bug is very bad and we don\'t know what broke yet."',
    options: [
      { text: 'We have isolated the regression to the payment webhook gateway. Our team is running diagnostics, and we will provide an updated status report within 45 minutes.', score: 100, feedback: 'Crisp executive communication with scope isolation and strict SLA on updates.' },
      { text: 'The payment integration system has experienced a catastrophic failure globally. Our engineering squads are currently reviewing the extensive server logs to identify the issue.', score: 30, feedback: 'Lacks professional composure.' },
      { text: 'It appears an unverified code deployment has severely compromised the checkout workflow. The responsible developers are actively mitigating the problem right now.', score: 20, feedback: 'Finger-pointing and unprofessional.' },
      { text: 'We are currently lacking substantive updates on the nature of the application failure. Please monitor the situation and check back with us at a later time.', score: 5, feedback: 'Dismissive and fails to instill confidence.' }
    ]
  },

  // ================= 3. JUMBLED SENTENCE BUILDER (3 Questions) =================
  {
    id: 'ss-7',
    category: 'Sentence Construction',
    type: 'jumble',
    prompt: 'Assemble these fragmented chips into a coherent executive technical summary:',
    chips: [
      { id: '1', text: 'By deploying automated canary pipelines,' },
      { id: '2', text: 'we minimized production regression incidents' },
      { id: '3', text: 'and accelerated sprint velocity by 35%.' }
    ],
    correctOrder: ['1', '2', '3'],
    explanation: 'Leads with the engineering methodology, details the risk reduction, and concludes with quantified velocity gain.'
  },
  {
    id: 'ss-8',
    category: 'Sentence Construction',
    type: 'jumble',
    prompt: 'Assemble into an active leadership bullet point:',
    chips: [
      { id: '1', text: 'I facilitated cross-functional design sprints' },
      { id: '2', text: 'to align product, engineering, and security requirements' },
      { id: '3', text: 'ahead of enterprise SOC2 compliance audits.' }
    ],
    correctOrder: ['1', '2', '3'],
    explanation: 'Uses strong action verb, states the cross-functional purpose, and grounds it in a compliance milestone.'
  },
  {
    id: 'ss-9',
    category: 'Sentence Construction',
    type: 'jumble',
    prompt: 'Assemble into an impactful problem-solution statement:',
    chips: [
      { id: '1', text: 'To eliminate database bottleneck latency,' },
      { id: '2', text: 'we restructured composite query indexes' },
      { id: '3', text: 'slashing p99 response times from 800ms to 42ms.' }
    ],
    correctOrder: ['1', '2', '3'],
    explanation: 'Clear problem framing, technical intervention, followed by exact metric proof.'
  },

  // ================= 4. SENTENCE UPGRADE & EXECUTIVE TONE (3 Questions) =================
  {
    id: 'ss-10',
    category: 'Executive Phrasing',
    type: 'upgrade',
    prompt: 'Transform: "I wrote code for the login page and made sure cookies worked."',
    options: [
      { text: 'Engineered secure JWT session authentication with HTTP-only cookies and CSRF protection, safeguarding 50,000+ active user accounts.', score: 100, feedback: 'Technical precision, security awareness, and scale quantification.' },
      { text: 'Successfully managed the frontend user authentication inputs and rigorously tested the integrated login buttons to ensure cookie persistence was active.', score: 35, feedback: 'Focuses on basic UI actions rather than system security.' },
      { text: 'Maintained full responsibility for guaranteeing that the user authorization process functioned correctly according to the provided system specifications.', score: 20, feedback: 'Passive duty-oriented phrasing.' },
      { text: 'Authored multiple dynamic React components that seamlessly communicated with our backend authentication endpoints to facilitate user access.', score: 40, feedback: 'Lacks security and impact context.' }
    ]
  },
  {
    id: 'ss-11',
    category: 'Executive Phrasing',
    type: 'upgrade',
    prompt: 'Transform: "Helped reduce AWS bill by deleting unused stuff."',
    options: [
      { text: 'Spearheaded cloud FinOps audit across 12 AWS accounts, terminating orphaned EBS volumes and rightsizing instances to yield $18,000 in annualized savings.', score: 100, feedback: 'Exceptional financial acumen, leadership verb, and exact dollar outcome.' },
      { text: 'Consistently reviewed the AWS management console architecture to identify and manually remove various unused EC2 instances that were consuming resources.', score: 30, feedback: 'Casual and misses organizational impact.' },
      { text: 'Assisted the senior DevOps lead with the systematic deletion of outdated development cloud resources to improve overall financial expenditure efficiency.', score: 40, feedback: 'Minimizes role to junior assistant.' },
      { text: 'Configured and deployed comprehensive AWS cost monitoring alarms to alert engineering team leads regarding any anomalous architectural billing spikes.', score: 50, feedback: 'Describes monitoring rather than proactive cost optimization.' }
    ]
  },
  {
    id: 'ss-12',
    category: 'Executive Phrasing',
    type: 'upgrade',
    prompt: 'Transform: "I was on call and fixed servers when they crashed."',
    options: [
      { text: 'Maintained 99.95% service SLA as primary on-call engineer, resolving critical production P1 incidents with a mean time to recovery (MTTR) under 14 minutes.', score: 100, feedback: 'Senior operational reliability metrics (SLA, MTTR, P1).' },
      { text: 'Diligently executed administrative reboots on backend server clusters whenever automated performance alerts were triggered during scheduled night shifts.', score: 25, feedback: 'Focuses on reactive reboots rather than system health.' },
      { text: 'Participated in regular on-call rotation schedules, taking responsibility for actively monitoring and checking comprehensive server health visualization graphs.', score: 30, feedback: 'Describes routine duty.' },
      { text: 'Provided pivotal assistance in diagnosing and resolving multiple critical outage tickets that were initially escalated by the customer support organization.', score: 35, feedback: 'Lacks metrics and ownership.' }
    ]
  },

  // ================= 5. VOCABULARY & PRECISION (3 Questions) =================
  {
    id: 'ss-13',
    category: 'Communication Precision',
    type: 'precision',
    prompt: 'Select the most accurate technical term to replace the bracketed word: "Our service architecture is designed to handle failure without crashing by [failing gracefully]."',
    options: [
      { text: 'Implementing a highly fault-tolerant operational resilience ecosystem', score: 100, feedback: 'Exact engineering terminology denoting continuous operation despite hardware/software defects.' },
      { text: 'Establishing a remarkably sturdy operational technology infrastructure', score: 20, feedback: 'Colloquial and imprecise.' },
      { text: 'Deploying a mathematically error-proof computational networking grid', score: 40, feedback: 'Misleading; no system is mathematically error-proof.' },
      { text: 'Configuring a thoroughly robust application containment environment', score: 25, feedback: 'Informal.' }
    ]
  },
  {
    id: 'ss-14',
    category: 'Communication Precision',
    type: 'precision',
    prompt: 'Select the optimal phrase for stakeholder communication: "We cannot deliver feature X because [it depends on another team who is slow]."',
    options: [
      { text: 'Feature X has an upstream dependency on the Data Platform team\'s schema migration, currently scheduled for completion in Sprint 4.', score: 100, feedback: 'Diplomatic, avoids blaming, and identifies structural dependencies clearly.' },
      { text: 'The Data Engineering team is effectively blocking our progress and preventing us from successfully finalizing our assigned project deliverables.', score: 25, feedback: 'Divisive blame language.' },
      { text: 'Several concurrent engineering squads are currently running significantly behind schedule, which has cascaded into our timeline constraints.', score: 15, feedback: 'Unprofessional.' },
      { text: 'We are unfortunately forced to suspend our implementation strategy until other personnel finalize their respective operational responsibilities.', score: 0, feedback: 'Highly unprofessional.' }
    ]
  },
  {
    id: 'ss-15',
    category: 'Communication Precision',
    type: 'precision',
    prompt: 'Select the best phrase when answering an interview question you do not know: "I haven\'t worked with Kubernetes before..."',
    options: [
      { text: '"While I haven\'t managed Kubernetes in production yet, I have extensive experience containerizing services with Docker and understand K8s pod orchestration and deployment concepts. I\'m confident I can bridge the gap rapidly."', score: 100, feedback: 'Honest, emphasizes foundational competencies, and demonstrates learning agility.' },
      { text: '"I must admit that I currently do not possess any functional knowledge regarding the configuration or deployment of Kubernetes orchestration clusters, apologies."', score: 20, feedback: 'Dead-end answer that halts conversational momentum.' },
      { text: '"I consider myself to be an absolute domain expert at managing distributed container orchestration systems at an enterprise enterprise scale."', score: 0, feedback: 'Dishonest and will fail technical follow-up questions.' },
      { text: '"In my professional assessment, the vast majority of modern startup environments actively avoid adopting Kubernetes due to its significant configuration overhead."', score: 5, feedback: 'Dismissive and counterproductive.' }
    ]
  }
];

export function computeSoftSkillScore(answers) {
  let totalScore = 0;
  let categoryScores = {
    'Workplace Scenarios': 0,
    'Professional Email Repair': 0,
    'Sentence Construction': 0,
    'Executive Phrasing': 0,
    'Communication Precision': 0
  };
  let categoryCounts = {
    'Workplace Scenarios': 0,
    'Professional Email Repair': 0,
    'Sentence Construction': 0,
    'Executive Phrasing': 0,
    'Communication Precision': 0
  };

  answers.forEach((ans, idx) => {
    const q = SOFT_SKILL_QUESTIONS[idx];
    if (!q) return;
    const score = ans.score || 0;
    totalScore += score;
    categoryScores[q.category] = (categoryScores[q.category] || 0) + score;
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  });

  const overall = Math.round(totalScore / SOFT_SKILL_QUESTIONS.length);

  const clarityScore = Math.min(100, Math.round((categoryScores['Executive Phrasing'] / (categoryCounts['Executive Phrasing'] * 100 || 1)) * 100));
  const professionalismScore = Math.min(100, Math.round((categoryScores['Workplace Scenarios'] / (categoryCounts['Workplace Scenarios'] * 100 || 1)) * 100));
  const grammarScore = Math.min(100, Math.round((categoryScores['Sentence Construction'] / (categoryCounts['Sentence Construction'] * 100 || 1)) * 100));
  const vocabularyScore = Math.min(100, Math.round((categoryScores['Communication Precision'] / (categoryCounts['Communication Precision'] * 100 || 1)) * 100));
  const communicationScore = Math.min(100, Math.round((categoryScores['Professional Email Repair'] / (categoryCounts['Professional Email Repair'] * 100 || 1)) * 100));

  const weakest = [];
  if (clarityScore < 70) weakest.push('Executive Phrasing');
  if (professionalismScore < 70) weakest.push('Workplace Scenarios');
  if (communicationScore < 70) weakest.push('Professional Email Tone');
  if (vocabularyScore < 70) weakest.push('Technical Communication Precision');
  if (grammarScore < 70) weakest.push('Sentence Construction');

  return {
    overallScore: overall,
    clarityScore,
    professionalismScore,
    grammarScore,
    vocabularyScore,
    communicationScore,
    weakestAreas: weakest.length > 0 ? weakest : ['Refining X-Y-Z metrics under pressure']
  };
}
