import { containsBlockedWords, getBlockedMessage } from './blocklist';

describe('blocklist', () => {
  describe('containsBlockedWords', () => {
    it('should return true for exact blocked word matches', () => {
      expect(containsBlockedWords('fuck')).toBe(true);
      expect(containsBlockedWords('shit')).toBe(true);
      expect(containsBlockedWords('asshole')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(containsBlockedWords('FUCK')).toBe(true);
      expect(containsBlockedWords('Shit')).toBe(true);
      expect(containsBlockedWords('AsShOlE')).toBe(true);
    });

    it('should detect blocked words in sentences', () => {
      expect(containsBlockedWords('What the fuck is this')).toBe(true);
      expect(containsBlockedWords('This is bullshit')).toBe(true);
      expect(containsBlockedWords('You are a dick')).toBe(true);
    });

    it('should match whole words only', () => {
      expect(containsBlockedWords('class')).toBe(false);
      expect(containsBlockedWords('classic')).toBe(false);
      expect(containsBlockedWords('assassin')).toBe(false);
      expect(containsBlockedWords('dickens')).toBe(false);
    });

    it('should return false for clean text', () => {
      expect(containsBlockedWords('Hello, how are you?')).toBe(false);
      expect(containsBlockedWords('What classes are available?')).toBe(false);
      expect(containsBlockedWords('Tell me about scholarships')).toBe(false);
    });

    it('should handle empty strings', () => {
      expect(containsBlockedWords('')).toBe(false);
    });

    it('should handle multi-word blocked phrases', () => {
      expect(containsBlockedWords('chicken shit')).toBe(true);
      expect(containsBlockedWords('son of a bitch')).toBe(true);
    });

    it('should detect blocked words with punctuation', () => {
      expect(containsBlockedWords('What the fuck!')).toBe(true);
      expect(containsBlockedWords('shit.')).toBe(true);
      expect(containsBlockedWords('(asshole)')).toBe(true);
    });
  });

  describe('getBlockedMessage', () => {
    it('should return a polite error message', () => {
      const message = getBlockedMessage();
      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });
});
