interface DocumentPreviewProps {
    fileName?: string;
}

export default function DocumentPreview({ fileName }: DocumentPreviewProps) {
    if (!fileName) {
        return (
            <div className="panel">
                <p className="muted">Select a document to preview</p>
            </div>
        );
    }

    return (
        <div className="panel"
             style={{
                 height: "calc(100vh - 220px)",
                 display: "flex",
                 flexDirection: "column"
             }}
        >
            <strong>{fileName}</strong>

            <object
                data={`/api/documents/${fileName}`}
                type="application/pdf"
                style={{ flex: 1, width: "100%" }}
            />

        </div>
    );
}