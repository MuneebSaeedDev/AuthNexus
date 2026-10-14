export default function Alert({ type = 'error', message }) {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-600',
    success: 'bg-green-50 border-green-200 text-green-600',
  };

  return (
    <div className={`p-3 mb-4 text-sm rounded-lg border ${styles[type]}`}>
      {message}
    </div>
  );
}
