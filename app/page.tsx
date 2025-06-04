'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation'; // 追加

const Page = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<"skill" | "position" | "area" | "price">("skill");
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState<any>(null); // ログイン中ユーザー
  const router = useRouter(); // 追加
  const ref = useRef<HTMLDivElement>(null); // ← 選択ボックスのref

  const options = {
    skill: ['Unity', 'XD', 'Figma', 'illustrator', 'Photoshop', 'GraphQL', 'Jenkins', 'bootstrap', 'UI/UX', 'Apache Kafka', 'Apache Camel'],
    position: ['PM', 'SE', 'フロントエンド', 'バックエンド', 'インフラ', 'QA', 'コンサル', 'SAP'],
    area: ['東京', '大阪', '名古屋', '福岡', '札幌', 'リモート', 'その他'],
    price: ['50万～', '60万～', '70万～', '80万～', '90万～', '100万～']
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowAll(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayItems = showAll
  ? options[category]
  : options[category].slice(0, 6);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh(); // 状態を再読み込み
  };

  return (
    <main className="bg-[#E6F0F8]">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="flex justify-between items-center py-3">
          <div className="text-lg font-semibold">ZENSHIN Freelance</div>
          <div className="space-x-4 text-sm">
            {user ? (
              <>
                <span className="text-teal-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline ml-2"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="font-semibold hover:underline">新規登録</Link>
                <Link href="/login" className="font-semibold hover:underline">ログイン</Link>
              </>
            )}
          </div>
        </header>

        <section className="text-center mb-4">
          <h1 className="text-2xl font-semibold text-indigo-500 mb-2">フリーランスエンジニア・PMのための案件掲示板</h1>
            <div className="max-w-screen-xl mx-auto px-4 py-3 text-grey-500 md:px-8 flex flex-col items-center text-center">
              <div className="flex items-center gap-x-4 bg-indigo-200 rounded-lg px-2">
                <div className="w-8 h-8 flex-none rounded-lg bg-indigo-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                  </svg>
                </div>
                <p className="py-2 text-gray-800">
                  新規登録&スキルシート提出等で案件決定時に最大15,000円を還元します。
                  <a href="#" className="underline duration-150 text-gray-800 hover:text-grey-200"> 詳細はこちら</a>
                </p>
              </div>
            </div>
        </section>

        <section className="text-center">
          {/* カテゴリ切り替えボタン */}
          <div className="flex justify-center gap-4 mb-4 text-sm">
            {(["skill", "position", "area", "price"] as const).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setCategory(key);
                  setShowAll(false);
                }}
                className={category === key ? "border-b-2 border-indigo-500" : "text-gray-500"}
              >
                {{
                  skill: "スキルでさがす",
                  position: "ポジションでさがす",
                  area: "エリアでさがす",
                  price: "単価でさがす"
                }[key]}
              </button>
            ))}
          </div>

          {/* 選択肢のリスト（バッジ＋検索ボタン） */}
          <div ref={ref} className="max-w-md mx-auto text-sm mb-6 relative">
            <div className="flex items-center border rounded px-3 py-2 bg-white">
              {/* バッジ＋トグルエリア */}
              <div
                className="flex flex-wrap items-center gap-2 flex-1 cursor-pointer"
                onClick={() => setShowAll(!showAll)}
              >
                {search.trim().length > 0 ? (
                  search
                    .split(" ")
                    .filter(Boolean)
                    .map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-1 text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item}
                        <button
                          className="text-indigo-600 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearch((prev) =>
                              prev
                                .split(" ")
                                .filter((i) => i !== item)
                                .join(" ")
                            );
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))
                ) : (
                  <span className="text-gray-400">選択してください</span>
                )}
                {/* ▼トグルアイコンは常時表示 */}
                <span className="ml-2 text-gray-500 text-sm">▼</span>
              </div>

              {/* 検索ボタン */}
              <button className="ml-3 bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600">
                検索
              </button>
            </div>

            {/* 選択肢一覧（クリックでトグル） */}
            {showAll && (
              <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {options[category].map((item) => {
                    const selectedItems = search.split(" ").filter(Boolean);
                    const isSelected = selectedItems.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => {
                          setSearch((prev) => {
                            const items = prev.split(" ").filter(Boolean);
                            return isSelected
                              ? items.filter((i) => i !== item).join(" ")
                              : [...items, item].join(" ");
                          });
                        }}
                        className={`text-left rounded px-2 py-1 ${
                          isSelected ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="text-sm mb-4">案件数：604件</div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: '運送会社向けDXサービス新規構築', reward: '〜100万', skill: ['PHP'] },
            { title: '電子決済サービス開発', reward: '〜80万', skill: ['PHP'] },
            { title: '充電電池とシェアリングサービスのシステム開発の案件', reward: '〜60万', skill: ['PHP'] },
            { title: 'PHP開発案件', reward: '〜65万', skill: ['PHP', 'MySQL'] },
            { title: '中学校・高校向け授業管理システムの開発', reward: '〜60万', skill: ['PHP', 'SQL'] },
            { title: 'お客様向けサービスのPOSシステムのインフラ構築支援', reward: '〜65万', skill: ['PHP'] },
            { title: 'PHP開発案件', reward: '〜65万', skill: ['PHP', 'MySQL'] },
            { title: '中学校・高校向け授業管理システムの開発', reward: '〜60万', skill: ['PHP', 'SQL'] },
            { title: 'お客様向けサービスのPOSシステムのインフラ構築支援', reward: '〜65万', skill: ['PHP'] },
          ].map((job, idx) => (
            <div key={idx} className="border p-4 rounded-lg shadow-sm bg-white">
              <h3 className="font-semibold text-base mb-1">{job.title}</h3>
              <p className="text-gray-500 text-sm mb-1">単価/月　{job.reward}</p>
              <p className="text-sm text-gray-500 mb-2">応募スキル</p>
              <div className="flex gap-2 flex-wrap">
                {job.skill.map((s) => (
                  <span key={s} className="bg-indigo-100 text-indigo-600 px-2 py-1 text-xs rounded">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center space-x-2 text-sm">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={`px-3 py-1 border ${n === 1 ? 'bg-indigo-400 text-white' : ''}`}>
              {n}
            </button>
          ))}
          <span className="px-3">…</span>
          <button className="px-3 py-1 border">100</button>
        </div>
        <footer className="flex justify-between items-center py-3">
          <div></div>
        </footer>
      </div>
    </main>
  );
};

export default Page;