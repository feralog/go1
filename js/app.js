/**
 * app.js - Lógica principal do aplicativo de quiz
 * 
 * Este arquivo contém a lógica principal do aplicativo, incluindo:
 * - Gerenciamento de telas e navegação
 * - Lógica do quiz (perguntas, respostas, pontuação)
 * - Timer e progresso
 */

// Variáveis globais
let currentUser = '';
let currentModule = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let quizStartTime = null;
let quizTimer = null;
let quizSeconds = 0;
let currentFileType = '';
let currentFileName = '';

// Elementos DOM
const screens = {
    login: document.getElementById('login-screen'),
    moduleSelection: document.getElementById('module-selection-screen'),
    quiz: document.getElementById('quiz-screen'),
    results: document.getElementById('results-screen'),
    resumosSelection: document.getElementById('resumos-selection-screen'),
    guiasSelection: document.getElementById('guias-selection-screen'),
    fileReading: document.getElementById('file-reading-screen')
};

// Inicialização
document.addEventListener('DOMContentLoaded', init);

/**
 * Inicializa o aplicativo
 */
async function init() {
    try {
        // Define o título do quiz
        document.getElementById('quiz-subject-title').textContent = quizConfig.title;
        document.title = quizConfig.title;
        
        // Carrega as questões
        await loadAllQuestions();
        console.log('Questões carregadas com sucesso');
        
        // Always start at the login screen with the main menu
        showLoginScreen();
        
        // Configura os event listeners
        setupEventListeners();
        
        // Popula a lista de módulos
        populateModuleList();
        
    } catch (error) {
        console.error('Erro ao inicializar o aplicativo:', error);
        alert('Ocorreu um erro ao carregar o aplicativo. Por favor, recarregue a página.');
    }
}

/**
 * Popula a lista de módulos na tela de seleção
 */
