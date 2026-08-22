import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const HUBS = ['Tokyo, Japan', 'Kyoto, Japan', 'Osaka, Japan', 'Mount Fuji, Japan', 'Hokkaido, Japan', 'Bali, Indonesia', 'Paris, France', 'Rome, Italy'];
const CATEGORIES = ['Transport', 'Etiquette', 'Food & Dining', 'Itinerary Review', 'Hidden Gems'];

export async function seedNewDiscussion() {
  const targetHub = HUBS[Math.floor(Math.random() * HUBS.length)];
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  const prompt = `
    You are an expert community manager for a travel forum.
    Generate a realistic, organic discussion thread for a traveler visiting: ${targetHub}.
    Category: ${category}.
    
    Return ONLY a valid JSON object with the following structure:
    {
      "discussion": {
        "title": "A highly realistic question/dilemma (e.g., 'Do I really need a JR Pass for 7 days in Tokyo/Kyoto?')",
        "content": "A detailed 2-3 paragraph post explaining their specific itinerary context, worries, or constraints.",
        "author_name": "A realistic name (e.g. 'Liam Vance')",
        "author_badge": "First-time Traveler or Explorer",
        "location": "${targetHub}",
        "category": "${category}",
        "minutes_ago": 240
      },
      "replies": [
        {
          "content": "A highly specific, helpful answer mentioning exact places, train lines, or local rules.",
          "author_name": "A realistic Japanese or local guide name (e.g. 'Kenji Sato')",
          "author_badge": "Verified Local Guide",
          "is_guide": true,
          "minutes_ago": 120
        },
        {
          "content": "A friendly tip sharing a personal past experience that agrees or adds a minor alternative.",
          "author_name": "A realistic traveler name (e.g. 'Hannah M.')",
          "author_badge": "Gold Nomad",
          "is_guide": false,
          "minutes_ago": 45
        }
      ]
    }
  `;

  try {
    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const resultStr = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(resultStr);

    if (!result.discussion) throw new Error('Invalid generation');

    // 1. Insert Discussion with time offset
    const discussionCreatedAt = new Date(Date.now() - result.discussion.minutes_ago * 60000).toISOString();
    
    const { data: discussion, error: dError } = await getSupabase()
      .from('forum_discussions')
      .insert({
        title: result.discussion.title,
        content: result.discussion.content,
        author_name: result.discussion.author_name,
        author_badge: result.discussion.author_badge,
        location: result.discussion.location,
        category: result.discussion.category,
        created_at: discussionCreatedAt,
        updated_at: discussionCreatedAt
      })
      .select()
      .single();

    if (dError) throw dError;

    // 2. Insert Replies
    const repliesToInsert = (result.replies || []).map((reply: any) => ({
      discussion_id: discussion.id,
      content: reply.content,
      author_name: reply.author_name,
      author_badge: reply.author_badge,
      is_guide: reply.is_guide,
      created_at: new Date(Date.now() - (reply.minutes_ago * 60000)).toISOString()
    }));

    if (repliesToInsert.length > 0) {
      const { error: rError } = await getSupabase().from('forum_replies').insert(repliesToInsert);
      if (rError) throw rError;
    }

    return { success: true, discussion_id: discussion.id };
  } catch (error: any) {
    console.error('Seeder Error:', error);
    return { success: false, error: error.message };
  }
}

export async function generateAutoReply(discussionId: string, userContent: string) {
  try {
    const { data: discussion } = await getSupabase().from('forum_discussions').select('*').eq('id', discussionId).single();
    if (!discussion) return;

    const prompt = `
      A real customer just posted in a travel forum.
      Location: ${discussion.location}
      Thread Title: ${discussion.title}
      Customer's Post: "${userContent}"

      Write a helpful, hyper-local response as a "Verified Local Guide". Keep it extremely authentic, 1-2 paragraphs.
      Return ONLY a JSON object: { "reply": "your detailed response here" }
    `;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' },
      temperature: 0.6,
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    if (!result.reply) return;

    await getSupabase().from('forum_replies').insert({
      discussion_id: discussionId,
      content: result.reply,
      author_name: 'Vaitour Guide AI',
      author_badge: 'Verified Local Guide',
      is_guide: true
    });

  } catch (error) {
    console.error('Auto-reply Error:', error);
  }
}
