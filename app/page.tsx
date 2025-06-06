'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';
import type { ProjectWithSkillsAndPositions } from "@/types/project";

const Page = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<"skill" | "position" | "area" | "price">("skill");
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState<any>(null); 
  const router = useRouter(); 
  const ref = useRef<HTMLDivElement>(null); // ← 選択ボックスのref
  const [projects, setProjects] = useState<
    { project_id: string; project_name: string; unit_price: number; skills: string[]; prefecture: string; positions: string[]; work_style: string }[]
  >([]);

  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [positionOptions, setPositionOptions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const options = {
    skill: skillOptions,
    position: positionOptions,  
    area: ['東京', '大阪', 'フルリモート'],
    price: ['70万～', '80万～', '90万～', '100万～']
  };

  useEffect(() => {
    // skills テーブルからスキル一覧を取得
    const fetchSkills = async () => {
      const { data, error } = await supabase.from("skills").select("name");
      if (error) {
        console.error("スキル取得エラー:", error);
        return;
      }
      setSkillOptions(data.map((skill) => skill.name));
    };

    // positions テーブルからポジション一覧を取得
    const fetchPositions = async () => {
      const { data, error } = await supabase.from("positions").select("name");
      if (error) {
        console.error("ポジション取得エラー:", error);
        return;
      }
      setPositionOptions(data.map((pos) => pos.name));
    };

    fetchSkills();
    fetchPositions();
  }, []);
  
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

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          project_id,
          project_name,
          unit_price,
          prefecture,
          work_style,
          project_skills (
            skills ( name )
          ),
          project_positions (
            positions ( name )
          )
        `);

      if (error) {
        console.error('プロジェクト取得エラー:', error.message);
        return;
      }

      // スキル名だけ抽出
      const parsed = data.map((project: any) => ({
        project_id: project.project_id,
        project_name: project.project_name,
        unit_price: project.unit_price,
        prefecture: project.prefecture,
        work_style: project.work_style,
        skills: project.project_skills.map((ps: any) => ps.skills.name),
        positions: project.project_positions.map((pp: any) => pp.positions.name),
      }));

      setProjects(parsed);
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh(); // 状態を再読み込み
  };

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_skills (
          skills ( name )
        ),
        project_positions (
          positions ( name )
        )
      `);

    if (error || !data) {
      console.error("検索エラー:", error.message);
      return;
    }

    const typedData = data as ProjectWithSkillsAndPositions[];

    const filtered = typedData.filter((project) => {
      const skillMatch = selectedSkills.every((skill) =>
        project.project_skills?.some((ps) => ps.skills?.name === skill)
      );

      const positionMatch = selectedPositions.every((position) =>
        project.project_positions?.some((pp) => pp.positions?.name === position)
      );

      const areaMatch =
        selectedAreas.length === 0 ||
        selectedAreas.some((area) => {
          if (area === "フルリモート") {
            return project.work_style?.includes("フルリモート");
          } else {
            return project.prefecture?.includes(area);
          }
        });

      const priceMatch =
        selectedPrices.length === 0 ||
        selectedPrices.every((price) => {
          const numericPrice = project.unit_price ?? 0;

          if (price === "70万～") return numericPrice >= 70;
          if (price === "80万～") return numericPrice >= 80;
          if (price === "90万～") return numericPrice >= 90;
          if (price === "100万～") return numericPrice >= 100;
          return true;
        });

      return skillMatch && positionMatch && areaMatch && priceMatch;
    });

    const parsed = filtered.map((project) => ({
      project_id: project.project_id,
      project_name: project.project_name,
      unit_price: project.unit_price ?? 0,
      prefecture: project.prefecture ?? "",
      work_style: project.work_style ?? "",
      skills: project.project_skills?.map((ps) => ps.skills?.name ?? "") ?? [],
      positions: project.project_positions?.map((pp) => pp.positions?.name ?? "") ?? [],
    }));

    setProjects(parsed);
  };

  return (
    <main className="bg-[#E6F0F8]">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="flex justify-between items-center py-3">
          <div className="text-lg font-semibold">ZENSHIN Freelance</div>
          <div className="space-x-4 text-sm">
            {user ? (
              <>
                <span className="font-semibold">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="font-semibold hover:underline ml-2"
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
            {[...selectedSkills, ...selectedPositions, ...selectedAreas, ...selectedPrices].length > 0 ? (
              [...selectedSkills, ...selectedPositions, ...selectedAreas, ...selectedPrices].map((item) => (
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
                      if (selectedSkills.includes(item)) {
                        setSelectedSkills((prev) => prev.filter((i) => i !== item));
                      } else if (selectedPositions.includes(item)) {
                        setSelectedPositions((prev) => prev.filter((i) => i !== item));
                      } else if (selectedAreas.includes(item)) {
                        setSelectedAreas((prev) => prev.filter((i) => i !== item));
                      } else if (selectedPrices.includes(item)) {
                        setSelectedPrices((prev) => prev.filter((i) => i !== item));
                      }
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">選択してください</span>
            )}
            <span className="ml-2 text-gray-500 text-sm">▼</span>
          </div>


              {/* 検索ボタン */}
              <button className="ml-3 bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600" onClick={handleSearch}>
                検索
              </button>
            </div>

            {/* 選択肢一覧（クリックでトグル） */}
            {showAll && (
              <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {options[category].map((item) => {
                    const selectedItems = search.split(" ").filter(Boolean);
                    const isSelected =
                      category === "skill"
                        ? selectedSkills.includes(item)
                        : category === "position"
                        ? selectedPositions.includes(item)
                        : category === "area"
                        ? selectedAreas.includes(item)
                        : category === "price"
                        ? selectedPrices.includes(item)
                        : false;

                    return (
                    <button
                      key={item}
                      onClick={() => {
                        if (category === "skill") {
                          setSelectedSkills((prev) =>
                            isSelected ? prev.filter((i) => i !== item) : [...prev, item]
                          );
                        } else if (category === "position") {
                          setSelectedPositions((prev) =>
                            isSelected ? prev.filter((i) => i !== item) : [...prev, item]
                          );
                        } else if (category === "price") {
                          setSelectedPrices((prev) =>
                            isSelected ? prev.filter((i) => i !== item) : [...prev, item]
                          );
                        } else if (category === "area") {
                          setSelectedAreas((prev) =>
                            isSelected ? prev.filter((i) => i !== item) : [...prev, item]
                          );
                        }
                      }}

                    >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="max-w-screen-xl mx-auto px-4 py-3 text-grey-500 md:px-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-x-4 bg-indigo-200 rounded-lg px-2">
                <svg className="w-5 h-5 text-gray-800 font-semibold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                </svg>
              <p className="py-2 font-semibold text-gray-800">
                新規登録&スキルシート提出等で案件決定時に最大15,000円を還元します。
                <Link
                  href={`/`}
                  className="text-sm font-semibold text-gray-800 hover:underline"
                >
                  view more →
                </Link>
              </p>
            </div>
          </div>
        </section>

        <div className="text-sm mb-4">案件数：{projects.length}件</div>

        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((job) => (
            <div key={job.project_id} className="border p-4 rounded-lg shadow-sm bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-base mb-1">{job.project_name}</h3>
                <p className="text-gray-500 text-sm mb-1">単価/月 : {job.unit_price}万円</p>
                <p className="text-gray-500 text-sm mb-1">勤務地 : {job.prefecture}</p>
                <p className="text-gray-500 text-sm mb-1">働き方 : {job.work_style}</p>
                <p className="text-sm text-gray-500 mb-2">スキル・ポジション : </p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {job.skills.map((s) => (
                    <span key={`skill-${s}`} className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded">
                      {s}
                    </span>
                  ))}
                  {job.positions.map((p) => (
                    <span key={`position-${p}`} className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* ↓ 「view more →」リンクを追加 */}
              <div className="mt-auto text-right">
                <Link
                  href={`/projects/${job.project_id}`}
                  className="text-sm font-semibold text-indigo-600 hover:underline"
                >
                  view more →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <footer className="flex justify-between items-center py-3">
          <div></div>
        </footer>
      </div>
    </main>
  );
};

export default Page;