function populateModuleList() {
    const moduleList = document.getElementById('module-list');
    moduleList.innerHTML = '';
    
    quizConfig.modules.forEach(module => {
        const button = document.createElement('button');
        button.className = 'list-group-item list-group-item-action module-btn';
        button.dataset.module = module.id;
        
        const progress = calculateModuleProgress(module.id);
        
        button.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <span>${module.name}</span>
                <span class="badge bg-primary rounded-pill module-progress" data-module="${module.id}">${progress}%</span>
            </div>
        `;
        
        button.addEventListener('click', () => startQuiz(module.id));
        
        moduleList.appendChild(button);
    });
}

/**
 * Configura todos os event listeners
 */
function setupEventListeners() {
    // Main menu buttons
    document.getElementById('resumos-btn').addEventListener('click', showResumosSelection);
    document.getElementById('guias-btn').addEventListener('click', showGuiasSelection);
    document.getElementById('start-quiz-btn').addEventListener('click', handleStartQuiz);

    // Back buttons
    document.getElementById('resumos-back-btn').addEventListener('click', showLoginScreen);
    document.getElementById('guias-back-btn').addEventListener('click', showLoginScreen);
    document.getElementById('file-back-btn').addEventListener('click', handleFileBack);

    // File selection buttons
    document.querySelectorAll('#resumos-list .list-group-item').forEach(button => {
        button.addEventListener('click', () => loadFile('resumos', button.dataset.file));
    });

    document.querySelectorAll('#guias-list .list-group-item').forEach(button => {
        button.addEventListener('click', () => loadFile('guias', button.dataset.file));
    });

    // Module selection
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Quiz
    document.getElementById('quit-quiz-btn').addEventListener('click', quitQuiz);
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);

    // Results
    document.getElementById('retry-module-btn').addEventListener('click', () => startQuiz(currentModule));
    document.getElementById('return-to-modules-btn').addEventListener('click', showModuleSelectionScreen);

    // Configura o salvamento automático
    window.addEventListener('beforeunload', saveUserData);
}

/**
 * Manipula o início do quiz
 */
function handleStartQuiz() {
    currentUser = 'Usuário';
    setUsername(currentUser);
    showModuleSelectionScreen();
}

/**
 * Manipula o logout do usuário
 */
function handleLogout() {
    currentUser = '';
    showLoginScreen();
}

/**
 * Mostra a tela de login
 */
function showLoginScreen() {
    hideAllScreens();
    screens.login.classList.remove('d-none');
}

/**
 * Mostra a tela de seleção de módulos
 */
function showModuleSelectionScreen() {
    hideAllScreens();
    screens.moduleSelection.classList.remove('d-none');
    
    // Atualiza o nome do usuário
    document.getElementById('user-display').textContent = currentUser;
    
    // Atualiza o progresso dos módulos
    updateModuleProgress();
}

/**
 * Atualiza o progresso exibido para cada módulo
 */
function updateModuleProgress() {
    // Atualiza o progresso de cada módulo
    document.querySelectorAll('.module-progress').forEach(element => {
        const module = element.dataset.module;
        const progress = calculateModuleProgress(module);
        element.textContent = `${progress}%`;
        
        // Atualiza a cor baseada no progresso
        if (progress >= 80) {
            element.classList.remove('bg-primary', 'bg-warning');
            element.classList.add('bg-success');
        } else if (progress >= 40) {
            element.classList.remove('bg-primary', 'bg-success');
            element.classList.add('bg-warning');
        } else {
            element.classList.remove('bg-warning', 'bg-success');
            element.classList.add('bg-primary');
        }
    });
    
    // Atualiza o progresso geral
    const overallProgress = calculateOverallProgress();
    document.getElementById('overall-progress').textContent = `${overallProgress}%`;
    document.getElementById('overall-progress-bar').style.width = `${overallProgress}%`;
    
    // Atualiza a cor do progresso geral
    const progressBar = document.getElementById('overall-progress-bar');
    if (overallProgress >= 80) {
        progressBar.className = 'progress-bar bg-success';
    } else if (overallProgress >= 40) {
        progressBar.className = 'progress-bar bg-warning';
    } else {
        progressBar.className = 'progress-bar bg-primary';
    }
}

/**
 * Inicia o quiz para um módulo específico
 * @param {string} module - ID do módulo
 */
function startQuiz(module) {
    currentModule = module;
    
    // Obtém as questões do módulo
    currentQuestions = getModuleQuestions(module);
    
    // REMOVIDO: Embaralha as questões
    // shuffleArray(currentQuestions);
    // Agora as questões ficam na ordem exata do arquivo JSON
    
    // Reinicia as variáveis do quiz
    currentQuestionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    
    // Mostra a tela do quiz
    showQuizScreen();
    
    // Inicia o timer
    startTimer();
    
    // Carrega a primeira questão
    loadQuestion();
}

/**
 * Mostra a tela do quiz
 */
function showQuizScreen() {
    hideAllScreens();
    screens.quiz.classList.remove('d-none');
    
    // Define o título do quiz
    const moduleConfig = quizConfig.modules.find(m => m.id === currentModule);
    const title = moduleConfig ? moduleConfig.name : currentModule;
    
    document.getElementById('quiz-title').textContent = title;
    
    // Reinicia o contador de respostas
    document.getElementById('correct-count').textContent = `Corretas: 0`;
    document.getElementById('incorrect-count').textContent = `Incorretas: 0`;
}

/**
 * Carrega uma questão
 */
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResultsScreen();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    displayQuestion(question);
    
    // Atualiza o número da questão
    document.getElementById('question-number').textContent = `Questão ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    
    // Atualiza o tipo da questão
    document.getElementById('question-type').textContent = question.type === 'conteudista' ? 'Conteudista' : 'Raciocínio';
    
    // Atualiza a barra de progresso
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('quiz-progress').style.width = `${progress}%`;
}

/**
 * Exibe uma questão na tela
 * @param {Object} question - Objeto da questão
 */
function displayQuestion(question) {
    // Exibe o texto da questão
    document.getElementById('question-text').textContent = question.question;
    
    // Limpa o container de opções
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Adiciona as opções
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-secondary w-100 option-btn';
        button.dataset.option = index;
        button.dataset.index = index;
        button.textContent = option;
        
        button.addEventListener('click', () => handleAnswer(index));
        
        optionsContainer.appendChild(button);
    });
    
    // Esconde o container de explicação
    document.getElementById('explanation-container').classList.add('d-none');
    
    // Mostra o container de questão
    document.getElementById('question-container').classList.remove('d-none');
}

/**
 * Manipula a resposta do usuário
 * @param {number} selectedIndex - Índice da opção selecionada
 */
