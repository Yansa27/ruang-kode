// Client-side Pyodide Runner for safe in-browser Python WebAssembly execution

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
}

let pyodidePromise: Promise<any> | null = null;

export async function getPyodideInstance(onStatusUpdate?: (status: string) => void): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only run in browser environments.');
  }

  const win = window as any;

  if (win.__pyodideInstance) {
    return win.__pyodideInstance;
  }

  if (pyodidePromise) {
    return pyodidePromise;
  }

  pyodidePromise = new Promise(async (resolve, reject) => {
    try {
      if (onStatusUpdate) onStatusUpdate('Mengunduh Python WebAssembly runtime...');

      // Load Pyodide script dynamically if not present
      if (!win.loadPyodide) {
        await new Promise<void>((res, rej) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          script.async = true;
          script.onload = () => {
            if ('caches' in window) {
              caches.open('ruangkode-pyodide-v1').then((c) => c.add(script.src)).catch(() => {});
            }
            res();
          };
          script.onerror = () => rej(new Error('Gagal memuat Pyodide script dari CDN. Periksa koneksi internet.'));
          document.head.appendChild(script);
        });
      }

      if (onStatusUpdate) onStatusUpdate('Menginisialisasi Python environment...');

      const pyodide = await win.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });

      win.__pyodideInstance = pyodide;
      if (onStatusUpdate) onStatusUpdate('Python siap digunakan!');
      resolve(pyodide);
    } catch (err) {
      pyodidePromise = null;
      reject(err);
    }
  });

  return pyodidePromise;
}

export async function runPythonCode(
  code: string,
  onStatusUpdate?: (status: string) => void
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await getPyodideInstance(onStatusUpdate);

    // Prepare execution wrapper to reliably intercept stdout and stderr
    const wrapper = `
import sys
from io import StringIO

_stdout_buffer = StringIO()
_stderr_buffer = StringIO()
_old_stdout = sys.stdout
_old_stderr = sys.stderr
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer

try:
${code
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
finally:
    sys.stdout = _old_stdout
    sys.stderr = _old_stderr

_captured_out = _stdout_buffer.getvalue()
_captured_err = _stderr_buffer.getvalue()
`;

    await pyodide.runPythonAsync(wrapper);

    const capturedOut = pyodide.globals.get('_captured_out') || '';
    const capturedErr = pyodide.globals.get('_captured_err') || '';
    const endTime = performance.now();

    const output = (capturedOut + (capturedErr ? '\n' + capturedErr : '')).trimEnd();

    return {
      success: true,
      output,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    const endTime = performance.now();
    let errorMessage = err.message || String(err);

    // Format python traceback nicely for student readability
    if (errorMessage.includes('Traceback (most recent call last):')) {
      const parts = errorMessage.split('Traceback (most recent call last):');
      const trace = parts[parts.length - 1];
      // Clean up internal wrapper frame references
      const cleaned = trace
        .split('\n')
        .filter((l: string) => !l.includes('_captured_out') && !l.includes('pyodide.runPythonAsync'))
        .join('\n')
        .trim();
      errorMessage = cleaned || trace.trim();
    }

    return {
      success: false,
      output: '',
      error: errorMessage,
      executionTimeMs: Math.round(endTime - startTime),
    };
  }
}
