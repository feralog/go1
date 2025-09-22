/**
 * config.js - Configurações do quiz
 * 
 * Este arquivo contém as configurações personalizáveis do quiz.
 * Altere estas configurações para adaptar o quiz à sua matéria.
 */

// Configuração do quiz
const quizConfig = {
    // Título principal que aparece na tela de login. Ajuste conforme a sua disciplina.
    title: "Quiz Médico",

    // Nome do localStorage para salvar os dados do usuário. Alterado para evitar conflitos com o template original.
    storageKey: "quizMedicoData",

    // Especialidades disponíveis
    specialties: {
        go: {
            id: "go",
            name: "Ginecologia e Obstetrícia",
            hasResumos: true,
            hasGuias: true,
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
        },
        cardio: {
            id: "cardio",
            name: "Cardiologia e Pneumologia",
            hasResumos: false,
            hasGuias: false,
            modules: [
                {
                    id: "has",
                    name: "Hipertensão Arterial Sistêmica",
                    file: "has"
                },
                {
                    id: "dislipidemias",
                    name: "Dislipidemias",
                    file: "dislipidemias"
                },
                {
                    id: "sca",
                    name: "Síndrome Coronariana Aguda",
                    file: "SCA"
                },
                {
                    id: "ic",
                    name: "Insuficiência Cardíaca",
                    file: "IC"
                },
                {
                    id: "propedeutica",
                    name: "Propedêutica",
                    file: "propedeutica"
                }
            ]
        }
    },

    // Lista de módulos disponíveis (mantida para compatibilidade)
    modules: []
};
