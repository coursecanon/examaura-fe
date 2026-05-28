export interface Question {
  id: string;
  text: string;
  type: 'objective' | 'multiple-choice' | 'yes-no-grid' | 'drag-match' | 'drag-classify' | 'inline-dropdown' | 'matching-dropdown';
  options?: string[]; // For objective and multiple-choice
  correctAnswer?: number | number[]; // Single number for objective, array for multiple-choice
  explanation: string;
  questionImage?: string; // Optional base64 image or URL for objective and multiple-choice
  
  // For Yes/No Grid
  statements?: {
    id: string;
    text: string;
    correctAnswer: 'yes' | 'no';
  }[];
  
  // For Drag & Drop Matching
  matchPairs?: {
    id: string;
    term: string;
    definition: string;
  }[];
  
  // For Drag & Drop Classification
  categories?: {
    id: string;
    name: string;
  }[];
  classifyItems?: {
    id: string;
    text: string;
    correctCategoryId: string;
  }[];
  
  // For Inline Dropdown
  sentenceTemplate?: string; // Contains [select] placeholders
  inlineDropdowns?: {
    id: string;
    options: string[];
    correctAnswer: number;
  }[];
  
  // For Matching Dropdown
  dropdownRows?: {
    id: string;
    label: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  duration: number; // in minutes
  passingScore?: number; // percentage (optional, defaults to 70)
  description?: string;
  questions: Question[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface UserAttempt {
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in minutes
  date: string;
}

export const categories: Category[] = [
  {
    id: 'azure',
    name: 'Azure AZ-900',
    description: 'Microsoft Azure Fundamentals Certification',
    icon: '☁️',
    color: '#0078D4'
  },
  {
    id: 'aws',
    name: 'AWS Cloud Practitioner',
    description: 'AWS Certified Cloud Practitioner',
    icon: '🌩️',
    color: '#FF9900'
  },
  {
    id: 'salesforce',
    name: 'Salesforce Admin',
    description: 'Salesforce Administrator Certification',
    icon: '⚡',
    color: '#00A1E0'
  },
  {
    id: 'mulesoft',
    name: 'MuleSoft',
    description: 'MuleSoft Certified Developer',
    icon: '🔗',
    color: '#00A0DF'
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    description: 'Google Cloud Digital Leader',
    icon: '🌐',
    color: '#4285F4'
  },
  {
    id: 'comptia',
    name: 'CompTIA A+',
    description: 'CompTIA A+ Core Certification',
    icon: '💻',
    color: '#E4022D'
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'az900-1',
    title: 'AZ-900 Practice Test 1',
    category: 'Azure AZ-900',
    difficulty: 'beginner',
    questionCount: 50,
    duration: 60,
    passingScore: 75,
    description: 'Comprehensive practice test covering Azure fundamentals including cloud concepts, core Azure services, security, privacy, compliance, and pricing.',
    questions: [
      {
        id: 'q1',
        text: 'Which cloud deployment model provides the highest degree of flexibility regarding where your applications run?',
        type: 'multiple-choice',
        options: [
          'Public Cloud',
          'Private Cloud',
          'Hybrid Cloud',
          'Community Cloud'
        ],
        correctAnswer: 2,
        explanation: 'A hybrid cloud combines public and private clouds, allowing data and applications to be shared between them. This provides the most flexibility in choosing where applications run.'
      },
      {
        id: 'q2',
        text: 'What is the primary benefit of using Azure Resource Manager (ARM) templates?',
        type: 'multiple-choice',
        options: [
          'Improved network latency',
          'Infrastructure as Code (IaC) deployment',
          'Enhanced security protocols',
          'Reduced storage costs'
        ],
        correctAnswer: 1,
        explanation: 'ARM templates enable Infrastructure as Code, allowing you to define and deploy Azure infrastructure in a declarative manner, ensuring consistency and repeatability.'
      },
      {
        id: 'q3',
        text: 'Which Azure service provides serverless compute capabilities?',
        type: 'multiple-choice',
        options: [
          'Azure Virtual Machines',
          'Azure App Service',
          'Azure Functions',
          'Azure Container Instances'
        ],
        correctAnswer: 2,
        explanation: 'Azure Functions is a serverless compute service that lets you run event-triggered code without having to explicitly provision or manage infrastructure.'
      },
      {
        id: 'q4',
        text: 'What is the Azure service level agreement (SLA) primarily measuring?',
        type: 'multiple-choice',
        options: [
          'Cost efficiency',
          'Service availability',
          'Data transfer speed',
          'Storage capacity'
        ],
        correctAnswer: 1,
        explanation: 'Azure SLA primarily measures service availability and uptime, guaranteeing a certain percentage of availability for Azure services.'
      },
      {
        id: 'q5',
        text: 'Which Azure Active Directory feature provides additional security for user sign-ins?',
        type: 'multiple-choice',
        options: [
          'Role-Based Access Control (RBAC)',
          'Multi-Factor Authentication (MFA)',
          'Azure Policy',
          'Azure Blueprints'
        ],
        correctAnswer: 1,
        explanation: 'Multi-Factor Authentication (MFA) adds an extra layer of security by requiring users to provide two or more verification methods during sign-in.'
      }
    ]
  },
  {
    id: 'az900-2',
    title: 'AZ-900 Practice Test 2',
    category: 'Azure AZ-900',
    difficulty: 'intermediate',
    questionCount: 45,
    duration: 55,
    passingScore: 75,
    description: 'Advanced practice questions focusing on Azure architecture and design principles.',
    questions: [
      {
        id: 'q1',
        text: 'What does the principle of "defense in depth" mean in Azure security?',
        type: 'multiple-choice',
        options: [
          'Using only one strong security measure',
          'Implementing multiple layers of security',
          'Storing data in the deepest data center',
          'Using deep learning for threat detection'
        ],
        correctAnswer: 1,
        explanation: 'Defense in depth is a strategy that uses multiple layers of security to protect resources, ensuring that if one layer is breached, others still provide protection.'
      },
      {
        id: 'q2',
        text: 'Which Azure service is best for storing unstructured data like videos and images?',
        type: 'multiple-choice',
        options: [
          'Azure SQL Database',
          'Azure Blob Storage',
          'Azure Table Storage',
          'Azure Queue Storage'
        ],
        correctAnswer: 1,
        explanation: 'Azure Blob Storage is optimized for storing massive amounts of unstructured data, such as text, binary data, videos, and images.'
      },
      {
        id: 'q3',
        text: 'What is the main purpose of Azure Policy?',
        type: 'multiple-choice',
        options: [
          'To manage user authentication',
          'To enforce organizational standards and compliance',
          'To optimize costs',
          'To manage virtual networks'
        ],
        correctAnswer: 1,
        explanation: 'Azure Policy helps enforce organizational standards and assess compliance at scale by creating, assigning, and managing policies.'
      }
    ]
  },
  {
    id: 'aws-1',
    title: 'AWS Cloud Practitioner Essentials',
    category: 'AWS Cloud Practitioner',
    difficulty: 'beginner',
    questionCount: 40,
    duration: 50,
    passingScore: 75,
    description: 'Essential practice questions for AWS Cloud Practitioner certification.',
    questions: [
      {
        id: 'q1',
        text: 'Which AWS service provides object storage?',
        type: 'multiple-choice',
        options: [
          'Amazon EBS',
          'Amazon S3',
          'Amazon EFS',
          'Amazon RDS'
        ],
        correctAnswer: 1,
        explanation: 'Amazon S3 (Simple Storage Service) is an object storage service that offers industry-leading scalability, data availability, security, and performance.'
      },
      {
        id: 'q2',
        text: 'What is the AWS shared responsibility model?',
        type: 'multiple-choice',
        options: [
          'AWS and customers share equal responsibility for all aspects of security',
          'AWS is responsible for security OF the cloud, customers for security IN the cloud',
          'Customers are responsible for all security measures',
          'AWS handles all security aspects'
        ],
        correctAnswer: 1,
        explanation: 'In the shared responsibility model, AWS manages security of the cloud (infrastructure), while customers manage security in the cloud (data, applications).'
      }
    ]
  },
  {
    id: 'sf-1',
    title: 'Salesforce Admin Practice',
    category: 'Salesforce Admin',
    difficulty: 'beginner',
    questionCount: 35,
    duration: 45,
    passingScore: 75,
    description: 'Practice test for Salesforce Administrator certification.',
    questions: [
      {
        id: 'q1',
        text: 'What is the maximum number of custom fields you can create on an object?',
        type: 'multiple-choice',
        options: [
          '500',
          '800',
          '1000',
          'Unlimited'
        ],
        correctAnswer: 1,
        explanation: 'Salesforce allows a maximum of 800 custom fields per object (including formula fields and roll-up summary fields).'
      }
    ]
  },
  {
    id: 'mule-1',
    title: 'MuleSoft Integration Basics',
    category: 'MuleSoft',
    difficulty: 'beginner',
    questionCount: 30,
    duration: 40,
    passingScore: 75,
    description: 'Basic integration concepts and MuleSoft fundamentals.',
    questions: [
      {
        id: 'q1',
        text: 'What is the primary purpose of MuleSoft Anypoint Platform?',
        type: 'multiple-choice',
        options: [
          'Database management',
          'API-led connectivity and integration',
          'Cloud storage',
          'Web hosting'
        ],
        correctAnswer: 1,
        explanation: 'MuleSoft Anypoint Platform is designed for API-led connectivity, enabling organizations to connect applications, data, and devices.'
      }
    ]
  },
  {
    id: 'gcp-1',
    title: 'Google Cloud Essentials',
    category: 'Google Cloud',
    difficulty: 'beginner',
    questionCount: 40,
    duration: 50,
    passingScore: 75,
    description: 'Essential concepts for Google Cloud Digital Leader certification.',
    questions: [
      {
        id: 'q1',
        text: 'Which Google Cloud service provides managed Kubernetes?',
        type: 'multiple-choice',
        options: [
          'Compute Engine',
          'App Engine',
          'Google Kubernetes Engine (GKE)',
          'Cloud Functions'
        ],
        correctAnswer: 2,
        explanation: 'Google Kubernetes Engine (GKE) is a managed Kubernetes service that makes it easy to deploy, manage, and scale containerized applications.'
      }
    ]
  },
  {
    id: 'comptia-1',
    title: 'CompTIA A+ Core 1',
    category: 'CompTIA A+',
    difficulty: 'beginner',
    questionCount: 50,
    duration: 90,
    passingScore: 75,
    description: 'Practice questions for CompTIA A+ Core 1 certification.',
    questions: [
      {
        id: 'q1',
        text: 'What type of connector is commonly used for Ethernet cables?',
        type: 'multiple-choice',
        options: [
          'RJ-11',
          'RJ-45',
          'USB-C',
          'HDMI'
        ],
        correctAnswer: 1,
        explanation: 'RJ-45 is the standard connector used for Ethernet networking cables, supporting various network speeds.'
      }
    ]
  }
];

export const userHistory: Record<string, UserAttempt[]> = {
  'azure': [
    {
      quizId: 'az900-1',
      score: 82,
      totalQuestions: 50,
      timeTaken: 52,
      date: '2026-03-20'
    },
    {
      quizId: 'az900-2',
      score: 78,
      totalQuestions: 45,
      timeTaken: 48,
      date: '2026-03-15'
    }
  ],
  'aws': [
    {
      quizId: 'aws-1',
      score: 90,
      totalQuestions: 40,
      timeTaken: 35,
      date: '2026-03-18'
    }
  ]
};