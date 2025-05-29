'use client';

import { useState } from 'react';

const Page = () => {
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [category, setCategory] = useState<"skill" | "position" | "area">("skill");

  const options = {
    skill: ['Unity', 'XD', 'Figma', 'illustrator', 'Photoshop', 'GraphQL', 'Jenkins', 'bootstrap', 'UI/UX', 'Apache Kafka', 'Apache Camel'],
    position: ['PM', 'SE', 'フロントエンド', 'バックエンド', 'インフラ', 'QA', 'デザイナー', 'ディレクター'],
    area: ['東京', '大阪', '名古屋', '福岡', '札幌', 'リモート', '地方'],
  };

  return (
    <main className="max-w-[1200px] mx-auto px-4">
      <header className="flex justify-between items-center py-3">
        <div className="text-lg font-semibold">ZENSHIN Freelance</div>
        <div className="space-x-4 text-sm">
          <a href="#" className="hover:underline">新規登録</a>
          <a href="#" className="hover:underline">ログイン</a>
        </div>
      </header>

      <section className="text-center mb-8">
        <h1 className="text-xl font-semibold mb-2">フリーランスエンジニアのための案件掲示板</h1>
        <p>新規登録で案件獲得時に最大15,000円獲得</p>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-blue-500 underline text-sm mt-2"
        >
          {showDetail ? "閉じる" : "詳細を見る"}
        </button>

        {showDetail && (
          <div className="mt-4 text-sm text-gray-700">
            <p>・登録は無料、5分で完了</p>
            <p>・非公開の高単価案件に応募可能</p>
            <p>・マッチすれば即日稼働もOK</p>
          </div>
        )}
      </section>

    <section className="text-center mb-8">
      {/* カテゴリ切り替えボタン */}
      <div className="flex justify-center gap-4 mb-4 text-sm">
        <button
          onClick={() => setCategory("skill")}
          className={category === "skill" ? "border-b-2 border-teal-500" : "text-gray-500"}
        >
          スキルでさがす
        </button>
        <button
          onClick={() => setCategory("position")}
          className={category === "position" ? "border-b-2 border-teal-500" : "text-gray-500"}
        >
          ポジションでさがす
        </button>
        <button
          onClick={() => setCategory("area")}
          className={category === "area" ? "border-b-2 border-teal-500" : "text-gray-500"}
        >
          エリアでさがす
        </button>
      </div>

      {/* 選択肢のリスト */}
      <div className="flex flex-wrap gap-3 justify-center mb-6 text-sm">
        {options[category].map((item) => (
          <label key={item} className="flex items-center space-x-1">
            <input type="checkbox" />
            <span>{item}</span>
          </label>
        ))}
        <a href="#" className="text-blue-500">…もっと見る</a>
      </div>

      {/* 検索フォーム */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="PHP JavaScript"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-l"
        />
        <button className="bg-teal-500 text-white px-4 rounded-r">検索</button>
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
        ].map((job, idx) => (
          <div key={idx} className="border p-4 rounded shadow-sm bg-white">
            <h3 className="font-semibold text-base mb-1">{job.title}</h3>
            <p className="text-red-500 text-sm mb-1">単価/月　{job.reward}</p>
            <p className="text-sm text-gray-500 mb-2">応募スキル</p>
            <div className="flex gap-2 flex-wrap">
              {job.skill.map((s) => (
                <span key={s} className="bg-gray-100 px-2 py-1 text-xs rounded">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center space-x-2 text-sm">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} className={`px-3 py-1 border ${n === 1 ? 'bg-teal-500 text-white' : ''}`}>
            {n}
          </button>
        ))}
        <span className="px-3">…</span>
        <button className="px-3 py-1 border">100</button>
      </div>
    </main>
  );
};

export default Page;
