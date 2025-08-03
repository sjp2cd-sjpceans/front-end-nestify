// 🚨 DEPRECATED: Client-side Gemini integration has been replaced
//
// TrustSearch now uses a LOCAL JSON approach for faster responses:
// - Local data: src/data/mockData.json
// - AI processing: Supabase Edge Function 'ai-chatbot-local'
// - Frontend hook: src/hooks/useChatbot.ts
//
// This approach provides:
// ✅ Faster responses (no database queries)
// ✅ Reduced token usage (pre-filtered context)
// ✅ Secure API key handling (server-side only)
// ✅ Better rate limit management

export const DEPRECATED_GEMINI_INFO = {
  status: 'replaced_with_local_json',
  new_approach: {
    data_source: 'src/data/mockData.json',
    ai_function: 'ai-chatbot-local',
    frontend_hook: 'useChatbot',
    benefits: [
      'Faster responses',
      'Reduced token usage', 
      'Secure API keys',
      'Better UX'
    ]
  },
  migration_date: '2024-01-25'
}