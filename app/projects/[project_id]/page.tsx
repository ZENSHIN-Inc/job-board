import { supabase } from "@/app/lib/supabase";
import { notFound } from "next/navigation";
import ClientApplyButton from "./ClientApplyButton";

import Link from "next/link";
import type { ProjectWithSkillsAndPositions } from "@/types/project";

type Props = {
  params: { project_id: string };
};

export async function generateStaticParams() {
  const { data } = await supabase.from("projects").select("project_id");
  return (data ?? []).map((p) => ({ project_id: p.project_id }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { project_id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_positions (
        positions (
          id,
          name
        )
      )
    `
    )
    .eq("project_id", project_id)
    .single<ProjectWithSkillsAndPositions>();

  if (!project || error) notFound();

  return (
    <main className="bg-[#E6F0F8]">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="py-4">
          <div className="text-lg font-semibold">ZENSHIN Freelance</div>
        </header>
        <div className="bg-white rounded p-4">
          <h1 className="text-lg font-semibold">{project.project_name}</h1>
          <div className="h-1 w-full bg-indigo-300" />

          <section className="grid grid-cols-1 md:grid-cols-4 text-sm border-b border-gray-200 py-2">
            {/* 左側 */}
            <div className="md:col-span-2 grid grid-cols-[96px_1fr] pm-2">
              <LabelCell>単価</LabelCell>
              <div className="p-3">
                {project.unit_price ? `〜${project.unit_price}万円` : "非公開"}
              </div>

              <LabelCell>案件概要</LabelCell>
              <div className="p-3 whitespace-pre-line">
                {project.description ?? "—"}
              </div>

              <LabelCell>募集ポジション</LabelCell>
              <div className="p-3">
                {project.project_positions && project.project_positions.length > 0
                  ? project.project_positions
                      .map((pp) => pp.positions?.name)
                      .filter(Boolean)
                      .join("、")
                  : "—"}
              </div>

              <LabelCell>稼働開始日</LabelCell>
              <div className="p-3">{project.start_date ?? "—"}</div>
            </div>

            {/* 右側 */}
            <div className="md:col-span-2 grid grid-cols-[96px_1fr] border-t md:border-t-0 md:border-l border-gray-200">
              <LabelCell>場所</LabelCell>
              <div className="p-3">{project.location ?? "—"}</div>

              <LabelCell>働き方</LabelCell>
              <div className="p-3">{project.work_style ?? "—"}</div>

              <LabelCell>必須スキル</LabelCell>
              <div className="p-3 whitespace-pre-line">
                {project.required_skills ?? "—"}
              </div>

              <LabelCell>歓迎スキル</LabelCell>
              <div className="p-3 whitespace-pre-line">
                {project.preferred_skills ?? "—"}
              </div>
            </div>
          </section>

          <div className="p-4">

            <ClientApplyButton projectId={project.project_id} />
          </div>
        </div>
      </div>
    </main>
  );
}

function LabelCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center bg-gray-200 px-2 py-3 text-xs font-semibold">
      {children}
    </div>
  );
}
