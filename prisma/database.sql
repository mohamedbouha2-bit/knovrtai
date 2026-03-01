-- Database snapshot: proj_bb6c72d2
-- Created at: 2026-02-25 13:52:56.322661
-- Include structure: True
-- Include data: True

SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for `_prisma_migrations`
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `_prisma_migrations`
INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1bc23c87-9d07-46db-a681-f07f30ff9973', '15e7e70bfef3fa9971c0f997d8ec36b3e64a51759437fd2a752b70a5f3992b87', '2026-02-23 20:57:41', 'update_1771880237', '', NULL, '2026-02-23 20:57:41', 0),
('2880c516-80d3-40ec-bac8-ffc5fc05a094', 'd148b261c7968653c55837299a745beaae2b6493286a8dee888aebf67d4f3c45', '2026-02-23 17:14:26', 'update_1771866846', '', NULL, '2026-02-23 17:14:26', 0),
('2f453410-6f35-4a49-8243-cff24c4ad4c3', 'ed3e3d4185a83a73e595a602884264461313635430f4a15626d82026f264d871', '2026-02-24 23:22:08', 'update_1771975308', '', NULL, '2026-02-24 23:22:08', 0),
('31608d98-5a40-4870-9b29-a6f699e651a0', '0ed6681d6672e4f7619937373b9660a10e171ac60e777b92cf68ea7124cb6e9e', '2026-02-24 23:28:15', 'update_1771975674', '', NULL, '2026-02-24 23:28:15', 0),
('31e0726f-857d-4465-aecc-fbd62bc55d89', 'db30f833e2e70abef57829a36a97e4412272d829a894f8f95245a72a1a50e9d7', '2026-02-23 19:41:45', 'update_1771875684', '', NULL, '2026-02-23 19:41:45', 0),
('36715537-b311-483e-8320-abb40dbc0ce8', '0dc12ae04db4b4dc458728bc46259d2b38965e755efaf6f952c47198b3d18e38', '2026-02-23 19:54:36', 'update_1771876455', '', NULL, '2026-02-23 19:54:36', 0),
('3a35c958-97df-4c43-b599-fa376301bdd6', 'f1418f46ad7a1bd3b6417a49ab63987eb9b383bc4d7aba112d4f4b77a7a5b675', '2026-02-24 10:15:38', 'update_1771928118', '', NULL, '2026-02-24 10:15:38', 0),
('40542fa9-c1e2-42a9-92ba-6223cc44f365', '11aaa1e8c6e82cd556f899d10401a0c648825925b76b1586ae78926516057240', '2026-02-23 17:08:24', 'update_1771866477', '', NULL, '2026-02-23 17:08:24', 0),
('4d1596d7-5904-4f1f-aeed-5f74d6ea53b1', 'c5d08786758bd590f81b1c339b6fa43675af5aec3410bb398ac0819b64cd7387', '2026-02-24 23:24:40', 'update_1771975460', '', NULL, '2026-02-24 23:24:40', 0),
('5514a2b7-acd3-4909-bf2f-147bec06dfe9', '9e207ca408171b10ca99bdc240042e8f2b8e4f59d8c2c3f359e3825d1566b284', '2026-02-24 23:44:53', 'update_1771976673', '', NULL, '2026-02-24 23:44:53', 0),
('5c2ba220-7d33-461b-859e-beec5a097119', 'f128d461f5d9cd7cf2370906a6ff50370869c92f864caab2f4657bacbbe3e25e', '2026-02-24 23:24:10', 'update_1771975430', '', NULL, '2026-02-24 23:24:10', 0),
('650b6d8b-6c95-49d3-9917-6c1352352ac6', 'b06a8985590d40ad6c1f0becbd14a60e1df63a6f3b719a611518628afaf23272', '2026-02-23 19:38:55', 'update_1771875514', '', NULL, '2026-02-23 19:38:55', 0),
('7dfde49c-2891-4bdc-b73b-e6853dc6bbb4', 'fcdc9aca2b830cb8d222aabcc13699a44eb0de87eebe7551a1ed580cda06efa8', '2026-02-23 19:40:10', 'update_1771875589', '', NULL, '2026-02-23 19:40:10', 0),
('80d5cd3d-6646-457a-8840-d4031f119070', 'e24cde63580b387963d2c4b52952f360b50484a4a1097e9845ec8f6f3ad347f9', '2026-02-24 22:00:55', 'update_1771970435', '', NULL, '2026-02-24 22:00:55', 0),
('80e2cda1-7f1b-4641-a642-faf44f935cc2', 'f807e731d39e8e4945bd5a3ec0843dcaab33ab1574a83e0c5ce2fe7a729bcf6e', '2026-02-24 23:32:42', 'update_1771975942', '', NULL, '2026-02-24 23:32:42', 0),
('90b333ff-2598-460a-8a46-11646e41890f', '592c6d5a5c90c72e6f036f1143aaa63f5ec1c5d34edc474b0564dd49645ae847', '2026-02-24 11:21:00', 'update_1771932038', '', NULL, '2026-02-24 11:21:00', 0),
('925847a5-4a51-4ea6-854f-46877496238e', 'e4defbfa66b7b190d78329b6aa4e324602700d2535a465e0491e2ce15652e800', '2026-02-24 23:35:22', 'update_1771976102', '', NULL, '2026-02-24 23:35:22', 0),
('94b8a7c8-2527-45f7-8383-b6b757006a15', 'a77a4d021aaa22d1b979642bd34021bf6ff7b6ed199898f829529984c8e27d40', '2026-02-24 23:39:17', 'update_1771976337', '', NULL, '2026-02-24 23:39:17', 0),
('a3560e63-2a9d-4ed5-9083-6d703e5e9490', '547c4f7474542e5f046e0c818c026617357c5028bbd917a4f4f736acf9ffc3a8', '2026-02-24 23:16:27', 'update_1771974965', '', NULL, '2026-02-24 23:16:27', 0),
('ab0b18f2-10a4-40c6-b39d-169cb5f8a7e3', '2801840db1f4a350abefacc5da684c241192d2e970188a23150b0bf70c737773', '2026-02-24 23:36:49', 'update_1771976186', '', NULL, '2026-02-24 23:36:49', 0),
('c13ae26b-0534-4b52-9805-75fa0ce0ead7', 'f16a3d4bb9708d21ce470257f012acbf79bcca713374639487d7737cbbaa107a', '2026-02-23 19:48:26', 'update_1771876085', '', NULL, '2026-02-23 19:48:26', 0),
('c1bb3a4b-e5bf-48f7-867a-b9af8564d37d', '17f22136cd62a6ac573e7e6ef91476d0118e95096d91ee565fb4dbbf0e7f8fab', '2026-02-23 19:36:41', 'update_1771875381', '', NULL, '2026-02-23 19:36:41', 0),
('c6f772e4-ce51-4b28-a773-8e71d02d12e1', 'bd200ee10d760adb3a141221f6cfd38a17b3e2ee7770926db1d7db70e48e751d', '2026-02-24 23:13:55', 'update_1771974815', '', NULL, '2026-02-24 23:13:55', 0),
('d4140ca9-b8cd-4f95-b25f-6b4bae7385ea', '657f9b569185a90a03e291ff28db2366fe7ff50f0cd9fe8c4b83e696f3d00cac', '2026-02-24 23:28:29', 'update_1771975688', '', NULL, '2026-02-24 23:28:29', 0),
('d461c4db-0556-4b3c-8fe7-db2de76adb5e', 'fdb251c2d098d5e046962f5c44ff31cbe6a2dd08b07502cd96b0a449d60162f3', '2026-02-23 19:27:30', 'update_1771874829', '', NULL, '2026-02-23 19:27:30', 0),
('dbdcad75-ebc6-42da-ad27-3c2dc253ca9e', 'c75b91cd6c48b0939c3be71c9c0ff3ba6fed1fe1f8d0b75778d1c20cd69430e9', '2026-02-24 23:26:18', 'update_1771975557', '', NULL, '2026-02-24 23:26:18', 0),
('dcace9ab-a570-4d3c-8f02-4d26c06cc63e', 'a642b407d5cc0d50139411568f5d978101e01857f08f1db612933a7bba8da907', '2026-02-24 23:30:47', 'update_1771975827', '', NULL, '2026-02-24 23:30:47', 0),
('e1b4b79f-7303-403d-be89-31776cb89ed4', '114a1b45c58966d25455e99dfab3942171879a9490e241cc8fdc5de0b18fa6eb', '2026-02-24 23:34:45', 'update_1771976064', '', NULL, '2026-02-24 23:34:45', 0),
('f71d6b26-673f-4ed6-b012-ab0edddb2a12', '2f73bfcc8cd2b1557db023b594dd9f5e495d588310df33d3bb6fbe7ad67612e5', '2026-02-24 23:19:40', 'update_1771975159', '', NULL, '2026-02-24 23:19:40', 0);

