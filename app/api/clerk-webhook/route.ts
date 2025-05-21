import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/db/schema/users'; // adjust this to your schema file

const client = neon(process.env.DATABASE_URL!);
const db = drizzle(client);

export async function POST(req: NextRequest) {
  const event = await req.json();

  const { type, data } = event;

  if (type === 'user.created' || type === 'user.updated') {
    const user = {
      id: data.id,
      email: data.email_addresses?.[0]?.email_address || '',
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      username: data.username,
      profile_image: data.image_url || null,
      reference: data.external_id || data.id, // or however you handle it
      updated_at: new Date(),
    };

  }

  return NextResponse.json({ success: true });
}
