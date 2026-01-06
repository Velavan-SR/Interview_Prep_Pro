import { IMessage } from '../db/models';

/**
 * Conversation Memory Manager
 * Handles intelligent context windowing and message prioritization
 */

interface MessageWithRelevance extends IMessage {
  relevanceScore?: number;
}

export class ConversationMemory {
  private maxTokens: number;
  private avgTokensPerMessage: number = 100; // Rough estimate

  constructor(maxTokens: number = 3000) {
    this.maxTokens = maxTokens;
  }

  /**
   * Get the most relevant messages for the current context
   * Uses a sliding window approach with recent message prioritization
   */
  getRelevantMessages(
    messages: IMessage[],
    currentTopic?: string
  ): IMessage[] {
    if (messages.length === 0) return [];

    // Always include the last N messages for immediate context
    const recentMessageCount = 6;
    const recentMessages = messages.slice(-recentMessageCount);

    // Calculate how many more messages we can include
    const maxMessages = Math.floor(this.maxTokens / this.avgTokensPerMessage);
    
    if (messages.length <= maxMessages) {
      return messages;
    }

    // For longer conversations, use a smart sampling strategy
    const remainingSlots = maxMessages - recentMessageCount;
    
    if (remainingSlots <= 0) {
      return recentMessages;
    }

    // Get older messages with relevance scoring
    const olderMessages = messages.slice(0, -recentMessageCount);
    const scoredMessages = this.scoreMessageRelevance(olderMessages, currentTopic);

    // Sort by relevance and take top N
    const topOlderMessages = scoredMessages
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, remainingSlots);

    // Combine and sort by original order
    const allSelected = [...topOlderMessages, ...recentMessages];
    return allSelected.sort((a, b) => 
      messages.indexOf(a) - messages.indexOf(b)
    );
  }

  /**
   * Score messages based on relevance factors
   */
  private scoreMessageRelevance(
    messages: IMessage[],
    currentTopic?: string
  ): MessageWithRelevance[] {
    return messages.map((msg, index) => {
      let score = 0;

      // Recency bonus (more recent = higher score)
      const recencyBonus = index / messages.length;
      score += recencyBonus * 0.3;

      // Question messages are more valuable (set context)
      if (msg.role === 'assistant') {
        score += 0.3;
      }

      // Longer messages likely have more substance
      const lengthBonus = Math.min(msg.content.length / 500, 1);
      score += lengthBonus * 0.2;

      // Topic relevance (if provided)
      if (currentTopic && msg.content.toLowerCase().includes(currentTopic.toLowerCase())) {
        score += 0.4;
      }

      // Code snippets are valuable
      if (msg.content.includes('```') || msg.content.includes('function') || msg.content.includes('const ')) {
        score += 0.2;
      }

      return { ...msg, relevanceScore: score };
    });
  }

  /**
   * Summarize a conversation for long-term storage
   */
  generateConversationSummary(messages: IMessage[]): string {
    const topics: string[] = [];
    let technicalDepth = 0;

    messages.forEach((msg) => {
      if (msg.role === 'assistant') {
        // Extract potential topics from questions
        const content = msg.content.toLowerCase();
        if (content.includes('event loop')) topics.push('Event Loop');
        if (content.includes('promise') || content.includes('async')) topics.push('Async Programming');
        if (content.includes('react')) topics.push('React');
        if (content.includes('database')) topics.push('Databases');
        if (content.includes('api')) topics.push('API Design');
        if (content.includes('performance')) topics.push('Performance');
        if (content.includes('security')) topics.push('Security');
      }

      // Estimate technical depth
      if (msg.content.length > 200) technicalDepth++;
    });

    const uniqueTopics = Array.from(new Set(topics));
    const avgMessageLength = messages.reduce((sum, m) => sum + m.content.length, 0) / messages.length;

    return `Interview covered ${uniqueTopics.length} topics: ${uniqueTopics.join(', ')}. ` +
           `Average response length: ${Math.round(avgMessageLength)} chars. ` +
           `Technical depth: ${technicalDepth > 5 ? 'High' : technicalDepth > 2 ? 'Medium' : 'Low'}`;
  }

  /**
   * Detect conversation patterns
   */
  analyzeConversationFlow(messages: IMessage[]): {
    avgResponseLength: number;
    questionCount: number;
    shortAnswerCount: number;
    detailedAnswerCount: number;
  } {
    const userMessages = messages.filter(m => m.role === 'user');
    const avgResponseLength = userMessages.length > 0
      ? userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length
      : 0;

    const questionCount = messages.filter(m => m.role === 'assistant').length;
    const shortAnswerCount = userMessages.filter(m => m.content.length < 100).length;
    const detailedAnswerCount = userMessages.filter(m => m.content.length > 300).length;

    return {
      avgResponseLength,
      questionCount,
      shortAnswerCount,
      detailedAnswerCount,
    };
  }
}

/**
 * Factory function to create a new memory instance
 */
export function createMemory(maxTokens?: number): ConversationMemory {
  return new ConversationMemory(maxTokens);
}
