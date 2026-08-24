import { MapPin } from "lucide-react";
import { AnalyticsSummary } from "../../services/analytics";


function googleMapUrl(key: string, locations: AnalyticsSummary['locations']) {
    const first = locations[0];
    const center = `${Number(first.latitude).toFixed(5)},${Number(
        first.longitude
    ).toFixed(5)}`;
    return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(
        key
    )}&center=${encodeURIComponent(center)}&zoom=3&maptype=roadmap`;
}




interface Props {
    summary: any;
    locationClusters: any;
    config: any;
    stats: any;
}
export default function GeoLocatonMap({ summary, locationClusters, config, stats }: Props) {
    return (
        <>
            <div className="rounded-[10px] border border-[#D9E2EC] bg-white p-[20px_22px]">
                <h2 className="text-[15px] font-bold text-[#1C2433] m-0">Click Locations Map</h2>
                <p className="text-[13px] text-[#667085] mt-[-8px] mb-[14px]">
                    {stats.geolocatedClicks || 0} geolocated click
                    {(stats.geolocatedClicks || 0) === 1 ? '' : 's'}
                    {stats.privateClicks
                        ? `, ${stats.privateClicks} local/private click${stats.privateClicks === 1 ? '' : 's'
                        } skipped`
                        : ''}
                </p>
                <div className="relative min-h-[260px] overflow-hidden rounded-[18px] border border-[#C8DAF7] bg-[linear-gradient(135deg,#EAF2FF,#F8FBFF)]">
                    {config?.googleMapsBrowserKey &&
                        (summary?.locations || []).length ? (
                        <iframe
                            title="Google click locations map"
                            src={googleMapUrl(
                                config.googleMapsBrowserKey,
                                summary?.locations || []
                            )}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                border: 0,
                            }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(47,128,237,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(47,128,237,.12) 1px, transparent 1px)",
                                backgroundSize: "32px 32px",
                            }}
                        />
                    )}
                    {(!config?.googleMapsBrowserKey ||
                        !(summary?.locations || []).length) &&
                        locationClusters.slice(0, 40).map((location: any, index: number) => {
                            const left = 8 + ((location.longitude + 180) / 360) * 84;
                            const top = 8 + ((90 - location.latitude) / 180) * 84;
                            const size = Math.min(34, 16 + location.count * 3);
                            return (
                                <div
                                    key={location.id}
                                    title={`${location.label} (${location.count} click${location.count === 1 ? "" : "s"
                                        })`}
                                    className="absolute grid place-items-center rounded-full border-[3px] border-white bg-[#2F80ED] text-[11px] font-black text-white shadow-[0_8px_18px_rgba(47,128,237,0.35)]"
                                    style={{
                                        left: `${left}%`,
                                        top: `${top}%`,
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        transform: `translate(-50%, -50%) scale(${index === 0 ? 1.08 : 1})`,
                                    }}
                                >
                                    {location.count > 1 ? location.count : ""}
                                </div>
                            );
                        })}
                    {!(summary?.locations || []).length && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center text-[13px] text-[#667085]">
                            <MapPin size={28} color="#2F80ED" />
                            <strong>No geolocated clicks yet</strong>
                            <span>
                                Localhost and private IP clicks cannot be mapped. Public
                                ngrok/domain clicks will appear here when IP geolocation
                                resolves.
                            </span>
                        </div>
                    )}
                </div>
                <div className="grid gap-2 mt-3">
                    {(summary?.locations || []).slice(0, 5).map((location: any) => (
                        <div key={location.id} className="flex items-center gap-2 text-[13px] text-[#1C2433]">
                            <MapPin size={14} color="#2F80ED" />
                            /{location.slug} from {location.city || 'Unknown city'}, {location.country || 'Unknown country'}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}