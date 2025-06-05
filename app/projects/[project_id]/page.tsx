import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

// SSRを強制して同期的にparamsやcookiesを扱えるようにする
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({
  params,
}: {
  params: { project_id: string };
}) {
  console.log(params)
  const cookieStore = cookies(); // 🔑 クッキーを取得
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from('projects')
    .select(`
      project_name,
      unit_price,
      prefecture,
      work_style,
      description,
      project_skills (
        skills ( name )
      ),
      project_positions (
        positions ( name )
      )
    `)
    .eq('project_id', params.project_id)
    .single();

  if (error || !data) {
    notFound(); // 404 ページへ
  }

  const skills = data.project_skills.map((ps: any) => ps.skills.name);
  const positions = data.project_positions.map((pp: any) => pp.positions.name);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{data.project_name}</h1>
      <p className="text-gray-600 mb-2">単価: {data.unit_price} 万円/月</p>
      <p className="text-gray-600 mb-2">勤務地: {data.prefecture}</p>
      <p className="text-gray-600 mb-2">働き方: {data.work_style}</p>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{data.description}</p>

      <h2 className="font-semibold mb-2">必要なスキル</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {skills.map((s: string) => (
          <span key={s} className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
            {s}
          </span>
        ))}
      </div>

      <h2 className="font-semibold mb-2">ポジション</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        {positions.map((p: string) => (
          <span key={p} className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded">
            {p}
          </span>
        ))}
      </div>
    </main>
  );
}
