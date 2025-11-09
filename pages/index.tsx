import { Terminal } from "lucide-react";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#2d2d2d",
    color: "white",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    backgroundColor: "#3c3c3c",
    borderBottom: "1px solid #333",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "500",
  },
  iframeContainer: {
    flex: 1,
    border: "none",
    width: "100%",
    height: "100%",
  },
};

export default function Home() {
  // You can change this URL to point to any website you want to display.
  const appUrl = "https://nextjs.org";

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Terminal size={20} style={{ marginRight: "8px" }} />
        <h1 style={styles.title}>Application Preview</h1>
      </div>
      <iframe
        src={appUrl}
        style={styles.iframeContainer}
        title="Application Preview"
        // Using a sandbox for better security
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}