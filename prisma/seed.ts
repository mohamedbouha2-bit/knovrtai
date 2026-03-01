const { PrismaClient, Prisma } = require('../prisma-generated/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding (Incremental Mode - System Overhaul: Settings Grid, RTL & Dark Mode)...');

  // 1. Helper for Dates
  const now = new Date();
  const oneMonthAgo = new Date(); oneMonthAgo.setMonth(now.getMonth() - 1);
  const nextMonth = new Date(); nextMonth.setMonth(now.getMonth() + 1);

  // -----------------------------------------------------------------------
  // 2. System Initialization (Global Config)
  // -----------------------------------------------------------------------
  console.log('Initializing Global Configuration...');
  
  const existingConfig = await prisma.global_config.findFirst();
  
  const configData = {
    openai_api_key: 'sk-placeholder-key-for-production',
    stripe_public_key: 'pk_live_placeholder',
    stripe_secret_key: 'sk_live_placeholder',
    default_language: 'en',
    is_maintenance_mode: false,
    enable_affiliate_system: true,
    currency_code: 'usd',
    max_login_attempts: 5,
    session_timeout_minutes: 120,
    max_token_limit: 128000,
    allow_new_registrations: true
  };

  if (!existingConfig) {
    await prisma.global_config.create({ data: configData });
    console.log('Global config created.');
  } else {
    // Only update non-destructive fields
    await prisma.global_config.update({
      where: { id: existingConfig.id },
      data: {
        is_maintenance_mode: false, 
        enable_affiliate_system: true,
        max_token_limit: 128000
      }
    });
    console.log('Global config updated.');
  }

  // System Status
  const systemStatus = await prisma.system_status.findFirst();
  const statusData = {
    is_initialized: true,
    current_version: '3.0.0-settings-overhaul',
    last_seed_date: now,
    environment_mode: 'production',
    health_score: 100,
    api_connection_active: true
  };

  if (!systemStatus) {
    await prisma.system_status.create({ data: statusData });
  } else {
    await prisma.system_status.update({
      where: { id: systemStatus.id },
      data: statusData
    });
  }

  // -----------------------------------------------------------------------
  // 3. Static Data: Languages (Enforcing Arabic RTL Support)
  // -----------------------------------------------------------------------
  console.log('Seeding Languages (Enforcing RTL)...');
  
  const languagesData = [
    { name: 'English (US)', iso_code: 'en-US', flag: 'get_image_url(keywords="usa flag icon", resolution="icon")' },
    { name: 'Arabic (SA)', iso_code: 'ar-SA', flag: 'get_image_url(keywords="saudi arabia flag icon", resolution="icon")' },
    { name: 'Spanish', iso_code: 'es-ES', flag: 'get_image_url(keywords="spain flag icon", resolution="icon")' },
    { name: 'French', iso_code: 'fr-FR', flag: 'get_image_url(keywords="france flag icon", resolution="icon")' },
    { name: 'German', iso_code: 'de-DE', flag: 'get_image_url(keywords="germany flag icon", resolution="icon")' },
  ];

  for (const lang of languagesData) {
    await prisma.language.upsert({
      where: { iso_code: lang.iso_code },
      update: {
        name: lang.name,
        flag_image_url: lang.flag,
        is_active: true
      },
      create: {
        name: lang.name,
        iso_code: lang.iso_code,
        flag_image_url: lang.flag,
        percentage_translated: lang.iso_code === 'en-US' ? 100 : 85,
        is_active: true
      }
    });
  }

  // -----------------------------------------------------------------------
  // 4. Static Data: Subscription Plans (Aligning Locked Icons)
  // -----------------------------------------------------------------------
  console.log('Seeding Subscription Plans...');

  const plansData = [
    { name: 'Standard Plan', price: 25.00, features: 'GPT-4o Access, 500 Images/mo, SEO Tools, Priority Support', credits: 1000, tier: 'standard' },
    { name: 'Pro Plan', price: 60.00, features: 'Unlimited AI Writing, 2000 Images/mo, API Access, Dedicated Manager, Manual Payments', credits: 5000, tier: 'pro' },
    { name: 'Business Plan', price: 120.00, features: 'Team Access, SSO, Custom Models, Audit Logs, SLA, White-label', credits: 20000, tier: 'pro' }, // Mapped to 'pro' enum as per schema, logically business
    { name: 'Lite Starter', price: 9.99, features: 'Basic AI Writing, 50 Images/mo', credits: 200, tier: 'lite' },
    { name: 'Free Trial', price: 0.00, features: '7 Days Access, 50 Credits', credits: 50, tier: 'lite' },
  ];

  // Map to store plan IDs for later use
  const planMap = new Map();

  for (const plan of plansData) {
    const existingPlan = await prisma.subscription_plan.findFirst({
      where: { name: plan.name }
    });

    let planId;
    if (existingPlan) {
      const updated = await prisma.subscription_plan.update({
        where: { id: existingPlan.id },
        data: {
          price: plan.price,
          features_list: plan.features,
          credits_included: plan.credits,
          tier: plan.tier
        }
      });
      planId = updated.id;
    } else {
      const created = await prisma.subscription_plan.create({
        data: {
          name: plan.name,
          price: plan.price,
          billing_cycle: 'monthly',
          features_list: plan.features,
          credits_included: plan.credits,
          is_active: true,
          tier: plan.tier
        }
      });
      planId = created.id;
    }
    planMap.set(plan.name, planId);
  }

  // -----------------------------------------------------------------------
  // 5. Static Data: AI Providers
  // -----------------------------------------------------------------------
  console.log('Seeding AI Providers...');
  
  const aiProviders = [
    { 
      name: 'OpenAI', logo: 'get_image_url(keywords="openai logo", resolution="icon")', 
      models: 'gpt-4o, gpt-4-turbo, gpt-3.5-turbo', code: 'openai_main', slug: 'openai', provider_type: 'openai',
      base_url: 'https://api.openai.com/v1'
    },
    { 
      name: 'Groq', logo: 'get_image_url(keywords="groq logo ai", resolution="icon")', 
      models: 'llama3-70b-8192, llama3-8b-8192', code: 'groq_main', slug: 'groq', provider_type: 'groq',
      base_url: 'https://api.groq.com/openai/v1'
    }
  ];

  for (const provider of aiProviders) {
    let existingProvider = await prisma.ai_provider.findUnique({ where: { code: provider.code } });
    if (!existingProvider) existingProvider = await prisma.ai_provider.findUnique({ where: { slug: provider.slug } });

    if (existingProvider) {
      await prisma.ai_provider.update({
        where: { id: existingProvider.id },
        data: { 
          name: provider.name,
          logo_url: provider.logo,
          available_models_list: provider.models,
          is_active: true,
          slug: provider.slug,
          provider_type: provider.provider_type,
          base_url: provider.base_url
        }
      });
    } else {
      await prisma.ai_provider.create({
        data: {
          name: provider.name,
          logo_url: provider.logo,
          connection_status: true,
          api_key: 'placeholder',
          available_models_list: provider.models,
          code: provider.code,
          is_active: true,
          slug: provider.slug,
          provider_type: provider.provider_type,
          base_url: provider.base_url
        }
      });
    }
  }

  // -----------------------------------------------------------------------
  // 6. Core Data: Users (Flattened Writes & Settings Overhaul)
  // -----------------------------------------------------------------------
  console.log('Seeding Users & Settings Overhaul...');

  const usersData = [
    {
      username: 'admin_sarah', email: 'sarah.admin@konvrt.ai', first_name: 'Sarah', full_name: 'Sarah Connor',
      role: 'admin', referral: 'ADMIN_SARAH', plan_name: 'Business Plan', credits: 999999,
      avatar: 'get_image_url(keywords="tech woman glasses portrait", resolution="medium")',
      ai_pref_style: 'Concise',
      lang: 'en-US', rtl: false
    },
    {
      username: 'marcus_sterling', email: 'marcus.sterling@agency.com', first_name: 'Marcus', full_name: 'Marcus Sterling',
      role: 'user', referral: 'MARCUS2024', plan_name: 'Pro Plan', credits: 5000,
      avatar: 'get_image_url(keywords="professional man suit portrait", resolution="medium")',
      ai_pref_style: 'Professional',
      lang: 'en-US', rtl: false
    },
    {
      username: 'ahmed_rtl_test', email: 'ahmed.test@agency.com', first_name: 'Ahmed', full_name: 'Ahmed Al-Fayed',
      role: 'user', referral: 'AHMEDRTL', plan_name: 'Standard Plan', credits: 1000,
      avatar: 'get_image_url(keywords="middle eastern man portrait", resolution="medium")',
      ai_pref_style: 'Creative',
      lang: 'ar-SA', rtl: true
    }
  ];

  for (const u of usersData) {
    // 6.1 Upsert User (Parent) - NO NESTED WRITES
    let user = await prisma.user.findFirst({
      where: { OR: [{ email: u.email }, { referral_code: u.referral }] }
    });

    const userCommonData = {
      username: u.username,
      full_name: u.full_name,
      role: u.role,
      is_ai_access_enabled: true,
      usage_limit_total: u.email.includes('admin') ? 999999 : 1000,
      is_rtl_enforced: u.rtl, 
      ui_theme: 'dark', // Enforcing Dark Mode via Enum
      ui_language: u.lang,
      language_code: u.lang.split('-')[0],
      referral_link_url: `https://konvrt.ai/ref/${u.referral}`,
      plan_tier: u.plan_name.toLowerCase().includes('business') ? 'business' : 'pro',
      ui_preferences: JSON.stringify({ sidebar: 'expanded', density: 'comfortable' })
    };

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: userCommonData
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: u.email,
          password: '$2b$10$placeholder',
          first_name: u.first_name,
          avatar_url: u.avatar,
          referral_code: u.referral,
          status: 'active',
          terms_accepted: true,
          usage_credits_remaining: u.credits,
          total_credits_used: 0,
          current_credit_balance: new Prisma.Decimal(u.credits),
          ...userCommonData
        }
      });
    }

    // 6.2 Upsert User Settings (Child) - Using Parent ID
    await prisma.user_settings.upsert({
      where: { user_id: user.id },
      update: {
        cultural_intelligence_enabled: true,
        theme_mode: 'dark',
        is_rtl: u.rtl,
        preferred_language_code: u.lang
      },
      create: {
        user_id: user.id,
        cultural_intelligence_enabled: true,
        theme_mode: 'dark',
        preferred_language_code: u.lang,
        is_rtl: u.rtl
      }
    });

    // 6.3 Upsert User Wallet (Child) - Using Parent ID
    await prisma.user_wallet.upsert({
      where: { user_id: user.id },
      update: {},
      create: {
        user_id: user.id,
        current_credit_balance: u.credits,
        currency_code: 'usd'
      }
    });

    // 6.4 Upsert AI Preferences (Child) - Using Parent ID
    await prisma.user_ai_preference.upsert({
      where: { user_id: user.id },
      update: {
        core_engine_model: 'gpt-4o'
      },
      create: {
        user_id: user.id,
        selected_category_tab: 'marketing',
        core_engine_model: 'gpt-4o',
        text_creativity_level: 7,
        image_generation_style: u.ai_pref_style,
        is_cultural_intelligence_enabled: true,
        target_language_code: u.lang
      }
    });

    // 6.5 Upsert Subscription (Child) - Using Parent ID
    const planId = planMap.get(u.plan_name);
    if (planId) {
      const existingSub = await prisma.user_subscription.findUnique({
        where: { user_id: user.id }
      });

      if (!existingSub) {
        await prisma.user_subscription.create({
          data: {
            user_id: user.id,
            subscription_plan_id: planId,
            status: 'active',
            next_billing_date: nextMonth,
            started_at: oneMonthAgo
          }
        });
      } else {
        // Only update if needed to avoid resetting billing cycles unnecessarily
        if (u.email.includes('admin') || existingSub.status !== 'active') {
             await prisma.user_subscription.update({
                where: { user_id: user.id },
                data: { subscription_plan_id: planId, status: 'active' }
             });
        }
      }
    }
  }

  // -----------------------------------------------------------------------
  // 7. Backfill: Ensure Settings for ALL Users (Smart Incremental)
  // -----------------------------------------------------------------------
  console.log('Running backfill for user settings (Enforcing Dark Mode & RTL readiness)...');
  
  const allUsers = await prisma.user.findMany({ select: { id: true, language_code: true, ui_language: true } });

  for (const user of allUsers) {
    // Determine RTL based on language code
    const langCode = user.ui_language || user.language_code || 'en';
    const isArabic = langCode.startsWith('ar');

    // 7.1 Update User Table Fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_rtl_enforced: isArabic,
        ui_theme: 'dark' // Enforce dark mode globally per request
      }
    });

    // 7.2 Update User Settings Table
    const settings = await prisma.user_settings.findUnique({ where: { user_id: user.id } });
    
    if (!settings) {
      await prisma.user_settings.create({
        data: {
          user_id: user.id,
          cultural_intelligence_enabled: true,
          theme_mode: 'dark',
          preferred_language_code: isArabic ? 'ar-SA' : 'en-US',
          is_rtl: isArabic
        }
      });
    } else {
      const updateData = {};
      if (settings.theme_mode !== 'dark') updateData.theme_mode = 'dark';
      if (settings.is_rtl !== isArabic) updateData.is_rtl = isArabic;

      if (Object.keys(updateData).length > 0) {
        await prisma.user_settings.update({
          where: { user_id: user.id },
          data: updateData
        });
      }
    }
  }

  // -----------------------------------------------------------------------
  // 8. System Settings (Admin Config Overhaul)
  // -----------------------------------------------------------------------
  console.log('Seeding System Settings (Admin Config)...');

  // These keys map to the new Admin Settings Save Changes requirement
  const systemSettingsData = [
    { key: 'site_name', value: 'Konvrt AI', desc: 'Global site name' },
    { key: 'theme_mode', value: 'dark', desc: 'Default system theme' },
    { key: 'is_rtl', value: 'false', desc: 'Default RTL setting' },
    { key: 'allow_registrations', value: 'true', desc: 'Allow new user signups' },
    { key: 'default_language', value: 'en', desc: 'Default system language' },
    { key: 'rtl_enabled', value: 'true', desc: 'Master switch for RTL support' },
    { key: 'admin_config', value: '{"dashboard_layout": "grid", "notifications": true, "toast_position": "top-right"}', desc: 'Admin panel configuration' },
    { key: 'ui_preferences', value: '{"sidebar_collapsed": false, "density": "comfortable", "animations": true}', desc: 'Default UI preferences' },
    { key: 'site_config', value: '{"maintenance_mode": false, "version": "3.0.0", "features": {"pro_icons": "locked"}}', desc: 'General site configuration' }
  ];

  for (const setting of systemSettingsData) {
    await prisma.system_settings.upsert({
      where: { setting_key: setting.key },
      update: {
        setting_value: setting.value,
        description: setting.desc,
        theme_mode: 'dark',
        rtl_enabled: setting.key === 'rtl_enabled' ? true : false,
        admin_config: setting.key === 'admin_config' ? setting.value : undefined,
        ui_preferences: setting.key === 'ui_preferences' ? setting.value : undefined,
        site_config: setting.key === 'site_config' ? setting.value : undefined
      },
      create: {
        setting_key: setting.key,
        setting_value: setting.value,
        description: setting.desc,
        theme_mode: 'dark',
        is_rtl: false,
        allow_registrations: true,
        rtl_enabled: setting.key === 'rtl_enabled' ? true : false,
        admin_config: setting.key === 'admin_config' ? setting.value : null,
        ui_preferences: setting.key === 'ui_preferences' ? setting.value : null,
        site_config: setting.key === 'site_config' ? setting.value : null
      }
    });
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });