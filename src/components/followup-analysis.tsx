type FollowupAnalysisProps = {
  answer: string;
};

function parseFollowupSections(answer: string) {
  const parts = answer
    .replace(/\r/g, "")
    .split(/【([^】]+)】/g)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return [{ title: "专属解析", body: answer.trim() }];
  }

  const sections: Array<{ title: string; body: string }> = [];
  for (let index = 0; index < parts.length; index += 2) {
    const title = parts[index];
    const body = parts[index + 1];
    if (title && body) sections.push({ title, body });
  }
  return sections.length ? sections : [{ title: "专属解析", body: answer.trim() }];
}

export function FollowupAnalysis({ answer }: FollowupAnalysisProps) {
  const sections = parseFollowupSections(answer);

  return (
    <div className="mt-4 grid gap-3">
      {sections.map((section, index) => (
        <section
          key={`${section.title}-${index}`}
          className={
            index === 0
              ? "border border-[#b17a25] bg-[#fff4d7] p-4"
              : "border border-[#d9c7aa] bg-white p-4"
          }
        >
          <div className="flex items-start gap-3">
            <span className="grid h-8 min-w-8 place-items-center bg-[#211a11] text-xs font-black text-[#e9c976]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h4 className="font-black leading-7 text-[#2b241b]">
                {section.title}
              </h4>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-8 text-[#554a3d]">
                {section.body}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