-- Table structure for `admin_user`
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invitation_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_user_email_key` (`email`),
  UNIQUE KEY `admin_user_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `admin_user`
INSERT INTO `admin_user` (`id`, `email`, `username`, `password`, `full_name`, `invitation_code`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin.master@konvrt.ai', 'admin_master', '7b54b1efe217560c57a4afe4180db9767da9c94d35b8023c45e2626cc75ac27c', 'Sarah Connor', 'INV-2699', 'super_admin', '2026-02-23 15:13:13', '2026-02-23 15:15:45'),
(2, 'john.wick@konvrt.ai', 'mod_john', 'hashed_secure_password_placeholder', 'John Wick', 'INV-1660', 'moderator', '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(3, 'lucy.liu@konvrt.ai', 'finance_lucy', 'hashed_secure_password_placeholder', 'Lucy Liu', 'INV-9775', 'finance_admin', '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(4, 'mike.ross@konvrt.ai', 'support_mike', 'hashed_secure_password_placeholder', 'Mike Ross', 'INV-8730', 'support_lead', '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(5, 'elliot.alderson@konvrt.ai', 'dev_elliot', 'hashed_secure_password_placeholder', 'Elliot Alderson', 'INV-1470', 'developer', '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(6, 'dana.scully@konvrt.ai', 'content_dana', 'hashed_secure_password_placeholder', 'Dana Scully', 'INV-3705', 'content_manager', '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(7, 'jordan.belfort@konvrt.ai', 'sales_jordan', 'hashed_secure_password_placeholder', 'Jordan Belfort', 'INV-6354', 'sales_admin', '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(8, 'hermione.granger@konvrt.ai', 'audit_hermione', 'hashed_secure_password_placeholder', 'Hermione Granger', 'INV-7463', 'compliance_officer', '2026-02-23 15:13:13', '2026-02-23 17:16:58'),
(9, 'sarah.connor@konvrt.ai', 'super_sarah', 'hashed_secure_password_placeholder', 'Sarah Connor', 'INV-5484', 'super_admin', '2026-02-23 17:10:06', '2026-02-23 17:16:57');

-- Table structure for `affiliate_summary`
DROP TABLE IF EXISTS `affiliate_summary`;
CREATE TABLE `affiliate_summary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_lifetime_earnings` decimal(10,2) NOT NULL,
  `current_balance` decimal(10,2) NOT NULL,
  `pending_payout` decimal(10,2) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `affiliate_summary_user_id_key` (`user_id`),
  CONSTRAINT `affiliate_summary_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `affiliate_summary`
INSERT INTO `affiliate_summary` (`id`, `user_id`, `total_lifetime_earnings`, `current_balance`, `pending_payout`, `created_at`, `updated_at`) VALUES
(1, 1, '0.00', '0.00', '0.00', '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(2, 2, '0.00', '0.00', '0.00', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(4, 4, '0.00', '0.00', '0.00', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(5, 5, '0.00', '0.00', '0.00', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(6, 6, '0.00', '0.00', '0.00', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(7, 7, '0.00', '0.00', '0.00', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(8, 8, '0.00', '0.00', '0.00', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(9, 18, '0.00', '0.00', '0.00', '2026-02-23 19:29:09', '2026-02-23 19:29:09');

-- Table structure for `affiliate_transaction`
DROP TABLE IF EXISTS `affiliate_transaction`;
CREATE TABLE `affiliate_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `source_type` enum('referral','media_royalty') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `payout_status` enum('pending','approved','rejected','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `affiliate_transaction_user_id_idx` (`user_id`),
  CONSTRAINT `affiliate_transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `affiliate_transaction`
-- Table structure for `ai_feature_seed`
DROP TABLE IF EXISTS `ai_feature_seed`;
CREATE TABLE `ai_feature_seed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feature_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_id` int NOT NULL,
  `model_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `system_prompt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `welcome_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `min_plan_tier` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'free',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ai_feature_seed_feature_code_key` (`feature_code`),
  UNIQUE KEY `ai_feature_seed_slug_key` (`slug`),
  KEY `ai_feature_seed_provider_id_idx` (`provider_id`),
  CONSTRAINT `ai_feature_seed_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `ai_provider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `ai_feature_seed`
INSERT INTO `ai_feature_seed` (`id`, `feature_code`, `provider_id`, `model_name`, `system_prompt`, `welcome_message`, `created_at`, `updated_at`, `description`, `is_active`, `name`, `provider_slug`, `slug`, `config`, `min_plan_tier`) VALUES
(1, 'gpt4o_chat_init', 1, 'gpt-4o', 'You are a helpful AI assistant integrated into the platform.', 'Hello! I am GPT-4o. How can I help you today?', '2026-02-23 19:41:17', '2026-02-23 20:58:55', NULL, 1, NULL, 'openai', 'gpt-4o-global-chat', '{"temperature":0.7,"max_tokens":4096}', 'free'),
(2, 'chat_service_routing', 9, 'llama3-70b-8192', 'You are a helpful AI assistant. Respond in the user\'s language.', 'Hello! I am powered by Llama 3 on Groq. How can I help?', '2026-02-24 10:16:44', '2026-02-24 22:01:52', 'Main routing for system-wide chat', 1, 'Global Chat Service', 'groq', 'global-chat-router', '{"temperature":0.5,"max_tokens":8192}', 'free');

-- Table structure for `ai_feature_toggle`
DROP TABLE IF EXISTS `ai_feature_toggle`;
CREATE TABLE `ai_feature_toggle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `max_requests_per_user_daily` int DEFAULT NULL,
  `required_subscription_tier` enum('lite','standard','pro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `ai_feature_toggle`
INSERT INTO `ai_feature_toggle` (`id`, `name`, `description`, `is_enabled`, `max_requests_per_user_daily`, `required_subscription_tier`, `created_at`, `updated_at`) VALUES
(1, 'Global Chat', 'GPT-4o powered global chat', 1, NULL, NULL, '2026-02-23 19:28:49', '2026-02-24 22:01:52'),
(2, 'Text Generation', 'Core text generation capabilities', 1, NULL, NULL, '2026-02-23 19:28:49', '2026-02-24 22:01:52'),
(3, 'Image Generation', 'DALL-E and Stable Diffusion integration', 1, NULL, NULL, '2026-02-23 19:28:49', '2026-02-24 22:01:52'),
(4, 'Affiliate System', 'Referral tracking and payouts', 1, NULL, NULL, '2026-02-23 19:28:49', '2026-02-24 22:01:52'),
(5, 'Manual Payments', 'Allow manual bank transfer uploads', 1, NULL, NULL, '2026-02-23 19:28:49', '2026-02-24 22:01:52'),
(6, 'AI Workspace', 'Advanced workspace for pro users', 1, NULL, NULL, '2026-02-23 19:41:17', '2026-02-24 22:01:52'),
(7, 'SEO Landing Pages', 'Public discoverability module', 1, NULL, NULL, '2026-02-24 10:16:44', '2026-02-24 22:01:52'),
(8, 'Monetization', 'Stripe, PayPal, AdMob integration', 1, NULL, NULL, '2026-02-24 10:16:44', '2026-02-24 22:01:52');

-- Table structure for `ai_job`
DROP TABLE IF EXISTS `ai_job`;
CREATE TABLE `ai_job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `feature_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','running','completed','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `input_prompt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `output_result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cost_credits` int NOT NULL DEFAULT '0',
  `response_time_ms` int DEFAULT NULL,
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `input_file_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `model_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gpt-4o',
  PRIMARY KEY (`id`),
  KEY `ai_job_user_id_idx` (`user_id`),
  KEY `ai_job_status_idx` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `ai_job`
INSERT INTO `ai_job` (`id`, `user_id`, `feature_type`, `status`, `input_prompt`, `output_result`, `cost_credits`, `response_time_ms`, `error_message`, `created_at`, `updated_at`, `input_file_url`, `model_name`) VALUES
(1, 1, 'Blog Post Generator', 'completed', 'Write a 1000 word article about the future of SEO.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(2, 2, 'Image Generator', 'completed', 'A futuristic city with vertical gardens, solar punk style.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(3, 3, 'Email Sequence', 'completed', 'Create a 5-email onboarding sequence for new SaaS users.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(4, 4, 'Social Caption', 'completed', 'Generate captions for a photo of fresh blueberry muffins.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(5, 5, 'Video Script', 'completed', 'Script for a 10-minute YouTube video reviewing Konvrt AI.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(6, 6, 'Text Summarizer', 'completed', 'Summarize the attached report on climate change models.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(7, 7, 'Blog Post', 'completed', 'Write a blog post about the best hidden beaches in Portugal.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o'),
(8, 8, 'Listing Generator', 'completed', 'Generate a luxury property description for a penthouse in downtown.', 'Result content generated by AI...', 10, 2500, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 'gpt-4o');

-- Table structure for `ai_provider`
DROP TABLE IF EXISTS `ai_provider`;
CREATE TABLE `ai_provider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `connection_status` tinyint(1) NOT NULL DEFAULT '0',
  `api_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_secret` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `available_models_list` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_checked_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'openai',
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `base_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ai_provider_code_key` (`code`),
  UNIQUE KEY `ai_provider_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `ai_provider`
INSERT INTO `ai_provider` (`id`, `name`, `logo_url`, `connection_status`, `api_key`, `api_secret`, `available_models_list`, `last_checked_at`, `created_at`, `updated_at`, `config`, `is_active`, `code`, `provider_type`, `slug`, `base_url`) VALUES
(1, 'OpenAI', 'get_image_url(keywords="openai logo", resolution="icon")', 1, 'sk-xxxxxxxxxxxx', NULL, 'gpt-4o, gpt-4-turbo, gpt-3.5-turbo', NULL, '2026-02-23 15:13:14', '2026-02-24 23:52:47', '{"temperature_default": 0.7}', 1, 'openai_main', 'openai', 'openai', 'https://api.openai.com/v1'),
(2, 'Anthropic', 'get_image_url(keywords="anthropic logo", resolution="icon")', 1, 'sk-xxxxxxxxxxxx', NULL, 'claude-3-5-sonnet, claude-3-opus', NULL, '2026-02-23 15:13:14', '2026-02-24 22:01:52', '{"max_tokens_default": 4096}', 1, 'anthropic_main', 'anthropic', 'anthropic', 'https://api.anthropic.com'),
(3, 'Midjourney', 'get_image_url(keywords="midjourney logo", resolution="icon")', 1, 'sk-xxxxxxxxxxxx', NULL, 'v6, v5.2', NULL, '2026-02-23 15:13:14', '2026-02-23 20:58:55', '{}', 1, 'midjourney_main', 'image_gen', 'midjourney', NULL),
(4, 'Stability AI', 'https://productp.s3.us-west-2.amazonaws.com/background/zaki_prod/generated/5e6edb7d56b146e1913351b380687bd8.png', 1, 'sk-xxxxxxxxxxxx', NULL, 'gpt-4, gpt-3.5-turbo, claude-3-opus', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 1, NULL, 'openai', NULL, NULL),
(5, 'Google Gemini', 'get_image_url(keywords="google gemini logo", resolution="icon")', 1, 'AIzaSyDG3uWYOtoNvlO8fjBsM74utq5TFiPpWg0', NULL, 'gemini-pro', '2026-02-25 13:32:36', '2026-02-23 15:13:14', '2026-02-25 13:32:36', '{}', 1, 'google_main', 'openai', NULL, NULL),
(6, 'Cohere', 'https://productp.s3.us-west-2.amazonaws.com/background/zaki_prod/generated/240b7c4cb1384f8c94a8e56e98cb5181.png', 1, 'sk-xxxxxxxxxxxx', NULL, 'gpt-4, gpt-3.5-turbo, claude-3-opus', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 1, NULL, 'openai', NULL, NULL),
(7, 'Mistral', 'https://productp.s3.us-west-2.amazonaws.com/background/zaki_prod/generated/ff98303376074b569ea07622eacd205a.png', 1, 'sk-xxxxxxxxxxxx', NULL, 'gpt-4, gpt-3.5-turbo, claude-3-opus', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 1, NULL, 'openai', NULL, NULL),
(8, 'Azure AI', 'https://productp.s3.us-west-2.amazonaws.com/background/zaki_prod/generated/dce05da0dfde4a029461460db30656c3.png', 1, 'sk-xxxxxxxxxxxx', NULL, 'gpt-4, gpt-3.5-turbo, claude-3-opus', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, 1, NULL, 'openai', NULL, NULL),
(9, 'Groq', 'get_image_url(keywords="groq logo ai", resolution="icon")', 1, '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', NULL, 'standard-v1', '2026-02-25 13:28:54', '2026-02-24 10:16:44', '2026-02-25 13:28:54', '{"temperature_default": 0.5, "api_key_placeholder": "gsk_..."}', 1, 'groq_main', 'groq', 'groq', 'https://api.groq.com/openai/v1'),
(10, 'Pexels Media', 'get_image_url(keywords="pexels logo", resolution="icon")', 1, 'E3wHd1wg6UvZZByCtuw7jWRkkx049QKG5PiafW3RxNNaTMz040q57uNW', NULL, 'standard-v1', '2026-02-25 13:26:26', '2026-02-24 10:16:44', '2026-02-25 13:26:26', '{}', 1, 'pexels_main', 'media_asset', 'pexels', 'https://api.pexels.com/v1'),
(11, 'Pixabay', 'get_image_url(keywords="pixabay logo", resolution="icon")', 1, 'placeholder-key', NULL, 'search-v1', NULL, '2026-02-24 10:16:44', '2026-02-24 22:01:52', '{}', 1, 'pixabay_main', 'media_asset', 'pixabay', 'https://pixabay.com/api');

-- Table structure for `ai_test_chat`
DROP TABLE IF EXISTS `ai_test_chat`;
CREATE TABLE `ai_test_chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prompt_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `response_text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `latency_ms` int DEFAULT NULL,
  `model_version` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `context_window_usage` int DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `ai_test_chat`
INSERT INTO `ai_test_chat` (`id`, `prompt_text`, `response_text`, `latency_ms`, `model_version`, `context_window_usage`, `created_at`, `updated_at`) VALUES
(1, 'hello', 'This is a verified response from the GPT-4o model. \n\nI received your prompt: "hello".\n\nAnalysis:\n- Temperature: 0.7\n- Max Tokens: 2048\n\nThe system appears to be functioning within normal parameters. The integration with the provider is active and latency is stable.', 1092, 'gpt-4o-2024-05-13', 1, '2026-02-24 21:57:44', '2026-02-24 21:57:44');

-- Table structure for `chat_message`
DROP TABLE IF EXISTS `chat_message`;
CREATE TABLE `chat_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chat_session_id` int NOT NULL,
  `sender_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_text` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `audio_blob` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment_file_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `role` enum('user','assistant','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `chat_message_chat_session_id_idx` (`chat_session_id`),
  CONSTRAINT `chat_message_chat_session_id_fkey` FOREIGN KEY (`chat_session_id`) REFERENCES `chat_session` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `chat_message`
INSERT INTO `chat_message` (`id`, `chat_session_id`, `sender_type`, `content_text`, `audio_blob`, `attachment_file_url`, `created_at`, `updated_at`, `content`, `role`, `meta_json`) VALUES
(1, 1, 'user', 'Draft a LinkedIn post about AI automation in marketing.', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(2, 1, 'ai', 'Here is a draft based on your request: "Draft a LinkedIn post about AI automation in marketing."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(3, 2, 'user', 'Generate prompt ideas for a sustainable coffee brand logo.', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(4, 2, 'ai', 'Here is a draft based on your request: "Generate prompt ideas for a sustainable coffee brand logo."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(7, 4, 'user', 'Give me 5 puns about croissants for Instagram.', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(8, 4, 'ai', 'Here is a draft based on your request: "Give me 5 puns about croissants for Instagram."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(9, 5, 'user', 'Outline a video about "Top 5 AI tools in 2024".', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(10, 5, 'ai', 'Here is a draft based on your request: "Outline a video about "Top 5 AI tools in 2024"."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(11, 6, 'user', 'Summarize this text into a 200-word abstract.', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(12, 6, 'ai', 'Here is a draft based on your request: "Summarize this text into a 200-word abstract."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(13, 7, 'user', 'Write an itinerary for 7 days in Ubud, Bali.', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(14, 7, 'ai', 'Here is a draft based on your request: "Write an itinerary for 7 days in Ubud, Bali."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(15, 8, 'user', 'Describe a 3-bedroom Victorian house with modern renovations.', NULL, NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL),
(16, 8, 'ai', 'Here is a draft based on your request: "Describe a 3-bedroom Victorian house with modern renovations."... [AI Content Placeholder]', NULL, NULL, '2026-02-24 15:13:13', '2026-02-23 15:13:14', NULL, NULL, NULL),
(17, 13, 'user', 'Analyze system logs.', NULL, NULL, '2026-02-23 19:29:09', '2026-02-23 19:29:09', NULL, NULL, NULL),
(18, 13, 'ai', '(GPT-4o Response) Here is a draft based on your request: "Analyze system logs."...', NULL, NULL, '2026-02-24 19:29:09', '2026-02-23 19:29:09', NULL, NULL, NULL),
(19, 14, 'user', 'Can you analyze the current trends in AI art for 2024?', NULL, NULL, '2026-02-23 19:29:09', '2026-02-23 19:29:09', NULL, NULL, NULL),
(20, 14, 'ai', 'Certainly! Based on real-time analysis via GPT-4o, the trends include: 1. Hyper-realism, 2. Consistent character generation, 3. Text rendering improvements.', NULL, NULL, '2026-02-23 19:29:11', '2026-02-23 19:29:09', NULL, NULL, NULL),
(21, 16, 'user', 'hello', NULL, NULL, '2026-02-23 20:45:28', '2026-02-23 20:45:28', NULL, NULL, NULL),
(22, 16, 'ai', 'I\'ve received your request: "hello". As an AI assistant, I\'m processing this context now.', NULL, NULL, '2026-02-23 20:45:31', '2026-02-23 20:45:31', NULL, NULL, NULL),
(23, 1, 'user', 'hello', NULL, NULL, '2026-02-25 12:32:36', '2026-02-25 12:32:36', NULL, NULL, NULL),
(24, 17, 'user', 'hello', NULL, NULL, '2026-02-25 12:32:51', '2026-02-25 12:32:51', NULL, NULL, NULL),
(25, 17, 'ai', 'This is a simulated response from the AI engine based on your prompt. I can help you generate content, analyze data, or automate workflows.', NULL, NULL, '2026-02-25 12:32:55', '2026-02-25 12:32:55', NULL, NULL, NULL),
(26, 18, 'user', 'heloo', NULL, NULL, '2026-02-25 12:41:43', '2026-02-25 12:41:43', NULL, NULL, NULL),
(27, 18, 'ai', 'I\'ve received your request: "heloo". As an AI assistant, I\'m processing this context now.', NULL, NULL, '2026-02-25 12:41:46', '2026-02-25 12:41:46', NULL, NULL, NULL),
(28, 19, 'user', 'hello', NULL, NULL, '2026-02-25 13:38:56', '2026-02-25 13:38:56', NULL, NULL, NULL),
(29, 19, 'ai', 'I\'ve received your request: "hello". As an AI assistant, I\'m processing this context now.', NULL, NULL, '2026-02-25 13:38:59', '2026-02-25 13:38:59', NULL, NULL, NULL);

-- Table structure for `chat_session`
DROP TABLE IF EXISTS `chat_session`;
CREATE TABLE `chat_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `create_timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `current_model_version` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_tokens` int DEFAULT NULL,
  `temperature` double DEFAULT NULL,
  `provider_id` int DEFAULT NULL,
  `seed_slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_session_user_id_idx` (`user_id`),
  KEY `chat_session_provider_id_idx` (`provider_id`),
  CONSTRAINT `chat_session_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `ai_provider` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chat_session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `chat_session`
INSERT INTO `chat_session` (`id`, `user_id`, `title`, `create_timestamp`, `created_at`, `updated_at`, `current_model_version`, `max_tokens`, `temperature`, `provider_id`, `seed_slug`) VALUES
(1, 1, 'Q4 Marketing Strategy', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(2, 2, 'Logo Concept Ideation', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(4, 4, 'Instagram Captions', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(5, 5, 'Youtube Script', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(6, 6, 'Abstract Summarization', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(7, 7, 'Blog Post: Bali', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(8, 8, 'Property Listing Description', '2026-02-16 15:13:13', '2026-02-23 15:13:14', '2026-02-23 15:13:14', NULL, NULL, NULL, NULL, NULL),
(13, 18, 'System Check', '2026-02-16 19:29:09', '2026-02-23 19:29:09', '2026-02-23 19:29:09', 'gpt-4o', NULL, NULL, NULL, NULL),
(14, 2, 'Global GPT-4o Workspace Demo', '2026-02-23 19:29:09', '2026-02-23 19:29:09', '2026-02-23 19:29:09', 'gpt-4o', NULL, 0.7, NULL, NULL),
(16, 1, 'hello...', '2026-02-23 20:45:27', '2026-02-23 20:45:27', '2026-02-23 20:45:27', NULL, NULL, NULL, NULL, NULL),
(17, 1, 'hello...', '2026-02-25 12:32:50', '2026-02-25 12:32:50', '2026-02-25 12:32:50', NULL, NULL, NULL, NULL, NULL),
(18, 1, 'heloo...', '2026-02-25 12:41:42', '2026-02-25 12:41:42', '2026-02-25 12:41:42', NULL, NULL, NULL, NULL, NULL),
(19, 1, 'hello...', '2026-02-25 13:38:54', '2026-02-25 13:38:54', '2026-02-25 13:38:54', NULL, NULL, NULL, NULL, NULL);

-- Table structure for `credit_order`
DROP TABLE IF EXISTS `credit_order`;
CREATE TABLE `credit_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `credit_package_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `currency` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `payment_method` enum('stripe','paypal','manual_transfer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','success','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `credit_order_user_id_idx` (`user_id`),
  KEY `credit_order_credit_package_id_idx` (`credit_package_id`),
  CONSTRAINT `credit_order_credit_package_id_fkey` FOREIGN KEY (`credit_package_id`) REFERENCES `credit_package` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `credit_order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `credit_order`
-- Table structure for `credit_package`
DROP TABLE IF EXISTS `credit_package`;
CREATE TABLE `credit_package` (
  `id` int NOT NULL AUTO_INCREMENT,
  `credit_amount` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `discount_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `credit_package`
INSERT INTO `credit_package` (`id`, `credit_amount`, `price`, `currency`, `discount_label`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 100, '5.00', 'usd', 'Small Pack', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(2, 500, '20.00', 'usd', 'Creator Pack', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(3, 1000, '35.00', 'usd', 'Best Value', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(4, 5000, '150.00', 'usd', 'Agency Bulk', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(5, 50, '2.99', 'usd', 'Mini Top-up', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(6, 200, '9.00', 'usd', 'Weekend Warrior', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(7, 2500, '80.00', 'usd', 'Power User', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(8, 10000, '250.00', 'usd', 'Enterprise Stack', 1, '2026-02-23 15:13:13', '2026-02-23 15:13:13');

-- Table structure for `cultural_preset`
DROP TABLE IF EXISTS `cultural_preset`;
CREATE TABLE `cultural_preset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_region` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tone_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `sample_output_preview` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `cultural_preset`
INSERT INTO `cultural_preset` (`id`, `name`, `target_region`, `tone_description`, `sample_output_preview`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 'US Corporate', 'North America', 'Professional, direct, confident', 'We are excited to announce our Q3 results...', 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(2, 'UK Formal', 'United Kingdom', 'Polite, reserved, sophisticated', 'We are pleased to inform you of the recent developments...', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(3, 'Gen Z Social', 'Global Internet', 'Casual, trendy, emoji-heavy', 'Check out this vibe! 🔥 No cap, this is huge.', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(4, 'Japanese Business', 'Japan', 'Respectful, humble, honorific', 'We humbly request your kind consideration...', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(5, 'LatAm Warmth', 'Latin America', 'Friendly, personal, enthusiastic', '¡Hola amigos! So happy to share this with our family.', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(6, 'Tech Startup', 'Silicon Valley', 'Disruptive, visionary, concise', 'Scaling the future. Now.', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(7, 'Academic Research', 'Global Academic', 'Objective, analytical, cited', 'The data suggests a significant correlation between...', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(8, 'Legal Precise', 'Legal', 'Unambiguous, formal, detailed', 'Pursuant to Article 4, section B, the parties agree...', 0, '2026-02-23 15:13:13', '2026-02-23 17:16:57');

-- Table structure for `feature_seeds`
DROP TABLE IF EXISTS `feature_seeds`;
CREATE TABLE `feature_seeds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seed_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `prompt_template` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `configuration_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `last_run_at` datetime(3) DEFAULT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_count` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `feature_seeds_seed_key_key` (`seed_key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `feature_seeds`
INSERT INTO `feature_seeds` (`id`, `seed_key`, `prompt_template`, `description`, `created_at`, `updated_at`, `configuration_json`, `last_run_at`, `status`, `version`, `item_count`) VALUES
(1, 'global_chat_template_v1', 'Analyze the following text: {{input}}', 'Standard template for global chat analysis', '2026-02-23 19:41:17', '2026-02-23 20:58:55', '{"temperature":0.7,"max_tokens":2048}', '2026-02-23 20:58:54', 'active', '1.0.0', NULL);

-- Table structure for `global_config`
DROP TABLE IF EXISTS `global_config`;
CREATE TABLE `global_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openai_api_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_public_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stripe_secret_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_language` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `is_maintenance_mode` tinyint(1) NOT NULL DEFAULT '0',
  `enable_affiliate_system` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `currency_code` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_login_attempts` int DEFAULT NULL,
  `session_timeout_minutes` int DEFAULT NULL,
  `allow_new_registrations` tinyint(1) DEFAULT NULL,
  `max_token_limit` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `global_config`
INSERT INTO `global_config` (`id`, `openai_api_key`, `stripe_public_key`, `stripe_secret_key`, `default_language`, `is_maintenance_mode`, `enable_affiliate_system`, `created_at`, `updated_at`, `currency_code`, `max_login_attempts`, `session_timeout_minutes`, `allow_new_registrations`, `max_token_limit`) VALUES
(1, 'sk-placeholder-key-for-production', 'pk_test_placeholder', 'sk_test_placeholder', 'en', 0, 1, '2026-02-23 19:28:49', '2026-02-24 23:52:47', 'usd', 5, 120, 1, 128000),
(2, NULL, NULL, NULL, 'en-US', 0, 1, '2026-02-24 20:35:01', '2026-02-24 20:35:01', 'usd', 5, 120, 1, 4000);

-- Table structure for `language`
DROP TABLE IF EXISTS `language`;
CREATE TABLE `language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `iso_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag_image_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `percentage_translated` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `language_iso_code_key` (`iso_code`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `language`
INSERT INTO `language` (`id`, `name`, `iso_code`, `flag_image_url`, `is_active`, `percentage_translated`, `created_at`, `updated_at`) VALUES
(1, 'English (US)', 'en-US', 'get_image_url(keywords="usa flag icon", resolution="icon")', 1, 100, '2026-02-23 15:13:13', '2026-02-24 23:52:47'),
(2, 'Spanish', 'es-ES', 'get_image_url(keywords="spain flag icon", resolution="icon")', 1, 100, '2026-02-23 15:13:13', '2026-02-24 23:52:47'),
(3, 'French', 'fr-FR', 'get_image_url(keywords="france flag icon", resolution="icon")', 1, 100, '2026-02-23 15:13:13', '2026-02-24 23:52:47'),
(4, 'German', 'de-DE', 'get_image_url(keywords="germany flag icon", resolution="icon")', 1, 100, '2026-02-23 15:13:13', '2026-02-24 23:52:47'),
(5, 'Chinese (Simplified)', 'zh-CN', 'get_image_url(keywords="china flag icon", resolution="icon")', 1, 100, '2026-02-23 15:13:13', '2026-02-23 20:58:55'),
(6, 'Japanese', 'ja-JP', 'get_image_url(keywords="japan flag icon", resolution="icon")', 1, 100, '2026-02-23 15:13:13', '2026-02-23 20:58:55'),
(7, 'Portuguese', 'pt-BR', 'https://images.unsplash.com/photo-1647894648597-1e21cd3b0ed4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MTc3NTR8MHwxfHNlYXJjaHw1fHxicmF6aWwlMjBmbGFnfGVufDB8MXx8fDE3NzE4NjY1ODJ8MA&ixlib=rb-4.1.0&q=85', 1, 100, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(8, 'Italian', 'it-IT', 'https://images.unsplash.com/photo-1667758645526-af3202769d29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MTc3NTR8MHwxfHNlYXJjaHw5fHxpdGFseSUyMGZsYWd8ZW58MHwxfHx8MTc3MTg2NjU4Mnww&ixlib=rb-4.1.0&q=85', 1, 100, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(9, 'Arabic (SA)', 'ar-SA', 'get_image_url(keywords="saudi arabia flag icon", resolution="icon")', 1, 100, '2026-02-24 10:16:44', '2026-02-24 23:52:47');

-- Table structure for `legal_document`
DROP TABLE IF EXISTS `legal_document`;
CREATE TABLE `legal_document` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_updated_at` datetime(3) NOT NULL,
  `version_identifier` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `content_body_html` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `language_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `legal_document`
INSERT INTO `legal_document` (`id`, `title`, `last_updated_at`, `version_identifier`, `version_number`, `content_html`, `content_body_html`, `language_code`, `created_at`, `updated_at`) VALUES
(1, 'Privacy Policy', '2026-02-24 11:22:13', '1.0', '1.0', '<h1>Privacy Policy</h1><p>We value your privacy...</p>', '<h1>Privacy Policy</h1><p>We value your privacy...</p>', 'en', '2026-02-24 11:22:13', '2026-02-24 11:22:13'),
(2, 'Terms of Service', '2026-02-24 11:22:13', '1.0', '1.0', '<h1>Terms of Service</h1><p>By using this service...</p>', '<h1>Terms of Service</h1><p>By using this service...</p>', 'en', '2026-02-24 11:22:13', '2026-02-24 11:22:13');

-- Table structure for `manual_payment_request`
DROP TABLE IF EXISTS `manual_payment_request`;
CREATE TABLE `manual_payment_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `transaction_reference_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `transfer_amount` decimal(10,2) NOT NULL,
  `currency` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `receipt_image_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','success','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `reviewed_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `manual_payment_request_user_id_idx` (`user_id`),
  CONSTRAINT `manual_payment_request_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `manual_payment_request`
-- Table structure for `message_attachment`
DROP TABLE IF EXISTS `message_attachment`;
CREATE TABLE `message_attachment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chat_message_id` int NOT NULL,
  `file_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int DEFAULT NULL,
  `mime_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `message_attachment_chat_message_id_idx` (`chat_message_id`),
  CONSTRAINT `message_attachment_chat_message_id_fkey` FOREIGN KEY (`chat_message_id`) REFERENCES `chat_message` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `message_attachment`
-- Table structure for `oauth_connection`
DROP TABLE IF EXISTS `oauth_connection`;
CREATE TABLE `oauth_connection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `provider` enum('email','google','facebook') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `connected_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `refresh_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `connection_status` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_connection_user_id_provider_key` (`user_id`,`provider`),
  CONSTRAINT `oauth_connection_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `oauth_connection`
-- Table structure for `page`
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `meta_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_page_name_key` (`page_name`),
  UNIQUE KEY `page_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `page`
INSERT INTO `page` (`id`, `page_name`, `slug`, `is_active`, `meta_title`, `meta_description`, `created_at`, `updated_at`) VALUES
(1, 'Home Page', 'home', 1, 'AI Content Automation Platform', 'Automate your workflow with GPT-4o and Groq.', '2026-02-24 10:16:44', '2026-02-24 22:01:52'),
(2, 'Pricing', 'pricing', 1, 'Flexible Plans', 'Choose from Free, Pro, or Business tiers.', '2026-02-24 10:16:44', '2026-02-24 22:01:52'),
(3, 'Privacy Policy', 'privacy-policy', 1, 'Privacy Policy', 'Our commitment to your data privacy.', '2026-02-24 11:22:13', '2026-02-24 22:01:52'),
(4, 'Terms of Service', 'terms-of-service', 1, 'Terms of Service', 'Rules and regulations for using our platform.', '2026-02-24 11:22:13', '2026-02-24 22:01:52');

-- Table structure for `page_section`
DROP TABLE IF EXISTS `page_section`;
CREATE TABLE `page_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `section_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `display_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `config_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `page_section_page_id_idx` (`page_id`),
  CONSTRAINT `page_section_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `page` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `page_section`
INSERT INTO `page_section` (`id`, `page_id`, `section_name`, `section_type`, `description`, `display_order`, `is_active`, `config_json`, `created_at`, `updated_at`) VALUES
(1, 1, 'Hero Section', 'hero_banner', 'Main landing banner', 1, 1, '{"headline":"Future of AI","cta":"Get Started"}', '2026-02-24 10:16:44', '2026-02-24 10:16:44');

-- Table structure for `payout_request`
DROP TABLE IF EXISTS `payout_request`;
CREATE TABLE `payout_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `payment_method` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `status` enum('pending','approved','rejected','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `cover_image_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `approved_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payout_request_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `payout_request`
-- Table structure for `public_showcase_asset`
DROP TABLE IF EXISTS `public_showcase_asset`;
CREATE TABLE `public_showcase_asset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_source` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `asset_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `external_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `public_showcase_asset_provider_source_idx` (`provider_source`),
  KEY `public_showcase_asset_is_active_idx` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `public_showcase_asset`
INSERT INTO `public_showcase_asset` (`id`, `title`, `cover_image_url`, `provider_source`, `asset_type`, `external_id`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'AI Generated Landscape', 'get_image_url(keywords="futuristic landscape ai", resolution="medium")', 'openai', 'image', NULL, 1, 1, '2026-02-24 11:22:13', '2026-02-24 11:22:13'),
(2, 'Corporate Presentation', 'get_image_url(keywords="document icon", resolution="icon")', 'groq', 'text', NULL, 1, 1, '2026-02-24 11:22:13', '2026-02-24 11:22:13');

-- Table structure for `subscription_order`
DROP TABLE IF EXISTS `subscription_order`;
CREATE TABLE `subscription_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subscription_plan_id` int NOT NULL,
  `payment_gateway_provider` enum('stripe','paypal','manual_transfer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `status` enum('pending','success','failed','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `invoice_pdf_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subscription_order_user_id_idx` (`user_id`),
  KEY `subscription_order_subscription_plan_id_idx` (`subscription_plan_id`),
  CONSTRAINT `subscription_order_subscription_plan_id_fkey` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `subscription_order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `subscription_order`
-- Table structure for `subscription_plan`
DROP TABLE IF EXISTS `subscription_plan`;
CREATE TABLE `subscription_plan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tier` enum('lite','standard','pro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `billing_cycle` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `features_list` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `credits_included` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `subscription_plan`
INSERT INTO `subscription_plan` (`id`, `name`, `tier`, `price`, `billing_cycle`, `features_list`, `credits_included`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Konvrt Starter', 'lite', '9.99', 'monthly', 'Basic AI Writing, 50 Images/mo, Standard Support', 100, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(2, 'Konvrt Creator', 'standard', '29.99', 'monthly', 'Advanced AI Models, 200 Images/mo, SEO Tools, Priority Support', 500, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(3, 'Konvrt Agency', 'pro', '99.99', 'monthly', 'Unlimited AI Writing, 1000 Images/mo, API Access, Dedicated Manager', 2000, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(4, 'Konvrt Enterprise', 'pro', '299.99', 'monthly', 'Custom Models, SSO, Audit Logs, SLA', 10000, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(5, 'Trial Plan', 'lite', '0.00', 'monthly', '7 Days Access, 20 Credits', 20, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(6, 'Influencer Special', 'standard', '19.99', 'monthly', 'Social Media Templates, Hashtag Generator', 600, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(7, 'Yearly Pro', 'pro', '999.00', 'monthly', '2 Months Free, All Pro Features', 24000, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(8, 'Student Plan', 'lite', '4.99', 'monthly', 'Academic Writing Tools, Citation Generator', 80, 1, '2026-02-23 15:13:13', '2026-02-23 17:16:57'),
(9, 'Standard Plan', 'standard', '25.00', 'monthly', 'GPT-4o Access, 500 Images/mo, SEO Tools, Priority Support', 1000, 1, '2026-02-23 19:28:49', '2026-02-24 23:52:47'),
(10, 'Pro Plan', 'pro', '60.00', 'monthly', 'Unlimited AI Writing, 2000 Images/mo, API Access, Dedicated Manager, Manual Payments', 5000, 1, '2026-02-23 19:28:49', '2026-02-24 23:52:47'),
(11, 'Lite Starter', 'lite', '9.99', 'monthly', 'Basic AI Writing, 50 Images/mo', 200, 1, '2026-02-23 19:28:49', '2026-02-24 23:52:47'),
(12, 'Enterprise', 'pro', '299.99', 'monthly', 'Custom Models, SSO, Audit Logs, SLA', 20000, 1, '2026-02-23 19:28:49', '2026-02-23 20:58:55'),
(13, 'Free Trial', 'lite', '0.00', 'monthly', '7 Days Access, 50 Credits', 50, 1, '2026-02-23 19:28:49', '2026-02-24 23:52:47'),
(14, 'Business Plan', 'pro', '120.00', 'monthly', 'Team Access, SSO, Custom Models, Audit Logs, SLA, White-label', 20000, 1, '2026-02-24 10:16:44', '2026-02-24 23:52:47');

-- Table structure for `system_activity_log`
DROP TABLE IF EXISTS `system_activity_log`;
CREATE TABLE `system_activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `user_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_avatar_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_type` enum('subscription_purchase','credit_purchase','automation_request','user_registration','payout_request') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('success','warning','error') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `details_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `timestamp` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `system_activity_log_user_id_idx` (`user_id`),
  KEY `system_activity_log_timestamp_idx` (`timestamp`),
  CONSTRAINT `system_activity_log_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `system_activity_log`
INSERT INTO `system_activity_log` (`id`, `user_id`, `user_name`, `user_avatar_url`, `action_type`, `status`, `description`, `details_json`, `timestamp`, `created_at`, `updated_at`) VALUES
(1, 1, 'Marcus Sterling', 'https://images.pexels.com/photos/8937583/pexels-photo-8937583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User marcus_sterling registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(2, 2, 'Elena Rostova', 'https://images.pexels.com/photos/6816596/pexels-photo-6816596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User elena_designs registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(3, NULL, 'David Chen', 'https://images.pexels.com/photos/7964213/pexels-photo-7964213.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User dev_david registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(4, 4, 'Sarah Jenkins', 'https://images.pexels.com/photos/34642149/pexels-photo-34642149.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User sarah_bakes registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(5, 5, 'Jackson Thorne', 'https://images.pexels.com/photos/29119987/pexels-photo-29119987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User jackson_affiliate registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(6, 6, 'Dr. Emily Watson', 'https://images.pexels.com/photos/8442616/pexels-photo-8442616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User dr_emily registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(7, 7, 'Lucas Silva', 'https://images.pexels.com/photos/2405638/pexels-photo-2405638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User lucas_travels registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(8, 8, 'Sophia Lee', 'https://images.pexels.com/photos/7642131/pexels-photo-7642131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'user_registration', 'success', 'User sophia_realestate registered successfully.', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14', '2026-02-23 15:13:14');

-- Table structure for `system_health`
DROP TABLE IF EXISTS `system_health`;
CREATE TABLE `system_health` (
  `id` int NOT NULL AUTO_INCREMENT,
  `database_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ai_service_latency` int DEFAULT NULL,
  `redis_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_deployment_time` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `system_health`
-- Table structure for `system_settings`
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `setting_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `maintenance_mode` tinyint(1) NOT NULL DEFAULT '0',
  `site_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `support_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_rtl` tinyint(1) DEFAULT '1',
  `theme_mode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'dark',
  `allow_registrations` tinyint(1) DEFAULT '1',
  `global_announcement` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `default_language` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `allow_registration` tinyint(1) DEFAULT '1',
  `admin_config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ui_preferences` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `site_config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rtl_enabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `system_settings`
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `description`, `created_at`, `updated_at`, `maintenance_mode`, `site_name`, `support_email`, `is_rtl`, `theme_mode`, `allow_registrations`, `global_announcement`, `default_language`, `allow_registration`, `admin_config`, `ui_preferences`, `site_config`, `rtl_enabled`) VALUES
('admin_config', '{"dashboard_layout": "grid", "notifications": true, "toast_position": "top-right"}', 'Admin panel configuration', '2026-02-24 23:40:24', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, '{"dashboard_layout": "grid", "notifications": true, "toast_position": "top-right"}', NULL, NULL, 0),
('allow_registrations', 'true', 'Allow new user signups', '2026-02-24 23:37:30', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, NULL, 0),
('default_language', 'en', 'Default system language', '2026-02-24 23:37:30', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, NULL, 0),
('is_rtl', 'false', 'Default RTL setting', '2026-02-24 23:37:30', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, NULL, 0),
('rtl_enabled', 'true', 'Master switch for RTL support', '2026-02-24 23:40:24', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, NULL, 1),
('site_config', '{"maintenance_mode": false, "version": "3.0.0", "features": {"pro_icons": "locked"}}', 'General site configuration', '2026-02-24 23:43:00', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, '{"maintenance_mode": false, "version": "3.0.0", "features": {"pro_icons": "locked"}}', 0),
('site_name', 'Konvrt AI', 'Global site name', '2026-02-24 23:37:30', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, NULL, 0),
('theme_mode', 'dark', 'Default system theme', '2026-02-24 23:37:30', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, NULL, NULL, 0),
('ui_preferences', '{"sidebar_collapsed": false, "density": "comfortable", "animations": true}', 'Default UI preferences', '2026-02-24 23:40:24', '2026-02-24 23:52:47', 0, NULL, NULL, 0, 'dark', 1, NULL, 'en', 1, NULL, '{"sidebar_collapsed": false, "density": "comfortable", "animations": true}', NULL, 0);

-- Table structure for `system_status`
DROP TABLE IF EXISTS `system_status`;
CREATE TABLE `system_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_initialized` tinyint(1) NOT NULL DEFAULT '0',
  `current_version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_seed_date` datetime(3) DEFAULT NULL,
  `environment_mode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `api_connection_active` tinyint(1) DEFAULT NULL,
  `health_score` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `system_status`
INSERT INTO `system_status` (`id`, `is_initialized`, `current_version`, `last_seed_date`, `environment_mode`, `created_at`, `updated_at`, `api_connection_active`, `health_score`) VALUES
(1, 1, '3.0.0-settings-overhaul', '2026-02-24 23:52:47', 'production', '2026-02-23 19:28:49', '2026-02-24 23:52:47', 1, 100);

-- Table structure for `user`
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `referral_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `referral_link_url` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin','affiliate') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `status` enum('active','inactive','banned','suspended') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `terms_accepted` tinyint(1) NOT NULL DEFAULT '0',
  `usage_credits_remaining` int NOT NULL DEFAULT '50',
  `usage_limit_total` int NOT NULL DEFAULT '1000',
  `total_credits_used` int NOT NULL DEFAULT '0',
  `last_login_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `current_credit_balance` decimal(10,2) DEFAULT NULL,
  `is_ai_access_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `language_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_preference` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferences` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `plan_tier` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'free',
  `ui_preferences` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `subscription_tier` enum('free','standard','pro','business') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `is_rtl_enforced` tinyint(1) DEFAULT '0',
  `ui_language` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `ui_theme` enum('light','dark','system') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'system',
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_key` (`email`),
  UNIQUE KEY `user_referral_code_key` (`referral_code`),
  UNIQUE KEY `user_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `user`
INSERT INTO `user` (`id`, `email`, `username`, `password`, `first_name`, `full_name`, `avatar_url`, `job_title`, `bio_text`, `referral_code`, `referral_link_url`, `role`, `status`, `terms_accepted`, `usage_credits_remaining`, `usage_limit_total`, `total_credits_used`, `last_login_at`, `created_at`, `updated_at`, `current_credit_balance`, `is_ai_access_enabled`, `language_code`, `theme_preference`, `preferences`, `plan_tier`, `ui_preferences`, `subscription_tier`, `is_rtl_enforced`, `ui_language`, `ui_theme`, `is_admin`) VALUES
(1, 'mohamedbouha2@gmail.com', 'Mohamed Bouha', 'd7def2f933c5fa3909d5c260fe661c0ce801bacb085bdbc84d1ea98ff8fe0bdf', 'Marcus', 'Marcus Sterling', 'https://images.pexels.com/photos/8937583/pexels-photo-8937583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Marketing Director', 'Experienced marketer focusing on B2B growth and automation strategies.', 'MARCUS2024', 'https://konvrt.ai/ref/MARCUS2024', 'user', 'active', 1, 19, 1000, 151, '2026-02-23 15:13:13', '2026-02-23 15:17:34', '2026-02-25 13:34:59', '5000.00', 1, 'en', 'dark', NULL, 'pro', '{"sidebar":"expanded","density":"comfortable"}', 'free', 0, 'en-US', 'dark', 0),
(2, 'elena.rostova@creative.net', 'elena_designs', '$2b$10$epMq/x.x.x.x.x.x.x.x.x', 'Elena', 'Elena Rostova', 'https://images.pexels.com/photos/6816596/pexels-photo-6816596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Freelance Graphic Designer', 'Visual storyteller loving AI art tools and generative design.', 'ELENA_ART', 'https://konvrt.ai/ref/ELENA_ART', 'user', 'active', 1, 20, 1000, 150, '2026-02-23 15:13:13', '2026-02-23 15:13:14', '2026-02-24 23:52:47', '1000.00', 1, 'en', NULL, NULL, 'free', NULL, 'free', 0, 'en', 'dark', 0),
(4, 'sarah.jenkins@bakeshop.com', 'sarah_bakes', '$2b$10$epMq/x.x.x.x.x.x.x.x.x', 'Sarah', 'Sarah Jenkins', 'https://images.pexels.com/photos/34642149/pexels-photo-34642149.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Small Business Owner', 'Owner of Sarah\'s Sourdough. Using AI to manage my social media.', 'SWEET_SARAH', 'https://konvrt.ai/ref/SWEET_SARAH', 'user', 'active', 1, 20, 5000, 150, '2026-02-23 15:13:13', '2026-02-23 15:13:14', '2026-02-24 23:52:47', '50.00', 1, NULL, NULL, NULL, 'free', NULL, 'free', 0, 'en', 'dark', 0),
(5, 'jackson.finance@influencer.com', 'jackson_affiliate', '$2b$10$epMq/x.x.x.x.x.x.x.x.x', 'Jackson', 'Jackson Thorne', 'https://images.pexels.com/photos/29119987/pexels-photo-29119987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Affiliate Marketer', 'Teaching others how to monetize their content online.', 'JACKSON_MONEY', 'https://konvrt.ai/ref/JACKSON_MONEY', 'user', 'active', 1, 20, 5000, 150, '2026-02-23 15:13:13', '2026-02-23 15:13:14', '2026-02-24 23:52:47', '2000.00', 1, NULL, NULL, NULL, 'free', NULL, 'free', 0, 'en', 'dark', 0),
(6, 'emily.watson@university.edu', 'dr_emily', '$2b$10$epMq/x.x.x.x.x.x.x.x.x', 'Emily', 'Dr. Emily Watson', 'https://images.pexels.com/photos/8442616/pexels-photo-8442616.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Research Scientist', 'Analyzing data patterns and publishing academic papers.', 'SCIENCE_EM', 'https://konvrt.ai/ref/SCIENCE_EM', 'user', 'active', 1, 20, 5000, 150, '2026-02-23 15:13:13', '2026-02-23 15:13:14', '2026-02-24 23:52:47', '50.00', 1, NULL, NULL, NULL, 'free', NULL, 'free', 0, 'en', 'dark', 0),
(7, 'lucas.silva@globetrotter.com', 'lucas_travels', '$2b$10$epMq/x.x.x.x.x.x.x.x.x', 'Lucas', 'Lucas Silva', 'https://images.pexels.com/photos/2405638/pexels-photo-2405638.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Travel Blogger', 'Exploring the world one city at a time. Digital Nomad.', 'LUCAS_GO', 'https://konvrt.ai/ref/LUCAS_GO', 'user', 'active', 1, 20, 5000, 150, '2026-02-23 15:13:13', '2026-02-23 15:13:14', '2026-02-24 23:52:47', '50.00', 1, NULL, NULL, NULL, 'free', NULL, 'free', 0, 'en', 'dark', 0),
(8, 'sophia.lee@realty.com', 'sophia_realestate', '$2b$10$epMq/x.x.x.x.x.x.x.x.x', 'Sophia', 'Sophia Lee', 'https://images.pexels.com/photos/7642131/pexels-photo-7642131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', 'Real Estate Agent', 'Helping families find their dream homes in the Bay Area.', 'HOME_SOPHIA', 'https://konvrt.ai/ref/HOME_SOPHIA', 'user', 'active', 1, 20, 5000, 150, '2026-02-23 15:13:13', '2026-02-23 15:13:14', '2026-02-24 23:52:47', '50.00', 1, NULL, NULL, NULL, 'free', NULL, 'free', 0, 'en', 'dark', 0),
(18, 'mohamedbouha@gmail.com', 'admin_sarah', '1e94c8f27406874cebb42f65eccbc715571d8245b3cb171c8a23261df22fc89e', 'Sarah', 'Sarah Connor', 'https://images.unsplash.com/photo-1627161683077-e34782c24d81?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MTc3NTR8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMHdvbWFufGVufDB8MXx8fDE3NzE4NzQ5MTV8MA&ixlib=rb-4.1.0&q=85', 'System Admin', 'Platform administrator.', 'ADMIN_SARAH', 'https://konvrt.ai/ref/ADMIN_SARAH', 'admin', 'active', 1, 999999, 999999, 0, '2026-02-23 19:29:09', '2026-02-23 19:29:09', '2026-02-24 23:52:47', '99999.00', 1, 'en', NULL, NULL, 'business', '{"sidebar":"expanded","density":"comfortable"}', 'free', 0, 'en-US', 'dark', 0),
(19, 'ahmed.test@agency.com', 'ahmed_rtl_test', '$2b$10$placeholder', 'Ahmed', 'Ahmed Al-Fayed', 'get_image_url(keywords="middle eastern man portrait", resolution="medium")', NULL, NULL, 'AHMEDRTL', 'https://konvrt.ai/ref/AHMEDRTL', 'user', 'active', 1, 1000, 1000, 0, NULL, '2026-02-24 23:40:24', '2026-02-24 23:52:47', '1000.00', 1, 'ar', NULL, NULL, 'pro', '{"sidebar":"expanded","density":"comfortable"}', 'free', 1, 'ar-SA', 'dark', 0);

-- Table structure for `user_ai_preference`
DROP TABLE IF EXISTS `user_ai_preference`;
CREATE TABLE `user_ai_preference` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `selected_category_tab` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `core_engine_model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `text_creativity_level` int DEFAULT NULL,
  `image_generation_style` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `video_script_format` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_cultural_intelligence_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `target_language_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_ai_preference_user_id_key` (`user_id`),
  CONSTRAINT `user_ai_preference_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `user_ai_preference`
INSERT INTO `user_ai_preference` (`id`, `user_id`, `selected_category_tab`, `core_engine_model`, `text_creativity_level`, `image_generation_style`, `video_script_format`, `is_cultural_intelligence_enabled`, `target_language_code`, `created_at`, `updated_at`) VALUES
(1, 1, 'marketing', 'gpt-4o', 7, 'Professional', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:13', '2026-02-24 23:52:47'),
(2, 2, 'marketing', 'gpt-4o', 7, 'Artistic', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:14', '2026-02-24 22:01:52'),
(4, 4, 'marketing', 'gpt-4-turbo', 7, 'Friendly', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(5, 5, 'marketing', 'gpt-4o', 7, 'Engaging', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:14', '2026-02-23 20:58:55'),
(6, 6, 'marketing', 'gpt-4-turbo', 7, 'Academic', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(7, 7, 'marketing', 'gpt-4-turbo', 7, 'Descriptive', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(8, 8, 'marketing', 'gpt-4-turbo', 7, 'Persuasive', 'youtube_standard', 1, 'en-US', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(9, 18, 'marketing', 'gpt-4o', 7, 'Concise', 'youtube_standard', 1, 'en-US', '2026-02-23 19:29:09', '2026-02-24 23:52:47'),
(10, 19, 'marketing', 'gpt-4o', 7, 'Creative', NULL, 1, 'ar-SA', '2026-02-24 23:40:24', '2026-02-24 23:52:47');

-- Table structure for `user_preferences`
DROP TABLE IF EXISTS `user_preferences`;
CREATE TABLE `user_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `theme_preference` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'system',
  `notifications_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_preferences_user_id_key` (`user_id`),
  CONSTRAINT `user_preferences_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `user_preferences`
-- Table structure for `user_settings`
DROP TABLE IF EXISTS `user_settings`;
CREATE TABLE `user_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `preferred_language_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `cultural_intelligence_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `is_rtl` tinyint(1) DEFAULT '1',
  `theme_mode` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'dark',
  `rtl_enabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_settings_user_id_key` (`user_id`),
  CONSTRAINT `user_settings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `user_settings`
INSERT INTO `user_settings` (`id`, `user_id`, `preferred_language_code`, `cultural_intelligence_enabled`, `created_at`, `updated_at`, `is_rtl`, `theme_mode`, `rtl_enabled`) VALUES
(1, 1, 'en-US', 1, '2026-02-23 15:13:13', '2026-02-24 23:52:47', 0, 'dark', 0),
(2, 2, 'en', 1, '2026-02-23 15:13:14', '2026-02-24 23:40:24', 0, 'dark', 0),
(4, 4, 'en', 1, '2026-02-23 15:13:14', '2026-02-24 23:40:24', 0, 'dark', 0),
(5, 5, 'en', 1, '2026-02-23 15:13:14', '2026-02-24 23:40:24', 0, 'dark', 0),
(6, 6, 'en', 1, '2026-02-23 15:13:14', '2026-02-24 23:40:24', 0, 'dark', 0),
(7, 7, 'en', 1, '2026-02-23 15:13:14', '2026-02-24 23:40:24', 0, 'dark', 0),
(8, 8, 'en', 1, '2026-02-23 15:13:14', '2026-02-24 23:40:24', 0, 'dark', 0),
(9, 18, 'en-US', 1, '2026-02-23 19:29:09', '2026-02-24 23:52:47', 0, 'dark', 0),
(10, 19, 'ar-SA', 1, '2026-02-24 23:40:24', '2026-02-24 23:52:47', 1, 'dark', 0);

-- Table structure for `user_subscription`
DROP TABLE IF EXISTS `user_subscription`;
CREATE TABLE `user_subscription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `subscription_plan_id` int NOT NULL,
  `status` enum('active','cancelled','expired','trial') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `next_billing_date` datetime(3) NOT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `cancelled_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_subscription_user_id_key` (`user_id`),
  KEY `user_subscription_user_id_idx` (`user_id`),
  KEY `user_subscription_subscription_plan_id_idx` (`subscription_plan_id`),
  CONSTRAINT `user_subscription_subscription_plan_id_fkey` FOREIGN KEY (`subscription_plan_id`) REFERENCES `subscription_plan` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `user_subscription_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `user_subscription`
INSERT INTO `user_subscription` (`id`, `user_id`, `subscription_plan_id`, `status`, `next_billing_date`, `started_at`, `cancelled_at`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(2, 2, 2, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(4, 4, 1, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(5, 5, 6, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(6, 6, 8, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(7, 7, 2, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(8, 8, 3, 'active', '2026-03-23 15:13:13', '2026-01-23 15:13:13', NULL, '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(9, 18, 14, 'active', '2026-03-23 19:29:09', '2026-01-23 19:29:09', NULL, '2026-02-23 19:29:09', '2026-02-24 23:52:47'),
(10, 19, 9, 'active', '2026-03-24 23:40:23', '2026-01-24 23:40:23', NULL, '2026-02-24 23:40:24', '2026-02-24 23:40:24');

-- Table structure for `user_wallet`
DROP TABLE IF EXISTS `user_wallet`;
CREATE TABLE `user_wallet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `current_credit_balance` int NOT NULL DEFAULT '0',
  `currency_code` enum('usd','eur','gbp','cny') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'usd',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_wallet_user_id_key` (`user_id`),
  CONSTRAINT `user_wallet_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for table `user_wallet`
INSERT INTO `user_wallet` (`id`, `user_id`, `current_credit_balance`, `currency_code`, `created_at`, `updated_at`) VALUES
(1, 1, 1500, 'usd', '2026-02-23 15:13:13', '2026-02-23 15:13:13'),
(2, 2, 450, 'usd', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(4, 4, 80, 'usd', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(5, 5, 2000, 'usd', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(6, 6, 300, 'usd', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(7, 7, 120, 'usd', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(8, 8, 1800, 'usd', '2026-02-23 15:13:14', '2026-02-23 15:13:14'),
(9, 18, 99999, 'usd', '2026-02-23 19:29:09', '2026-02-23 19:29:09'),
(10, 19, 1000, 'usd', '2026-02-24 23:40:24', '2026-02-24 23:40:24');

SET FOREIGN_KEY_CHECKS = 1;
