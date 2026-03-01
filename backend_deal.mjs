#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createInterface } from "readline";
import { execSync } from "child_process";
import { pathToFileURL } from "url";

// معرف المشروع الفريد لإدارة قاعدة البيانات
const PROJECT_ID = "PROJ_bb6c72d2_snap_20260225_135055_910";
const PROJECT_ROOT = ".";

/**
 * دالة لسؤال المستخدم في التيرمنال مع خيار إخفاء الإدخال (كلمة السر)
 */
function ask(question, { hidden = false, defaultValue = "" } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    if (hidden) {
      rl._writeToOutput = (str) => {
        if (str.includes(question)) {
          rl.output.write(question);
        } else {
          rl.output.write("*"); // استبدال كلمة السر بنجوم
        }
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer || defaultValue);
    });
  });
}

function run(cmd) {
  console.log(`🚀 تنفيذ: ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit", cwd: PROJECT_ROOT });
  } catch (e) {
    console.error(`❌ فشل تنفيذ الأمر: ${cmd}`);
    process.exit(1);
  }
}

/**
 * دالة بذر البيانات (Seed) - تقوم بإدخال البيانات الأساسية لقاعدة البيانات
 */
async function seedDatabase(databaseUrl) {
  const sqlPath = resolve(PROJECT_ROOT, "prisma/database.sql");
  if (existsSync(sqlPath)) {
    console.log("📝 جاري تشغيل ملف SQL المخصص لإدخال البيانات...");
    const sql = readFileSync(sqlPath, "utf-8");
    process.env.DATABASE_URL = databaseUrl;
    
    // استيراد Prisma Client المولد ديناميكياً
    const clientPath = pathToFileURL(resolve(process.cwd(), PROJECT_ROOT, "prisma-generated/client/index.js")).href;
    const { PrismaClient } = await import(clientPath);
    const prisma = new PrismaClient();

    // تقسيم أوامر SQL وتنفيذها
    const statements = sql
      .split(/;\s*\n/)
      .map(s => s.split("\n").filter(line => {
          const t = line.trim();
          return t.length > 0 && !t.startsWith("--");
      }).join("\n").trim())
      .filter(s => s.length > 0);

    for (const st of statements) {
      await prisma.$executeRawUnsafe(st + (st.endsWith(";") ? "" : ";"));
    }
    console.log("✅ تمت عملية بذر البيانات بنجاح.");
    await prisma.$disconnect();
  } else {
    run("npx prisma db seed");
  }
}

async function main() {
  console.log(`\n💎 GemAI Project Setup - ID: ${PROJECT_ID}\n`);

  const pkgPath = resolve(PROJECT_ROOT, "package.json");
  if (!existsSync(pkgPath)) {
    console.error("❌ خطأ: لم يتم العثور على ملف package.json");
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const version = pkg.version;

  // دعم الإصدارات المحددة في المشروع
  if (version === "1.0.0" || version === "3.0.0") {
    const dbHost = await ask("Database host [default: localhost]: ", { defaultValue: "localhost" });
    const dbPort = await ask("Database port [default: 3306]: ", { defaultValue: "3306" });
    const dbUser = await ask("Database user [default: root]: ", { defaultValue: "root" });
    const dbPass = await ask("Database password: ", { hidden: true });

    if (!dbPass && dbUser !== "root") {
      console.error("⚠️ تحذير: كلمة السر فارغة.");
    }

    const databaseUrl = `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${PROJECT_ID}`;
    
    // تحديث ملف schema.prisma بالرابط الجديد
    const schemaPath = resolve(PROJECT_ROOT, "prisma/schema.prisma");
    if (existsSync(schemaPath)) {
      let schema = readFileSync(schemaPath, "utf-8");
      schema = schema.replace(/url\s*=\s*"mysql:\/\/[^"]*"/, `url = "${databaseUrl}"`);
      writeFileSync(schemaPath, schema, "utf-8");
      console.log("📍 تم تحديث ملف schema.prisma بنجاح.");
    }

    // تهيئة قاعدة البيانات
    run("npx prisma db push --force-reset --accept-data-loss");
    run("npx prisma generate");
    await seedDatabase(databaseUrl);

  } else {
    console.error(`❌ خطأ: الإصدار ${version} غير مدعوم حالياً في سكربت الإعداد.`);
    process.exit(1);
  }

  console.log("\n✨ اكتملت عملية الإعداد! يمكنك الآن تشغيل التطبيق.");
}

main();