/* eslint-disable semi */
import { React, type AllWidgetProps } from "jimu-core";
import { Button } from "jimu-ui";

const Widget = (props: AllWidgetProps<any>) => {
  const [message, setMessage] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const handleFetchZen = async () => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch("https://api.github.com/zen", {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const text = await response.text();
      setMessage(text);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
      controller.abort();
    }
  };

  return (
    <div className="widget-starter jimu-widget">
      <h4>Run Suggestions</h4>
      <Button
        type="primary"
        onClick={() => {
          handleFetchZen();
        }}
        size="default"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch GitHub Zen"}
      </Button>
      {loading && <p>Loading API response...</p>}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && <p>GitHub Zen: {message}</p>}
    </div>
  );
};

export default Widget;
