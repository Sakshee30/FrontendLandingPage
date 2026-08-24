import { TOKEN_COLOR } from '../../../utils/constants/colors.constants';

export function ActionBtn({
  children,
  title,
  onClick,
  color,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  color?: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 28,
        height: 28,
        border: `1px solid ${danger ? 'rgba(239,68,68,0.2)' : TOKEN_COLOR.BORDER}`,
        borderRadius: 7,
        background: danger ? 'rgba(239,68,68,0.04)' : '#fff',
        color: color ?? (danger ? TOKEN_COLOR.DANGER : TOKEN_COLOR.MUTED),
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        flexShrink: 0,
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}
