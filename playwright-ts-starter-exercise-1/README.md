# 🧪 Playwright TypeScript Automation Framework Setup

## 🔧 Prerequisites

Ensure the following tools and dependencies are installed before using the framework:

- **Node.js** (version 16 or higher) – JavaScript runtime environment  
- **npm** – Node Package Manager for managing project dependencies  
- **Git** – Version control system to clone and manage the codebase  
- **Visual Studio Code** – IDE with recommended extensions for TypeScript and Cucumber  
- **Browsers** – Chrome, Edge, or Firefox (used by Playwright for browser automation)

---

## ⚙️ Setup Instructions

Follow these steps to clone and set up the project locally:

#### 1. Clone the Repository (`master` branch)

git clone --single-branch -b master https://github.com/ucl-isd/test-archetype-playwright-typescript-tdd.git

#### 2. Open the cloned project in VS Code and Install Dependencies (Can be done from VS Code terminal):

npm install

#### 3. Install Playwright and its browsers:

npm install -D @playwright/test<br>
npx playwright install