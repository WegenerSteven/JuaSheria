import { type HTMLTemplateResult, html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { AIChatMessage } from '@microsoft/ai-chat-protocol';

// Simple markdown parser for basic formatting
function parseMarkdown(text: string): HTMLTemplateResult {
  let processedText = text;

  // Handle bold text (**text** or __text__)
  processedText = processedText.replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  processedText = processedText.replaceAll(/__(.*?)__/g, '<strong>$1</strong>');

  // Handle italic text (*text* or _text_)
  processedText = processedText.replaceAll(/\*(.*?)\*/g, '<em>$1</em>');
  processedText = processedText.replaceAll(/_(.*?)_/g, '<em>$1</em>');

  // Handle line breaks
  processedText = processedText.replaceAll('\n', '<br>');

  // Handle numbered lists (1. item)
  processedText = processedText.replaceAll(/(\n|^)(\d+)\.\s+/g, '$1<br><strong>$2.</strong> ');

  return html`${unsafeHTML(processedText)}`;
}

export type ParsedMessage = {
  html: HTMLTemplateResult;
  citations: string[];
  followupQuestions: string[];
  role: string;
  context?: object;
};

export function parseMessageIntoHtml(
  message: AIChatMessage,
  renderCitationReference: (citation: string, index: number) => HTMLTemplateResult,
): ParsedMessage {
  if (message.role === 'user') {
    return {
      html: parseMarkdown(message.content),
      citations: [],
      followupQuestions: [],
      role: message.role,
      context: message.context,
    };
  }

  const citations: string[] = [];
  const followupQuestions: string[] = [];

  // Extract any follow-up questions that might be in the message
  const text = message.content
    .replaceAll(/<<([^>]+)>>/g, (_match, content: string) => {
      followupQuestions.push(content);
      return '';
    })
    .split('<<')[0] // Truncate incomplete questions
    .trim();

  // Extract any citations that might be in the message
  const parts = text.split(/\[([^\]]+)]/g);
  const result = html`${parts.map((part, index) => {
    if (index % 2 === 0) {
      // Process markdown formatting for non-citation parts
      return html`${parseMarkdown(part)}`;
    }

    if (index + 1 < parts.length) {
      // Handle only completed citations
      let citationIndex = citations.indexOf(part);
      if (citationIndex === -1) {
        citations.push(part);
        citationIndex = citations.length;
      } else {
        citationIndex++;
      }

      return renderCitationReference(part, citationIndex);
    }

    return nothing;
  })}`;

  return {
    html: result,
    citations,
    followupQuestions,
    role: message.role,
    context: message.context,
  };
}
