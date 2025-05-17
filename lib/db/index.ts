import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


import * as usersSchema from './schema/users';
import * as toolsSchema from './schema/tools';
import * as categoriesSchema from './schema/categories';
import * as toolCategoriesSchema from './schema/tool-categories';
import * as bookmarksSchema from './schema/bookmarks';
import * as usageSchema from './schema/usage';
import * as customRequestsSchema from './schema/custom-requests';


const schema = {
  ...usersSchema,
  ...toolsSchema,
  ...categoriesSchema,
  ...toolCategoriesSchema,
  ...bookmarksSchema,
  ...usageSchema,
  ...customRequestsSchema
};


const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });


export * from './schema/users';
export * from './schema/tools';
export * from './schema/categories';
export * from './schema/tool-categories';
export * from './schema/bookmarks';
export * from './schema/usage';
export * from './schema/custom-requests';