"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import type { Group } from "@/data/groups";
import { Plate } from "./GroupRow";
import { CheckIcon, CloseIcon, CopyIcon, ExternalIcon, ShareIcon } from "./Icons";

interface Props {
  group: Group | null;
  copied: boolean;
  onCopy: (group: Group) => void;
  onClose: () => void;
}

export default function QrDialog({ group, copied, onCopy, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (group && !dialog.open) dialog.showModal();
    if (!group && dialog.open) dialog.close();
  }, [group]);

  async function share() {
    if (!group) return;
    try {
      await navigator.share({
        title: group.name,
        text: `Join the ${group.name} group on Arattai`,
        url: group.link,
      });
    } catch {
      // the person dismissed the share sheet
    }
  }

  return (
    <dialog
      ref={ref}
      className="qr-dialog"
      aria-labelledby="qr-title"
      onClose={onClose}
      onClick={(event) => {
        // clicks on the backdrop land on the dialog element itself
        if (event.target === ref.current) onClose();
      }}
    >
      {group && (
        <div className="qr-body">
          <div className="qr-head">
            <Plate group={group} />
            <div className="qr-title-wrap">
              <h2 id="qr-title" className="qr-title">
                {group.name}
              </h2>
              {group.native && (
                <p className="row-native" lang={group.nativeLang}>
                  {group.native}
                </p>
              )}
            </div>
            <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close">
              <CloseIcon />
            </button>
          </div>

          <div className="qr-tile">
            <QRCodeSVG
              value={group.link}
              size={256}
              level="M"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#0e1a3a"
              title={`QR code to join ${group.name}`}
            />
          </div>

          <p className="qr-hint">Open the Arattai app and scan this code to join.</p>

          <dl className="qr-meta">
            <dt>Group name in Arattai</dt>
            <dd>{group.groupName}</dd>
          </dl>

          <div className="qr-actions">
            <a
              className="btn btn-join"
              href={group.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalIcon /> Join on Arattai
            </a>
            <button type="button" className="btn" onClick={() => onCopy(group)} data-copied={copied}>
              {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "Copied" : "Copy link"}
            </button>
            {canShare && (
              <button type="button" className="btn" onClick={share}>
                <ShareIcon /> Share
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
