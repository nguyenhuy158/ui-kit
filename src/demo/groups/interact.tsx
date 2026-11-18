import { Check, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Celebrate } from "../../ui/Celebrate";
import { Lightbox, LightboxButton } from "../../ui/Lightbox";
import { SwipeAction } from "../../ui/SwipeAction";
import { useToast } from "../../ui/Toast";
import { PHOTOS } from "../fixtures";
import { Anchor, Section } from "../section";
import type { GroupProps } from "./types";

export function InteractGroup(_: GroupProps) {
  const toast = useToast();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [celebrateKey, setCelebrateKey] = useState(0);
  const photo = PHOTOS[lightboxIndex ?? 0];
  return (
    <>
      <Section title="Lightbox, Swipe action, Celebrate" id="s-gestures">
        <Card className="space-y-5">
          <Anchor id="c-lightbox" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLightboxIndex(0)}
          >
            Mở ảnh toàn màn hình
          </Button>
          <Anchor id="c-swipe" />
          <SwipeAction
            label="Xoá"
            icon={<Trash2 size={15} />}
            onAction={() => toast.success("Đã xoá")}
          >
            <div className="rounded-ui border border-border px-3 py-3 text-sm text-fg">
              Vuốt trái dòng này trên điện thoại để lộ nút Xoá
            </div>
          </SwipeAction>
          <Anchor id="c-celebrate" />
          <div className="flex flex-col items-center gap-3 py-4">
            <Celebrate key={celebrateKey}>
              <Check size={44} className="text-success" />
            </Celebrate>
            <Button
              size="sm"
              onClick={() => setCelebrateKey((value) => value + 1)}
            >
              Bắn pháo giấy
            </Button>
          </div>
        </Card>
      </Section>

      {photo && (
        <Lightbox
          open={lightboxIndex !== null}
          src={photo.src}
          alt={photo.alt}
          index={lightboxIndex ?? 0}
          total={PHOTOS.length}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              (value) => ((value ?? 0) - 1 + PHOTOS.length) % PHOTOS.length,
            )
          }
          onNext={() =>
            setLightboxIndex((value) => ((value ?? 0) + 1) % PHOTOS.length)
          }
          actions={
            <LightboxButton
              label="Tải ảnh về"
              onClick={() => toast.info("Tải ảnh")}
            >
              <Download size={20} />
            </LightboxButton>
          }
          footer={
            <p className="text-center text-sm text-white/80">{photo.title}</p>
          }
        />
      )}
    </>
  );
}
