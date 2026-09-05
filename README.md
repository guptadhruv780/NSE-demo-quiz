# NSE Demo Quiz System

A modern, interactive quiz application built with React and Vite. This project provides a complete quiz-taking experience with real-time progress tracking, scoring, and result analysis.

## Features

- 🎯 **Interactive Quiz Interface** - Clean and intuitive UI for taking quizzes
- ⏱️ **Timer Management** - Built-in timer for timed quiz sessions
- 📊 **Progress Tracking** - Real-time progress bar showing quiz completion
- ✍️ **Scratch Pad** - Dedicated scratch/notes section for calculations and notes
- 🏆 **Leaderboard Preview** - View top performers at a glance
- 📈 **Result Analysis** - Detailed result summary with score breakdown
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance** - Built with Vite for optimal build and dev experience

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── screens/           # Full-page components (Landing, Quiz, Result, Scratch)
│   │   ├── context/           # React Context for state management
│   │   ├── data/              # Mock quiz data
│   │   ├── api/               # API stubs for backend integration
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Components Overview

### Screens
- **LandingScreen** - Welcome page with quiz selection
- **QuizScreen** - Main quiz interface with questions and answers
- **ResultScreen** - Shows quiz results and statistics
- **ScratchScreen** - Dedicated workspace for notes and calculations

### Components
- **QuestionCard** - Displays individual quiz questions
- **TimerBar** - Countdown timer display
- **ProgressBar** - Visual progress indicator
- **ResultSummary** - Quiz performance summary
- **LeaderboardPreview** - Top scores preview
- **LoadingState** - Loading indicator
- **ErrorState** - Error message display
- **ScratchCard** - Notes/scratch pad interface

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/guptadhruv780/NSE-demo-quiz.git
   cd NSE-demo-quiz
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Context API** - State management
- **CSS3** - Styling
- **JavaScript (ES6+)** - Programming language

## Getting Started

1. After installation, run `npm run dev` in the `frontend` directory
2. Open your browser and navigate to `http://localhost:5173`
3. Start taking the quiz!

## File Structure Details

- **App.jsx** - Main app routing and layout
- **QuizContext.jsx** - Global state management for quiz data
- **mockQuestions.js** - Sample quiz questions data
- **stubs.js** - API endpoint placeholders for backend integration

## Configuration

- **vite.config.js** - Vite configuration
- **.oxlintrc.json** - Linting rules
- **.gitignore** - Git ignore patterns

## Future Enhancements

- Backend API integration for dynamic questions
- User authentication and profiles
- Advanced analytics and reporting
- Multiple quiz categories
- Question explanations and detailed feedback
- Difficulty levels
- Custom quiz creation

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Contact

- GitHub: [@guptadhruv780](https://github.com/guptadhruv780)
- Project Repository: [NSE-demo-quiz](https://github.com/guptadhruv780/NSE-demo-quiz)

---

**Built with ❤️ using React + Vite**
