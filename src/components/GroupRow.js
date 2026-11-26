import { CheckIcon, CopyIcon, QrIcon } from "./Icons";

export function Plate({ group }) {
  return (
    <span
      className="plate"
      data-category={group.category}
      data-photo={group.image ? "true" : undefined}
      aria-hidden="true"
    >
      {group.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={group.image} alt="" loading="lazy" width={64} height={64} />
      ) : (
        group.code
      )}
    </span>
  );
}

export default function GroupRow({ group, copied, onCopy, onShowQr }) {
  return (
    <li className="row">
      <Plate group={group} />

      <div className="row-text">
        <h3 className="row-name">{group.name}</h3>
        {group.native && (
          <p className="row-native" lang={group.nativeLang}>
            {group.native}
          </p>
        )}
      </div>

      <div className="row-actions">
        <a
          className="btn btn-join"
          href={group.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Join ${group.name} on Arattai`}
        >
          Join
        </a>
        <button
          type="button"
          className="btn btn-icon"
          data-copied={copied}
          onClick={() => onCopy(group)}
          aria-label={`Copy link for ${group.name}`}
          title="Copy link"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button
          type="button"
          className="btn btn-icon"
          onClick={() => onShowQr(group)}
          aria-label={`Show QR code for ${group.name}`}
          title="Show QR code"
        >
          <QrIcon />
        </button>
      </div>
    </li>
  );
}
