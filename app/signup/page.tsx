"use client";

import { useState, useRef } from "react";
import { supabase } from "@/app/lib/supabase";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    phone: "",
    birthDate: "",
    nationality: "",
    referralCode: "",
    allowProposal: "yes",
    residence: "",
    nearestStation: "",
    workOnsite: "",
    startDate: "",
    workFrequency: "",
    desiredUnitPrice: "",
    concurrentProject: "",
    ngCompanies: "",
    visaStatus: "",
    japaneseLevel: "",
    skills: [] as string[],
    desiredPosition: [] as string[],
    selfPr: "",
  });

  const [message, setMessage] = useState("");
  const [showSkill, setShowSkill] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const refSkill = useRef<HTMLDivElement>(null);
  const refPosition = useRef<HTMLDivElement>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, ...profile } = form;

    // Supabase 側が `text[]` 型を許容していればそのままでOK
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: profile },
    });

    if (error) {
      setMessage("登録に失敗しました：" + error.message);
    } else {
      setMessage("登録メールを確認してください。");
    }
  };

  const skillOptions = ["React", "Next.js", "Node.js", "Python", "Java"];
  const positionOptions = ["フロントエンド", "バックエンド", "PM", "デザイナー"];
  const countryOptions = ["日本", "アメリカ", "中国", "韓国", "その他"];

  return (
    <main className="bg-[#E6F0F8] min-h-screen">
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[["姓", "lastName"], ["名", "firstName"], ["セイ", "lastNameKana"], ["メイ", "firstNameKana"], ["メールアドレス", "email", "email"], ["パスワード", "password", "password"], ["電話番号", "phone"], ["生年月日", "birthDate", "date"]].map(([label, name, type = "text"]) => (
            <div key={name}>
              <label className="block text-sm mb-1">{label}</label>
              <input name={name} type={type} value={(form as any)[name]} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          ))}

          <div>
            <label className="block text-sm mb-1">国籍</label>
            <select name="nationality" value={form.nationality} onChange={handleChange} className="w-full border rounded px-3 py-2">
              {countryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">リファラルコード</label>
            <input name="referralCode" value={form.referralCode} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">弊社からの案件提案の可否</label>
            <div className="flex gap-4">
              <label><input type="radio" name="allowProposal" value="yes" checked={form.allowProposal === "yes"} onChange={handleChange} /> 可</label>
              <label><input type="radio" name="allowProposal" value="no" checked={form.allowProposal === "no"} onChange={handleChange} /> 不可</label>
            </div>
          </div>

          {form.allowProposal === "yes" && (
            <>
              {[
                ["居住地", "residence"],
                ["最寄り駅", "nearestStation"],
                ["稼働頻度", "workFrequency"],
                ["単価希望", "desiredUnitPrice"],
                ["NG企業", "ngCompanies"],
                ["就労ビザ（外国籍）", "visaStatus"],
                ["日本語レベル（外国籍）", "japaneseLevel"]
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm mb-1">{label}</label>
                  <input name={name} value={(form as any)[name]} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
              ))}

              <div>
                <label className="block text-sm mb-1">出社可否</label>
                <select name="workOnsite" value={form.workOnsite} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="可能">可能</option>
                  <option value="不可">不可</option>
                  <option value="応相談">応相談</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">稼働開始時期</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm mb-1">並行状況</label>
                <select name="concurrentProject" value={form.concurrentProject} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="あり">あり</option>
                  <option value="なし">なし</option>
                </select>
              </div>

              {/* スキル */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">スキル</label>
                <div ref={refSkill} className="max-w-full text-sm relative">
                  <div className="flex items-center border rounded px-3 py-2 bg-white">
                    <div
                      className="flex flex-wrap items-center gap-2 flex-1 cursor-pointer"
                      onClick={() => setShowSkill(!showSkill)}
                    >
                      {form.skills.length > 0 ? (
                        form.skills.map((item) => (
                          <span key={item} className="flex items-center gap-1 text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full text-sm">
                            {item}
                            <button
                              type="button"
                              className="text-indigo-600 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setForm((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter((i) => i !== item),
                                }));
                              }}
                            >×</button>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">選択してください</span>
                      )}
                      <span className="ml-2 text-gray-300 text-sm">▼</span>
                    </div>
                  </div>

                  {showSkill && (
                    <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
                      <div className="grid grid-cols-2 gap-2 p-3">
                        {skillOptions.map((item) => {
                          const isSelected = form.skills.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  skills: isSelected
                                    ? prev.skills.filter((i) => i !== item)
                                    : [...prev.skills, item],
                                }))
                              }
                              className={`text-left rounded px-2 py-1 ${isSelected ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 希望ポジション */}
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">希望ポジション</label>
                <div ref={refPosition} className="max-w-full text-sm relative">
                  <div className="flex items-center border rounded px-3 py-2 bg-white">
                    <div
                      className="flex flex-wrap items-center gap-2 flex-1 cursor-pointer"
                      onClick={() => setShowPosition(!showPosition)}
                    >
                      {form.desiredPosition.length > 0 ? (
                        form.desiredPosition.map((item) => (
                          <span key={item} className="flex items-center gap-1 text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full text-sm">
                            {item}
                            <button
                              type="button"
                              className="text-indigo-600 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setForm((prev) => ({
                                  ...prev,
                                  desiredPosition: prev.desiredPosition.filter((i) => i !== item),
                                }));
                              }}
                            >×</button>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">選択してください</span>
                      )}
                      <span className="ml-2 text-gray-300 text-sm">▼</span>
                    </div>
                  </div>

                  {showPosition && (
                    <div className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-auto">
                      <div className="grid grid-cols-2 gap-2 p-3">
                        {positionOptions.map((item) => {
                          const isSelected = form.desiredPosition.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  desiredPosition: isSelected
                                    ? prev.desiredPosition.filter((i) => i !== item)
                                    : [...prev.desiredPosition, item],
                                }))
                              }
                              className={`text-left rounded px-2 py-1 ${isSelected ? "bg-indigo-100 text-indigo-600" : "hover:bg-gray-100"}`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>


              <div className="md:col-span-2">
                <label className="block text-sm mb-1">自己PR</label>
                <textarea name="selfPr" value={form.selfPr} onChange={handleChange} rows={4} className="w-full border rounded px-3 py-2" />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-700">
              登録する
            </button>
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
