import { PrismaClient, Prisma } from '../prisma-generated/client';
import * as T from './entities.type';

export const prisma = new PrismaClient();

/**
 * دالة المصنع (Factory): تنشئ جميع العمليات لأي جدول تلقائياً
 * مع دعم كامل للأنواع (TypeScript Types)
 */
const createEntity = <Entry, PK, CreateData, Filter>(name: string) => ({
    Create: async (data: CreateData): Promise<Entry | null> => {
        try {
            // ملاحظة: يمكنك إضافة _toDecimal هنا إذا أردت معالجة الحقول العشرية
            return await (prisma as any)[name].create({ data });
        } catch (error) {
            console.error(`Error creating ${name}:`, error);
            return null;
        }
    },

    Get: async (args: PK): Promise<Entry | null> => {
        try {
            return await (prisma as any)[name].findUnique({ where: args });
        } catch (error) {
            console.error(`Error getting ${name}:`, error);
            return null;
        }
    },

    GetAll: async (args?: Filter): Promise<Entry[]> => {
        try {
            return await (prisma as any)[name].findMany({ where: args as any });
        } catch (error) {
            console.error(`Error getting all ${name}:`, error);
            return [];
        }
    },

    GetPage: async (page: number = 1, size: number = 10, args?: Filter): Promise<Entry[]> => {
        try {
            return await (prisma as any)[name].findMany({
                where: args as any,
                skip: (page - 1) * size,
                take: size,
            });
        } catch (error) {
            console.error(`Error getting paged ${name}:`, error);
            return [];
        }
    },

    Count: async (args?: Filter): Promise<number> => {
        try {
            return await (prisma as any)[name].count({ where: args as any });
        } catch (error) {
            console.error(`Error counting ${name}:`, error);
            return 0;
        }
    },

    Update: async (args: { where: PK; data: CreateData }): Promise<Entry | null> => {
        try {
            return await (prisma as any)[name].update({
                where: args.where,
                data: args.data,
            });
        } catch (error) {
            console.error(`Error updating ${name}:`, error);
            return null;
        }
    },

    Delete: async (args: PK): Promise<Entry | null> => {
        try {
            return await (prisma as any)[name].delete({ where: args });
        } catch (error) {
            console.error(`Error deleting ${name}:`, error);
            return null;
        }
    }
});

/**
 * تعريف جميع الجداول سطر بسطر باستخدام الدالة المختصرة
 */
export const default_entities: T.Entities = {
    user: createEntity<T.user, T.user_uniqueKey, T.user_without_PKs, T.filtered_user>('user'),
    admin_user: createEntity<T.admin_user, T.admin_user_uniqueKey, T.admin_user_without_PKs, T.filtered_admin_user>('admin_user'),
    chat_session: createEntity<T.chat_session, T.chat_session_uniqueKey, T.chat_session_without_PKs, T.filtered_chat_session>('chat_session'),
    chat_message: createEntity<T.chat_message, T.chat_message_uniqueKey, T.chat_message_without_PKs, T.filtered_chat_message>('chat_message'),
    message_attachment: createEntity<T.message_attachment, T.message_attachment_uniqueKey, T.message_attachment_without_PKs, T.filtered_message_attachment>('message_attachment'),
    oauth_connection: createEntity<T.oauth_connection, T.oauth_connection_uniqueKey, T.oauth_connection_without_PKs, T.filtered_oauth_connection>('oauth_connection'),
    user_ai_preference: createEntity<T.user_ai_preference, T.user_ai_preference_uniqueKey, T.user_ai_preference_without_PKs, T.filtered_user_ai_preference>('user_ai_preference'),
    user_settings: createEntity<T.user_settings, T.user_settings_uniqueKey, T.user_settings_without_PKs, T.filtered_user_settings>('user_settings'),
    
    // جداول الـ AI والخدمات
    ai_job: createEntity<T.ai_job, T.ai_job_uniqueKey, T.ai_job_without_PKs, T.filtered_ai_job>('ai_job'),
    ai_provider: createEntity<T.ai_provider, T.ai_provider_uniqueKey, T.ai_provider_without_PKs, T.filtered_ai_provider>('ai_provider'),
    ai_feature_toggle: createEntity<T.ai_feature_toggle, T.ai_feature_toggle_uniqueKey, T.ai_feature_toggle_without_PKs, T.filtered_ai_feature_toggle>('ai_feature_toggle'),
    
    // جداول الاشتراكات والمالية
    subscription_plan: createEntity<T.subscription_plan, T.subscription_plan_uniqueKey, T.subscription_plan_without_PKs, T.filtered_subscription_plan>('subscription_plan'),
    subscription_order: createEntity<T.subscription_order, T.subscription_order_uniqueKey, T.subscription_order_without_PKs, T.filtered_subscription_order>('subscription_order'),
    credit_package: createEntity<T.credit_package, T.credit_package_uniqueKey, T.credit_package_without_PKs, T.filtered_credit_package>('credit_package'),
    credit_order: createEntity<T.credit_order, T.credit_order_uniqueKey, T.credit_order_without_PKs, T.filtered_credit_order>('credit_order'),
    user_wallet: createEntity<T.user_wallet, T.user_wallet_uniqueKey, T.user_wallet_without_PKs, T.filtered_user_wallet>('user_wallet'),
    
    // جداول النظام والمحتوى
    language: createEntity<T.language, T.language_uniqueKey, T.language_without_PKs, T.filtered_language>('language'),
    page: createEntity<T.page, T.page_uniqueKey, T.page_without_PKs, T.filtered_page>('page'),
    page_section: createEntity<T.page_section, T.page_section_uniqueKey, T.page_section_without_PKs, T.filtered_page_section>('page_section'),
    legal_document: createEntity<T.legal_document, T.legal_document_uniqueKey, T.legal_document_without_PKs, T.filtered_legal_document>('legal_document'),
    system_settings: createEntity<T.system_settings, T.system_settings_uniqueKey, T.system_settings_without_PKs, T.filtered_system_settings>('system_settings'),
    
    // أضف أي جداول أخرى متبقية هنا بنفس النمط...
};