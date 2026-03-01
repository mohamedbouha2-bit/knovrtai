export type user_status = 'active' | 'inactive' | 'banned' | 'suspended';

export type user_role = 'user' | 'admin' | 'affiliate';

export type subscription_status = 'active' | 'cancelled' | 'expired' | 'trial';

export type subscription_plan_tier = 'lite' | 'standard' | 'pro';

export type transaction_status = 'pending' | 'success' | 'failed' | 'refunded';

export type payment_gateway = 'stripe' | 'paypal' | 'manual_transfer';

export type payout_status = 'pending' | 'approved' | 'rejected' | 'completed';

export type currency_code = 'usd' | 'eur' | 'gbp' | 'cny';

export type subscription_tier = 'free' | 'standard' | 'pro' | 'business';

export type auth_provider = 'email' | 'google' | 'facebook';

export type affiliate_source_type = 'referral' | 'media_royalty';

export type activity_action_type = 'subscription_purchase' | 'credit_purchase' | 'automation_request' | 'user_registration' | 'payout_request';

export type activity_status = 'success' | 'warning' | 'error';

export type ui_theme = 'light' | 'dark' | 'system';

export type message_role = 'user' | 'assistant' | 'system';

export type ai_job_status = 'pending' | 'running' | 'completed' | 'failed';

// --- Base Unique Keys & Types ---

export type user_uniqueKey = { id: number; };
export type user_without_PKs = {
  email: string;
  username?: string | null;
  password: string;
  first_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  job_title?: string | null;
  bio_text?: string | null;
  referral_code: string;
  referral_link_url: string;
  role: user_role;
  status: user_status;
  terms_accepted: boolean;
  usage_credits_remaining: number;
  usage_limit_total: number;
  total_credits_used: number;
  last_login_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  current_credit_balance?: number | null;
  is_ai_access_enabled: boolean;
  theme_preference?: string | null;
  language_code?: string | null;
  preferences?: string | null;
  plan_tier?: string | null;
  ui_preferences?: string | null;
  subscription_tier: subscription_tier;
  ui_theme?: ui_theme | null;
  ui_language?: string | null;
  is_rtl_enforced?: boolean | null;
  is_admin?: boolean | null;
};
export type user = user_uniqueKey & user_without_PKs;

export type admin_user_uniqueKey = { id: number; };
export type admin_user_without_PKs = {
  email: string;
  username: string;
  password: string;
  full_name: string;
  invitation_code: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};
export type admin_user = admin_user_uniqueKey & admin_user_without_PKs;

export type oauth_connection_uniqueKey = { id: number; };
export type oauth_connection_without_PKs = {
  user_id: number;
  provider: auth_provider;
  provider_id: string;
  connected_email: string;
  access_token?: string | null;
  refresh_token?: string | null;
  connection_status: boolean;
  created_at: Date;
  updated_at: Date;
};
export type oauth_connection = oauth_connection_uniqueKey & oauth_connection_without_PKs;

export type chat_session_uniqueKey = { id: number; };
export type chat_session_without_PKs = {
  user_id: number;
  title?: string | null;
  create_timestamp: Date;
  current_model_version?: string | null;
  temperature?: number | null;
  max_tokens?: number | null;
  provider_id?: number | null;
  created_at: Date;
  updated_at: Date;
  seed_slug?: string | null;
};
export type chat_session = chat_session_uniqueKey & chat_session_without_PKs;

export type chat_message_uniqueKey = { id: number; };
export type chat_message_without_PKs = {
  chat_session_id: number;
  sender_type: string;
  content_text?: string | null;
  audio_blob?: string | null;
  attachment_file_url?: string | null;
  role?: message_role | null;
  content?: string | null;
  created_at: Date;
  updated_at: Date;
  meta_json?: string | null;
};
export type chat_message = chat_message_uniqueKey & chat_message_without_PKs;

