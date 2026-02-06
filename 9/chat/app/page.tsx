"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Send,
  User,
  Bot,
  Plus,
  MessageSquare,
  Settings,
  MoreHorizontal,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Search,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "analysis";
  analysisData?: {
    productName: string;
    totalReviews: number;
    averageRating: number;
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
    };
    summary: string;
    pros: string[];
    cons: string[];
  };
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "안녕하세요! 쇼핑몰 리뷰 분석 AI 챗봇입니다. 분석하고 싶은 상품의 리뷰 URL이나 텍스트를 입력해주세요.",
      type: "text",
    }
  ]);
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isIndexing, setIsIndexing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages when currentChatId changes
  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    } else {
      // Reset to welcome message for new chat
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "안녕하세요! 쇼핑몰 리뷰 분석 AI 챗봇입니다. 분석하고 싶은 상품의 리뷰 URL이나 텍스트를 입력해주세요.",
        type: "text",
      }]);
    }
  }, [currentChatId]);

  const fetchChats = async () => {
    try {
      const res = await fetch("/api/chats");
      const data = await res.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  const fetchMessages = async (chatId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      const data = await res.json();
      if (data.success) {
        // Transform backend messages to frontend format if needed
        // Assuming the backend returns 'messages' array matching the type
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndexData = async () => {
    setIsIndexing(true);
    try {
      const resp = await fetch("/api/index-data", { method: "POST" });
      const data = await resp.json();
      if (data.success) {
        alert("인덱싱 완료: " + data.message);
      } else {
        alert("인덱싱 실패: " + data.error);
      }
    } catch (err) {
      alert("인덱싱 중 오류 발생");
    } finally {
      setIsIndexing(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userContent = input;
    setInput("");

    // Optimistically add user message for better UX (will be replaced by real fetch or sync)
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userContent,
      type: "text",
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // AI loading state
    const loadingMsg: Message = {
      id: "loading-" + Date.now(),
      role: "assistant",
      content: "분석 중입니다...",
      type: "text",
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      let chatId = currentChatId;

      // Create chat if not exists
      if (!chatId) {
        const createRes = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: userContent.substring(0, 30) }),
        });
        const createData = await createRes.json();
        if (createData.success) {
          chatId = createData.chat.id;
          setCurrentChatId(chatId);
          fetchChats(); // Refresh sidebar
        }
      }

      if (!chatId) throw new Error("Failed to create or get chat ID");

      // Use Search API which saves history
      const searchResp = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userContent, chatId }),
      });
      const searchData = await searchResp.json();

      if (searchData.success) {
        // Fetch updated messages to ensure synchronization
        // Alternatively, we could manually construct the message from searchData.aiResponse
        // But fetching is safer to keep state in sync with DB
        await fetchMessages(chatId);
      } else {
        throw new Error(searchData.error || "Search failed");
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Remove loading message and show error
      setMessages((prev) => prev.filter(m => m.id !== loadingMsg.id));
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-white text-zinc-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-zinc-50 border-r border-zinc-200 flex flex-col transition-all duration-300",
          isSidebarOpen ? "w-[260px]" : "w-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-sm font-medium w-full shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            새로운 채팅
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <div className="text-xs font-semibold text-zinc-400 px-2 py-2 mb-1">최근 대화</div>
          <nav className="space-y-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 transition-colors",
                  currentChatId === chat.id
                    ? "bg-indigo-50 text-indigo-900 font-medium"
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <MessageSquare className={cn("w-4 h-4 flex-shrink-0", currentChatId === chat.id ? "text-indigo-500" : "text-zinc-400")} />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
            {chats.length === 0 && (
              <p className="px-3 py-2 text-xs text-zinc-400">대화 기록이 없습니다.</p>
            )}
          </nav>

          <div className="mt-4 px-2">
            <button
              onClick={handleIndexData}
              disabled={isIndexing}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {isIndexing ? "인덱싱 중..." : "샘플 데이터 인덱싱"}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200">
          <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-zinc-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              J
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-zinc-900">지호 최</div>
              <div className="text-xs text-zinc-500">Free Plan</div>
            </div>
            <Settings className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-zinc-100 flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-zinc-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              쇼핑 리뷰 분석 봇
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-4 max-w-3xl mx-auto",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div className={cn("flex flex-col gap-2 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-none"
                  )}
                >
                  {msg.content}
                </div>

                {msg.type === "analysis" && msg.analysisData && (
                  <div className="w-full bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mt-2 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-900">{msg.analysisData.productName}</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">
                        ★ {msg.analysisData.averageRating} ({msg.analysisData.totalReviews})
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Sentiment */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-zinc-600">감성 분석</span>
                          <span className="text-indigo-600 font-bold">{msg.analysisData.sentiment.positive}% 긍정적</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                          <div style={{ width: `${msg.analysisData.sentiment.positive}%` }} className="h-full bg-green-500" />
                          <div style={{ width: `${msg.analysisData.sentiment.neutral}%` }} className="h-full bg-gray-300" />
                          <div style={{ width: `${msg.analysisData.sentiment.negative}%` }} className="h-full bg-red-500" />
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-900 border border-indigo-100">
                        <strong>요약:</strong> {msg.analysisData.summary}
                      </div>

                      {/* Pros/Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4 text-green-600" /> 장점
                          </h4>
                          <ul className="text-sm text-zinc-600 space-y-1 list-disc list-inside">
                            {msg.analysisData.pros.map((pro, idx) => (
                              <li key={idx}>{pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                            <ThumbsDown className="w-4 h-4 text-red-500" /> 단점
                          </h4>
                          <ul className="text-sm text-zinc-600 space-y-1 list-disc list-inside">
                            {msg.analysisData.cons.map((con, idx) => (
                              <li key={idx}>{con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                  <User className="w-5 h-5 text-zinc-500" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start max-w-3xl mx-auto gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-zinc-200 text-zinc-500 px-4 py-3 rounded-2xl rounded-bl-none text-[15px]">
                메시지를 불러오는 중입니다...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-zinc-100">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-3 top-3">
              <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-full hover:bg-zinc-100">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="리뷰를 분석할 상품의 URL이나 텍스트를 입력하세요..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-4 pl-12 pr-12 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[56px] max-h-32"
              rows={1}
              style={{ minHeight: "56px" }}
            />
            <div className="absolute right-3 top-2.5">
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-w-3xl mx-auto mt-2 text-center">
            <p className="text-xs text-zinc-400">
              AI는 실수를 할 수 있습니다. 중요한 정보는 확인해 주세요.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
