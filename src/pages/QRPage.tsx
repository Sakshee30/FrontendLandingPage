import { QRBuilder } from "../app/components/QRBuilder";

export default function QRPage({ initialType = "URL" }: { initialType?: string }) {
  return <QRBuilder initialType={initialType} />;
}
