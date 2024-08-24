# Rate-My-Professor-Using-RAG

---

# ProfessAI

**ProfessAI** is an AI-powered assistant designed to help students find the best professors based on their specific needs and preferences. Leveraging a Retrieval-Augmented Generation (RAG) system, ProfessAI analyzes a comprehensive database of professor reviews to provide concise, relevant, and personalized recommendations, streamlining the decision-making process for students.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Personalized Professor Recommendations**: Get top 3 professor recommendations based on your specific queries.
- **Comprehensive Review Analysis**: Analyze detailed reviews including teaching style, course difficulty, and grading fairness.
- **Real-time Chat Interface**: Interact with the AI assistant through a user-friendly chat interface.
- **Structured and Concise Information**: Receive well-organized summaries to help you make informed decisions.
- **Privacy and Security**: Handles data securely, without sharing any personal information that isn’t explicitly stated in official reviews.

## Technology Stack

- **Frontend**: React with Material-UI
- **Backend**: Next.js
- **AI Models**: Google Generative AI (Gemini) for text embeddings, OpenRouter for GPT-like interactions
- **Database**: Pinecone for vector storage and retrieval
- **APIs**: Google Generative AI, OpenAI

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MOHAMMED-IQRAMUL/Rate-My-Professor-Using-RAG.git
   cd Rate-My-Professor-Using-RAG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PINECONE_API_KEY=your-pinecone-api-key
   GEMINI_API_KEY=your-gemini-api-key
   OPENROUTER_API_KEY=your-openrouter-api-key
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000` in your web browser.

## Usage

- **Interact with ProfessAI**: Open the web app in your browser and start typing your queries in the chat interface. The AI assistant will provide recommendations based on your inputs.

- **Customizing Recommendations**: You can modify the system prompt or adjust the ranking criteria in the backend to better suit your needs.

## Project Structure

```plaintext
ProfessAI/
├── public/                     # Static assets
├── src/                        # Source files
│   ├── components/             # React components
│   ├── pages/                  # Next.js pages
│   │   ├── api/                # API routes
│   │   └── index.js            # Main page component
│   └── styles/                 # CSS and styling files
├── .env                        # Environment variables
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

## Contributing

We welcome contributions from the community! To contribute:

1. **Fork the repository**
2. **Create a new branch**
   ```bash
   git checkout -b feature-your-feature-name
   ```
3. **Make your changes and commit them**
   ```bash
   git commit -m "Add your message here"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature-your-feature-name
   ```
5. **Open a Pull Request**: We will review your changes and merge them into the main branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact:

- **GitHub**: [your-username](https://github.com/MOHAMMED-IQRAMUL)

---
