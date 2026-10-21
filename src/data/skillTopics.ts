export interface SkillTopic {
  level_number: number;
  topic: string;
}

export const SKILL_TOPICS_MAP: Record<number, SkillTopic[]> = {
  1: [ // Data Structures & Algorithms
    { level_number: 1, topic: "Time & Space Complexity, Big-O notation, Arrays & Strings basics" },
    { level_number: 2, topic: "Pointers, recursion, basic searching (Binary Search) and sorting algorithms" },
    { level_number: 3, topic: "Singly & Doubly Linked Lists, insertion, deletion, cycle detection" },
    { level_number: 4, topic: "Stacks & Queues: Monotonic stack, circular queue, deque applications" },
    { level_number: 5, topic: "Hashing techniques, HashMaps, HashSets, collision resolution, two-pointer methods" },
    { level_number: 6, topic: "Trees: Traversals (BFS/DFS), Binary Search Trees, LCA, balanced BSTs" },
    { level_number: 7, topic: "Heaps, Priority Queues, intervals, sliding window maximum" },
    { level_number: 8, topic: "Graph Algorithms: BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort" },
    { level_number: 9, topic: "Dynamic Programming: Memoization, Tabulation, 1D/2D state formulation" },
    { level_number: 10, topic: "Advanced DP with bitmasks, Trie structures, Segment Trees, NP problems" }
  ],
  2: [ // Object-Oriented Programming
    { level_number: 1, topic: "Core concepts: Classes, Objects, methods, state, constructor basics" },
    { level_number: 2, topic: "Encapsulation, Data Hiding, Getters/Setters, Access Modifiers" },
    { level_number: 3, topic: "Inheritance hierarchies, code reuse, super calls, single vs multiple" },
    { level_number: 4, topic: "Polymorphism: Method overloading vs method overriding, virtual dispatch" },
    { level_number: 5, topic: "Abstract Classes, Interfaces, Default methods, Contract-first design" },
    { level_number: 6, topic: "SOLID Principles: Single Responsibility, Open-Closed, Liskov Substitution" },
    { level_number: 7, topic: "SOLID Principles: Interface Segregation, Dependency Inversion" },
    { level_number: 8, topic: "Creational & Structural Patterns: Singleton, Factory, Builder, Adapter" },
    { level_number: 9, topic: "Behavioral Patterns: Observer, Strategy, Command, State patterns" },
    { level_number: 10, topic: "Enterprise domain modeling, Clean Architecture, anti-patterns avoidance" }
  ],
  3: [ // SQL & Databases
    { level_number: 1, topic: "Relational database concepts, tables, primary & foreign keys, data types" },
    { level_number: 2, topic: "Basic DDL & DML: CREATE, ALTER, INSERT, UPDATE, DELETE queries" },
    { level_number: 3, topic: "Basic SELECT filtering: WHERE, ORDER BY, LIMIT, LIKE, NULL handling" },
    { level_number: 4, topic: "Aggregate functions, GROUP BY, HAVING clauses for summary reporting" },
    { level_number: 5, topic: "Relational Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS joins" },
    { level_number: 6, topic: "Subqueries, Nested queries, EXISTS, IN, ANY, ALL predicates" },
    { level_number: 7, topic: "Window functions: ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, PARTITION BY" },
    { level_number: 8, topic: "Indexes (B-tree, Hash), Query execution plans (EXPLAIN), optimization" },
    { level_number: 9, topic: "ACID transactions, isolation levels, row locking, stored procedures, triggers" },
    { level_number: 10, topic: "Database sharding, partitioning, replication topologies, NoSQL hybrid models" }
  ],
  4: [ // Cloud Fundamentals (AWS/Azure)
    { level_number: 1, topic: "Cloud basics: IaaS vs PaaS vs SaaS, public vs private vs hybrid models" },
    { level_number: 2, topic: "Regions, Availability Zones, high availability concepts, edge locations" },
    { level_number: 3, topic: "Compute fundamentals: Virtual Machines (EC2/Azure VMs), instance types" },
    { level_number: 4, topic: "Storage services: Object storage (S3/Blob), Block storage (EBS), lifecycle rules" },
    { level_number: 5, topic: "Networking: VPC/VNet, Subnets, Route Tables, Internet Gateways, NAT" },
    { level_number: 6, topic: "Identity & Access: IAM roles, policies, least privilege, security groups" },
    { level_number: 7, topic: "Managed Databases: RDS, Aurora, DynamoDB, Cosmos DB fundamentals" },
    { level_number: 8, topic: "Serverless compute & integration: AWS Lambda, Azure Functions, SQS, SNS" },
    { level_number: 9, topic: "Container orchestration: ECS, EKS, AKS, container registry management" },
    { level_number: 10, topic: "Cloud architecture frameworks, Cost optimization, Multi-region failover" }
  ],
  5: [ // Operating Systems
    { level_number: 1, topic: "OS architecture: Kernel vs User space, system calls, OS types & roles" },
    { level_number: 2, topic: "Process concept: PCB, process states, fork, exec, process termination" },
    { level_number: 3, topic: "Threads: User vs Kernel threads, multi-threading models, concurrency basics" },
    { level_number: 4, topic: "CPU Scheduling algorithms: FCFS, SJF, Round Robin, Priority scheduling" },
    { level_number: 5, topic: "Process Synchronization: Critical Section, Race Conditions, Peterson's algorithm" },
    { level_number: 6, topic: "Semaphores, Mutex locks, Producer-Consumer and Dining Philosophers problems" },
    { level_number: 7, topic: "Deadlocks: Prevention, Avoidance (Banker's Algorithm), Detection, Recovery" },
    { level_number: 8, topic: "Memory Management: Paging, Segmentation, Virtual Memory, Page replacement" },
    { level_number: 9, topic: "File Systems: Inodes, directory structures, disk scheduling (SSTF, SCAN)" },
    { level_number: 10, topic: "Virtualization hypervisors, container primitives (cgroups, namespaces), RTOS" }
  ],
  6: [ // Computer Networks
    { level_number: 1, topic: "Network topologies, OSI vs TCP/IP model layers and fundamental functions" },
    { level_number: 2, topic: "Physical & Data Link layers: Framing, MAC addressing, CSMA/CD, switches" },
    { level_number: 3, topic: "Network Layer: IPv4 vs IPv6 addressing, subnetting, CIDR notation" },
    { level_number: 4, topic: "Routing fundamentals: Distance Vector, Link State, OSPF, BGP overview" },
    { level_number: 5, topic: "Transport Layer: TCP 3-way handshake, TCP connection teardown, UDP protocol" },
    { level_number: 6, topic: "TCP Flow Control: Sliding window, Congestion control (Slow start, AIMD)" },
    { level_number: 7, topic: "Application Layer protocols: HTTP/1.1 vs HTTP/2 vs HTTP/3, DNS lookup flow" },
    { level_number: 8, topic: "Network Security: SSL/TLS handshake, HTTPS encryption, Firewalls, VPNs" },
    { level_number: 9, topic: "Load Balancing: L4 vs L7 proxies, reverse proxies, CDN edge caching" },
    { level_number: 10, topic: "Software-Defined Networking (SDN), zero-trust networks, socket programming" }
  ],
  7: [ // Aptitude & Logical Reasoning
    { level_number: 1, topic: "Basic arithmetic: Percentages, Ratios, Proportions, Averages, Fractions" },
    { level_number: 2, topic: "Number systems, LCM & HCF, Divisibility rules, Surds & Indices" },
    { level_number: 3, topic: "Time, Speed & Distance: Relative speed, Trains, Boats & Streams" },
    { level_number: 4, topic: "Time & Work: Efficiency, Pipes & Cisterns, Unitary work method" },
    { level_number: 5, topic: "Profit & Loss, Discounts, Simple and Compound Interest calculations" },
    { level_number: 6, topic: "Permutations, Combinations, and Probability fundamentals" },
    { level_number: 7, topic: "Logical Reasoning: Number series, Coding-Decoding, Blood relations, Directions" },
    { level_number: 8, topic: "Analytical Reasoning: Seating arrangements (linear/circular), Puzzles" },
    { level_number: 9, topic: "Data Interpretation: Bar graphs, Pie charts, Line plots, Tabular datasets" },
    { level_number: 10, topic: "Critical Thinking: Syllogisms, Statement-Assumption, Cause-and-Effect deduction" }
  ],
  8: [ // Communication & Behavioral
    { level_number: 1, topic: "Professional introduction: Elevator pitch, crafting your career narrative" },
    { level_number: 2, topic: "Active listening skills, asking clarifying questions in technical contexts" },
    { level_number: 3, topic: "Structured email writing, meeting etiquette, clear documentation norms" },
    { level_number: 4, topic: "STAR Method mastery: Situation, Task, Action, Result behavioral answering" },
    { level_number: 5, topic: "Handling conflict, receiving constructive feedback, professional resilience" },
    { level_number: 6, topic: "Cross-functional team collaboration, empathy, and stakeholder management" },
    { level_number: 7, topic: "Technical explanation to non-technical stakeholders with metaphors and diagrams" },
    { level_number: 8, topic: "Leadership qualities, ownership mindset, initiative, and proactive problem solving" },
    { level_number: 9, topic: "Negotiation, influencing without authority, project consensus building" },
    { level_number: 10, topic: "Executive presentation, global business communication, crisis diplomacy" }
  ],
  9: [ // Web Development Basics
    { level_number: 1, topic: "Semantic HTML5 elements, page structure, forms, validation, accessibility" },
    { level_number: 2, topic: "CSS3 fundamentals: Box model, display properties, positioning, typography" },
    { level_number: 3, topic: "Responsive design: Media queries, Flexbox layout, CSS Grid systems" },
    { level_number: 4, topic: "Modern JavaScript (ES6+): let/const, arrow functions, destructuring, modules" },
    { level_number: 5, topic: "DOM manipulation, event delegation, bubbling, form processing" },
    { level_number: 6, topic: "Asynchronous JS: Event loop, Promises, async/await, Fetch API & AJAX" },
    { level_number: 7, topic: "Browser APIs: LocalStorage, SessionStorage, Cookies, History API" },
    { level_number: 8, topic: "Component-based UI libraries (React basics): JSX, Props, State, Hooks" },
    { level_number: 9, topic: "Web Performance: Asset optimization, lazy loading, Core Web Vitals" },
    { level_number: 10, topic: "Web Security fundamentals: CORS, CSRF, XSS prevention, Content Security Policy" }
  ],
  10: [ // System Design (Intro)
    { level_number: 1, topic: "System architecture basics: Monolith vs Microservices, Client-Server model" },
    { level_number: 2, topic: "Latency vs Throughput, Availability vs Consistency, SLA / SLO metrics" },
    { level_number: 3, topic: "Horizontal vs Vertical scaling, Stateless vs Stateful service patterns" },
    { level_number: 4, topic: "Load balancing strategies: Round robin, Least connections, IP Hash" },
    { level_number: 5, topic: "Caching strategies: Cache-aside, Write-through, Write-back, Eviction (LRU/LFU)" },
    { level_number: 6, topic: "Database choice: SQL vs NoSQL, Document, Key-Value, Graph databases" },
    { level_number: 7, topic: "Message Queues & Event Streaming: Asynchronous processing, Kafka, RabbitMQ" },
    { level_number: 8, topic: "CAP Theorem, PACELC theorem, eventual consistency, distributed transactions" },
    { level_number: 9, topic: "Case Study: Designing a URL shortener (TinyURL) or Rate Limiter service" },
    { level_number: 10, topic: "Fault tolerance: Circuit breakers, Retries with backoff, Disaster recovery" }
  ],
  11: [ // Git & Version Control
    { level_number: 1, topic: "Version control rationale, Git vs SVN, local repository initialization" },
    { level_number: 2, topic: "Git architecture: Working directory, Staging area, Local commit history" },
    { level_number: 3, topic: "Essential commands: git status, add, commit, diff, log, .gitignore usage" },
    { level_number: 4, topic: "Branching basics: Creating branches, switching (checkout/switch), listing" },
    { level_number: 5, topic: "Remote repositories: git remote, push, fetch, pull, tracking branches" },
    { level_number: 6, topic: "Merging strategies: Fast-forward vs 3-way merge, resolving merge conflicts" },
    { level_number: 7, topic: "Git Rebase: Interactive rebase (squash, reword, fixup), rebase vs merge" },
    { level_number: 8, topic: "Undoing changes: git revert, reset (soft/mixed/hard), checkout, reflog" },
    { level_number: 9, topic: "Collaboration workflows: Pull Requests, Code Reviews, Gitflow, Trunk-based" },
    { level_number: 10, topic: "Git hooks, Submodules, Signed commits, Monorepo tooling & bisect debugging" }
  ],
  12: [ // Generative AI Basics
    { level_number: 1, topic: "Foundations: AI vs ML vs Deep Learning, Discriminative vs Generative models" },
    { level_number: 2, topic: "Transformers overview: Self-attention mechanism, Encoders and Decoders" },
    { level_number: 3, topic: "Large Language Models (LLMs): Tokens, Context windows, Pre-training concepts" },
    { level_number: 4, topic: "Prompt Engineering: Zero-shot, Few-shot, Chain-of-Thought prompting techniques" },
    { level_number: 5, topic: "Embeddings & Vector Spaces: Semantic search, cosine similarity calculations" },
    { level_number: 6, topic: "Vector Databases: Pinecone, Chroma, Qdrant indexing, hybrid search" },
    { level_number: 7, topic: "Retrieval-Augmented Generation (RAG): Architecture, chunking, retrieval evaluation" },
    { level_number: 8, topic: "Fine-tuning techniques: LoRA, QLoRA, instruction tuning vs prompting" },
    { level_number: 9, topic: "AI Agents: Tool calling, Function calling, ReAct loops, LangChain basics" },
    { level_number: 10, topic: "GenAI Safety, Guardrails, Hallucination mitigation, Responsible AI governance" }
  ]
};

export function getSkillTopics(skillSetId: number): SkillTopic[] {
  return SKILL_TOPICS_MAP[skillSetId] || [];
}
