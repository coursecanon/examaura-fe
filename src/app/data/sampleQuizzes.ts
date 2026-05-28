import { Quiz } from './mockData';

export const sampleQuizzes: Quiz[] = [
  // Azure Quiz 1
  {
    id: 'azure-az900-1',
    title: 'Azure AZ-900: Fundamentals Practice Test',
    category: 'azure',
    difficulty: 'intermediate',
    questionCount: 7,
    duration: 45,
    passingScore: 70,
    description: 'Comprehensive practice test covering Azure fundamentals including cloud concepts, services, and security.',
    questions: [
      {
        id: 'az1-q1',
        text: 'Select Yes if the statement is true about Azure cloud concepts, otherwise select No.',
        type: 'yes-no-grid',
        explanation: 'Understanding Azure cloud characteristics is fundamental. High availability ensures services remain accessible, elasticity allows scaling, and Azure does support hybrid cloud deployments.',
        statements: [
          {
            id: 's1',
            text: 'Azure provides high availability for critical applications',
            correctAnswer: 'yes'
          },
          {
            id: 's2',
            text: 'Elasticity means the ability to scale resources automatically',
            correctAnswer: 'yes'
          },
          {
            id: 's3',
            text: 'Azure only supports public cloud deployments',
            correctAnswer: 'no'
          },
          {
            id: 's4',
            text: 'Capital Expenditure (CapEx) is eliminated when using cloud services',
            correctAnswer: 'yes'
          }
        ]
      },
      {
        id: 'az1-q2',
        text: 'Match the cloud concept to its correct description.',
        type: 'drag-match',
        explanation: 'These are key cloud computing concepts. Low latency ensures fast response times, fault tolerance provides redundancy, disaster recovery enables business continuity, and dynamic scalability adjusts resources based on demand.',
        matchPairs: [
          {
            id: 'p1',
            term: 'Low Latency',
            definition: 'A cloud service that performs quickly with minimal delay in response time'
          },
          {
            id: 'p2',
            term: 'Fault Tolerance',
            definition: 'The ability to remain operational even when components fail'
          },
          {
            id: 'p3',
            term: 'Disaster Recovery',
            definition: 'The ability to recover from catastrophic failures and restore services'
          },
          {
            id: 'p4',
            term: 'Dynamic Scalability',
            definition: 'Automatically adjusting resources based on current demand'
          }
        ]
      },
      {
        id: 'az1-q3',
        text: 'Which of the following are US Government cloud entities? Classify them correctly.',
        type: 'drag-classify',
        explanation: 'Azure Government and AWS GovCloud are US-specific cloud offerings designed for government workloads. Azure Germany and Azure China are region-specific offerings for European and Chinese customers respectively.',
        categories: [
          { id: 'us', name: 'US Government Entity' },
          { id: 'regional', name: 'Regional Cloud Entity' }
        ],
        classifyItems: [
          { id: 'i1', text: 'Azure Government', correctCategoryId: 'us' },
          { id: 'i2', text: 'Azure Germany', correctCategoryId: 'regional' },
          { id: 'i3', text: 'AWS GovCloud', correctCategoryId: 'us' },
          { id: 'i4', text: 'Azure China', correctCategoryId: 'regional' }
        ]
      },
      {
        id: 'az1-q4',
        text: 'When you are implementing a Software as a Service (SaaS) solution, you are responsible for [select] and [select].',
        type: 'inline-dropdown',
        explanation: 'In SaaS, the cloud provider manages infrastructure, platform, and application. The customer is only responsible for configuring the application and managing their data and user access.',
        sentenceTemplate: 'When you are implementing a Software as a Service (SaaS) solution, you are responsible for [select] and [select].',
        inlineDropdowns: [
          {
            id: 'd1',
            options: ['configuring the application', 'managing the operating system', 'maintaining physical servers', 'updating the runtime'],
            correctAnswer: 0
          },
          {
            id: 'd2',
            options: ['network infrastructure', 'application code', 'defining access permissions', 'hardware maintenance'],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'az1-q5',
        text: 'Match each Azure service to its correct service model.',
        type: 'matching-dropdown',
        explanation: 'Azure Virtual Machines provide infrastructure (IaaS), Azure SQL Database is a managed platform service (PaaS), Azure App Service is platform for hosting apps (PaaS), and Microsoft 365 is software as a service (SaaS).',
        dropdownRows: [
          {
            id: 'r1',
            label: 'Azure Virtual Machines',
            options: ['IaaS', 'PaaS', 'SaaS'],
            correctAnswer: 0
          },
          {
            id: 'r2',
            label: 'Azure SQL Database',
            options: ['IaaS', 'PaaS', 'SaaS'],
            correctAnswer: 1
          },
          {
            id: 'r3',
            label: 'Azure App Service',
            options: ['IaaS', 'PaaS', 'SaaS'],
            correctAnswer: 1
          },
          {
            id: 'r4',
            label: 'Microsoft 365',
            options: ['IaaS', 'PaaS', 'SaaS'],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'az1-q6',
        text: 'Which Azure service provides serverless compute capabilities?',
        type: 'objective',
        options: [
          'Azure Virtual Machines',
          'Azure Functions',
          'Azure Container Instances',
          'Azure Kubernetes Service'
        ],
        correctAnswer: 1,
        explanation: 'Azure Functions is a serverless compute service that allows you to run code without managing infrastructure. It automatically scales and you only pay for the compute time you consume.'
      },
      {
        id: 'az1-q7',
        text: 'Which of the following are benefits of using Azure Resource Manager? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          'Deploy resources as a group',
          'Apply access control to resources',
          'Tag resources for organization',
          'Eliminate all security vulnerabilities',
          'Use declarative templates'
        ],
        correctAnswer: [0, 1, 2, 4],
        explanation: 'Azure Resource Manager provides group deployment, RBAC for access control, tagging capabilities, and template-based deployment. However, it does not eliminate all security vulnerabilities - security is a shared responsibility.'
      }
    ]
  },
  
  // Azure Quiz 2
  {
    id: 'azure-az900-2',
    title: 'Azure AZ-900: Security and Compliance',
    category: 'azure',
    difficulty: 'beginner',
    questionCount: 7,
    duration: 40,
    description: 'Focus on Azure security features, compliance standards, and identity management.',
    questions: [
      {
        id: 'az2-q1',
        text: 'Evaluate each statement about Azure security features.',
        type: 'yes-no-grid',
        explanation: 'Azure Security Center provides security posture management, Azure AD handles identity, DDoS protection is available, and multi-factor authentication significantly enhances security.',
        statements: [
          {
            id: 's1',
            text: 'Azure Security Center provides unified security management',
            correctAnswer: 'yes'
          },
          {
            id: 's2',
            text: 'Azure Active Directory is only for managing virtual machines',
            correctAnswer: 'no'
          },
          {
            id: 's3',
            text: 'Azure provides DDoS protection for network resources',
            correctAnswer: 'yes'
          },
          {
            id: 's4',
            text: 'Multi-factor authentication reduces security risks',
            correctAnswer: 'yes'
          }
        ]
      },
      {
        id: 'az2-q2',
        text: 'Match the Azure security tool to its primary function.',
        type: 'drag-match',
        explanation: 'Each Azure security tool has a specific purpose: Sentinel for SIEM, Key Vault for secrets, Security Center for posture, and Defender for threat protection.',
        matchPairs: [
          {
            id: 'p1',
            term: 'Azure Sentinel',
            definition: 'Cloud-native SIEM and SOAR solution for intelligent security analytics'
          },
          {
            id: 'p2',
            term: 'Azure Key Vault',
            definition: 'Securely store and manage secrets, keys, and certificates'
          },
          {
            id: 'p3',
            term: 'Azure Security Center',
            definition: 'Unified security management and threat protection system'
          },
          {
            id: 'p4',
            term: 'Azure Defender',
            definition: 'Advanced threat protection for hybrid workloads'
          }
        ]
      },
      {
        id: 'az2-q3',
        text: 'Classify these Azure services by their primary security focus.',
        type: 'drag-classify',
        explanation: 'Identity services manage user authentication and access, while network security services protect infrastructure and data in transit.',
        categories: [
          { id: 'identity', name: 'Identity & Access Management' },
          { id: 'network', name: 'Network Security' }
        ],
        classifyItems: [
          { id: 'i1', text: 'Azure Active Directory', correctCategoryId: 'identity' },
          { id: 'i2', text: 'Azure Firewall', correctCategoryId: 'network' },
          { id: 'i3', text: 'Azure MFA', correctCategoryId: 'identity' },
          { id: 'i4', text: 'Azure DDoS Protection', correctCategoryId: 'network' },
          { id: 'i5', text: 'Azure AD B2C', correctCategoryId: 'identity' }
        ]
      },
      {
        id: 'az2-q4',
        text: 'In Azure, [select] is the service that provides identity and access management, and [select] can be used to enforce policies across resources.',
        type: 'inline-dropdown',
        explanation: 'Azure Active Directory (Azure AD) is the identity service, and Azure Policy is used to enforce organizational standards and compliance.',
        sentenceTemplate: 'In Azure, [select] is the service that provides identity and access management, and [select] can be used to enforce policies across resources.',
        inlineDropdowns: [
          {
            id: 'd1',
            options: ['Azure Security Center', 'Azure Active Directory', 'Azure Firewall', 'Azure Monitor'],
            correctAnswer: 1
          },
          {
            id: 'd2',
            options: ['Azure Blueprints', 'Azure Advisor', 'Azure Policy', 'Azure Defender'],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'az2-q5',
        text: 'Identify the compliance certification for each standard.',
        type: 'matching-dropdown',
        explanation: 'Different compliance standards apply to different industries: HIPAA for healthcare, GDPR for EU data protection, ISO 27001 for information security, and SOC 2 for service organizations.',
        dropdownRows: [
          {
            id: 'r1',
            label: 'Healthcare data protection in the US',
            options: ['HIPAA', 'GDPR', 'ISO 27001', 'SOC 2'],
            correctAnswer: 0
          },
          {
            id: 'r2',
            label: 'EU data protection and privacy',
            options: ['HIPAA', 'GDPR', 'ISO 27001', 'SOC 2'],
            correctAnswer: 1
          },
          {
            id: 'r3',
            label: 'Information security management',
            options: ['HIPAA', 'GDPR', 'ISO 27001', 'SOC 2'],
            correctAnswer: 2
          },
          {
            id: 'r4',
            label: 'Service organization controls',
            options: ['HIPAA', 'GDPR', 'ISO 27001', 'SOC 2'],
            correctAnswer: 3
          }
        ]
      },
      {
        id: 'az2-q6',
        text: 'What is the primary purpose of Azure Role-Based Access Control (RBAC)?',
        type: 'objective',
        options: [
          'To encrypt data at rest',
          'To manage fine-grained access permissions to Azure resources',
          'To monitor network traffic',
          'To backup virtual machines'
        ],
        correctAnswer: 1,
        explanation: 'Azure RBAC provides fine-grained access management for Azure resources, allowing you to grant users only the rights they need to perform their jobs.'
      },
      {
        id: 'az2-q7',
        text: 'Which of the following are layers of defense in depth? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          'Physical security',
          'Identity and access',
          'Perimeter security',
          'Social media monitoring',
          'Application security'
        ],
        correctAnswer: [0, 1, 2, 4],
        explanation: 'Defense in depth includes physical security, identity & access, perimeter, network, compute, application, and data layers. Social media monitoring is not a standard layer of defense in depth.'
      }
    ]
  },

  // AWS Quiz
  {
    id: 'aws-clf-c02-1',
    title: 'AWS Cloud Practitioner: Core Services',
    category: 'aws',
    difficulty: 'beginner',
    questionCount: 7,
    duration: 40,
    description: 'Comprehensive test covering AWS core services, storage options, and compute resources.',
    questions: [
      {
        id: 'aws1-q1',
        text: 'Evaluate each statement about AWS core services.',
        type: 'yes-no-grid',
        explanation: 'EC2 provides virtual servers, S3 offers object storage, RDS is managed relational database, and Lambda is serverless - not requiring EC2 management.',
        statements: [
          {
            id: 's1',
            text: 'Amazon EC2 provides resizable compute capacity in the cloud',
            correctAnswer: 'yes'
          },
          {
            id: 's2',
            text: 'Amazon S3 is a file-based storage system',
            correctAnswer: 'no'
          },
          {
            id: 's3',
            text: 'Amazon RDS manages database administration tasks',
            correctAnswer: 'yes'
          },
          {
            id: 's4',
            text: 'AWS Lambda requires you to manage EC2 instances',
            correctAnswer: 'no'
          }
        ]
      },
      {
        id: 'aws1-q2',
        text: 'Match each AWS service to its primary use case.',
        type: 'drag-match',
        explanation: 'CloudFront is a CDN, Route 53 handles DNS, VPC provides network isolation, and ELB distributes traffic across instances.',
        matchPairs: [
          {
            id: 'p1',
            term: 'Amazon CloudFront',
            definition: 'Content delivery network that distributes content globally with low latency'
          },
          {
            id: 'p2',
            term: 'Amazon Route 53',
            definition: 'Scalable domain name system (DNS) web service'
          },
          {
            id: 'p3',
            term: 'Amazon VPC',
            definition: 'Isolated virtual network environment in the AWS cloud'
          },
          {
            id: 'p4',
            term: 'Elastic Load Balancing',
            definition: 'Automatically distributes incoming traffic across multiple targets'
          }
        ]
      },
      {
        id: 'aws1-q3',
        text: 'Classify these AWS services by their service category.',
        type: 'drag-classify',
        explanation: 'Compute services handle processing power, while storage services manage data persistence.',
        categories: [
          { id: 'compute', name: 'Compute Services' },
          { id: 'storage', name: 'Storage Services' }
        ],
        classifyItems: [
          { id: 'i1', text: 'Amazon EC2', correctCategoryId: 'compute' },
          { id: 'i2', text: 'Amazon S3', correctCategoryId: 'storage' },
          { id: 'i3', text: 'AWS Lambda', correctCategoryId: 'compute' },
          { id: 'i4', text: 'Amazon EBS', correctCategoryId: 'storage' },
          { id: 'i5', text: 'Amazon ECS', correctCategoryId: 'compute' }
        ]
      },
      {
        id: 'aws1-q4',
        text: 'To store objects in AWS, you would use [select], while for block storage attached to EC2 instances, you would use [select].',
        type: 'inline-dropdown',
        explanation: 'S3 is the object storage service for storing files and objects, while EBS provides block-level storage volumes for use with EC2 instances.',
        sentenceTemplate: 'To store objects in AWS, you would use [select], while for block storage attached to EC2 instances, you would use [select].',
        inlineDropdowns: [
          {
            id: 'd1',
            options: ['Amazon EBS', 'Amazon S3', 'Amazon Glacier', 'Amazon EFS'],
            correctAnswer: 1
          },
          {
            id: 'd2',
            options: ['Amazon S3', 'Amazon EBS', 'Amazon DynamoDB', 'Amazon RDS'],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 'aws1-q5',
        text: 'Match each AWS database service to its type.',
        type: 'matching-dropdown',
        explanation: 'RDS is relational SQL database, DynamoDB is NoSQL, Redshift is a data warehouse for analytics, and ElastiCache is in-memory caching.',
        dropdownRows: [
          {
            id: 'r1',
            label: 'Amazon RDS',
            options: ['Relational', 'NoSQL', 'Data Warehouse', 'In-Memory Cache'],
            correctAnswer: 0
          },
          {
            id: 'r2',
            label: 'Amazon DynamoDB',
            options: ['Relational', 'NoSQL', 'Data Warehouse', 'In-Memory Cache'],
            correctAnswer: 1
          },
          {
            id: 'r3',
            label: 'Amazon Redshift',
            options: ['Relational', 'NoSQL', 'Data Warehouse', 'In-Memory Cache'],
            correctAnswer: 2
          },
          {
            id: 'r4',
            label: 'Amazon ElastiCache',
            options: ['Relational', 'NoSQL', 'Data Warehouse', 'In-Memory Cache'],
            correctAnswer: 3
          }
        ]
      },
      {
        id: 'aws1-q6',
        text: 'Which AWS service allows you to run code without provisioning or managing servers?',
        type: 'objective',
        options: [
          'Amazon EC2',
          'Amazon ECS',
          'AWS Lambda',
          'AWS Elastic Beanstalk'
        ],
        correctAnswer: 2,
        explanation: 'AWS Lambda is a serverless compute service that runs your code in response to events without requiring you to provision or manage servers.'
      },
      {
        id: 'aws1-q7',
        text: 'Which of the following are benefits of AWS cloud computing? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          'Trade capital expense for variable expense',
          'Benefit from massive economies of scale',
          'Eliminate all security responsibilities',
          'Increase speed and agility',
          'Stop guessing about capacity'
        ],
        correctAnswer: [0, 1, 3, 4],
        explanation: 'AWS provides cost benefits, economies of scale, agility, and eliminates capacity guessing. However, security is a shared responsibility - AWS does not eliminate all customer security responsibilities.'
      }
    ]
  },

  // MuleSoft Quiz
  {
    id: 'mulesoft-mcd-1',
    title: 'MuleSoft Certified Developer: Integration Fundamentals',
    category: 'mulesoft',
    difficulty: 'intermediate',
    questionCount: 7,
    duration: 50,
    description: 'Test your knowledge of MuleSoft integration patterns, API design, and Anypoint Platform.',
    questions: [
      {
        id: 'ms1-q1',
        text: 'Evaluate each statement about MuleSoft and API-led connectivity.',
        type: 'yes-no-grid',
        explanation: 'MuleSoft uses API-led connectivity with three layers, DataWeave is the transformation language, Anypoint Studio is the IDE, and connectors simplify integration.',
        statements: [
          {
            id: 's1',
            text: 'API-led connectivity organizes APIs into Experience, Process, and System layers',
            correctAnswer: 'yes'
          },
          {
            id: 's2',
            text: 'DataWeave is used only for JSON transformations',
            correctAnswer: 'no'
          },
          {
            id: 's3',
            text: 'Anypoint Studio is the development environment for MuleSoft',
            correctAnswer: 'yes'
          },
          {
            id: 's4',
            text: 'MuleSoft connectors eliminate the need to write integration code',
            correctAnswer: 'yes'
          }
        ]
      },
      {
        id: 'ms1-q2',
        text: 'Match each MuleSoft component to its function.',
        type: 'drag-match',
        explanation: 'Each MuleSoft component has a specific role: Runtime Engine executes apps, API Manager handles policies, Design Center creates APIs, and Exchange shares assets.',
        matchPairs: [
          {
            id: 'p1',
            term: 'Mule Runtime Engine',
            definition: 'Executes Mule applications and processes data'
          },
          {
            id: 'p2',
            term: 'API Manager',
            definition: 'Manages, governs, and secures APIs with policies'
          },
          {
            id: 'p3',
            term: 'Design Center',
            definition: 'Web-based tool for creating APIs and integrations'
          },
          {
            id: 'p4',
            term: 'Anypoint Exchange',
            definition: 'Marketplace for sharing and discovering reusable assets'
          }
        ]
      },
      {
        id: 'ms1-q3',
        text: 'Classify these MuleSoft connectors by their integration category.',
        type: 'drag-classify',
        explanation: 'Database connectors work with data storage systems, while SaaS connectors integrate with cloud-based software applications.',
        categories: [
          { id: 'database', name: 'Database Connectors' },
          { id: 'saas', name: 'SaaS Connectors' }
        ],
        classifyItems: [
          { id: 'i1', text: 'Salesforce Connector', correctCategoryId: 'saas' },
          { id: 'i2', text: 'MySQL Connector', correctCategoryId: 'database' },
          { id: 'i3', text: 'ServiceNow Connector', correctCategoryId: 'saas' },
          { id: 'i4', text: 'MongoDB Connector', correctCategoryId: 'database' },
          { id: 'i5', text: 'Workday Connector', correctCategoryId: 'saas' }
        ]
      },
      {
        id: 'ms1-q4',
        text: 'In MuleSoft, [select] APIs interact directly with systems of record, while [select] APIs provide access tailored to specific user experiences.',
        type: 'inline-dropdown',
        explanation: 'System APIs connect to underlying systems, Process APIs implement business logic, and Experience APIs are customized for specific channels or audiences.',
        sentenceTemplate: 'In MuleSoft, [select] APIs interact directly with systems of record, while [select] APIs provide access tailored to specific user experiences.',
        inlineDropdowns: [
          {
            id: 'd1',
            options: ['Experience', 'Process', 'System', 'Gateway'],
            correctAnswer: 2
          },
          {
            id: 'd2',
            options: ['System', 'Process', 'Experience', 'Proxy'],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'ms1-q5',
        text: 'Match each API policy to its purpose.',
        type: 'matching-dropdown',
        explanation: 'Rate limiting controls request frequency, Client ID enforcement requires authentication, IP whitelist restricts access by location, and CORS enables browser requests.',
        dropdownRows: [
          {
            id: 'r1',
            label: 'Rate Limiting',
            options: ['Control request frequency', 'Require authentication', 'Restrict by IP', 'Enable cross-origin'],
            correctAnswer: 0
          },
          {
            id: 'r2',
            label: 'Client ID Enforcement',
            options: ['Control request frequency', 'Require authentication', 'Restrict by IP', 'Enable cross-origin'],
            correctAnswer: 1
          },
          {
            id: 'r3',
            label: 'IP Whitelist',
            options: ['Control request frequency', 'Require authentication', 'Restrict by IP', 'Enable cross-origin'],
            correctAnswer: 2
          },
          {
            id: 'r4',
            label: 'CORS Policy',
            options: ['Control request frequency', 'Require authentication', 'Restrict by IP', 'Enable cross-origin'],
            correctAnswer: 3
          }
        ]
      },
      {
        id: 'ms1-q6',
        text: 'What is the primary purpose of DataWeave in MuleSoft?',
        type: 'objective',
        options: [
          'To deploy applications to CloudHub',
          'To transform data between different formats',
          'To create API specifications',
          'To monitor API performance'
        ],
        correctAnswer: 1,
        explanation: 'DataWeave is MuleSoft\'s powerful data transformation language used to transform data between different formats like JSON, XML, CSV, and Java objects.'
      },
      {
        id: 'ms1-q7',
        text: 'Which of the following are components of Anypoint Platform? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          'Design Center',
          'API Manager',
          'Runtime Manager',
          'Microsoft Visual Studio',
          'Anypoint Exchange'
        ],
        correctAnswer: [0, 1, 2, 4],
        explanation: 'Anypoint Platform includes Design Center, API Manager, Runtime Manager, and Anypoint Exchange. Microsoft Visual Studio is not part of Anypoint Platform.'
      }
    ]
  }
];