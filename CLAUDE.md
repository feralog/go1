# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based quiz template application designed for educational purposes. It allows students to take quizzes on different subjects with progress tracking and performance analysis. The application is built with vanilla HTML, CSS, and JavaScript, using Bootstrap for UI components.

## File Structure

- `index.html` - Main application page with all screens (login, module selection, quiz, results)
- `css/styles.css` - Custom styling for the quiz application
- `js/config.js` - Quiz configuration including title, modules, and storage key
- `js/data.js` - Data management layer for questions and user progress
- `js/app.js` - Main application logic and UI controls
- `*.json` - Question files containing quiz data for different modules

## Architecture

### Configuration System
The application uses a centralized configuration in `js/config.js`:
- `quizConfig.title` - Sets the main quiz title displayed throughout the app
- `quizConfig.storageKey` - Unique localStorage key to prevent conflicts
- `quizConfig.modules` - Array defining available quiz modules, each pointing to a JSON file

### Data Layer (`js/data.js`)
- **Question Loading**: Dynamically loads question data from JSON files based on module configuration
- **Progress Tracking**: Maintains detailed statistics for each question (seen count, correct/incorrect answers, last seen date)
- **Local Storage**: Automatically saves user progress with auto-save every 10 seconds
- **Module Progress**: Calculates completion percentages based on questions answered correctly at least once

### Application Logic (`js/app.js`)
- **Screen Management**: Single-page app with multiple screens (login, module selection, quiz, results)
- **Quiz Flow**: Questions are presented in original JSON order (no shuffling)
- **Timer**: Tracks time spent on each quiz session
- **Scoring**: Real-time feedback with detailed performance analysis

### Question Format
Each JSON file contains an array of question objects:
```json
{
  "question": "Question text",
  "options": ["Option 1", "Option 2", "..."],
  "correctIndex": 0,
  "explanation": "Explanation text",
  "type": "conteudista" | "raciocínio"
}
```

## Development Workflow

### Adding New Modules
1. Create a new JSON file with questions following the format above
2. Add module configuration to `quizConfig.modules` in `js/config.js`
3. The new module will automatically appear in the module selection screen

### Customizing for Different Subjects
1. Update `quizConfig.title` in `js/config.js`
2. Update `quizConfig.storageKey` to prevent localStorage conflicts
3. Replace question JSON files with subject-specific content
4. Optionally update CSS styling in `css/styles.css`

### Testing
- Open `index.html` in a web browser
- Test all quiz flows: login, module selection, quiz completion, results
- Verify progress tracking persists across browser sessions
- Check that all JSON files load correctly

## Key Features
- **Progress Persistence**: User progress automatically saves to localStorage
- **Detailed Analytics**: Tracks question-level statistics and module completion
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Analysis**: Provides feedback based on quiz scores
- **Multi-Module Support**: Easily extensible to support additional quiz modules

## Repository Information
- **GitHub Repository**: https://github.com/feralog/go1.git
- **Last Update**: Answer randomization completed - all JSON files now have properly distributed correct answer indices instead of clustering at index 2

## Answer Randomization Status
All quiz JSON files have been processed to randomize answer order while maintaining correctness:
- **anatomia.json**: ✓ Valid JSON with 20 questions, randomized
- **ciclo_menstrual.json**: ✓ Valid JSON with 20 questions, randomized
- **desenvolvimento_puberal.json**: ✓ Valid JSON with 20 questions, randomized
- **embrio.json**: ✓ Valid JSON with 20 questions, randomized
- **embrio2.json**: ✓ Valid JSON with 20 questions, randomized
- **exame_ginecologico.json**: ✓ Valid JSON with 20 questions, randomized
- **questoes_modulo1.json**: ✓ Valid JSON with 2 questions, randomized
- **questoes_modulo2.json**: ✓ Valid JSON with 2 questions, randomized

## Common Tasks
- **Change quiz subject**: Edit `quizConfig.title` in `js/config.js`
- **Add questions**: Create new JSON file and add to `quizConfig.modules`
- **Reset user data**: Use browser developer tools to clear localStorage or call `clearUserData()` function
- **Deploy**: Upload all files to web server - no build process required
- **Randomize answers**: Use the `randomize_simple.js` script if new questions are added