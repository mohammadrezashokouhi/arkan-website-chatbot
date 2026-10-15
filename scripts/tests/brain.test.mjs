import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import crypto from 'node:crypto';
import { z } from 'zod';
function load(file, deps, env = {}) {
 const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
 const exports = {};
 vm.runInNewContext(code, { exports, require: (id) => { if (id === 'server-only') return {}; if (id in deps) return deps[id]; throw Error('Unexpected dependency: ' + id); }, process: { env }, Buffer, console });
 return exports;
}
test('conversation capabilities reject tampering and use channel isolation', () => {
 const tokens = load('src/lib/rag/conversation-token.ts', { 'node:crypto': crypto }, { CHAT_SESSION_SECRET: 'test-secret' });
 const id = crypto.randomUUID();
 const signed = tokens.signConversation(id, 'web');
 assert.equal(tokens.verifyConversation(signed, 'web'), id);
 assert.equal(tokens.verifyConversation(signed, 'widget'), null);
 assert.equal(tokens.verifyConversation(id, 'web'), null);
 assert.equal(tokens.verifyConversation(signed + 'x', 'web'), null);
 assert.equal(tokens.verifyConversation(signed + '.extra', 'web'), null);
});
async function toolsFor(db) {
 let opts;
 const brain = load('src/lib/rag/chat.ts', {
  'node:crypto': crypto, ai: { tool: x => x }, zod: { z },
  '@/lib/supabase': { getSupabaseAdmin: () => db ? { from: name => name === 'conversations' ? { insert: () => ({ select: () => ({ single: async () => ({data:null}) }) }) } : db.from(name) } : null },
  '@/lib/validation': { leadSchema: z.object({full_name:z.string(),phone:z.string(),business_name:z.string(),stage:z.string(),challenge:z.string()}) },
  './retrieve': { retrieve: async () => [], buildContext: () => '' },
  './config': { getChatSettings: async () => ({ max_messages_per_conv: 0 }), getActivePrompt: async () => 'Rayan', getModelConfig: async () => ({}) },
  './generate': { isOpenRouterConfigured: () => true, streamChat: o => { opts = o; return {text: Promise.resolve('ok')}; } },
  './policy': { isWithinOfficeHours: () => true }, './summarize': {},
 });
 await brain.getReplyText({ userMessage: 'سلام' });
 return opts.tools;
}
test('lead tool requires explicit consent and returns failure without storage', async () => {
 const tools = await toolsFor(null);
 assert.equal(tools.capture_lead.inputSchema.safeParse({full_name:'رضا',phone:'123',business_name:'test',stage:'نوپا',challenge:'test'}).success, false);
 assert.equal((await tools.capture_lead.execute({})).ok, false);
 assert.equal((await tools.check_registration_status.execute({tracking_code:'a'.repeat(32)})).ok, false);
});
test('status lookup selects status only and never returns personal data', async () => {
 let table, selected, code;
 const db = { from: name => { table = name; return { insert: async () => ({}), select: col => { selected = col; return { eq: (key,val) => {code=[key,val]; return { maybeSingle: async () => ({data:{status:'new'}}) };} };} };} };
 const tools = await toolsFor(db);
 const result = await tools.check_registration_status.execute({tracking_code:'A'.repeat(32)});
 assert.equal(table, 'leads'); assert.equal(selected, 'status');
 assert.equal(code[0], 'tracking_code'); assert.equal(code[1], 'a'.repeat(32));
 assert.equal(result.ok, true); assert.equal(Object.keys(result).length, 2);
});
test('status lookup distinguishes unknown request from database failure', async () => {
 for (const response of [{data:null,error:null},{data:null,error:{message:'offline'}}]) {
  const db={from:()=>({insert:async()=>({}),select:()=>({eq:()=>({maybeSingle:async()=>response})})})};
  const tools=await toolsFor(db);
  assert.equal((await tools.check_registration_status.execute({tracking_code:'b'.repeat(32)})).ok,false);
 }
});
test('successful lead capture persists consent and an unguessable tracking code', async () => {
 let row;
 const db={from:()=>({insert:async data=>{row=data;return {error:null};}})};
 const tools=await toolsFor(db);
 const args={consent:true,full_name:'رضا رضایی',phone:'+16045550123',business_name:'فروشگاه',stage:'نوپا',challenge:'طراحی سایت فروشگاهی'};
 assert.equal((await tools.capture_lead.execute({...args,consent:false})).ok,false);
 const result=await tools.capture_lead.execute(args);
 assert.equal(result.ok,true);
 assert.match(result.tracking_code,/^[a-f0-9]{32}$/);
 assert.equal(row.tracking_code,result.tracking_code);
 assert.ok(row.consent_at);
});
