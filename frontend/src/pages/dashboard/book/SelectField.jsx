const SelectField = ({ label, name, options, register }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        {...register(name, { required: true })}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="Select Category">Select Category</option>
        {options?.map((option) => (
          <option key={option?._id} value={option?._id}>
            {option?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
