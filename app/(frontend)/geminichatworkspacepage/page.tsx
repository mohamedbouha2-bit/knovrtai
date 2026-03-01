'use client';

import React from 'react';
import GeminiChatWorkspacePage_ConversationList from '@/components/GeminiChatWorkspacePage_ConversationList';
import GeminiChatWorkspacePage_InputComposer from '@/components/GeminiChatWorkspacePage_InputComposer';
const GeminiChatWorkspacePage: React.FC = () => {
  return <main className="min-h-screen w-full bg-[#ffffff]">
      <section className="w-full relative">
        <GeminiChatWorkspacePage_ConversationList />
      </section>
      <section className="w-full relative">
        <GeminiChatWorkspacePage_InputComposer />
      </section>
    </main>;
};
export default GeminiChatWorkspacePage;
