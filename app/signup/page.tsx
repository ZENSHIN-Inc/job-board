"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const { email, password } = form;

    const { error } = await supabase.auth.signUp({ email, password, options: {
      emailRedirectTo: "http://localhost:3000/profile"
      } 
    });

    if (error) {
      setMessage("登録に失敗しました：" + error.message);
      return;
    }

    setMessage("登録が完了しました。認証メールをご確認ください。");
  };

  return (
    <main className="bg-[#E6F0F8]">
      <div className="max-w-md mx-auto px-4">
        <header className="flex justify-between items-center py-3">
        </header>
        <h1 className="text-2xl font-bold mb-6 text-indigo-500 text-center">新規登録</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">メールアドレス</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">パスワード</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
            登録する
          </button>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </form>
        <footer className="flex justify-between items-center py-3">
        </footer>
      </div>
    </main>
  );
}
