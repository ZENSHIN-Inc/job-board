"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // 必要に応じて

export default function ClientApplyButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      // ✅ ログイン済み → 応募処理 or 応募ページへ
      console.log("応募します", projectId);
      router.push(`/projects/${projectId}/apply`);
    } else {
      // ❌ 未ログイン → ログインページへ
      alert("応募するにはログインが必要です。ログインページに移動します。");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="block w-full rounded bg-indigo-500 py-2 text-center text-white hover:bg-indigo-600 disabled:opacity-50"
    >
      {loading ? "確認中..." : "応募する"}
    </button>
  );
}
