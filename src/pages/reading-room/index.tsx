import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMachine } from "@xstate/react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { machine } from "./machine";
import { locale } from "../../lib/locale";
import "./ReadingRoom.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const STREAM_URL = (token: string) =>
  `/api/shards/stream/?token=${encodeURIComponent(token)}`;

export const ReadingRoom = () => {
  const { token = "" } = useParams<{ token: string }>();
  const [state, send] = useMachine(machine);

  // Inject the URL token into the machine on mount, then transition into loading.
  useEffect(() => {
    if (token) send({ type: "SET_TOKEN", token });
  }, [token, send]);

  const chapter = state.context.chapter;

  if (state.matches("idle") || state.matches("loading")) return <ChamberLoading />;
  if (state.matches("invalid")) return <ChamberError variant="invalid" />;
  if (state.matches("locked")) return <ChamberError variant="locked" />;
  if (state.matches("error")) return <ChamberError variant="network" />;
  if (state.matches("sanctuary"))
    return (
      <ChamberSanctuary
        orderIndex={chapter?.orderIndex ?? 0}
        bookTitle={chapter?.bookTitle ?? ""}
      />
    );
  // reading
  return <ChamberPdf token={token} onLastPage={() => send({ type: "REACHED_LAST_PAGE" })} />;
};

const ChamberLoading = () => (
  <div className="chamber-shell chamber-state-center">
    <div className="chamber-pulse" />
    <p className="chamber-state-text">{locale("readingRoom.loading") as string}</p>
  </div>
);

const ChamberError = ({ variant }: { variant: "invalid" | "locked" | "network" }) => (
  <div className="chamber-shell chamber-state-center">
    <h2 className="chamber-state-title">
      {locale(`readingRoom.errors.${variant}.title`) as string}
    </h2>
    <p className="chamber-state-body">
      {locale(`readingRoom.errors.${variant}.body`) as string}
    </p>
  </div>
);

const ChamberSanctuary = ({
  orderIndex,
  bookTitle,
}: {
  orderIndex: number;
  bookTitle: string;
}) => (
  <div className="chamber-shell chamber-state-center">
    <h2 className="chamber-state-title">
      {locale("readingRoom.sanctuary.title", { orderIndex }) as string}
    </h2>
    <p className="chamber-state-body">{locale("readingRoom.sanctuary.body") as string}</p>
    <p className="chamber-sanctuary-footer">
      {locale("readingRoom.sanctuary.bookFooter", { bookTitle }) as string}
    </p>
  </div>
);

const ChamberPdf = ({
  token,
  onLastPage,
}: {
  token: string;
  onLastPage: () => void;
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <div className="chamber-shell chamber-pdf-shell">
      <Document
        file={STREAM_URL(token)}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<ChamberLoading />}
        error={<ChamberError variant="network" />}
      >
        {numPages !== null && (
          <>
            {Array.from({ length: numPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <div key={pageNumber} className="chamber-page">
                  <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
                </div>
              );
            })}
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <button className="btn-primary" onClick={onLastPage}>
                {locale("readingRoom.finish") as string}
              </button>
            </div>
          </>
        )}
      </Document>
    </div>
  );
};

export default ReadingRoom;
