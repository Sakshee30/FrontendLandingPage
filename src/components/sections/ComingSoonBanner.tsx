export function ComingSoonBanner() {
  return (
    <div className="flex min-h-[58px] w-full select-none items-center justify-center bg-white px-4 py-[11px]" data-figma-node="4768:18299">
      <div className="flex w-full max-w-[383px] items-center justify-center gap-2.5">
        <span className="inline-flex h-9 items-center justify-center gap-2.5 rounded-[50px] border-[.5px] border-white bg-[rgba(220,228,241,.1)] px-5 shadow-[0_2px_12px_rgba(8,28,69,.08)]">
          <svg aria-hidden="true" viewBox="0 0 14 16" className="h-4 w-3.5 shrink-0 fill-[#f4b400]">
            <path d="M8.4 0 1 9.2h4.7L4.9 16 13 6.1H8.2L8.4 0Z" />
          </svg>
          <span className="whitespace-nowrap font-['Poppins'] text-base font-normal leading-none text-[#001845]">Coming soon</span>
        </span>
        <span className="whitespace-nowrap px-2.5 py-2 font-['Poppins'] text-base font-medium leading-none text-[#001845]">AI Automation</span>
      </div>
    </div>
  );
}
