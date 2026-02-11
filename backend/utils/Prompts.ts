//classification
export const classificationPrompt = (
  question: string
) => `Analyze this user message and determine if it requires searching a knowledge base or if it's a conversational message.

  User message: "${question}"

A query needs retrieval if it:
- Asks for specific information, facts, or details
- Contains "who", "what", "when", "where", "why", "how" questions
- Asks about a specific topic, person, or event
- Requests data or documentation

A query does NOT need retrieval if it:
- Is casual conversation (greetings, thanks, acknowledgments)
- Is sharing personal information
- Is expressing emotions or opinions
- Is a simple statement without a question

Respond with only "RETRIEVE" or "CONVERSATIONAL"`;

//rephrase
export const rewritePrompt = (
  chatHistoryStr: string,
  question: string
) => `Given a chat history and a follow-up question, rephrase the follow-up question to be a standalone question that contains all necessary context.

  Chat History:
  ${chatHistoryStr}

  Follow-up Question: ${question}

  Standalone Question:`;

//conversation
export const conversationalPrompt = (
  chatHistoryStr: string,
  question: string
) => `You are a helpful AI assistant. Have a natural conversation with the user.

${chatHistoryStr ? `Chat History:\n${chatHistoryStr}\n` : ""}
User: ${question}

Respond naturally and conversationally. If the user is sharing information, acknowledge it warmly.`;
