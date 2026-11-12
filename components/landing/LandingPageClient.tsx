'use client';
import { useState } from 'react';
import { Play, RotateCcw, Check } from '@/components/ui/icons';

export default function LandingPageClient() {
  const [ran, setRan] = useState(false);
  return <div className="demo-editor">
    <div className="demo-tabs"><span><span className="python-dot" /> halo_dunia.py</span><span>Contoh latihan</span></div>
    <div className="demo-code" aria-label="Contoh kode Python">
      <div><i>1</i><span className="code-comment"># Setiap perjalanan punya awal.</span></div>
      <div><i>2</i><span>nama = <b>&quot;Developer masa depan&quot;</b></span></div>
      <div><i>3</i><span> </span></div>
      <div><i>4</i><span><em>def</em> <strong>sapa</strong>(nama):</span></div>
      <div><i>5</i><span>    <em>return</em> <b>f&quot;Halo, {'{nama}'}!&quot;</b></span></div>
      <div><i>6</i><span> </span></div>
      <div><i>7</i><span><strong>print</strong>(sapa(nama))</span></div>
    </div>
    <div className="demo-toolbar"><span>Python 3 <span>•</span> Contoh interaktif</span><button onClick={() => setRan(!ran)}>{ran ? <RotateCcw size={14} /> : <Play size={14} />}{ran ? 'Ulangi contoh' : 'Lihat hasil'}</button></div>
    <div className="demo-output" aria-live="polite"><span className="output-label">OUTPUT</span>{ran ? <><p>Halo, Developer masa depan!</p><span className="output-success"><Check size={13} /> Begitu cara fungsi menghasilkan output.</span></> : <><p className="output-placeholder">Hasil kodemu akan muncul di sini.</p><span className="output-hint">Klik “Lihat hasil” untuk mencoba contoh.</span></>}</div>
  </div>;
}
