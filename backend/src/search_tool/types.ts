

// 2 possible paths
// web path -> browse , summarize , source urls / cite urls,
// Direct path -> LLM . No browsing
// Shared shape -> candidate

export type candidate = {
    answer : string;
    sources : string[]; // Top 10 anime of the world
    mode : 'web' | 'direct';
}