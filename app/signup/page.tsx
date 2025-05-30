// app/signup/page.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase"; // パスはlibの場所に合わせて調整

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setMessage("登録に失敗しました：" + error.message);
    } else {
      setMessage("登録メールを確認してください。");
    }
  };

  return (
    <main className="bg-[#E6F0F8]">
      <div className="max-w-md mx-auto mt-20 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">メールアドレス</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">パスワード</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-700"
          >
            登録する
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </main>
  );
}
