'use client';

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function ProfilePage() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    phone: "",
    birthDate: "",
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
    nationality: "",
    visaStatus: "",
    japaneseLevel: "",
    skills: [] as string[],
    desiredPosition: [] as string[],
    selfPr: "",
  });

  const [message, setMessage] = useState("");
  const [showSkill, setShowSkill] = useState(false);
  const [showPosition, setShowPosition] = useState(false);

  const refSkill = useRef(null);
  const refPosition = useRef(null);

  const prefectureOptions = ["東京都", "大阪府", "福岡県"]; // 例
  const countryOptions = ["日本", "アメリカ", "中国"];
  const visaStatusOptions = ["技術・人文知識・国際業務", "永住者", "家族滞在"];
  const japaneseLevelOptions = ["N1", "N2", "N3", "ビジネス会話"];
  const unitPriceOptions = ["〜30万円", "31〜50万円", "51〜70万円", "71万円〜"];
  const skillOptions = ["JavaScript", "TypeScript", "React", "Node.js"];
  const positionOptions = ["バックエンドエンジニア", "PM", "フロントエンドエンジニア"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      setMessage("ユーザー情報の取得に失敗しました。ログイン状態を確認してください。");
      return;
    }

    const user_id = userData.user.id;

    const {
      lastName,
      firstName,
      lastNameKana,
      firstNameKana,
      phone,
      birthDate,
      referralCode,
      allowProposal,
      residence,
      nearestStation,
      workOnsite,
      startDate,
      workFrequency,
      desiredUnitPrice,
      concurrentProject,
      ngCompanies,
      nationality,
      visaStatus,
      japaneseLevel,
      skills,
      desiredPosition,
      selfPr,
    } = form;

    const { error: insertError } = await supabase.from("users").insert([
      {
        user_id,
        first_name: firstName,
        last_name: lastName,
        first_name_kana: firstNameKana,
        last_name_kana: lastNameKana,
        phone_number: phone,
        birthday: birthDate,
        referral_code: referralCode,
        allow_proposal: allowProposal === "yes",
        residence,
        nearest_station: nearestStation,
        work_onsite: workOnsite,
        available_from: startDate,
        work_frequency: workFrequency,
        desired_unit_price: desiredUnitPrice,
        concurrent_projects: concurrentProject,
        ng_companies: ngCompanies,
        nationality,
        work_visa_status: visaStatus,
        japanese_level: japaneseLevel,
        self_pr: selfPr,
      },
    ]);

    if (insertError) {
      console.log("💥 insertError", insertError);
      setMessage("プロフィール保存に失敗しました：" + insertError.message);
    } else {
      setMessage("プロフィールの登録が完了しました！");
    }
  };

  return (
    <main className="bg-[#E6F0F8]">
      <div className="max-w-4xl mx-auto px-4">
        <header className="flex justify-between items-center py-3">
        </header>
        <h1 className="text-2xl font-bold mb-6 text-indigo-500 text-center">プロフィール登録</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ここにすべてのフォーム項目を追加 */}
          {/* フロントから提供いただいた JSX 構造を貼り付けて使用してください */}
           {[["姓", "lastName"], ["名", "firstName"], ["セイ", "lastNameKana"], ["メイ", "firstNameKana"], ["電話番号", "phone"], ["生年月日", "birthDate", "date"]].map(([label, name, type = "text"]) => (
            <div key={name}>
              <label className="block text-sm mb-1">{label}</label>
              <input name={name} type={type} value={(form as any)[name]} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          ))}

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
              {/* 居住地選択をセレクトボックスに変更 */}
              <div>
                <label className="block text-sm mb-1">居住地</label>
                <select name="residence" value={form.residence} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">選択してください</option>
                  {prefectureOptions.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>

              </div>
              {[
                ["最寄り駅", "nearestStation"],
                ["稼働頻度", "workFrequency"],
                ["NG企業", "ngCompanies"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm mb-1">{label}</label>
                  <input name={name} value={(form as any)[name]} onChange={handleChange} className="w-full border rounded px-3 py-2" />
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

              {form.nationality && form.nationality !== "日本" && (
                <>
                  {/* 就労ビザ（外国籍） */}
                  <div>
                    <label className="block text-sm mb-1">就労ビザ（外国籍）</label>
                    <select
                      name="visaStatus"
                      value={form.visaStatus}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">選択してください</option>
                      {visaStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  {/* 日本語レベル（外国籍） */}
                  <div>
                    <label className="block text-sm mb-1">日本語レベル（外国籍）</label>
                    <select
                      name="japaneseLevel"
                      value={form.japaneseLevel}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">選択してください</option>
                      {japaneseLevelOptions.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}


              {/* 単価希望 */}
              <div>
                <label className="block text-sm mb-1">単価希望</label>
                <select name="desiredUnitPrice" value={form.desiredUnitPrice} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">選択してください</option>
                  {unitPriceOptions.map((price) => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </select>
              </div>

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
            <button type="submit" className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              登録する
            </button>
            {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
          </div>
        </form>
        <footer className="flex justify-between items-center py-3">
        </footer>
      </div>
    </main>
  );
}