export type ai_job_uniqueKey = { id: number; };
export type ai_job_without_PKs = {
  user_id?: number | null;
  feature_type: string;
  status: ai_job_status;
  model_name: string;
  input_prompt?: string | null;
  input_file_url?: string | null;
  output_result?: string | null;
  cost_credits: number;
  response_time_ms?: number | null;
  error_message?: string | null;
  created_at: Date;
  updated_at: Date;
};
export type ai_job = ai_job_uniqueKey & ai_job_without_PKs;

export type user_wallet_uniqueKey = { id: number; };
export type user_wallet_without_PKs = {
  user_id: number;
  current_credit_balance: number;
  currency_code: currency_code;
  created_at: Date;
  updated_at: Date;
};
export type user_wallet = user_wallet_uniqueKey & user_wallet_without_PKs;

// --- Generic Filters ---

export type StringFilter = {
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  equals?: string;
  in?: string[];
  notIn?: string[];
  not?: string | StringFilter;
};

export type NumberFilter = {
  equals?: number;
  in?: number[];
  notIn?: number[];
  not?: number | NumberFilter;
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
};

export type DateFilter = {
  equals?: Date;
  in?: Date[];
  notIn?: Date[];
  not?: Date | DateFilter;
  lt?: Date;
  lte?: Date;
  gt?: Date;
  gte?: Date;
};

// --- Enum Specific Filters ---

export type userStatusFilter = { equals?: user_status; in?: user_status[]; notIn?: user_status[]; not?: user_status | userStatusFilter; };
export type userRoleFilter = { equals?: user_role; in?: user_role[]; notIn?: user_role[]; not?: user_role | userRoleFilter; };
export type subscriptionStatusFilter = { equals?: subscription_status; in?: subscription_status[]; notIn?: subscription_status[]; not?: subscription_status | subscriptionStatusFilter; };
export type aiJobStatusFilter = { equals?: ai_job_status; in?: ai_job_status[]; notIn?: ai_job_status[]; not?: ai_job_status | aiJobStatusFilter; };
export type currencyCodeFilter = { equals?: currency_code; in?: currency_code[]; notIn?: currency_code[]; not?: currency_code | currencyCodeFilter; };

// --- COMPLETE FILTERED TYPES (COMPLETING WHAT WAS MISSING) ---

export type filtered_user = {
  id?: number | NumberFilter | null;
  email?: string | StringFilter | null;
  username?: string | StringFilter | null;
  role?: user_role | userRoleFilter | null;
  status?: user_status | userStatusFilter | null;
  usage_credits_remaining?: number | NumberFilter | null;
  created_at?: Date | DateFilter | null;
  updated_at?: Date | DateFilter | null;
};

export type filtered_ai_job = {
  id?: number | NumberFilter | null;
  user_id?: number | NumberFilter | null;
  feature_type?: string | StringFilter | null;
  status?: ai_job_status | aiJobStatusFilter | null;
  model_name?: string | StringFilter | null;
  cost_credits?: number | NumberFilter | null;
  response_time_ms?: number | NumberFilter | null;
  created_at?: Date | DateFilter | null;
  updated_at?: Date | DateFilter | null;
};

export type filtered_chat_session = {
  id?: number | NumberFilter | null;
  user_id?: number | NumberFilter | null;
  title?: string | StringFilter | null;
  current_model_version?: string | StringFilter | null;
  created_at?: Date | DateFilter | null;
};

export type filtered_user_wallet = {
  id?: number | NumberFilter | null;
  user_id?: number | NumberFilter | null;
  current_credit_balance?: number | NumberFilter | null;
  currency_code?: currency_code | currencyCodeFilter | null;
  created_at?: Date | DateFilter | null;
};

export type filtered_payout_request = {
  id?: number | NumberFilter | null;
  user_id?: number | NumberFilter | null;
  amount?: number | NumberFilter | null;
  status?: payout_status | { equals?: payout_status } | null;
  created_at?: Date | DateFilter | null;
};