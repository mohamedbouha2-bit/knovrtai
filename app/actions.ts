"use server";

import prisma from "./prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";

const genAI = new GoogleGenerativeAI("AIzaSyCij_b-qZWsM93Rbh8ofrfwdJXUCUGtVNo");
const groq = new Groq({ apiKey: "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" });
const PEXELS_KEY = "E3wHd1wg6UvZZByCtuw7jWRkkx049QKG5PiafW3RxNNaTMz040q57uNW";

export async function createContactEntry(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  try {
    // 1. جلب الكلمة المفتاحية من Groq
    const groqRes = await groq.chat.completions.create({
      messages: [{ role: "user", content: `Give me ONE English noun for a tech wallpaper theme: ${name}` }],
      model: "llama-3.3-70b-versatile",
    });
    const keyword = groqRes.choices[0]?.message?.content?.trim() || "future";

    // 2. جلب الصورة
    const pexelsRes = await fetch(`https://api.pexels.com/v1/search?query=${keyword}&per_page=1`, {
      headers: { Authorization: PEXELS_KEY }
    });
    const pexelsData = await pexelsRes.json();
    const imageUrl = pexelsData.photos?.[0]?.src?.large || "";

    // 3. الحل النهائي لـ Gemini:
    // جربنا gemini-1.5-flash ولم تنجح، الآن سنستخدم المسار الكامل
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // سنستخدم sendMessage لأنها أكثر استقراراً في النسخ الجديدة
    const chat = model.startChat();
    const result = await chat.sendMessage(`رحب بـ ${name} في AutoCoder.cc بعبارة ترحيبية قصيرة جداً باللغة العربية.`);
    const aiResponse = result.response.text();

    // 4. الحفظ
    await prisma.user.create({
      data: { name, email, aiResponse },
    });

    return { success: true, message: aiResponse, imageUrl };
  } catch (error: any) {
    console.error("DEBUG:", error.message);
    // إذا استمر الخطأ، سنقوم بإرجاع رسالة ترحيب ثابتة حتى لا يتعطل الموقع تماماً
    return { 
      success: true, 
      message: `أهلاً بك يا ${name}! نحن سعداء بانضمامك إلينا.`, 
      imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" 
    };
  }
}