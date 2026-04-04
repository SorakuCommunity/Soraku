import { getServerSession } from "next-auth";
import { NextResponse } from 'next/server';
import { authOptions } from "./[...nextauth]";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function GET(req) {
  const session = await getAuthSession();
  console.log(session);
  return NextResponse.json({ id: 1 });
}
