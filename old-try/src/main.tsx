import { createRoot } from "react-dom/client";
import { StrictMode } from "react";

console.log('[MAIN] Ultra minimal main.tsx starting...');

function UltraMinimalApp() {
  console.log('[APP] Ultra minimal app rendering...');
  return (
    <div style={{ padding: '50px', background: 'purple', color: 'white', minHeight: '100vh' }}>
      <h1>React is Working!</h1>
      <p>If you see this, React is successfully mounting.</p>
      <p>Server is running correctly.</p>
      <button onClick={() => alert('Click works!')} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test Click
      </button>
    </div>
  );
}

const mount = document.getElementById("root");
console.log('[MAIN] Root element:', mount);

if (mount) {
  console.log('[MAIN] Creating root and rendering...');
  const root = createRoot(mount);
  root.render(
    <StrictMode>
      <UltraMinimalApp />
    </StrictMode>
  );
  console.log('[MAIN] Render complete!');
} else {
  console.error('[MAIN] NO ROOT ELEMENT FOUND!');
}
