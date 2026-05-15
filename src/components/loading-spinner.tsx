import "../app/spinner.css";

export function LoadingSpinner({
  width = 30,
  height = 30,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      width={width}
      height={height}
      role="img"
      aria-label="Loading"
    >
      <title>Loading</title>
      <desc>A trailing spinner sweeps the outer ring.</desc>
      <defs>
        <circle id="b" r="2.4" fill="#ffffff" opacity="0.07" />
        <circle id="l" r="3.1" />
      </defs>
      <use href="#b" x="6" y="6" />
      <use href="#b" x="17" y="6" />
      <use href="#b" x="28" y="6" />
      <use href="#b" x="39" y="6" />
      <use href="#b" x="50" y="6" />
      <use href="#b" x="6" y="17" />
      <use href="#b" x="17" y="17" />
      <use href="#b" x="28" y="17" />
      <use href="#b" x="39" y="17" />
      <use href="#b" x="50" y="17" />
      <use href="#b" x="6" y="28" />
      <use href="#b" x="17" y="28" />
      <use href="#b" x="28" y="28" />
      <use href="#b" x="39" y="28" />
      <use href="#b" x="50" y="28" />
      <use href="#b" x="6" y="39" />
      <use href="#b" x="17" y="39" />
      <use href="#b" x="28" y="39" />
      <use href="#b" x="39" y="39" />
      <use href="#b" x="50" y="39" />
      <use href="#b" x="6" y="50" />
      <use href="#b" x="17" y="50" />
      <use href="#b" x="28" y="50" />
      <use href="#b" x="39" y="50" />
      <use href="#b" x="50" y="50" />
      <use className="l d00" href="#l" x="6" y="6" />
      <use className="l d01" href="#l" x="17" y="6" />
      <use className="l d02" href="#l" x="28" y="6" />
      <use className="l d03" href="#l" x="39" y="6" />
      <use className="l d04" href="#l" x="50" y="6" />
      <use className="l d10" href="#l" x="6" y="17" />
      <use className="l d14" href="#l" x="50" y="17" />
      <use className="l d20" href="#l" x="6" y="28" />
      <use className="l d24" href="#l" x="50" y="28" />
      <use className="l d30" href="#l" x="6" y="39" />
      <use className="l d34" href="#l" x="50" y="39" />
      <use className="l d40" href="#l" x="6" y="50" />
      <use className="l d41" href="#l" x="17" y="50" />
      <use className="l d42" href="#l" x="28" y="50" />
      <use className="l d43" href="#l" x="39" y="50" />
      <use className="l d44" href="#l" x="50" y="50" />
    </svg>
  );
}
