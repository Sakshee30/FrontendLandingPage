import { HelpCircle } from "lucide-react";

export function openHelpTopic(topicId: string) {
  window.dispatchEvent(new CustomEvent("ziplin-open-help", { detail: { topicId } }));
}

export function HelpButton({ topicId, label = "Help" }: { topicId: string; label?: string }) {
  return (
    <button
      className="h-6 w-6 rounded-full border border-[#C8daf7] bg-[#EEF4FF] text-[#2F80ED] flex items-center justify-center cursor-pointer"
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        openHelpTopic(topicId);
      }}
      title={`Help: ${label}`}
      aria-label={`Open help for ${label}`}
    >
      <HelpCircle size={14} />
    </button>
  );
}