function handleAnswer(selectedIndex) {
    // Obtém a questão atual
    const question = currentQuestions[currentQuestionIndex];
    const correctIndex = question.correctIndex;
    const isCorrect = selectedIndex === correctIndex;
    
    // Atualiza o contador de respostas
    if (isCorrect) {
        correctAnswers++;
        document.getElementById('correct-count').textContent = `Corretas: ${correctAnswers}`;
    } else {
        incorrectAnswers++;
        document.getElementById('incorrect-count').textContent = `Incorretas: ${incorrectAnswers}`;
    }
    
    // Marca as opções como corretas ou incorretas
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(button => {
        const index = parseInt(button.dataset.index);
        
        if (index === correctIndex) {
            button.classList.add('correct');
        } else if (index === selectedIndex) {
            button.classList.add('incorrect');
        }
        
        // Desabilita todos os botões
        button.disabled = true;
    });
    
    // Mostra a explicação
    document.getElementById('explanation-text').textContent = question.explanation;
    document.getElementById('explanation-container').classList.remove('d-none');
    
    // Adiciona efeito de pulse ao container de explicação
    document.getElementById('explanation-container').classList.add('pulse');
    setTimeout(() => {
        document.getElementById('explanation-container').classList.remove('pulse');
    }, 500);
    
    // Atualiza o progresso da questão
    updateQuestionProgress(currentModule, currentQuestionIndex, isCorrect);
}

/**
 * Avança para a próxima questão
 */
function nextQuestion() {
    // Avança para a próxima questão
    currentQuestionIndex++;
    
    // Carrega a próxima questão
    loadQuestion();
}

/**
 * Abandona o quiz atual e volta para a seleção de módulos
 */
function quitQuiz() {
    if (confirm('Tem certeza que deseja sair do quiz? Seu progresso será salvo.')) {
        stopTimer();
        showModuleSelectionScreen();
    }
}

/**
 * Mostra a tela de resultados
 */
function showResultsScreen() {
    stopTimer();
    hideAllScreens();
    screens.results.classList.remove('d-none');
    
    // Calcula a pontuação
    const totalQuestions = correctAnswers + incorrectAnswers;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Atualiza os elementos da tela de resultados
    document.getElementById('score-percentage').textContent = `${scorePercentage}%`;
    document.getElementById('final-correct-count').textContent = correctAnswers;
    document.getElementById('final-incorrect-count').textContent = incorrectAnswers;
    document.getElementById('total-time').textContent = formatTime(quizSeconds);
    
    // Gera a análise de desempenho
    generatePerformanceAnalysis(scorePercentage);
    
    // Atualiza a cor do círculo de pontuação
    const scoreCircle = document.getElementById('score-circle');
    if (scorePercentage >= 80) {
        scoreCircle.style.borderColor = '#198754'; // Verde
    } else if (scorePercentage >= 60) {
        scoreCircle.style.borderColor = '#ffc107'; // Amarelo
    } else if (scorePercentage >= 40) {
        scoreCircle.style.borderColor = '#fd7e14'; // Laranja
    } else {
        scoreCircle.style.borderColor = '#dc3545'; // Vermelho
    }
}

/**
 * Gera uma análise de desempenho baseada na pontuação
 * @param {number} scorePercentage - Porcentagem de acertos
 */
function generatePerformanceAnalysis(scorePercentage) {
    const analysisContainer = document.getElementById('performance-analysis');
    let analysisText = '';
    
    if (scorePercentage >= 90) {
        analysisText = 'Excelente! Você domina este conteúdo.';
    } else if (scorePercentage >= 80) {
        analysisText = 'Muito bom! Você tem um bom conhecimento deste conteúdo.';
    } else if (scorePercentage >= 70) {
        analysisText = 'Bom! Você está no caminho certo, mas ainda pode melhorar.';
    } else if (scorePercentage >= 60) {
        analysisText = 'Regular. Recomendamos revisar este conteúdo novamente.';
    } else if (scorePercentage >= 40) {
        analysisText = 'Atenção! Você precisa estudar mais este conteúdo.';
    } else {
        analysisText = 'Você precisa dedicar mais tempo ao estudo deste conteúdo.';
    }
    
    analysisContainer.textContent = analysisText;
}

/**
 * Mostra a tela de seleção de resumos
 */
function showResumosSelection() {
    hideAllScreens();
    screens.resumosSelection.classList.remove('d-none');
}

/**
 * Mostra a tela de seleção de guias
 */
function showGuiasSelection() {
    hideAllScreens();
    screens.guiasSelection.classList.remove('d-none');
}

