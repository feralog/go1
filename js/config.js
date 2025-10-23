/**
 * config.js - Configurações do quiz
 * 
 * Este arquivo contém as configurações personalizáveis do quiz.
 * Altere estas configurações para adaptar o quiz à sua matéria.
 */

// Configuração do quiz
const quizConfig = {
    // Título principal que aparece na tela de login. Ajuste conforme a sua disciplina.
    title: "Quizzes",

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
                    file: "subjects/GO/GOQuestions/exame_ginecologico"
                },
                {
                    id: "ciclo_menstrual",
                    name: "Ciclo Menstrual",
                    file: "subjects/GO/GOQuestions/ciclo_menstrual"
                },
                {
                    id: "desenvolvimento_puberal",
                    name: "Desenvolvimento Puberal",
                    file: "subjects/GO/GOQuestions/desenvolvimento_puberal"
                },
                {
                    id: "embriologia",
                    name: "Embriologia",
                    file: "subjects/GO/GOQuestions/embrio"
                },
                {
                    id: "embriologia_avancada",
                    name: "Embriologia Avançada",
                    file: "subjects/GO/GOQuestions/embrio2"
                },
                {
                    id: "anatomia",
                    name: "Anatomia",
                    file: "subjects/GO/GOQuestions/anatomia"
                }
            ]
        },
        cardio: {
            id: "cardio",
            name: "Cardiologia e Pneumologia",
            hasResumos: false,
            hasGuias: false,
            hasSubcategories: true,
            subcategories: {
                avc1: {
                    id: "avc1",
                    name: "AVC 1",
                    modules: [
                        {
                            id: "has",
                            name: "Hipertensão Arterial Sistêmica",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/has"
                        },
                        {
                            id: "dislipidemias",
                            name: "Dislipidemias",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/dislipidemias"
                        },
                        {
                            id: "sca",
                            name: "Síndrome Coronariana Aguda",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/SCA"
                        },
                        {
                            id: "ic",
                            name: "Insuficiência Cardíaca",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/IC"
                        },
                        {
                            id: "propedeutica",
                            name: "Propedêutica",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/propedeutica"
                        },
                        {
                            id: "bronquite",
                            name: "Bronquite",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/bronquite"
                        },
                        {
                            id: "enfisema",
                            name: "Enfisema",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/enfisema"
                        },
                        {
                            id: "diagnostico_dpoc",
                            name: "Diagnóstico DPOC",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/diagnostico_dpoc"
                        },
                        {
                            id: "tratamento_dpoc",
                            name: "Tratamento DPOC",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/tratamento_dpoc"
                        }
                    ]
                },
                avc2: {
                    id: "avc2",
                    name: "AVC 2",
                    modules: [
                        {
                            id: "ecg",
                            name: "ECG",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/ECG"
                        },
                        {
                            id: "asma",
                            name: "Asma",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/asma"
                        },
                        {
                            id: "dengue",
                            name: "Dengue",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/dengue"
                        },
                        {
                            id: "hipertireoidismo",
                            name: "Hipertireoidismo",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/hipertireoidismo"
                        },
                        {
                            id: "lrarenal",
                            name: "Lesão Renal Aguda",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/lrarenal"
                        },
                        {
                            id: "miocardiopatias",
                            name: "Miocardiopatias",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/miocardiopatias"
                        },
                        {
                            id: "pneumonias",
                            name: "Pneumonias",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/pneumonias"
                        },
                        {
                            id: "sdnefritica",
                            name: "Síndrome Nefrítica",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/sdnefritica"
                        },
                        {
                            id: "valvulopatias",
                            name: "Valvulopatias",
                            file: "subjects/CardioPneumo/CardioPneumoQuestions/valvulopatias"
                        }
                    ]
                }
            }
        },
        tc: {
            id: "tc",
            name: "Técnicas Cirúrgicas",
            hasResumos: true,
            hasGuias: true,
            modules: [
                {
                    id: "cicatrizacao",
                    name: "Cicatrização",
                    file: "subjects/TecnicasCirurgicas/TCQuestions/questoes_cicatrizacao"
                },
                {
                    id: "cicatrizacao_patologica",
                    name: "Cicatrização Patológica",
                    file: "subjects/TecnicasCirurgicas/TCQuestions/questoes_cicatrizacao_patologica"
                },
                {
                    id: "coagulacao",
                    name: "Coagulação",
                    file: "subjects/TecnicasCirurgicas/TCQuestions/questoes_coagulacao"
                },
                {
                    id: "preoperatorio",
                    name: "Pré-operatório",
                    file: "subjects/TecnicasCirurgicas/TCQuestions/questoes_preoperatorio"
                }
            ]
        }
    },

    // Lista de módulos disponíveis (mantida para compatibilidade)
    modules: []
};
