interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = ({ label, error, className = "", children, ...props }: SelectProps) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select
        {...props}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/70 ${className}`}
      >
        {children}
      </select>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
