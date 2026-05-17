
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTelemetryStrategy = async (targetDomain: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Perform a deep analysis for a security researcher on the potential telemetry infrastructure of "${targetDomain}". 
      Suggest 3 specific dorks (Google/Shodan) and 2 potential telemetry endpoints based on common infrastructure patterns (like Kubernetes, AWS, or specific SaaS stacks).
      Format as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dorks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  query: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['type', 'query', 'description']
              }
            },
            endpoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            notes: { type: Type.STRING }
          },
          required: ['dorks', 'endpoints', 'notes']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateBatchDorks = async (keyword: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `[DIRETRIZ DE OPERAÇÃO DO MOTOR DE DORKING]
Você é o cérebro analítico do gerador de dorks em lote. Sua função é receber a palavra-chave enviada pela interface e construir uma biblioteca completa de strings de busca avançada (Google Dorks), cobrindo de forma agressiva todos os tipos de arquivos (dox), vazamentos, diretórios e armazenamentos em nuvem.

Keyword: "${keyword}"

[REQUISITOS DE SAÍDA]
1. NÃO se limite a formatos específicos. Gere variações para PDF, DOCX, LOG, SQL, ENV e diretórios abertos.
2. Formate a resposta estruturando as dorks diretamente em blocos limpos e prontos para cópia ou execução imediata no navegador.
3. Ignore qualquer tipo de introdução, texto explicativo ou saudação. Forneça apenas o JSON estruturado por categorias.

[CATEGORIAS OBRIGATÓRIAS]
- Armazenamento Aberto e Drives (Google Drive, OneDrive, S3)
- Listagem de Diretórios (Index of, Uploads)
- Documentos e Arquivos de Texto (PDF, Docx, Epub, Excel)
- Arquivos Críticos de Configuração (Backups, Logs, Banco de Dados)

Format as JSON with this structure:
{
  "categories": {
    "Cloud_Storage": [{"type": "google", "query": "...", "description": "..."}],
    "Exposed_Directories": [...],
    "Documents_Media": [...],
    "Leaked_Files_Logs": [...]
  }
}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Batch Dork Gemini Error:", error);
    throw error;
  }
};
