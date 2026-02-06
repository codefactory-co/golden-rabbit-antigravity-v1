import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> } // params를 Promise로 처리
) {
    const { chatId } = await params;
    try {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ success: true, messages: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ chatId: string }> } // params를 Promise로 처리
) {
    const { chatId } = await params;
    try {
        const body = await request.json();
        const { role, content, type, analysis_data } = body;

        const { data, error } = await supabase
            .from("messages")
            .insert([{
                chat_id: chatId,
                role,
                content,
                type: type || 'text',
                analysis_data
            }])
            .select()
            .single();

        if (error) throw error;

        // Update chat's updated_at
        await supabase
            .from("chats")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", chatId);

        return NextResponse.json({ success: true, message: data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
