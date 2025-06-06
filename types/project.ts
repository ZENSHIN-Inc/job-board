// プロジェクト本体
export type Project = {
  project_id: string;
  project_name: string;
  description: string | null;
  location: string | null;
  unit_price: number | null;
  contract_structure: string | null;
  number_of_openings: number | null;
  billing_method: string | null;
  start_date: string | null;
  interview_count: number | null;
  payment_term: string | null;
  required_skills: string | null;
  preferred_skills: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  work_style: string | null;
  prefecture: string | null;
};

// 中間テーブル（project_skills）
export type ProjectSkill = {
  project_id: string;
  skill_id: number;
};

// skills テーブル
export type Skill = {
  id: number;
  name: string;
};

// positions テーブル
export type Position = {
  id: number;
  name: string;
};

// 中間テーブル（project_positions）
export type ProjectPosition = {
  project_id: string;
  position_id: number;
};

// JOIN込みの構造（project_positions + positions）
export type ProjectWithPositions = Project & {
  project_positions?: {
    position_id: number;
    positions?: Position;
  }[];
};

// JOIN込みの構造（SupabaseのselectでJOINしたい場合）
export type ProjectWithSkills = Project & {
  project_skills?: {
    skill_id: number;
    skills?: Skill;
  }[];
};

export type ProjectWithSkillsAndPositions = Project & {
  project_skills?: {
    skill_id: number;
    skills?: Skill;
  }[];
  project_positions?: {
    position_id: number;
    positions?: Position;
  }[];
};