

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={
                `${className} border border-gray-200 rounded-xl p-5 bg-white `
            }>
            {children}
        </div>
    );
}