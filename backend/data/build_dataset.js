const fs = require('fs');
const path = require('path');

// Helper to convert list of topic strings to { topicName, description, subtopics: [{ name, description, details }] }
function formatTopics(topicList) {
    return topicList.map(t => {
        if (typeof t === 'string') {
            return {
                topicName: t,
                description: `Covers fundamental concepts and analytical methods for ${t}.`,
                subtopics: [
                    {
                        name: `${t} - Core Principles`,
                        description: `Conceptual foundations, mathematical formulation, and key definitions of ${t}.`,
                        details: `Theoretical framework, standard procedures, problem-solving techniques, and practical engineering applications of ${t}.`
                    }
                ]
            };
        }
        return t;
    });
}

const ecsSemester3Courses = [
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283111",
        subjectName: "Engineering Mathematics-III",
        description: "Covers Laplace Transforms, Fourier Series, Vector Spaces, Linear Transformations, and Matrix Eigenvalues essential for Electronics and Computer Science Engineering.",
        category: "Program Core",
        credits: 3,
        hours: { theoryHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Understand Laplace transform and its properties to solve differential equations." },
            { code: "CO2", description: "Apply inverse Laplace transforms and convolution theorem to system response analysis." },
            { code: "CO3", description: "Express periodic functions as Fourier series and compute half-range expansions." },
            { code: "CO4", description: "Analyze finite-dimensional vector spaces, bases, inner products, and Gram-Schmidt orthogonalization." },
            { code: "CO5", description: "Evaluate linear transformations, kernel, range, and rank-nullity relationships." },
            { code: "CO6", description: "Compute eigenvalues, eigenvectors, and diagonalize symmetric and square matrices." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Laplace Transforms",
                hours: 5,
                description: "Definition, properties, and standard functions of unilateral Laplace transforms.",
                topics: formatTopics([
                    "Definition of Laplace transform",
                    "Conditions of existence",
                    "Laplace transform of standard functions",
                    "e^at",
                    "sin(at)",
                    "cos(at)",
                    "sinh(at)",
                    "cosh(at)",
                    "t^n",
                    "Linearity property",
                    "First shifting theorem",
                    "Change of scale property",
                    "Multiplication by t",
                    "Division by t",
                    "Laplace transform of derivatives",
                    "Laplace transform of integrals",
                    "Evaluation of integrals using Laplace transformation"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Inverse Laplace Transform",
                hours: 4,
                description: "Techniques and theorems for computing inverse Laplace transforms.",
                topics: formatTopics([
                    "Inverse Laplace transform",
                    "Linearity property",
                    "Standard formulae",
                    "Inverse Laplace transform using derivatives",
                    "Partial fractions",
                    "Convolution theorem"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Fourier Series",
                hours: 5,
                description: "Orthogonal expansions of periodic functions using Dirichlet conditions.",
                topics: formatTopics([
                    "Dirichlet conditions",
                    "Fourier series",
                    "Parseval's identity",
                    "Fourier series on interval (c,c+2l)",
                    "Half-range sine series",
                    "Half-range cosine series"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Vector Spaces",
                hours: 4,
                description: "Linear algebra foundations of vector spaces, spans, bases, and inner product spaces.",
                topics: formatTopics([
                    "N-dimensional vector spaces",
                    "Finite-dimensional vector spaces",
                    "Linear span",
                    "Basis",
                    "Dimension",
                    "Subspace",
                    "Cauchy-Schwarz inequality",
                    "Inner product spaces",
                    "Norm",
                    "Orthogonal vectors",
                    "Orthogonal projection",
                    "Orthogonal complements",
                    "Gram-Schmidt orthogonalization"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Linear Transformation",
                hours: 4,
                description: "Mappings between vector spaces, geometric transformations, and matrix representation.",
                topics: formatTopics([
                    "Linear transformation",
                    "Reflection",
                    "Projection",
                    "Rotation",
                    "Contraction",
                    "Dilation",
                    "Shear",
                    "Kernel",
                    "Range",
                    "Rank-nullity theorem",
                    "Matrix of linear transformation",
                    "Composition of linear transformations",
                    "Inverse of linear transformation",
                    "Change of bases"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Eigenvalues and Eigenvectors",
                hours: 4,
                description: "Spectral decomposition, characteristic equations, and matrix diagonalization.",
                topics: formatTopics([
                    "Characteristic equation",
                    "Eigenvalues",
                    "Eigenvectors",
                    "Properties of eigenvalues",
                    "Properties of eigenvectors",
                    "Similarity of matrices",
                    "Diagonalization",
                    "Functions of square matrices"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283112",
        subjectName: "Electronic Devices and Circuits",
        description: "Covers semiconductor diode applications, BJT and MOSFET amplifier configurations, power amplifiers, and power electronic switching devices.",
        category: "Program Core",
        credits: 3,
        hours: { theoryHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 39 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Analyze diode wave-shaping circuits, clippers, and clampers." },
            { code: "CO2", description: "Design rectifier circuits with capacitive, inductive, and filter networks." },
            { code: "CO3", description: "Examine BJT small-signal models and design single-stage amplifiers." },
            { code: "CO4", description: "Model MOSFET amplifier topologies and analyze AC small-signal parameters." },
            { code: "CO5", description: "Evaluate power amplifier classes (Class A, B, AB, C) and efficiency." },
            { code: "CO6", description: "Understand operational characteristics of power electronic devices (Thyristors, IGBTs, GTOs)." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Clippers and Clampers",
                hours: 6,
                description: "PN junction characteristics and wave-shaping circuits.",
                topics: formatTopics([
                    "PN junction diode structure",
                    "PN junction diode construction",
                    "Diode symbol",
                    "Zero bias operation",
                    "Forward bias",
                    "Reverse bias",
                    "Avalanche breakdown",
                    "V-I characteristics",
                    "Temperature effects",
                    "PN junction diode clippers",
                    "PN junction diode clampers",
                    "Input-output waveforms",
                    "Transfer characteristics",
                    "Circuit analysis"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Rectifiers and Filters",
                hours: 6,
                description: "AC to DC conversion and ripple suppression filters.",
                topics: formatTopics([
                    "Full-wave centre-tapped rectifier",
                    "Bridge rectifier",
                    "DC output voltage",
                    "RMS output voltage",
                    "DC output current",
                    "RMS output current",
                    "Ripple factor",
                    "Capacitor filter",
                    "Inductor filter",
                    "LC filter",
                    "C-L-C / pi filter"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "BJT Based Circuits",
                hours: 8,
                description: "Bipolar junction transistor biasing, load lines, and small-signal amplification.",
                topics: formatTopics([
                    "DC load line",
                    "Regions of operation",
                    "BJT configurations",
                    "Biasing circuits",
                    "Bias stability",
                    "Bias compensation",
                    "AC load line",
                    "Small signal models",
                    "h-parameter model",
                    "Hybrid-pi model",
                    "CE amplifier",
                    "CB amplifier",
                    "CC amplifier",
                    "Voltage gain",
                    "Current gain",
                    "Input impedance",
                    "Output impedance",
                    "CE amplifier design"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "MOSFET Based Circuits",
                hours: 8,
                description: "MOSFET operation, small-signal equivalent circuits, and CS/CD/CG amplifier design.",
                topics: formatTopics([
                    "DC load line",
                    "MOSFET regions of operation",
                    "MOSFET configurations",
                    "Biasing circuits",
                    "AC load line",
                    "Small signal MOSFET model",
                    "Common-source amplifier",
                    "Source follower",
                    "Common-gate amplifier",
                    "CS amplifier design"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Power Amplifier",
                hours: 5,
                description: "Large-signal audio and RF power amplification topologies.",
                topics: formatTopics([
                    "Power amplifier",
                    "Voltage amplifier versus power amplifier",
                    "Class A amplifier",
                    "Class B amplifier",
                    "Class AB amplifier",
                    "Class C amplifier",
                    "MOSFET power amplifier"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Power Electronic Devices",
                hours: 6,
                description: "Solid-state power switching components and trigger mechanisms.",
                topics: formatTopics([
                    "Need for power electronic devices",
                    "Thyristor",
                    "Power MOSFET",
                    "IGBT",
                    "IGCT",
                    "GTO",
                    "Construction",
                    "Characteristics",
                    "Applications"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283113",
        subjectName: "Computer Organization and Architecture",
        description: "Examines processor datapath design, instruction sets, memory hierarchy, pipelining, and modern parallel architectures.",
        category: "Program Core",
        credits: 3,
        hours: { theoryHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 39 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Demonstrate arithmetic algorithms including Booth multiplier and division techniques." },
            { code: "CO2", description: "Design hardwired and microprogrammed control units for CPU instruction execution." },
            { code: "CO3", description: "Evaluate cache memory mapping, coherency (MESI), and virtual memory paging." },
            { code: "CO4", description: "Understand interrupt handling, DMA data transfers, and bus arbitration protocols." },
            { code: "CO5", description: "Analyze instruction pipelining, pipeline hazards, and hazard resolution techniques." },
            { code: "CO6", description: "Explain superscalar processor features, GPU architectures, and multi-core systems." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Introductory Concepts",
                hours: 6,
                description: "Von Neumann architecture, numerical representations, and arithmetic algorithms.",
                topics: formatTopics([
                    "Basic building blocks of computer",
                    "Moore's law",
                    "Evolution of x86 computers",
                    "Von Neumann model",
                    "Harvard model",
                    "Performance measures",
                    "Floating-point representation",
                    "Floating-point arithmetic",
                    "IEEE 754",
                    "Booth multiplier",
                    "Restoring division",
                    "Non-restoring division"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Processor Organization",
                hours: 8,
                description: "CPU datapath, instruction formats, addressing modes, and control unit design.",
                topics: formatTopics([
                    "Instruction format",
                    "Instruction cycle",
                    "Instruction-set types",
                    "Addressing modes",
                    "Datapath organization",
                    "Control sequences",
                    "Hardwired control unit",
                    "Microprogrammed control unit",
                    "Nano-programming",
                    "CISC versus RISC"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Memory Organization",
                hours: 8,
                description: "Cache hierarchies, mapping techniques, MESI protocol, and virtual memory.",
                topics: formatTopics([
                    "Types of memory",
                    "Memory performance parameters",
                    "Memory hierarchy",
                    "Memory interleaving",
                    "Cache memory",
                    "Locality of reference",
                    "Cache mapping",
                    "Cache architectures",
                    "Cache coherency",
                    "MESI model",
                    "Virtual memory",
                    "Paging",
                    "Segmentation",
                    "Page replacement policies",
                    "Pentium virtual memory case study"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "I/O Organization",
                hours: 4,
                description: "Bus protocols, DMA channels, interrupts, and peripheral interfacing.",
                topics: formatTopics([
                    "I/O interfacing",
                    "Handshaking",
                    "Interrupt handling",
                    "DMA",
                    "I/O buses",
                    "Protocols",
                    "Bus arbitration"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Parallel Processing",
                hours: 6,
                description: "Flynn taxonomy, pipelining stages, hazards, and branch prediction.",
                topics: formatTopics([
                    "Parallel processing",
                    "Flynn classification",
                    "Amdahl's law",
                    "Pipelining",
                    "Pipeline performance metrics",
                    "Pipeline hazards",
                    "Hazard solutions"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Advanced Processor Architecture",
                hours: 7,
                description: "Superscalar execution, multi-core clusters, and GPU computing models.",
                topics: formatTopics([
                    "Superscalar processors",
                    "Branch prediction",
                    "GPUs",
                    "Clusters",
                    "Multi-core processors",
                    "NVIDIA GPU case study",
                    "GPU programming model"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283114",
        subjectName: "Data Structures and Algorithms",
        description: "Core algorithms, asymptotic complexity, linear data structures, non-linear trees/graphs, sorting, hashing, greedy methods, and dynamic programming.",
        category: "Program Core",
        credits: 3,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 2, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Analyze the time and space complexity of algorithms using asymptotic notations." },
            { code: "CO2", description: "Implement stack and queue operations and their applications like infix-postfix conversion." },
            { code: "CO3", description: "Construct singly, doubly, and circular linked lists for dynamic data management." },
            { code: "CO4", description: "Apply binary trees, binary search trees, and graph traversals (DFS/BFS) to compute optimal solutions." },
            { code: "CO5", description: "Evaluate and benchmark sorting algorithms and hash collision resolution methods." },
            { code: "CO6", description: "Design greedy algorithms and dynamic programming formulations for optimization problems." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Introduction to Data Structures and Algorithm Complexity",
                hours: 4,
                description: "Foundational data structures, array operations, and Big-O asymptotic analysis.",
                topics: formatTopics([
                    "Introduction to data structures",
                    "Linear data structures",
                    "Non-linear data structures",
                    "Operations on data structures",
                    "Arrays",
                    "Static arrays",
                    "Dynamic arrays",
                    "Structures",
                    "Mathematical preliminaries",
                    "Time complexity",
                    "Space complexity",
                    "Worst-case analysis",
                    "Average-case analysis",
                    "Order notations"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Stacks and Queues",
                hours: 4,
                description: "LIFO and FIFO data structures, array implementation, and expression parsing.",
                topics: formatTopics([
                    "Stack operations",
                    "Array implementation of stack",
                    "Parenthesis checking",
                    "Infix to postfix conversion",
                    "Postfix evaluation",
                    "Queue operations",
                    "Round Robin algorithm"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Linked Lists",
                hours: 6,
                description: "Dynamic memory pointer structures: Singly, doubly, and circular linked lists.",
                topics: formatTopics([
                    "Linked list introduction",
                    "Linked list representation",
                    "Linked list versus array",
                    "Singly linked list",
                    "Insertion",
                    "Deletion",
                    "Reversal",
                    "Printing linked list",
                    "Stack using linked list",
                    "Queue using linked list",
                    "Circular linked list",
                    "Doubly linked list"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Trees and Graphs",
                hours: 6,
                description: "Hierarchical and network data representations, BST operations, DFS, and BFS.",
                topics: formatTopics([
                    "Tree terminology",
                    "Binary tree",
                    "Types of binary trees",
                    "Binary tree representation",
                    "Binary tree traversal",
                    "Binary search tree",
                    "BST operations",
                    "Graph terminology",
                    "Adjacency matrix",
                    "Adjacency list",
                    "Depth First Search",
                    "Breadth First Search"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Sorting and Searching",
                hours: 3,
                description: "Internal and external sorting algorithms, linear/binary search, and hashing tables.",
                topics: formatTopics([
                    "Linear search",
                    "Binary search",
                    "Internal sorting",
                    "External sorting",
                    "Bubble sort",
                    "Insertion sort",
                    "Selection sort",
                    "Quick sort",
                    "Merge sort",
                    "Sorting complexity comparison",
                    "Hashing",
                    "Hash functions",
                    "Collision",
                    "Linear probing",
                    "Quadratic probing",
                    "Double hashing"
                ])
            },
            {
                moduleNumber: 7,
                chapterName: "Greedy Method and Dynamic Programming",
                hours: 3,
                description: "Optimization paradigms: Kruskal, Prim, Knapsack, TSP, and Longest Common Subsequence.",
                topics: formatTopics([
                    "Greedy strategy",
                    "Knapsack problem",
                    "Job sequencing",
                    "Minimum Cost Spanning Tree",
                    "Kruskal algorithm",
                    "Prim algorithm",
                    "All Pair Shortest Path",
                    "Travelling Salesman Problem",
                    "Flow Shop Scheduling",
                    "Multistage Graph",
                    "Longest Common Subsequence"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "OEC301",
        subjectName: "Introduction to IoT and Applications",
        description: "IoT architecture, sensor networking, wireless protocols, cloud connectivity, and smart city implementations.",
        category: "Open Elective",
        credits: 2,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Identify core architectural components and communication paradigms of IoT." },
            { code: "CO2", description: "Select appropriate sensor and actuator technologies for target IoT devices." },
            { code: "CO3", description: "Implement IoT communication protocols (MQTT, CoAP, WebSockets, BLE, Zigbee)." },
            { code: "CO4", description: "Design end-to-end IoT platform architectures for smart living and industry." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Introduction to IoT",
                hours: 4,
                description: "Basic building blocks, characteristics, and M2M architectures.",
                topics: formatTopics([
                    "IoT characteristics",
                    "IoT architecture",
                    "IoT technologies",
                    "M2M",
                    "Industrial IoT"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Connected Devices and Web Connectivity",
                hours: 5,
                description: "Networking protocols and web integration for embedded devices.",
                topics: formatTopics([
                    "NFC",
                    "RFID",
                    "Bluetooth",
                    "Bluetooth LE",
                    "Zigbee",
                    "Wi-Fi",
                    "GSM",
                    "CoAP",
                    "REST",
                    "HTTP",
                    "HTTPS",
                    "WebSockets"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Sensors and Actuators",
                hours: 4,
                description: "Transducers, signal conditioning, and wearable embedded hardware.",
                topics: formatTopics([
                    "Sensors",
                    "Actuators",
                    "Wearable electronics"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "IoT Platform Design Methodology",
                hours: 4,
                description: "Methodological steps in designing complete IoT hardware and cloud platforms.",
                topics: formatTopics([
                    "IoT Platform Design Methodology",
                    "System Specification",
                    "Process Specification",
                    "Domain Model Specification",
                    "Information Model Specification",
                    "Service Specification",
                    "Functional View Specification",
                    "Operational View Specification",
                    "Device and Component Integration"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Smart Living",
                hours: 5,
                description: "IoT implementations in home automation, smart cities, and agriculture.",
                topics: formatTopics([
                    "Weather monitoring",
                    "Smart lighting",
                    "Smart parking",
                    "Emergency response",
                    "Smart irrigation"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Connected Commerce",
                hours: 4,
                description: "Enterprise IoT applications in logistics, payments, and fleet telemetry.",
                topics: formatTopics([
                    "Inventory management",
                    "Smart payment",
                    "Fleet tracking"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283115",
        subjectName: "Electronic Devices and Circuits Lab",
        description: "Hands-on laboratory for diode wave-shaping, rectifier filter analysis, BJT biasing, and MOSFET amplifier characterization.",
        category: "Program Core Lab",
        credits: 1,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 2, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Practical Experiments",
                hours: 26,
                description: "Experimental verification of electronic circuits.",
                topics: formatTopics([
                    "Diode V-I Characteristics",
                    "Diode Clippers and Clampers",
                    "Full-wave Bridge Rectifier with Filter",
                    "BJT Common Emitter Amplifier Frequency Response",
                    "MOSFET Common Source Amplifier",
                    "Power Amplifier Class AB Testing"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283116",
        subjectName: "Data Structures and Algorithms Laboratory",
        description: "Practical C/C++ implementation of sorting, dynamic programming, backtracking, graphs, and greedy algorithms.",
        category: "Program Core Lab",
        credits: 1,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 2, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        experiments: [
            { number: 1, category: "Sorting", title: "Modified Bubble, Insertion and Selection Sort", application: "Display examination results based on total marks", options: [] },
            { number: 2, category: "Divide and Conquer", title: "Quick Sort and Merge Sort", application: "Display employee records based on work experience", options: [] },
            { number: 3, category: "Divide and Conquer", title: "Divide and Conquer Problem Solving", application: "Matrix operations and sub-array optimization", options: ["Multiplication of long integers", "Finding minimum and maximum element of an array"] },
            { number: 4, category: "Greedy", title: "Knapsack / Cargo Loading", application: "Optimal cargo packaging", options: [] },
            { number: 5, category: "Greedy", title: "Minimum-cost communication network", application: "Kruskal / Prim Spanning Tree", options: [] },
            { number: 6, category: "Greedy", title: "Optimal coin change", application: "Greedy currency dispensation", options: [] },
            { number: 7, category: "Dynamic Programming", title: "Shortest path for emergency vehicles", application: "All-pairs shortest path computation", options: [] },
            { number: 8, category: "Dynamic Programming", title: "DNA/RNA sequence comparison using LCS", application: "Bioinformatics gene alignment", options: [] },
            { number: 9, category: "Dynamic Programming", title: "All-pairs shortest path", application: "Floyd-Warshall routing", options: [] },
            { number: 10, category: "Backtracking", title: "N-Queens", application: "Constraint satisfaction chessboard placement", options: [] },
            { number: 11, category: "Backtracking", title: "Map coloring", application: "Graph vertex coloring", options: [] },
            { number: 12, category: "String Matching", title: "Search-engine keyword/document matching", application: "Pattern matching algorithms", options: [] }
        ],
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Algorithm Implementation Lab",
                hours: 26,
                description: "Complete laboratory course mapping to the 12 core algorithmic experiments.",
                topics: formatTopics([
                    "Sorting Algorithms Benchmark",
                    "Divide and Conquer Applications",
                    "Greedy Optimization Problems",
                    "Dynamic Programming Matrix & Sequence Solvers",
                    "Backtracking State-Space Searches",
                    "String Pattern Matching Engines"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283117",
        subjectName: "Computer Organization and Architecture Laboratory",
        description: "Assembly language programming, ALU simulation, and CPU architecture benchmarking.",
        category: "Program Core Lab",
        credits: 1,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 2, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Computer Organization Experiments",
                hours: 26,
                description: "Practical implementations of processor simulators and assembly instructions.",
                topics: formatTopics([
                    "Booth Multiplication Simulation",
                    "Restoring and Non-Restoring Division",
                    "Memory Hierarchy and Cache Miss Simulation",
                    "Direct Memory Access (DMA) Simulation",
                    "Pipeline Hazard Analysis Simulator"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2283611",
        subjectName: "Mini Project",
        description: "Practical implementation of an integrated hardware and software engineering prototype solving real-world domain problems.",
        category: "Skill Enhancement",
        credits: 2,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 4, totalHours: 52 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Project Lifecycle",
                hours: 52,
                description: "Problem definition, system design, hardware-software integration, testing, and technical documentation.",
                topics: formatTopics([
                    "Problem Statement Identification",
                    "Literature Survey & Feasibility",
                    "System Architecture & Hardware Selection",
                    "Software Development & Sensor Interfacing",
                    "Integration, Testing & Validation",
                    "Technical Report Writing & Presentation"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2993511",
        subjectName: "Entrepreneurship Development",
        description: "Foundations of entrepreneurship, startup ideation, legal structuring, business plans, and market analysis.",
        category: "Vertical 5",
        credits: 2,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Entrepreneurship Concepts",
                hours: 13,
                description: "Entrepreneurial mindset, opportunity identification, and innovation frameworks.",
                topics: formatTopics([
                    "Concept of Entrepreneurship",
                    "Characteristics of Successful Entrepreneurs",
                    "Startup Ecosystem in India",
                    "Opportunity Recognition and Idea Generation"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Business Planning and Execution",
                hours: 13,
                description: "Feasibility studies, financial projections, legal compliance, and pitch presentations.",
                topics: formatTopics([
                    "Business Plan Formulation",
                    "Market Research and Competitive Analysis",
                    "Sources of Startup Finance and VC Funding",
                    "Institutional Support Mechanisms (MSME, Startup India)"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 3,
        courseCode: "2993512",
        subjectName: "Environmental Science",
        description: "Ecosystem dynamics, natural resource management, environmental pollution control, sustainability, and green policies.",
        category: "Vertical 5",
        credits: 2,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Ecosystems and Natural Resources",
                hours: 13,
                description: "Biodiversity conservation, water and energy resources, and ecological balance.",
                topics: formatTopics([
                    "Ecosystem Structure and Function",
                    "Renewable and Non-Renewable Resources",
                    "Biodiversity Threats and Conservation Strategies",
                    "Water Resource Management and Conservation"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Environmental Pollution and Sustainability",
                hours: 13,
                description: "Air, water, soil, noise, and e-waste pollution management and environmental legislation.",
                topics: formatTopics([
                    "Air and Water Pollution Control Technologies",
                    "E-Waste Management in Electronics Industry",
                    "Climate Change and Carbon Footprint Reduction",
                    "Environmental Protection Acts and Sustainability Goals"
                ])
            }
        ]
    }
];

const ecsSemester4Courses = [
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284111",
        subjectName: "Engineering Mathematics-IV",
        description: "Advanced matrix algebra, quadratic forms, vector spaces, probability distributions, sampling theory, and statistical curve fitting.",
        category: "Program Core",
        credits: 3,
        hours: { theoryHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Apply Cayley-Hamilton theorem and diagonalize square matrices." },
            { code: "CO2", description: "Transform quadratic forms to canonical forms and evaluate rank, index, and signature." },
            { code: "CO3", description: "Construct orthonormal bases using the Gram-Schmidt process." },
            { code: "CO4", description: "Analyze continuous and discrete random variables and probability distributions." },
            { code: "CO5", description: "Perform hypothesis testing with Student's t-test, Chi-square test, and Large sample tests." },
            { code: "CO6", description: "Calculate correlation coefficients and fit linear/non-linear regression curves." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Linear Algebra - Theory of Matrices",
                hours: 5,
                description: "Matrix functions, derogatory/non-derogatory properties, and Cayley-Hamilton application.",
                topics: formatTopics([
                    "Eigenvalues and eigenvectors",
                    "Cayley-Hamilton theorem",
                    "Functions of square matrices",
                    "Derogatory and non-derogatory matrices",
                    "Similarity",
                    "Diagonalization"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Linear Algebra - Quadratic Forms",
                hours: 4,
                description: "Congruent transformations, classification of quadratic forms, and Sylvester's law.",
                topics: formatTopics([
                    "Quadratic forms",
                    "Congruent transformation",
                    "Canonical forms",
                    "Rank",
                    "Index",
                    "Signature",
                    "Sylvester's law",
                    "Definite forms",
                    "Semi-definite forms",
                    "Indefinite forms",
                    "Orthogonal transformation"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Vector Space, Basis and Orthonormal Basis",
                hours: 4,
                description: "Inner product spaces, linear independence, and Gram-Schmidt process.",
                topics: formatTopics([
                    "Vector spaces",
                    "Subspaces",
                    "Linear combinations",
                    "Linear dependence",
                    "Linear independence",
                    "Basis",
                    "Norm",
                    "Inner product",
                    "Distance",
                    "Orthogonality",
                    "Cauchy-Schwarz inequality",
                    "Gram-Schmidt process"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Probability",
                hours: 4,
                description: "Random variables, expectations, variance, and standard distributions (Binomial, Poisson, Normal).",
                topics: formatTopics([
                    "Random variables",
                    "Probability distributions",
                    "Density functions",
                    "Expectation",
                    "Variance",
                    "Moments",
                    "MGF",
                    "Covariance",
                    "Correlation",
                    "Binomial distribution",
                    "Poisson distribution",
                    "Normal distribution"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Probability Distribution and Sampling Theory",
                hours: 5,
                description: "Hypothesis testing, small/large sample tests, Chi-square, and Student t-distributions.",
                topics: formatTopics([
                    "Sampling distribution",
                    "Hypothesis testing",
                    "Level of significance",
                    "Critical region",
                    "One-tailed test",
                    "Two-tailed test",
                    "Large sample tests",
                    "Degrees of freedom",
                    "Student's t-distribution",
                    "Small sample tests",
                    "Chi-square test",
                    "Goodness of fit",
                    "Contingency table",
                    "Test of independence",
                    "Yates correction"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Statistical Techniques",
                hours: 4,
                description: "Karl Pearson and Spearman correlation, curve fitting, and linear regression.",
                topics: formatTopics([
                    "Karl Pearson correlation",
                    "Spearman rank correlation",
                    "Curve fitting",
                    "First-degree curve",
                    "Second-degree curve",
                    "Linear regression"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284112",
        subjectName: "Analog Electronics",
        description: "MOSFET amplifier frequency response, differential amplifiers, operational amplifier circuits, active filters, oscillators, and 555 timers.",
        category: "Program Core",
        credits: 4,
        hours: { theoryHours: 3, tutorialHours: 1, practicalHours: 0, totalHours: 39 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Evaluate the high and low frequency response of single and multi-stage MOSFET amplifiers." },
            { code: "CO2", description: "Design MOSFET differential amplifiers and evaluate CMRR and input impedance." },
            { code: "CO3", description: "Analyze feedback topologies and closed-loop op-amp configurations." },
            { code: "CO4", description: "Design sinusoidal oscillators (RC phase shift, Wien bridge, Crystal) and waveform generators." },
            { code: "CO5", description: "Implement linear op-amp applications like summing, difference, instrumentation, and converter circuits." },
            { code: "CO6", description: "Design non-linear IC circuits including Schmitt triggers, window detectors, and 555 timer multivibrators." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Frequency Response of MOSFET Amplifiers",
                hours: 7,
                description: "Low and high frequency behavior, Miller's theorem, and cascode amplifiers.",
                topics: formatTopics([
                    "Low frequency response",
                    "Coupling capacitance",
                    "Bypass capacitance",
                    "Load capacitance",
                    "High frequency response",
                    "Parasitic capacitance",
                    "Miller's theorem",
                    "Miller capacitance",
                    "Unity gain bandwidth",
                    "Multistage amplifiers",
                    "Coupling methods",
                    "MOSFET cascode"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Differential Amplifier and Op-amp",
                hours: 7,
                description: "MOSFET differential pairs, active loads, CMRR, and IC 741 architecture.",
                topics: formatTopics([
                    "MOSFET differential amplifier",
                    "DC characteristics",
                    "Transfer characteristics",
                    "Differential-mode gain",
                    "Common-mode gain",
                    "CMRR",
                    "Input impedance",
                    "Active load",
                    "Ideal op-amp",
                    "Op-amp parameters",
                    "IC 741"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Op-amp and Feedback",
                hours: 6,
                description: "Negative and positive feedback topologies, virtual ground, and gain stabilization.",
                topics: formatTopics([
                    "Open-loop configuration",
                    "Closed-loop configuration",
                    "Virtual ground",
                    "Virtual short",
                    "Positive feedback",
                    "Negative feedback",
                    "Feedback types",
                    "Inverting amplifier",
                    "Non-inverting amplifier"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Oscillators and Waveform Generator",
                hours: 6,
                description: "Barkhausen stability criterion, sinusoidal oscillators, and relaxation generators.",
                topics: formatTopics([
                    "Barkhausen criterion",
                    "RC phase-shift oscillator",
                    "Wien bridge oscillator",
                    "Crystal oscillator",
                    "Square-wave generator",
                    "Triangular-wave generator"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Applications of Op-amp",
                hours: 7,
                description: "Mathematical operations, instrumentation amplifiers, and V-to-I/I-to-V converters.",
                topics: formatTopics([
                    "Adder",
                    "Summing amplifier",
                    "Averaging circuit",
                    "Subtractor",
                    "Integrator",
                    "Differentiator",
                    "Difference amplifier",
                    "Current amplifier",
                    "Instrumentation amplifier",
                    "I-to-V converter",
                    "V-to-I converter"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Non-Linear Integrated Circuits",
                hours: 6,
                description: "Comparators, zero-crossing detectors, Schmitt triggers, and IC 555 timer applications.",
                topics: formatTopics([
                    "Comparator",
                    "Zero-crossing detector",
                    "Window detector",
                    "Schmitt trigger",
                    "IC 555 timer",
                    "Astable multivibrator",
                    "Monostable multivibrator"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284113",
        subjectName: "Discrete Structures and Automata Theory",
        description: "Set theory, mathematical logic, relations, graph theory, deterministic/non-deterministic finite automata, regular expressions, context-free grammars, and pushdown automata.",
        category: "Program Core",
        credits: 4,
        hours: { theoryHours: 3, tutorialHours: 1, practicalHours: 0, totalHours: 39 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Apply set operations, mathematical induction, and predicate logic inference." },
            { code: "CO2", description: "Analyze relations, equivalence classes, POSETs, lattices, and Pigeonhole principle." },
            { code: "CO3", description: "Evaluate graph connectivity, Eulerian/Hamiltonian circuits, and Dijkstra's algorithm." },
            { code: "CO4", description: "Design DFA, NFA, Moore and Mealy finite state machines." },
            { code: "CO5", description: "Convert between regular expressions, regular grammars, and finite automata." },
            { code: "CO6", description: "Construct Context-Free Grammars, Chomsky Normal Forms, and Pushdown Automata (PDA)." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Set Theory and Logic",
                hours: 6,
                description: "Venn diagrams, principle of inclusion-exclusion, propositional logic, and truth tables.",
                topics: formatTopics([
                    "Sets and subsets",
                    "Venn diagrams",
                    "Set operations",
                    "Laws of set theory",
                    "Power set",
                    "Inclusion-exclusion principle",
                    "Mathematical induction",
                    "Propositions",
                    "Truth tables",
                    "Logical equivalence",
                    "Implication",
                    "Laws of logic",
                    "Normal forms",
                    "Inference",
                    "Predicates",
                    "Quantifiers"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Relations and Functions",
                hours: 6,
                description: "Binary relations, equivalence relations, Hasse diagrams, lattices, and bijective functions.",
                topics: formatTopics([
                    "Relations",
                    "Properties of relations",
                    "Equivalence relation",
                    "Partial order relation",
                    "Closures",
                    "Poset",
                    "Hasse diagram",
                    "Lattice",
                    "Functions",
                    "Injective function",
                    "Surjective function",
                    "Bijective function",
                    "Identity function",
                    "Inverse function",
                    "Pigeonhole principle",
                    "Extended pigeonhole principle"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Graph Theory",
                hours: 6,
                description: "Graph terminology, subgraphs, Euler/Hamilton circuits, planar graphs, and shortest path algorithms.",
                topics: formatTopics([
                    "Graphs",
                    "Degree",
                    "Paths",
                    "Cycles",
                    "Subgraphs",
                    "Graph types",
                    "Eulerian path/circuit",
                    "Hamiltonian path/circuit",
                    "Planar graph",
                    "Graph isomorphism",
                    "Dijkstra algorithm",
                    "Trees"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Finite Automata",
                hours: 7,
                description: "Deterministic and Non-Deterministic Finite Automata, state minimization, and transducers.",
                topics: formatTopics([
                    "Automata",
                    "DFA",
                    "NFA",
                    "Transition diagrams",
                    "Language recognizers",
                    "NFA to DFA",
                    "Epsilon transitions",
                    "Moore machine",
                    "Mealy machine"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Regular Expression and Regular Grammar",
                hours: 7,
                description: "Equivalence of regular expressions and finite automata, Arden's theorem, and regular grammars.",
                topics: formatTopics([
                    "Regular grammar",
                    "Regular expression",
                    "RE/RG equivalence",
                    "RE to RG",
                    "RG to RE",
                    "RE to FA",
                    "FA to RE",
                    "Applications"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "CFG and PDA",
                hours: 7,
                description: "Context-free languages, derivations, ambiguity, Chomsky Normal Form, and Pushdown Automata.",
                topics: formatTopics([
                    "Chomsky hierarchy",
                    "Context-free grammar",
                    "Sentential forms",
                    "Leftmost derivation",
                    "Rightmost derivation",
                    "Context-free languages",
                    "Parsing",
                    "Ambiguity",
                    "Simplification",
                    "Chomsky Normal Form",
                    "Pushdown automata",
                    "PDA transitions",
                    "PDA design"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "MDC401",
        subjectName: "Multidisciplinary Minor",
        description: "Specialized multidisciplinary minor course exploring inter-departmental engineering and technology intersections.",
        category: "Multidisciplinary Minor",
        credits: 3,
        hours: { theoryHours: 3, tutorialHours: 0, practicalHours: 0, totalHours: 39 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Multidisciplinary Engineering Fundamentals",
                hours: 13,
                description: "Cross-disciplinary principles, system-level design, and collaborative engineering.",
                topics: formatTopics([
                    "Interdisciplinary Problem Solving",
                    "System Dynamics and Integration",
                    "Emerging Technology Paradigms",
                    "Cross-Domain Optimization"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Applied Multidisciplinary Systems",
                hours: 26,
                description: "Case studies in mechatronics, biomedical informatics, and smart infrastructure.",
                topics: formatTopics([
                    "Smart Sensor Networks Integration",
                    "Embedded Systems in Multidisciplinary Controls",
                    "Data Analytics across Engineering Domains",
                    "Ethical and Environmental Standards"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "OEC401",
        subjectName: "Robotics and Its Applications",
        description: "Kinematics, actuator systems, robotic vision, motion planning, grippers, and industrial/humanoid automation.",
        category: "Open Elective",
        credits: 2,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Understand robotic classification, coordinate frames, and degrees of freedom." },
            { code: "CO2", description: "Compute forward and inverse kinematics using Denavit-Hartenberg conventions." },
            { code: "CO3", description: "Select robotic sensors, drives, and end-effector grippers." },
            { code: "CO4", description: "Examine industrial, medical, and social humanoid robotic implementations." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Introduction to Robotics",
                hours: 4,
                description: "Historical perspective, anatomy, work volume, and robot classifications.",
                topics: formatTopics([
                    "History and Evolution of Robotics",
                    "Robot Anatomy and Structural Subsystems",
                    "Coordinate Systems and Work Envelopes",
                    "Degrees of Freedom and Arm Configurations"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Configuration and Kinematics",
                hours: 5,
                description: "Spatial transformations, forward and inverse kinematic modeling.",
                topics: formatTopics([
                    "Homogeneous Transformation Matrices",
                    "Denavit-Hartenberg (DH) Notation",
                    "Direct and Inverse Kinematics Analysis",
                    "Velocity Kinematics and Jacobian Matrix"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Sensors in Robotics",
                hours: 4,
                description: "Internal position encoders and external tactile, vision, and proximity sensors.",
                topics: formatTopics([
                    "Potentiometers and Optical Encoders",
                    "Tactile and Force-Torque Sensors",
                    "Proximity and Range Sensors (Ultrasonic, Lidar)",
                    "Machine Vision and Image Processing for Robots"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Drives and Grippers",
                hours: 4,
                description: "Actuation systems (pneumatic, hydraulic, electric) and end-effector design.",
                topics: formatTopics([
                    "Pneumatic and Hydraulic Actuators",
                    "DC Servo Motors and Stepper Motors",
                    "Mechanical and Vacuum Grippers",
                    "Magnetic and Adhesive End Effectors"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Robotics Applications",
                hours: 5,
                description: "Industrial manufacturing, welding, assembly, paint spraying, and surgical robotics.",
                topics: formatTopics([
                    "Industrial Pick-and-Place Automation",
                    "Arc and Spot Welding Applications",
                    "Medical and Minimally Invasive Surgical Robotics",
                    "Autonomous Mobile Robots (AMR) and AGVs"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Humanoid Robotics and Social Robots",
                hours: 4,
                description: "Biped locomotion, human-robot interaction (HRI), and companion robots.",
                topics: formatTopics([
                    "Bipedal Gait and Balance Control",
                    "Humanoid Kinematic Structures",
                    "Human-Robot Interaction (HRI) Frameworks",
                    "Social Companion and Service Robots"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284114",
        subjectName: "Analog Electronics Lab",
        description: "Hands-on implementation and measurement of op-amp circuits, filters, oscillators, and Schmitt triggers.",
        category: "Program Core Lab",
        credits: 1,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 2, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Analog Circuits Experiments",
                hours: 26,
                description: "Laboratory experiments for Op-Amp parameters, active filters, and oscillators.",
                topics: formatTopics([
                    "Op-Amp Inverting and Non-Inverting Characteristics",
                    "Op-Amp Summing, Subtractor, and Integrator Circuits",
                    "Instrumentation Amplifier using IC 741",
                    "RC Phase Shift and Wien Bridge Oscillator Testing",
                    "Schmitt Trigger and IC 555 Astable Multivibrator"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284115",
        subjectName: "Discrete Structures and Automata Theory Tutorials",
        description: "Problem solving sessions and analytical proofs for discrete logic, relations, graph algorithms, and automata constructions.",
        category: "Program Core Lab",
        credits: 1,
        hours: { theoryHours: 0, tutorialHours: 2, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Discrete Structures Tutorials",
                hours: 26,
                description: "Analytical tutorial problem sets covering formal proofs and automata designs.",
                topics: formatTopics([
                    "Mathematical Induction and Logic Proofs",
                    "Equivalence Relations and Poset Hasse Diagrams",
                    "Graph Isomorphism and Dijkstra Step-by-Step",
                    "DFA and NFA State Minimization Constructions",
                    "Regular Expression to Finite Automata Conversions",
                    "Pushdown Automata (PDA) State Design"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "MDL401",
        subjectName: "Multidisciplinary Minor Lab",
        description: "Hands-on engineering projects and simulations spanning cross-disciplinary technologies.",
        category: "Multidisciplinary Minor Lab",
        credits: 1,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 2, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Multidisciplinary Experiments",
                hours: 26,
                description: "Experimental setups in multi-sensor control, data acquisition, and automated actuation.",
                topics: formatTopics([
                    "Multi-Sensor Data Acquisition Setup",
                    "Microcontroller Sensor-Actuator Interfacing",
                    "Cross-Domain Simulation and Modeling",
                    "Real-Time System Testing and Analytics"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284411",
        subjectName: "Maintenance of Electronic Instruments / Network Administration",
        description: "Testing, calibration, troubleshooting of electronic testing instruments, and network administration configuration.",
        category: "Skill Enhancement",
        credits: 2,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 4, totalHours: 52 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Electronic Instruments Maintenance",
                hours: 26,
                description: "Calibration, fault diagnosis, and maintenance of multimeters, oscilloscopes, and signal generators.",
                topics: formatTopics([
                    "CRO and DSO Calibration and Probing Techniques",
                    "Function Generator and Power Supply Troubleshooting",
                    "Component Testing using LCR Meters and Transistor Checkers",
                    "PCB Inspection, Soldering, and Desoldering Techniques"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Network Administration",
                hours: 26,
                description: "LAN configuration, router switches setup, IP addressing, DNS/DHCP server setup, and firewall security.",
                topics: formatTopics([
                    "Ethernet Cable Crimping and Structured Cabling",
                    "Router, Switch, and Access Point Configuration",
                    "DHCP, DNS, and Web Server Setup in Linux/Windows",
                    "Network Monitoring (Wireshark) and Firewall Rules"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2284412",
        subjectName: "Creative Coding in Python",
        description: "Python programming from syntax basics to OOP, data structures, GUI with Tkinter, OpenCV image processing, Data Science with NumPy/Pandas/SciPy, and Django web frameworks.",
        category: "Skill Enhancement",
        credits: 2,
        hours: { theoryHours: 0, tutorialHours: 0, practicalHours: 4, totalHours: 52 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Write Python programs using built-in data types, functions, and control structures." },
            { code: "CO2", description: "Implement Object-Oriented paradigms, custom exceptions, and file I/O operations." },
            { code: "CO3", description: "Develop GUI applications with Tkinter, SQLite, and computer vision filters with OpenCV." },
            { code: "CO4", description: "Manipulate datasets and generate statistical plots using NumPy, Pandas, Matplotlib, and Seaborn." },
            { code: "CO5", description: "Build scalable web applications and REST APIs using the Django web framework." }
        ],
        assessment: { internalAssessment1: 0, internalAssessment2: 0, endSemesterExam: 0, termWork: 25, oral: 25, total: 50 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Python Programming Basics",
                hours: 10,
                description: "Syntax, data types, collections, control flow, loops, and functions.",
                topics: formatTopics([
                    "Syntax and Data Types",
                    "Variables",
                    "Operators",
                    "Input and Output",
                    "List",
                    "Tuple",
                    "Set",
                    "Dictionary",
                    "C to Python transition",
                    "if / else / elif",
                    "for loop",
                    "while loop",
                    "Functions"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Functions, File I/O and Classes",
                hours: 10,
                description: "File manipulation, system modules, OOP classes/objects, and data structures in Python.",
                topics: formatTopics([
                    "File I/O",
                    "Read operations",
                    "Write operations",
                    "File modes",
                    "OS module",
                    "SYS module",
                    "Classes",
                    "Objects",
                    "Constructors",
                    "Class variables",
                    "Methods",
                    "Inheritance",
                    "Exception handling",
                    "Linked list",
                    "Stack",
                    "Queue"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "GUI and Image Processing",
                hours: 10,
                description: "Desktop GUI interfaces with Tkinter, SQLite database operations, and OpenCV vision.",
                topics: formatTopics([
                    "Tkinter",
                    "Buttons",
                    "Labels",
                    "Entry fields",
                    "SQLite",
                    "CRUD",
                    "OpenCV"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Data Science",
                hours: 12,
                description: "NumPy arrays, Pandas DataFrames, Matplotlib visualizations, and SciPy analytics.",
                topics: formatTopics([
                    "NumPy",
                    "ndarray",
                    "NumPy operations",
                    "Pandas",
                    "DataFrame",
                    "Missing values",
                    "Matplotlib",
                    "Seaborn",
                    "SciPy",
                    "Integration",
                    "Optimization",
                    "Eigenvalues",
                    "Eigenvectors",
                    "Statistics",
                    "Line chart",
                    "Bar chart",
                    "Histogram",
                    "Pie chart"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Web Development",
                hours: 10,
                description: "Web architecture and full-stack development using the Django framework.",
                topics: formatTopics([
                    "Web applications",
                    "Web architecture",
                    "Django",
                    "Django history",
                    "Django design philosophy",
                    "Django features",
                    "Django environment setup"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2994511",
        subjectName: "Business Model Development",
        description: "Corporate entrepreneurship, business structures, MSMEs, cost and revenue models, venture capital, IPR, Business Model Canvas, and digital innovation.",
        category: "Vertical 5",
        credits: 2,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Evaluate entrepreneurial processes and legal forms of business organization." },
            { code: "CO2", description: "Design cost and revenue models and assess angel/VC financing mechanisms." },
            { code: "CO3", description: "Navigate Intellectual Property Rights (Patents, Trademarks, Copyrights) and ethics." },
            { code: "CO4", description: "Build Business Model Canvases, develop MVPs, and deploy digital marketing strategies." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Fundamentals of Entrepreneurship",
                hours: 4,
                description: "Economic impact, entrepreneurial process, and corporate mindset.",
                topics: formatTopics([
                    "Entrepreneurship",
                    "Economic development",
                    "Entrepreneurial process",
                    "Women entrepreneurs",
                    "Corporate entrepreneurship",
                    "Entrepreneurial mindset"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Business Structures and MSME",
                hours: 4,
                description: "Proprietorships, public/private corporations, and MSME growth catalysts.",
                topics: formatTopics([
                    "Proprietorship",
                    "Public companies",
                    "Private companies",
                    "Cooperative businesses",
                    "MSME",
                    "MSME role"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Financing and Capitalization",
                hours: 5,
                description: "Cost structures, angel investors, venture capital, and crowdfunding.",
                topics: formatTopics([
                    "Cost models",
                    "Revenue models",
                    "Angel investors",
                    "Venture capital",
                    "Crowdfunding",
                    "Government funding"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Intellectual Property and Ethics",
                hours: 4,
                description: "Patent protection, trademarks, copyrights, and technology ethics.",
                topics: formatTopics([
                    "Patents",
                    "Trademarks",
                    "Copyrights",
                    "Patent search",
                    "IPR protection",
                    "Technology ethics"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Business Model Canvas and Prototyping",
                hours: 5,
                description: "Value propositions, customer segmentation, MVP development, and validation.",
                topics: formatTopics([
                    "Business models",
                    "Value proposition",
                    "Customer segments",
                    "Customer relationships",
                    "Channels",
                    "Key partners",
                    "Key activities",
                    "Key resources",
                    "Prototyping",
                    "MVP"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Digital Business and Modern Models",
                hours: 4,
                description: "SaaS, freemium, SEO, social media marketing, and digital innovation.",
                topics: formatTopics([
                    "Subscription model",
                    "Freemium model",
                    "SEO",
                    "SEM",
                    "Social media marketing",
                    "Influencer marketing",
                    "Digital business innovation"
                ])
            }
        ]
    },
    {
        department: "ECS",
        semester: 4,
        courseCode: "2994512",
        subjectName: "Design Thinking",
        description: "Empathy mapping, problem framing, divergent ideation, iterative prototyping, and usability validation.",
        category: "Vertical 5",
        credits: 2,
        hours: { theoryHours: 2, tutorialHours: 0, practicalHours: 0, totalHours: 26 },
        scheme: "NEP 2020",
        academicYear: "2025-26",
        university: "University of Mumbai",
        programCode: "BE-ECS",
        programName: "Bachelor of Engineering - Electronics and Computer Science",
        courseOutcomes: [
            { code: "CO1", description: "Apply user-centric empathy mapping to discover latent human needs." },
            { code: "CO2", description: "Formulate clear Point of View (POV) problem statements and prioritize challenges." },
            { code: "CO3", description: "Facilitate multidisciplinary brainstorming, mind mapping, and ideation." },
            { code: "CO4", description: "Construct low-fidelity paper and scenario prototypes and perform usability testing." }
        ],
        assessment: { internalAssessment1: 20, internalAssessment2: 20, endSemesterExam: 60, termWork: 0, oral: 0, total: 100 },
        chapters: [
            {
                moduleNumber: 1,
                chapterName: "Introduction",
                hours: 4,
                description: "Traditional problem solving vs Design Thinking, 5-stage framework.",
                topics: formatTopics([
                    "Design Thinking",
                    "Traditional problem solving",
                    "Need for Design Thinking",
                    "Key principles",
                    "Empathize",
                    "Define",
                    "Ideate",
                    "Prototype",
                    "Test"
                ])
            },
            {
                moduleNumber: 2,
                chapterName: "Empathy",
                hours: 4,
                description: "Foundations of empathy, observational research, and empathy mapping.",
                topics: formatTopics([
                    "Foundation of empathy",
                    "Purpose",
                    "Observation",
                    "User observation",
                    "Empathy map"
                ])
            },
            {
                moduleNumber: 3,
                chapterName: "Define",
                hours: 4,
                description: "Problem definition, prioritization, framing, and Point of View (POV).",
                topics: formatTopics([
                    "Problem definition",
                    "Problem prioritization",
                    "Problem framing",
                    "Problem statement",
                    "Point of View"
                ])
            },
            {
                moduleNumber: 4,
                chapterName: "Ideate",
                hours: 5,
                description: "Multidisciplinary approach, breaking assumptions, brainstorming, and mind mapping.",
                topics: formatTopics([
                    "Ideation",
                    "Multidisciplinary approach",
                    "Breaking patterns",
                    "Challenging assumptions",
                    "Value-chain thinking",
                    "Brainstorming",
                    "Mind mapping"
                ])
            },
            {
                moduleNumber: 5,
                chapterName: "Prototype",
                hours: 5,
                description: "Low and high fidelity prototyping, paper mockups, and storyboarding.",
                topics: formatTopics([
                    "Low-fidelity prototype",
                    "High-fidelity prototype",
                    "Paper prototype",
                    "Storyboard prototype",
                    "Scenario prototype"
                ])
            },
            {
                moduleNumber: 6,
                chapterName: "Test",
                hours: 4,
                description: "Testing guidelines, desirability, feasibility, viability, and usability testing.",
                topics: formatTopics([
                    "Testing guidelines",
                    "Desirability",
                    "Feasibility",
                    "Viability",
                    "Usability testing"
                ])
            }
        ]
    }
];

const subjectsPath = path.join(__dirname, 'subjects.json');

// Only store the official NEP 2020 B.E. ECS Semester 3 & 4 courses
const allSubjects = [
    ...ecsSemester3Courses,
    ...ecsSemester4Courses
];

fs.writeFileSync(subjectsPath, JSON.stringify(allSubjects, null, 2), 'utf8');
console.log(`Successfully generated subjects.json with ${allSubjects.length} ECS subjects (Semester 3: ${ecsSemester3Courses.length}, Semester 4: ${ecsSemester4Courses.length}).`);

