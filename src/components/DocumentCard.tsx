'use client';
import Link from 'next/link';

type Props = {
  id: string;
  description: string;
  signerEmail: string;
  status: string;
  sender?: boolean; // true if you uploaded it
};

export default function DocumentCard({
  id,
  description,
  signerEmail,
  status,
  sender = false,
}: Props) {
  const badge =
    status === 'signed'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';

  return (
    <Link
      href={`/sign/${id}`}
      className="block border rounded p-4 hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">
          {sender ? 'To:' : 'From:'}{' '}
          <span className="text-gray-600">{signerEmail}</span>
        </span>

        <span className={`text-xs px-2 py-1 rounded ${badge}`}>{status}</span>
      </div>
      <p className="text-sm text-gray-700">{description}</p>
    </Link>
  );
}
