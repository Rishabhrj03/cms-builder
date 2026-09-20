import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from '@/lib/db/usersRepo';
import { createWorkspace } from '@/lib/db/workspacesRepo';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    if (password.length < 8)
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

    const existing = await getUserByEmail(email);
    if (existing)
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    // Create workspace first
    const workspaceId = await createWorkspace({
      name: `${name}'s Workspace`,
      ownerId: '', // updated below
      plan: 'free',
      createdAt: new Date(),
    });

    const passwordHash = await bcrypt.hash(password, 12);
    await createUser({
      name,
      email,
      passwordHash,
      workspaceId,
      plan: 'free',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Registration failed';
    console.error(err);
    if (msg.includes('duplicate key')) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
