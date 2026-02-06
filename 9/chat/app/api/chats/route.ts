import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("chats")
            .select("*")
            .order("updated_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, chats: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title } = await req.json();

        const { data, error } = await supabase
            .from("chats")
            .insert([{ title: title || "New Chat" }])
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, chat: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
