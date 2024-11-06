import { ChatAnthropic } from "@langchain/anthropic";
import { HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

class AIService {
  private model: ChatAnthropic;
  private outputParser: StringOutputParser;

  constructor() {
    this.model = new ChatAnthropic({
      apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
      model: "claude-3-sonnet-20240229",
      temperature: 0.7,
    });
    this.outputParser = new StringOutputParser();
  }

  async generateMemo(
    eventContext: string,
    bookNotes: string[],
    format: 'bullet' | 'narrative' | 'framework'
  ): Promise<string> {
    try {
      const prompt = this.constructPrompt(eventContext, bookNotes, format);
      const response = await this.model
        .pipe(this.outputParser)
        .invoke([new HumanMessage(prompt)]);
      
      return response;
    } catch (error) {
      console.error('AI Memo Generation error:', error);
      throw new Error('Failed to generate memo');
    }
  }

  private constructPrompt(
    eventContext: string,
    bookNotes: string[],
    format: 'bullet' | 'narrative' | 'framework'
  ): string {
    return `
      As an AI assistant, help create a memo for an upcoming event using insights from books.
      
      Event Context:
      ${eventContext}

      Relevant Book Notes:
      ${bookNotes.join('\n\n')}

      Please create a ${format} format memo that:
      1. Identifies key principles from the books that are relevant to the event
      2. Provides actionable insights for the specific context
      3. Includes specific examples or quotes where relevant
      ${format === 'bullet' ? '4. Use clear bullet points for easy scanning' : ''}
      ${format === 'framework' ? '4. Structure the response using a clear framework or model' : ''}
      
      Keep the memo concise and focused on practical application.
    `;
  }
}

export const aiService = new AIService();