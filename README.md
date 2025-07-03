## 🌍 Problem Statement

Civil Education (Societal, personal, climate-related, etc.)
am solving societal and governance issues in my country.

---

<div align="center">

<img src="./packages/webapp/public/favicon.png" alt="" align="center" height="64" />

# JuaSheria - Kenyan Constitution AI Assistant

A serverless AI Chat assistant with RAG (Retrieval-Augmented Generation) using LangChain.js, specifically designed to help users understand and interpret the Constitution of Kenya and other Kenyan laws.

:star: If you like this project, star it on GitHub — it helps a lot!

[LiveDemo:JuaSheria](https://witty-ground-053be570f.1.azurestaticapps.net/) • [Problem](#problem) • [Features](#features)

</div>

## Problem

Kenya is experiencing a significant political awakening, particularly among Gen Z citizens who are actively challenging government actions they perceive as punitive, corrupt, and unaccountable. Current issues include:

- **Youth-Led Protests**: Gen Z Kenyans are rising against government policies, police brutality, and systemic corruption
- **Constitutional Ignorance**: Many protesters and citizens don't fully understand their constitutional rights and how to legally defend them
- **Government Accountability Crisis**: Citizens struggle to hold officials accountable due to lack of legal knowledge
- **Police Brutality**: Young people face harassment but don't know their legal protections and recourse options
- **Complex Legal Language**: Constitutional documents use technical language that's difficult for ordinary citizens and activists to understand
- **Limited Legal Literacy**: Many Kenyans, especially youth, lack resources to interpret legal documents during critical moments
- **Expensive Legal Consultation**: Getting legal guidance during protests or government encounters requires expensive lawyer consultations most cannot afford

**The Need for Constitutional Awareness**: As Kenyans continue to fight for justice, transparency, and accountability, there's an urgent need for citizens—especially young activists—to understand their Constitution, know their rights, and learn how to defend them legally.

**JuaSheria** addresses this critical need by providing an intelligent, accessible AI assistant that can instantly interpret Kenyan legal documents, explain constitutional rights in simple terms, and help citizens understand how to legally protect themselves while fighting for change. This tool empowers the current generation of Kenyan activists with the legal knowledge they need to challenge injustice effectively and safely.

### Technical Advantages

- **Proven RAG Architecture**: Built-in Retrieval-Augmented Generation ensures responses are grounded in actual legal documents
- **Serverless Scalability**: Azure Functions and Static Web Apps provide cost-effective scaling for varying user loads
- **Enterprise-Ready**: Production-ready authentication, monitoring, and deployment infrastructure
- **LangChain.js Integration**: Powerful document processing and AI orchestration capabilities

### Development Benefits

- **Rapid Prototyping**: Pre-built chat interface and API endpoints accelerated development
- **Best Practices**: Follows Microsoft's recommended patterns for AI applications
- **Comprehensive Documentation**: Extensive guides and examples for customization
- **CI/CD Ready**: Built-in GitHub Actions for automated deployment

### Cost Efficiency

- **Pay-per-Use**: Serverless architecture means costs scale with actual usage
- **No Infrastructure Management**: Focus on legal content rather than server maintenance
- **Azure Credits**: Eligible for Azure for Students and startup programs

## Architecture

This application uses the same proven architecture as enterprise AI chat applications:

<div align="center">
  <img src="./docs/images/architecture.drawio.png" alt="Application architecture" width="640px" />
</div>

### Components:

- **Web App**: Built with Lit web components and hosted on Azure Static Web Apps
- **API**: Serverless functions using Azure Functions and LangChain.js for document processing and chat responses
- **Database**: Azure Cosmos DB for storing chat sessions and vector embeddings of legal documents
- **File Storage**: Azure Blob Storage for storing source legal documents

### Current Legal Documents

The assistant is designed to work with:

- Constitution of Kenya (2010) - _Upload required_
- Acts of Parliament
- Legal precedents and case law
- Regulatory documents
- Legal templates and forms

### JuaSheria is Different and this is why you should vote for my ai agent

Unlike generic AI assistants, JuaSheria is specifically designed for the current Kenyan political context and trained on Kenyan legal documents, making it an essential tool for:

- **Young Activists & Gen Z**: Understanding constitutional rights during protests and government encounters
- **Legal Professionals**: Quick references for defending citizens' rights and challenging government actions
- **Citizens Fighting Injustice**: Clear explanations of legal protections against police brutality and government overreach
- **Students & Researchers**: Analysis of constitutional provisions relevant to current political movements
- **Civil Society Organizations**: Legal guidance for advocacy and accountability efforts
- **Ordinary Kenyans**: Accessible legal knowledge to protect themselves and their communities

**Empowering Kenya's Fight for Justice**: JuaSheria transforms complex constitutional language into actionable legal knowledge that every Kenyan can understand and use in their fight for a more just and accountable government.

## Features

- 🏛️ **Constitutional Rights Education**: Deep knowledge of constitutional protections relevant to current protests
- ⚖️ **Legal Protection Guidance**: Interprets laws protecting citizens from police brutality and government overreach
- 🗣️ **Activist-Friendly Interface**: Natural language queries about legal rights during protests and civil action
- 🔍 **Contextual Legal Advice**: RAG-powered responses with specific constitutional citations for defending rights
- 📱 **Mobile-First Design**: Accessible on phones for real-time legal guidance during protests or encounters
- 🚀 **Instant Access**: Serverless architecture ensures fast responses when legal knowledge is urgently needed
- 📚 **Precise Legal Citations**: Always provides specific article and section references for constitutional protections
- ⚠️ **Responsible Disclaimers**: Clear guidance on when to seek professional legal representation
- 🛡️ **Rights Protection Focus**: Specialized knowledge on fundamental rights, freedoms, and legal recourse options

---
