'use client';
import SignatureCanvas from 'react-signature-canvas';
import { useRef, useState } from 'react';

type Props = { onDone: (dataUrl: string) => void };

export default function SignaturePad({ onDone }: Props) {
  const ref = useRef<SignatureCanvas>(null);
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    if (!dirty) return;
    onDone(ref.current!.getCanvas().toDataURL());
  };

  return (
    <div className="space-y-2">
      {/* drawing area */}
      <SignatureCanvas
        ref={ref}
        penColor="black"
        canvasProps={{ className: 'border w-full h-48 bg-white' }}
        onBegin={() => setDirty(true)}
      />

      {/* controls */}
      <div className="flex gap-4 bg-white p-2 border rounded">
        <button
          onClick={() => {
            ref.current?.clear();
            setDirty(false);
          }}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Clear
        </button>

        <button
          onClick={handleSave}
          disabled={!dirty}
          className={`px-3 py-1 rounded text-white ${
            dirty
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          Save Signature
        </button>
      </div>
    </div>
  );
}
