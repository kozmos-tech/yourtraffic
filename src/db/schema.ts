import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core'

// Tables required by better-auth (email/password + sessions).
// Field names match better-auth's core schema so the drizzle adapter maps cleanly.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()),
})

// A tracked website, owned by a user. The domain maps incoming events to a
// project; the api key authorizes reads over the REST API and MCP server.
export const project = pgTable('project', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  domain: text('domain').notNull().unique(),
  apiKey: text('api_key').notNull().unique(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

// OAuth tables for the MCP server. better-auth's mcp plugin turns this app into
// an OAuth authorization server so agents can connect over the Model Context
// Protocol. Field names (camelCase) match the plugin's schema so the drizzle
// adapter maps cleanly; the SQL column names stay snake_case like the rest.

// A dynamically registered OAuth client (one per MCP app that connects).
export const oauthApplication = pgTable('oauth_application', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  metadata: text('metadata'),
  clientId: text('client_id').notNull().unique(),
  clientSecret: text('client_secret'),
  redirectUrls: text('redirect_urls').notNull(),
  type: text('type').notNull(),
  disabled: boolean('disabled').default(false),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

// An issued access token, bound to a user and client. getMcpSession looks the
// bearer token up here to authorize each MCP request.
export const oauthAccessToken = pgTable('oauth_access_token', {
  id: text('id').primaryKey(),
  accessToken: text('access_token').notNull().unique(),
  refreshToken: text('refresh_token').notNull().unique(),
  accessTokenExpiresAt: timestamp('access_token_expires_at').notNull(),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at').notNull(),
  clientId: text('client_id')
    .notNull()
    .references(() => oauthApplication.clientId, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  scopes: text('scopes').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

// A record that a user granted a client access, so repeat connections skip the
// consent step.
export const oauthConsent = pgTable('oauth_consent', {
  id: text('id').primaryKey(),
  clientId: text('client_id')
    .notNull()
    .references(() => oauthApplication.clientId, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  scopes: text('scopes').notNull(),
  consentGiven: boolean('consent_given').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

// One row per pageview. No cookies and no personal data: a visitor is a daily
// rotating hash of ip + user agent + project, so it cannot be traced across days.
export const event = pgTable(
  'event',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    timestamp: timestamp('timestamp')
      .$defaultFn(() => new Date())
      .notNull(),
    pathname: text('pathname').notNull(),
    referrer: text('referrer'),
    country: text('country'),
    browser: text('browser'),
    os: text('os'),
    device: text('device'),
    visitorHash: text('visitor_hash').notNull(),
  },
  (t) => [index('event_project_time_idx').on(t.projectId, t.timestamp)]
)