/**
 * Carrega um arquivo para leitura
 * @param {string} type - Tipo do arquivo ('resumos' ou 'guias')
 * @param {string} filename - Nome do arquivo
 */
async function loadFile(type, filename) {
    try {
        currentFileType = type;
        currentFileName = filename;

        // Busca o arquivo
        const folderName = type === 'resumos' ? 'Resumos' : 'Guias';
        const response = await fetch(`GO conteudo/${folderName}/${filename}`);

        if (!response.ok) {
            throw new Error(`Erro ao carregar arquivo: ${response.status}`);
        }

        const content = await response.text();

        // Converte markdown para HTML simples
        const htmlContent = convertMarkdownToHTML(content);

        // Exibe o arquivo
        showFileReading(type, filename, htmlContent);

    } catch (error) {
        console.error('Erro ao carregar arquivo:', error);
        alert('Erro ao carregar o arquivo. Verifique se o arquivo existe.');
    }
}

/**
 * Converte markdown básico para HTML
 * @param {string} markdown - Conteúdo em markdown
 * @returns {string} HTML convertido
 */
function convertMarkdownToHTML(markdown) {
    let html = markdown;

    // Remove carriage returns
    html = html.replace(/\r/g, '');

    // Process tables first (before other processing)
    html = processMarkdownTables(html);

    // Headers (must be done in order from h6 to h1)
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Horizontal rules
    html = html.replace(/^---\s*$/gim, '<hr>');

    // Bold and italic (order matters)
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Code (inline and blocks)
    html = html.replace(/```[\s\S]*?```/g, (match) => {
        return '<pre><code>' + match.replace(/```/g, '').trim() + '</code></pre>';
    });
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Line breaks and paragraphs
    html = html.replace(/\n\s*\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');

    // Lists (improved handling)
    const lines = html.split('<br>');
    let inList = false;
    let listType = '';
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.match(/^[\*\-\+] /)) {
            if (!inList) {
                processedLines.push('<ul>');
                inList = true;
                listType = 'ul';
            } else if (listType !== 'ul') {
                processedLines.push('</ol><ul>');
                listType = 'ul';
            }
            processedLines.push('<li>' + line.replace(/^[\*\-\+] /, '') + '</li>');
        } else if (line.match(/^\d+\. /)) {
            if (!inList) {
                processedLines.push('<ol>');
                inList = true;
                listType = 'ol';
            } else if (listType !== 'ol') {
                processedLines.push('</ul><ol>');
                listType = 'ol';
            }
            processedLines.push('<li>' + line.replace(/^\d+\. /, '') + '</li>');
        } else {
            if (inList) {
                processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
                listType = '';
            }
            if (line.trim() !== '') {
                processedLines.push(line);
            }
        }
    }

    if (inList) {
        processedLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }

    html = processedLines.join('<br>');

    // Wrap in paragraphs
    html = '<p>' + html + '</p>';

    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p><br><\/p>/g, '');
    html = html.replace(/<br><\/p>/g, '</p>');
    html = html.replace(/<p><br>/g, '<p>');
    html = html.replace(/<p><h([1-6])>/g, '<h$1>');
    html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
    html = html.replace(/<p><hr><\/p>/g, '<hr>');
    html = html.replace(/<p><ul>/g, '<ul>');
    html = html.replace(/<\/ul><\/p>/g, '</ul>');
    html = html.replace(/<p><ol>/g, '<ol>');
    html = html.replace(/<\/ol><\/p>/g, '</ol>');
    html = html.replace(/<p><pre>/g, '<pre>');
    html = html.replace(/<\/pre><\/p>/g, '</pre>');
    html = html.replace(/<p><table>/g, '<table>');
    html = html.replace(/<\/table><\/p>/g, '</table>');

    return html;
}

/**
 * Processa tabelas markdown e converte para HTML
 * @param {string} text - Texto com possíveis tabelas markdown
 * @returns {string} Texto com tabelas convertidas para HTML
 */
function processMarkdownTables(text) {
    const lines = text.split('\n');
    const result = [];
    let inTable = false;
    let tableRows = [];
    let alignments = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect table rows (lines with |)
        if (line.includes('|') && line.split('|').length > 2) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }

            // Check if this is an alignment row (contains only |, :, -, and spaces)
            if (line.match(/^[\|\:\-\s]+$/)) {
                // Parse alignments
                alignments = line.split('|').map(cell => {
                    const trimmed = cell.trim();
                    if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
                    if (trimmed.endsWith(':')) return 'right';
                    return 'left';
                });
                continue; // Skip alignment row
            }

            tableRows.push(line);
        } else {
            if (inTable) {
                // End of table, process accumulated rows
                result.push(convertTableToHTML(tableRows, alignments));
                inTable = false;
                tableRows = [];
                alignments = [];
            }
            result.push(line);
        }
    }

    // Handle table at end of file
    if (inTable && tableRows.length > 0) {
        result.push(convertTableToHTML(tableRows, alignments));
    }

    return result.join('\n');
}

/**
 * Converte linhas de tabela markdown para HTML
 * @param {string[]} rows - Array de linhas da tabela
 * @param {string[]} alignments - Array de alinhamentos
 * @returns {string} HTML da tabela
 */
function convertTableToHTML(rows, alignments) {
    if (rows.length === 0) return '';

    let html = '<table class="table table-striped table-hover">';

    // Header row
    if (rows.length > 0) {
        html += '<thead><tr>';
        const headerCells = rows[0].split('|').filter(cell => cell.trim() !== '');
        headerCells.forEach((cell, index) => {
            const align = alignments[index] || 'left';
            const alignAttr = align !== 'left' ? ` style="text-align: ${align}"` : '';
            html += `<th${alignAttr}>${cell.trim()}</th>`;
        });
        html += '</tr></thead>';
    }

    // Body rows
    if (rows.length > 1) {
        html += '<tbody>';
        for (let i = 1; i < rows.length; i++) {
            html += '<tr>';
            const cells = rows[i].split('|').filter(cell => cell.trim() !== '');
            cells.forEach((cell, index) => {
                const align = alignments[index] || 'left';
                const alignAttr = align !== 'left' ? ` style="text-align: ${align}"` : '';
                html += `<td${alignAttr}>${cell.trim()}</td>`;
            });
            html += '</tr>';
        }
        html += '</tbody>';
    }

    html += '</table>';
    return html;
}

/**
 * Mostra a tela de leitura de arquivo
 * @param {string} type - Tipo do arquivo
 * @param {string} filename - Nome do arquivo
 * @param {string} content - Conteúdo HTML
 */
function showFileReading(type, filename, content) {
    hideAllScreens();
    screens.fileReading.classList.remove('d-none');

    // Define o título baseado no arquivo
    const titles = {
        '1exame.md': 'Exame Ginecológico',
        '2ciclomenstrual.md': 'Ciclo Menstrual',
        '3embrio.md': 'Embriologia',
        '4desenvolvimentopuberal.md': 'Desenvolvimento Puberal',
        '4desenvolvimento_puberal.md': 'Desenvolvimento Puberal'
    };

    const title = titles[filename] || filename.replace('.md', '');
    document.getElementById('file-title').textContent = title;

    // Define a cor do cabeçalho
    const header = document.getElementById('file-header');
    header.className = `card-header text-white ${type === 'resumos' ? 'bg-info' : 'bg-success'}`;

    // Exibe o conteúdo
    document.getElementById('file-content').innerHTML = content;
}

/**
 * Manipula o botão voltar da tela de arquivo
 */
function handleFileBack() {
    if (currentFileType === 'resumos') {
        showResumosSelection();
    } else if (currentFileType === 'guias') {
        showGuiasSelection();
    } else {
        showLoginScreen();
    }
}

/**
 * Esconde todas as telas
 */
function hideAllScreens() {
    Object.values(screens).forEach(screen => {
        screen.classList.add('d-none');
    });
}

/**
 * Inicia o timer do quiz
 */
function startTimer() {
    quizStartTime = new Date();
    quizSeconds = 0;
    
    // Atualiza o timer a cada segundo
    quizTimer = setInterval(() => {
        quizSeconds++;
        document.getElementById('timer').innerHTML = `<i class="fas fa-clock me-1"></i>${formatTime(quizSeconds)}`;
    }, 1000);
}

/**
 * Para o timer do quiz
 */
function stopTimer() {
    clearInterval(quizTimer);
}

/**
 * Formata o tempo em segundos para o formato MM:SS
 * @param {number} seconds - Tempo em segundos
 * @returns {string} Tempo formatado
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Embaralha um array (algoritmo Fisher-Yates)
 * @param {Array} array - Array a ser embaralhado
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
