/**
 * config.js - Configurações do quiz
 * 
 * Este arquivo contém as configurações personalizáveis do quiz.
 * Altere estas configurações para adaptar o quiz à sua matéria.
 */

// Configuração do quiz
const quizConfig = {
    // Título principal que aparece na tela de login. Ajuste conforme a sua disciplina.
    title: "Quiz de Ginecologia e Obstetrícia",

    // Nome do localStorage para salvar os dados do usuário. Alterado para evitar conflitos com o template original.
    storageKey: "quizGinecologiaData",

    // Lista de módulos disponíveis. Cada módulo aponta para um arquivo JSON (sem a extensão) com as questões.
    modules: [
        {
            id: "exame_ginecologico",
            name: "Exame Ginecológico",
            file: "exame_ginecologico"
        },
        {
            id: "ciclo_menstrual",
            name: "Ciclo Menstrual",
            file: "ciclo_menstrual"
        },
        {
            id: "desenvolvimento_puberal",
            name: "Desenvolvimento Puberal",
            file: "desenvolvimento_puberal"
        },
        {
            id: "embriologia",
            name: "Embriologia",
            file: "embrio"
        },
        {
            id: "embriologia_avancada",
            name: "Embriologia Avançada",
            file: "embrio2"
        },
        {
            id: "anatomia",
            name: "Anatomia",
            file: "anatomia"
        }
    ]
};
