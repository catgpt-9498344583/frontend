// Blocklist of inappropriate words
const BLOCKLIST = [
  'arsehole', 'asshat', 'asshole', 'bastard', 'bitch', 'bloody', 'blowjob',
  'bollocks', 'bugger', 'bullshit', 'chicken shit', 'ching chong', 'clusterfuck',
  'cock', 'cocksucker', 'coonass', 'cornhole', 'cracker', 'crap', 'cunt',
  'dick', 'dumbass', 'enshittification', 'faggot', 'feck', 'fuck', 'fuckery',
  'grab em by the pussy', 'healslut', 'if you see kay', 'jesus fucking christ',
  'kike', 'motherfucker', 'nigga', 'nigger', 'pajeet', 'paki', 'poof',
  'poofter', 'prick', 'pussy', 'ratfucking', 'retard', 'russian warship go fuck yourself',
  'serving cunt', 'shit', 'shithole', 'shitpost', 'shitter', 'shut the fuck up',
  'shut the hell up', 'slut', 'son of a bitch', 'spic', 'taking the piss',
  'twat', 'unclefucker', 'wanker', 'whore'
];

/**
 * Checks if the text contains any blocked words
 * @param text - The text to check
 * @returns true if blocked words are found, false otherwise
 */
export function containsBlockedWords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BLOCKLIST.some(word => {
    // Use word boundaries to match whole words
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Returns a user-friendly error message for blocked content
 */
export function getBlockedMessage(): string {
  return "I'm sorry, but I can't respond to messages containing inappropriate language. Please rephrase your message in a respectful way.";
}
