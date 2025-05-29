"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setMessage("ログインに失敗しました：" + error.message);
    } else {
      // 成功時にトップページにリダイレクト
      router.push("/");
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
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
          className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
        >
          ログイン
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
    </main>
  );
}
